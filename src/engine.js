/* Bead Battle engine: pure functions over a plain JSON battle state.
 *
 * ENGINE NOTES
 * - Every living fighter acts once per round, fastest first (Speed after stages; paralysis halves it).
 *   Fighters flagged "quick" (a Quick move last round, or Quick Draw in round 1) act before everyone else.
 * - Damage = (power x A / D x 0.35 + 2) x type x crit x ability/move bonuses x random(0.85-1.00).
 *   Physical moves use Attack vs Defense, Special moves use Special vs Special.
 * - Stat stages run from -6 to +6. Statuses: poison (lose 1/8 HP after each own turn),
 *   burn (lose 1/16, physical damage halved), paralyze (Speed halved, 25% chance to lose the turn),
 *   freeze (skips 1 turn). Charm is separate: skips the next turn.
 * - From round 15 (sudden death) every fighter loses 10% of its max HP at the start of each round.
 * - The state object is always JSON-safe so it can be stored as one database document.
 */
(function (root) {
  const TYPES = {
    Steel: { beats: ["Crystal", "Nature"], basic: "Slash" },
    Crystal: { beats: ["Energy", "Shadow"], basic: "Shard Toss" },
    Energy: { beats: ["Storm", "Steel"], basic: "Plasma Zap" },
    Nature: { beats: ["Storm", "Crystal"], basic: "Leaf Swipe" },
    Redstone: { beats: ["Nature", "Steel"], basic: "Spark Pulse" },
    Storm: { beats: ["Redstone", "Mob"], basic: "Static Jolt" },
    Shadow: { beats: ["Heart", "Energy"], basic: "Night Cut" },
    Heart: { beats: ["Shadow", "Mob"], basic: "Charm Strike" },
    Mob: { beats: ["Heart", "Redstone"], basic: "Hiss" },
  };
  // Every fighter also knows its type's support move.
  const TYPE_MOVES = {
    Steel: { name: "Iron Wall", fx: [{ fx: "stat", who: "self", stat: "defense", by: 1, chance: 100 }, { fx: "mindMap" }], text: "Defense +1, and the next attack it takes before its next turn deals half damage." },
    Crystal: { name: "Prism Guard", fx: [{ fx: "reflect", pct: 50 }], text: "The next attack it takes before its next turn bounces 50% of the damage back." },
    Energy: { name: "Overcharge", fx: [{ fx: "stat", who: "self", stat: "attack", by: 1, chance: 100 }, { fx: "stat", who: "self", stat: "special", by: 1, chance: 100 }, { fx: "recoil", pct: 10 }], text: "Attack +1 and Special +1, but it loses 10% of its max HP." },
    Nature: { name: "Regrow", fx: [{ fx: "heal", pct: 30 }, { fx: "cooldown", turns: 2 }], text: "Heals 30% of max HP. Can't be used again for 2 turns." },
    Redstone: { name: "Charge Up", fx: [{ fx: "charge" }], text: "Its next attack deals double damage." },
    Storm: { name: "Tailwind", fx: [{ fx: "stat", who: "self", stat: "speed", by: 2, chance: 100 }], text: "Speed +2." },
    Shadow: { name: "Fade", fx: [{ fx: "stat", who: "self", stat: "eva", by: 1, chance: 100 }], text: "Evasion +1, so attacks miss it more often." },
    Heart: { name: "Mend", fx: [{ fx: "heal", pct: 25 }, { fx: "cure" }, { fx: "cooldown", turns: 2 }], text: "Heals 25% of max HP and cures its status and charm. Can't be used again for 2 turns." },
    Mob: { name: "Taunt", fx: [{ fx: "taunt" }, { fx: "stat", who: "self", stat: "defense", by: 1, chance: 100 }], text: "Every enemy's next attack must target it. Defense +1." },
  };
  const COST = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 };
  const MAX_TEAM = 6;
  const SUDDEN_DEATH = 15;
  const STAT_LABEL = { attack: "Attack", defense: "Defense", speed: "Speed", special: "Special", acc: "accuracy", eva: "evasion" };
  const STATUS_LABEL = { poison: "poisoned", burn: "burned", paralyze: "paralyzed", freeze: "frozen", charm: "charmed" };
  const K = 0.35, LOG_MAX = 150;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const stageMult = s => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s));
  const accMult = s => (s >= 0 ? (3 + s) / 3 : 3 / (3 - s));
  function typeMult(moveType, targetType) {
    if (TYPES[moveType] && TYPES[moveType].beats.includes(targetType)) return 2;
    if (TYPES[targetType] && TYPES[targetType].beats.includes(moveType)) return 0.5;
    return 1;
  }

  // ---------- setup ----------
  function newBattle({ id, name, players, teamSize, budget, creator, now }) {
    const seats = [];
    for (let i = 0; i < players; i++) seats.push({ name: "", uid: null });
    return { id, name, status: "lobby", teamSize: budget ? null : teamSize, budget: budget || null, creator: creator || null, created: now || 0,
      seats, draft: null, units: [], round: 0, queue: [], qi: 0, winner: null, log: [], seq: 0, rev: 0 };
  }
  function log(st, text, kind) {
    st.seq = (st.seq || 0) + 1;
    st.log.push({ r: st.round, t: text, k: kind || "", s: st.seq });
    if (st.log.length > LOG_MAX) st.log.splice(0, st.log.length - LOG_MAX);
  }

  function startDraft(st, rng) {
    const n = st.seats.length;
    // Snake draft: 1,2,3,3,2,1,1,2,3...
    const rounds = st.budget ? Math.min(MAX_TEAM, st.budget) : st.teamSize;
    const order = [];
    for (let r = 0; r < rounds; r++) {
      const row = [...Array(n).keys()];
      order.push(...(r % 2 ? row.reverse() : row));
    }
    st.status = "draft";
    st.draft = { order, i: 0, picks: st.seats.map(() => []), spent: st.seats.map(() => 0), done: st.seats.map(() => false) };
    log(st, st.budget ? `Draft started. Each player has ${st.budget} points to spend (Common 1 up to Legendary 5).`
      : `Draft started. Each player picks ${st.teamSize} fighter${st.teamSize > 1 ? "s" : ""}.`, "sys");
  }
  const costOf = f => COST[f.rarity] || 3;
  function pointsLeft(st, seat) { return st.budget ? st.budget - (st.draft.spent[seat] || 0) : null; }
  function seatFinished(st, seat) {
    if (!st.budget) return false;
    const d = st.draft;
    return d.done[seat] || pointsLeft(st, seat) <= 0 || d.picks[seat].length >= MAX_TEAM;
  }
  function draftSeat(st) { return st.draft ? st.draft.order[st.draft.i] : null; }
  function advanceDraft(st, rng) {
    const d = st.draft;
    d.i++;
    while (d.i < d.order.length && seatFinished(st, d.order[d.i])) d.i++;
    if (d.i >= d.order.length) startBattle(st, rng);
  }
  function pick(st, seat, fighter, rng) {
    if (st.status !== "draft" || draftSeat(st) !== seat) throw new Error("Not your pick.");
    const taken = st.draft.picks.flat().map(f => f.id);
    if (taken.includes(fighter.id)) throw new Error("Already picked.");
    if (st.budget && costOf(fighter) > pointsLeft(st, seat)) throw new Error(`Not enough points: ${fighter.name} costs ${costOf(fighter)}.`);
    st.draft.picks[seat].push(fighter);
    if (st.budget) st.draft.spent[seat] += costOf(fighter);
    log(st, `${st.seats[seat].name} picked ${fighter.name}.`, "pick");
    advanceDraft(st, rng);
  }
  function finishPicking(st, seat, rng) {
    if (!st.budget || st.status !== "draft" || draftSeat(st) !== seat) throw new Error("Not your pick.");
    if (!st.draft.picks[seat].length) throw new Error("Pick at least one fighter first.");
    st.draft.done[seat] = true;
    log(st, `${st.seats[seat].name} is done picking.`, "pick");
    advanceDraft(st, rng);
  }

  function makeUnit(f, seat, idx) {
    return {
      id: `u${idx}`, seat, fid: f.id, name: f.name, type: f.type, baseType: f.type, piece: f.piece || "",
      stats: { hp: f.hp, attack: f.attack, defense: f.defense, speed: f.speed, special: f.special },
      ability: f.ability, move: f.move,
      hp: f.hp, maxHp: f.hp, fainted: false,
      stages: { attack: 0, defense: 0, speed: 0, special: 0, acc: 0, eva: 0 },
      status: null, charm: false, lockTo: null, mindMap: false, reflect: 0, quick: false,
      cooldown: 0, typeCd: 0, maxUsed: false, charged: false, lastMove: null, repeat: 0, swift: 0, flow: 0, berserk: false, attacked: false,
    };
  }

  function startBattle(st, rng) {
    st.status = "battle";
    let idx = 0;
    st.units = [];
    st.draft.picks.forEach((team, seat) => team.forEach(f => st.units.push(makeUnit(f, seat, idx++))));
    log(st, "The battle begins!", "sys");
    // Start-of-battle abilities
    for (const u of st.units) {
      const ab = u.ability || {};
      if (ab.code === "shapeshift") {
        const counts = {};
        enemiesOf(st, u).forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
        const common = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        if (common) {
          const beater = Object.keys(TYPES).find(t => TYPES[t].beats.includes(common[0]));
          if (beater) { u.type = beater; log(st, `${u.name} shapeshifts into a ${beater} type!`, "ab"); }
        }
      }
      if (ab.code === "eventHorizon") {
        enemiesOf(st, u).forEach(e => { changeStage(st, e, "attack", -1, true); changeStage(st, e, "special", -1, true); });
        log(st, `${u.name}'s Event Horizon weakens every enemy's Attack and Special.`, "ab");
      }
      if (ab.code === "quickStart") u.quick = true;
    }
    newRound(st, rng);
    advance(st, rng, true);
  }

  // ---------- helpers ----------
  const alive = st => st.units.filter(u => !u.fainted);
  const enemiesOf = (st, u) => st.units.filter(e => !e.fainted && e.seat !== u.seat);
  const unitById = (st, id) => st.units.find(u => u.id === id);
  const ab = u => (u.ability && u.ability.code) || "";

  function effStat(u, stat, opts = {}) {
    let s = u.stages[stat] || 0;
    if (opts.ignoreBoosts && s > 0) s = 0;
    let v = u.stats[stat] * stageMult(s);
    if (stat === "speed" && u.status === "paralyze") v *= 0.5;
    if (ab(u) === "statMult" && u.ability.stat === stat) v *= 1 + u.ability.pct / 100;
    return v;
  }

  function changeStage(st, u, stat, by, quiet) {
    if (by < 0 && stat === "acc" && ab(u) === "trueSight") { if (!quiet) log(st, `${u.name}'s accuracy can't be lowered.`, "ab"); return; }
    const before = u.stages[stat] || 0;
    const after = clamp(before + by, -6, 6);
    u.stages[stat] = after;
    if (quiet) return;
    if (after === before) log(st, `${u.name}'s ${STAT_LABEL[stat]} won't go any ${by > 0 ? "higher" : "lower"}.`, "fx");
    else log(st, `${u.name}'s ${STAT_LABEL[stat]} ${by > 0 ? "rose" : "fell"}${Math.abs(by) > 1 ? " sharply" : ""}.`, "fx");
  }

  function inflict(st, u, status) {
    if (u.fainted) return false;
    if (status === "charm") {
      if (ab(u) === "immune" && u.ability.status === "charm") { log(st, `${u.name} can't be charmed.`, "ab"); return false; }
      if (u.charm) return false;
      u.charm = true; log(st, `${u.name} is charmed and will skip its next turn!`, "fx"); return true;
    }
    if (u.status) return false;
    u.status = status;
    log(st, `${u.name} is ${STATUS_LABEL[status]}!`, "fx");
    return true;
  }

  function heal(st, u, amount, reason) {
    if (u.fainted || amount <= 0) return;
    if (ab(u) === "doubleHealing") amount *= 2;
    const before = u.hp;
    u.hp = Math.min(u.maxHp, u.hp + Math.round(amount));
    if (u.hp > before) log(st, `${u.name} recovers ${u.hp - before} HP${reason ? " (" + reason + ")" : ""}.`, "heal");
  }

  function hurt(st, u, amount, reason, source) {
    if (u.fainted || amount <= 0) return;
    u.hp = Math.max(0, u.hp - Math.round(amount));
    log(st, `${u.name} loses ${Math.round(amount)} HP${reason ? " (" + reason + ")" : ""}.`, "dmg");
    afterHpDrop(st, u);
    if (u.hp <= 0) faint(st, u, source || null, false);
  }

  function afterHpDrop(st, u) {
    if (ab(u) === "berserk" && !u.berserk && u.hp > 0 && u.hp < u.maxHp / 2) {
      u.berserk = true; log(st, `${u.name} goes berserk!`, "ab"); changeStage(st, u, "attack", 1);
    }
  }

  function faint(st, u, attacker, physical) {
    if (u.fainted) return;
    u.fainted = true; u.hp = 0;
    log(st, `${u.name} is knocked out!`, "ko");
    if (attacker && !attacker.fainted && attacker !== u) {
      if (ab(u) === "shatter") hurt(st, attacker, u.maxHp * u.ability.pct / 100, `${u.name} shatters`, null);
      if (ab(u) === "fuse" && physical) hurt(st, attacker, attacker.maxHp * u.ability.pct / 100, `${u.name} explodes`, null);
      if (ab(attacker) === "healOnKO") heal(st, attacker, attacker.maxHp * attacker.ability.pct / 100, "Ore Finder");
      if (ab(attacker) === "soulSteal" && u.move && !(attacker.stolen || []).some(m => m.from === u.fid)) {
        attacker.stolen = attacker.stolen || [];
        attacker.stolen.push(Object.assign({}, u.move, { type: u.baseType, from: u.fid, fromName: u.name }));
        log(st, `${attacker.name} steals ${u.name}'s soul and learns ${u.move.name}!`, "ab");
      }
    }
  }

  // ---------- moves ----------
  function movesOf(u) {
    const basicCat = u.stats.attack >= u.stats.special ? "phys" : "spec";
    const sig = Object.assign({ key: "sig" }, u.move, { type: u.type });
    const basic = { key: "basic", name: TYPES[u.type] ? TYPES[u.type].basic : "Strike", power: 40, accuracy: 100, cat: basicCat, target: "foe", fx: [], text: "Basic move.", type: u.type };
    return { sig, basic };
  }
  function typeMoveOf(u) {
    const t = TYPE_MOVES[u.type] || TYPE_MOVES.Steel;
    return { key: "type", name: t.name, power: 0, accuracy: 100, cat: "status", target: "self", fx: t.fx, text: t.text, type: u.type };
  }
  function maxOf(u) {
    const sig = movesOf(u).sig;
    const status = sig.cat === "status";
    const rp = (sig.fx || []).find(f => f.fx === "randomPower");
    const power = status ? 110 : rp ? 100 : Math.min(200, Math.round(sig.power * 1.75));
    const fx = (sig.fx || []).filter(f => !["cooldown", "randomPower"].includes(f.fx));
    return { key: "max", name: `${sig.name} MAX`, power, accuracy: 100, sure: true, max: true,
      cat: status ? (u.stats.attack >= u.stats.special ? "phys" : "spec") : sig.cat, target: "foe", fx, type: u.type,
      text: `Once per battle. ${power} power and can't miss${fx.length ? ". Also: " + sig.text : "."}` };
  }
  function availableMoves(st, u) {
    const { sig, basic } = movesOf(u);
    const out = [];
    out.push(Object.assign({}, sig, { disabled: u.cooldown > 0, why: u.cooldown > 0 ? `Recharging (${u.cooldown})` : "" }));
    const tm = typeMoveOf(u);
    out.push(Object.assign(tm, { disabled: u.typeCd > 0, why: u.typeCd > 0 ? `Recharging (${u.typeCd})` : "" }));
    out.push(basic);
    if (!u.maxUsed) out.push(maxOf(u));
    (u.stolen || []).forEach((m, i) => out.push(Object.assign({}, m, { key: "st" + i, stolen: true, disabled: false, why: "" })));
    return out;
  }
  function legalTargets(st, u, move) {
    if (move.target === "self") return [u.id];
    const foes = enemiesOf(st, u);
    if (u.lockTo) {
      const t = unitById(st, u.lockTo);
      if (t && !t.fainted) return [t.id];
    }
    return foes.map(f => f.id);
  }
  const hasFx = (m, name) => (m.fx || []).find(x => x.fx === name);

  // ---------- rounds ----------
  function newRound(st, rng) {
    st.round++;
    const list = alive(st).map(u => ({ u, q: u.quick ? 1 : 0, s: effStat(u, "speed"), r: rng() }));
    list.sort((a, b) => b.q - a.q || b.s - a.s || a.r - b.r);
    st.queue = list.map(x => x.u.id);
    st.qi = 0;
    for (const x of list) x.u.quick = false;
    log(st, `Round ${st.round}`, "round");
    if (st.round >= SUDDEN_DEATH) {
      if (st.round === SUDDEN_DEATH) log(st, "Sudden death! Every fighter now loses 10% of its max HP each round.", "sys");
      for (const u of alive(st)) hurt(st, u, Math.max(1, Math.round(u.maxHp / 10)), "sudden death", null);
    }
  }

  function activeUnit(st) {
    if (st.status !== "battle") return null;
    return unitById(st, st.queue[st.qi]) || null;
  }

  function checkWinner(st) {
    const seatsAlive = [...new Set(alive(st).map(u => u.seat))];
    if (seatsAlive.length <= 1) {
      st.status = "done";
      st.winner = seatsAlive.length ? seatsAlive[0] : -1;
      log(st, st.winner >= 0 ? `${st.seats[st.winner].name} wins the battle!` : "Everyone is knocked out. It's a draw!", "win");
      return true;
    }
    return false;
  }

  // Moves the pointer to the next fighter that can act, resolving skipped turns.
  function advance(st, rng, startHere) {
    let guard = 0;
    if (!startHere) st.qi++;
    while (guard++ < 500) {
      if (checkWinner(st)) return;
      if (st.qi >= st.queue.length) { newRound(st, rng); continue; }
      const u = activeUnit(st);
      if (!u || u.fainted) { st.qi++; continue; }
      // start of turn
      u.reflect = 0; u.mindMap = false;
      if (ab(u) === "lowHpHeal" && u.hp < u.maxHp * u.ability.below) heal(st, u, u.maxHp * u.ability.pct / 100, "Regrowth");
      let skip = null;
      if (u.status === "freeze") { u.status = null; skip = `${u.name} is frozen solid and can't move! It thaws out.`; }
      else if (u.charm) { u.charm = false; skip = `${u.name} is charmed and skips its turn.`; }
      else if (u.status === "paralyze" && rng() < 0.25) skip = `${u.name} is paralyzed and can't move!`;
      if (skip) {
        log(st, skip, "fx");
        endTurn(st, u, rng);
        if (checkWinner(st)) return;
        st.qi++;
        continue;
      }
      return; // waiting for this unit's controller
    }
  }

  function endTurn(st, u, rng) {
    if (u.fainted) return;
    if (u.cooldown > 0) u.cooldown--;
    if (u.typeCd > 0) u.typeCd--;
    if (u.status === "poison") hurt(st, u, Math.max(1, u.maxHp / 8), "poison");
    else if (u.status === "burn") hurt(st, u, Math.max(1, u.maxHp / 16), "burn");
    if (u.fainted) return;
    if (ab(u) === "endTurnHeal") heal(st, u, u.maxHp * u.ability.pct / 100, "Photosynthesis");
    if (ab(u) === "swift" && u.swift < u.ability.max) { u.swift++; changeStage(st, u, "speed", 1); }
  }

  // ---------- attacking ----------
  function calcDamage(st, att, tgt, mv, rng, ctx) {
    const phys = mv.cat === "phys";
    const pierce = ab(att) === "armorPierce";
    let A = hasFx(mv, "useDef") ? effStat(att, "defense") : effStat(att, phys ? "attack" : "special");
    let D = effStat(tgt, phys ? "defense" : "special", { ignoreBoosts: pierce });
    if (ab(att) === "ignoreDefPct") D *= 1 - att.ability.pct / 100;
    let power = ctx.power;
    let dmg = power * A / Math.max(1, D) * K + 2;
    const tm = typeMult(mv.type, tgt.type);
    dmg *= tm;
    if (phys && att.status === "burn") dmg *= 0.5;
    // crit
    let critChance = hasFx(mv, "highCrit") ? 0.25 : 1 / 16;
    if (ab(att) === "critBoost") critChance *= att.ability.mult;
    const crit = rng() < critChance;
    if (crit) dmg *= 1.5;
    // attacker bonuses
    const a = att.ability || {};
    if (a.code === "catBoost" && a.cat === mv.cat) dmg *= 1 + a.pct / 100;
    if (a.code === "typeBoost" && a.type === mv.type) dmg *= 1 + a.pct / 100;
    if (a.code === "lowHpTypeBoost" && a.type === mv.type && att.hp < att.maxHp * a.below) dmg *= a.mult;
    if (a.code === "vsType" && tgt.type === a.type) dmg *= a.mult;
    if (a.code === "vsLowHp" && tgt.hp < tgt.maxHp * a.below) dmg *= a.mult;
    if (a.code === "repeater" && ctx.repeat > 0) dmg *= 1 + a.pct / 100 * ctx.repeat;
    const sb = hasFx(mv, "slowerBonus"); if (sb && effStat(att, "speed") < effStat(tgt, "speed")) dmg *= sb.mult;
    const fb = hasFx(mv, "fullHpBonus"); if (fb && att.hp === att.maxHp) dmg *= fb.mult;
    if (ctx.charged) dmg *= 2;
    // target defences
    if (!ctx.pierceShields && ab(tgt) === "halveSuperEffective" && tm > 1) dmg *= 0.5;
    dmg *= 0.85 + rng() * 0.15;
    return { dmg: Math.max(1, Math.floor(dmg)), crit, tm };
  }

  function act(st, choice, rng) {
    const u = activeUnit(st);
    if (!u) throw new Error("No fighter is waiting to act.");
    const moves = availableMoves(st, u);
    let mv = moves.find(m => m.key === choice.move);
    if (!mv || mv.disabled) throw new Error("That move can't be used right now.");
    const targets = legalTargets(st, u, mv);
    let tgt = unitById(st, mv.target === "self" ? u.id : choice.target);
    if (!tgt || !targets.includes(tgt.id)) throw new Error("Pick a valid target.");

    // Bait: an enemy's signature move may be swapped for its basic move
    if ((mv.key === "sig" || mv.stolen) && mv.target === "foe" && ab(tgt) === "bait" && rng() < tgt.ability.chance / 100) {
      log(st, `${u.name} is distracted by ${tgt.name}'s bait!`, "ab");
      mv = moves.find(m => m.key === "basic");
    }
    const repeat = u.lastMove === mv.key ? Math.min((u.repeat || 0) + 1, (u.ability && u.ability.max) || 0) : 0;
    u.lastMove = mv.key; u.repeat = repeat;
    if (u.lockTo && mv.target === "foe") u.lockTo = null;

    if (mv.key === "max") u.maxUsed = true;
    log(st, `${u.name} uses ${mv.name}${mv.target === "foe" ? " on " + tgt.name : ""}!`, mv.max ? "max" : "move");

    if (mv.cat === "status") {
      if (mv.target === "foe" && !hitCheck(st, u, tgt, mv, rng)) { finishAction(st, u, mv, rng); return st; }
      applyFx(st, u, tgt, mv, rng, 0);
      finishAction(st, u, mv, rng);
      return st;
    }

    const charged = !!u.charged; u.charged = false;
    if (charged) log(st, `${u.name} unleashes its charge!`, "ab");
    if (!hitCheck(st, u, tgt, mv, rng)) { finishAction(st, u, mv, rng); return st; }

    // number of hits
    let hits = 1;
    const h = hasFx(mv, "hits"); if (h) hits = h.n;
    const hr = hasFx(mv, "hitsRange"); if (hr) hits = hr.min + Math.floor(rng() * (hr.max - hr.min + 1));
    const rp = hasFx(mv, "randomPower");
    const pierceShields = ab(u) === "longReach" || !!hasFx(mv, "breakShields");
    const physical = mv.cat === "phys";
    let total = 0, landed = 0;
    for (let i = 0; i < hits && !tgt.fainted && !u.fainted; i++) {
      const power = rp ? rp.min + Math.floor(rng() * (rp.max - rp.min + 1)) : mv.power;
      if (rp && i === 0) log(st, `The glitch rolls power ${power}.`, "fx");
      // Deflect special attacks
      if (mv.cat === "spec" && ab(tgt) === "deflect" && rng() < tgt.ability.chance / 100) {
        const back = calcDamage(st, u, u, mv, rng, { power, repeat, pierceShields: true });
        log(st, `${tgt.name} deflects the attack back!`, "ab");
        hurt(st, u, back.dmg, "deflected", tgt);
        break;
      }
      let { dmg, crit, tm } = calcDamage(st, u, tgt, mv, rng, { power, repeat, pierceShields, charged });
      if (tgt.mindMap && !pierceShields) { dmg = Math.max(1, Math.floor(dmg / 2)); tgt.mindMap = false; log(st, `${tgt.name}'s Mind Map halves the damage.`, "ab"); }
      if (ab(tgt) === "surviveFromFull" && !pierceShields && tgt.hp === tgt.maxHp && dmg >= tgt.hp) { dmg = tgt.hp - 1; log(st, `${tgt.name} holds on with Bulwark!`, "ab"); }
      tgt.hp = Math.max(0, tgt.hp - dmg);
      total += dmg; landed++;
      const notes = [];
      if (crit) notes.push("critical hit");
      if (tm > 1) notes.push("super effective");
      if (tm < 1) notes.push("not very effective");
      log(st, `${tgt.name} takes ${dmg} damage${notes.length ? " (" + notes.join(", ") + ")" : ""}.`, "dmg");
      if (tgt.reflect && !pierceShields) {
        const back = Math.max(1, Math.floor(dmg * tgt.reflect / 100)); tgt.reflect = 0;
        log(st, `${tgt.name}'s Reflect Shine bounces damage back!`, "ab");
        hurt(st, u, back, "reflected", tgt);
      }
      afterHpDrop(st, tgt);
      onHit(st, u, tgt, mv, rng, tm);
      if (tgt.hp <= 0) faint(st, tgt, u, physical);
    }
    if (hits > 1 && landed > 0) log(st, `Hit ${landed} time${landed > 1 ? "s" : ""}.`, "fx");
    if (landed > 0) applyFx(st, u, tgt, mv, rng, total);
    finishAction(st, u, mv, rng);
    return st;
  }

  function hitCheck(st, u, tgt, mv, rng) {
    if (tgt === u) return true;
    const sure = mv.sure || ab(u) === "neverMiss" || (ab(u) === "sureFirstHit" && !u.attacked);
    u.attacked = true;
    if (sure) return true;
    const ignoreEva = ab(u) === "trueSight";
    const p = (mv.accuracy || 100) / 100 * accMult((u.stages.acc || 0) - (ignoreEva ? 0 : (tgt.stages.eva || 0)));
    if (rng() >= p) { log(st, `${u.name} misses!`, "miss"); return false; }
    if (!ignoreEva && ab(tgt) === "dodge" && rng() < tgt.ability.pct / 100) { log(st, `${tgt.name} dodges!`, "miss"); return false; }
    return true;
  }

  function onHit(st, u, tgt, mv, rng, tm) {
    const a = u.ability || {};
    const physical = mv.cat === "phys";
    if (!tgt.fainted) {
      if (a.code === "contactInflict" && physical && rng() < a.chance / 100) inflict(st, tgt, a.status);
      if (a.code === "typeInflict" && mv.type === a.type && rng() < a.chance / 100) inflict(st, tgt, a.status);
      if (a.code === "onHitStat" && rng() < a.chance / 100) changeStage(st, tgt, a.stat, a.by);
      if (a.code === "onSpecialHitStat" && mv.cat === "spec" && rng() < a.chance / 100) changeStage(st, tgt, a.stat, a.by);
      if (a.code === "lure" && !tgt.lockTo) { tgt.lockTo = u.id; log(st, `${tgt.name} is lured and must attack ${u.name} next.`, "ab"); }
      if (ab(tgt) === "rageCore" && tm > 1) { log(st, `${tgt.name}'s Rage Core flares!`, "ab"); changeStage(st, tgt, "attack", 1); }
    }
    if (a.code === "flowingCut" && u.flow < a.max) { u.flow++; changeStage(st, u, "speed", 1); }
    if (ab(tgt) === "whenHitContact" && physical && rng() < tgt.ability.chance / 100) inflict(st, u, tgt.ability.status);
  }

  function applyFx(st, u, tgt, mv, rng, total) {
    for (const f of mv.fx || []) {
      switch (f.fx) {
        case "stat": {
          const who = f.who === "self" ? u : tgt;
          if (!who.fainted && rng() < f.chance / 100) changeStage(st, who, f.stat, f.by);
          break;
        }
        case "status": if (rng() < f.chance / 100) inflict(st, tgt, f.status); break;
        case "heal": heal(st, u, u.maxHp * f.pct / 100); break;
        case "drain": heal(st, u, total * f.pct / 100); break;
        case "recoil": hurt(st, u, u.maxHp * f.pct / 100, "recoil", null); break;
        case "selfFaint": if (!u.fainted) { log(st, `${u.name} is spent by the blast.`, "fx"); faint(st, u, null, false); } break;
        case "reflect": u.reflect = f.pct; log(st, `${u.name} shines, ready to reflect the next hit.`, "fx"); break;
        case "mindMap": u.mindMap = true; log(st, `${u.name} maps out the enemy's next move.`, "fx"); break;
        case "quick": u.quick = true; log(st, `${u.name} will act first next round.`, "fx"); break;
        case "cooldown": if (mv.key === "type") u.typeCd = f.turns + 1; else u.cooldown = f.turns + 1; break;
        case "charge": u.charged = true; log(st, `${u.name} charges up. Its next attack deals double damage!`, "fx"); break;
        case "cure": if (u.status || u.charm) { u.status = null; u.charm = false; log(st, `${u.name} is cured.`, "heal"); } break;
        case "taunt": enemiesOf(st, u).forEach(e => { e.lockTo = u.id; }); log(st, `${u.name} taunts every enemy. They must attack it next.`, "fx"); break;
        default: break;
      }
    }
  }

  function finishAction(st, u, mv, rng) {
    endTurn(st, u, rng);
    advance(st, rng, false);
  }

  // ---------- previews (no state changes) ----------
  // What a move would do: damage range, chance to hit, knock-out chance and warnings.
  function previewMove(st, attId, moveKey, tgtId) {
    const u = unitById(st, attId);
    if (!u) return null;
    const mv = availableMoves(st, u).find(m => m.key === moveKey);
    if (!mv) return null;
    const dbl = ab(u) === "doubleHealing" ? 2 : 1;
    if (mv.target === "self" || mv.cat === "status" && mv.target === "self") {
      const out = { kind: "self", heal: 0, notes: [] };
      for (const f of mv.fx || []) {
        if (f.fx === "heal") out.heal += Math.round(u.maxHp * f.pct / 100 * dbl);
        if (f.fx === "stat") out.notes.push(`${STAT_LABEL[f.stat][0].toUpperCase() + STAT_LABEL[f.stat].slice(1)} ${f.by > 0 ? "+" : ""}${f.by}`);
        if (f.fx === "recoil") out.notes.push(`costs ${Math.round(u.maxHp * f.pct / 100)} HP`);
        if (f.fx === "charge") out.notes.push("next attack ×2");
        if (f.fx === "reflect") out.notes.push(`reflects ${f.pct}% of the next hit`);
        if (f.fx === "mindMap") out.notes.push("halves the next hit");
        if (f.fx === "taunt") out.notes.push("enemies must attack it");
        if (f.fx === "cure" && (u.status || u.charm)) out.notes.push("cures it");
      }
      out.heal = Math.min(out.heal, u.maxHp - u.hp);
      return out;
    }
    const tgt = unitById(st, tgtId);
    if (!tgt || tgt.fainted) return null;
    let hMin = 1, hMax = 1;
    const h = hasFx(mv, "hits"); if (h) hMin = hMax = h.n;
    const hr = hasFx(mv, "hitsRange"); if (hr) { hMin = hr.min; hMax = hr.max; }
    const rp = hasFx(mv, "randomPower");
    const pierce = ab(u) === "longReach" || !!hasFx(mv, "breakShields");
    const repeat = u.lastMove === mv.key ? Math.min((u.repeat || 0) + 1, (u.ability && u.ability.max) || 0) : 0;
    const once = (power, low) => { let n = 0; const r = () => (++n === 1 ? 0.999 : (low ? 0 : 0.99999)); return calcDamage(st, u, tgt, mv, r, { power, repeat, pierceShields: pierce, charged: !!u.charged }); };
    const lo = once(rp ? rp.min : mv.power, true), hi = once(rp ? rp.max : mv.power, false);
    let min = lo.dmg * hMin, max = hi.dmg * hMax;
    const notes = [];
    if (tgt.mindMap && !pierce) { min -= Math.ceil(lo.dmg / 2); max -= Math.ceil(hi.dmg / 2); notes.push("Mind Map halves the first hit"); }
    if (ab(tgt) === "surviveFromFull" && !pierce && tgt.hp === tgt.maxHp) { min = Math.min(min, tgt.hp - 1); max = Math.min(max, tgt.hp - 1); notes.push("Bulwark: survives with 1 HP"); }
    min = Math.max(1, Math.min(min, tgt.hp)); max = Math.max(min, Math.min(max, tgt.hp));
    // chance to hit
    let p = 1;
    const sure = mv.sure || ab(u) === "neverMiss" || (ab(u) === "sureFirstHit" && !u.attacked);
    if (!sure) {
      const ignoreEva = ab(u) === "trueSight";
      p = Math.min(1, (mv.accuracy || 100) / 100 * accMult((u.stages.acc || 0) - (ignoreEva ? 0 : (tgt.stages.eva || 0))));
      if (!ignoreEva && ab(tgt) === "dodge") p *= 1 - tgt.ability.pct / 100;
    }
    if (tgt.reflect && !pierce) notes.push(`reflects ${tgt.reflect}% back`);
    if (mv.cat === "spec" && ab(tgt) === "deflect") notes.push(`${tgt.ability.chance}% chance it bounces back`);
    if ((mv.key === "sig" || mv.stolen) && ab(tgt) === "bait") notes.push(`${tgt.ability.chance}% chance of being distracted`);
    if (ab(tgt) === "whenHitContact" && mv.cat === "phys") notes.push(`${tgt.ability.chance}% chance to be charmed`);
    if (ab(tgt) === "fuse" && mv.cat === "phys" && max >= tgt.hp) notes.push("explodes if knocked out");
    if (ab(tgt) === "shatter" && max >= tgt.hp) notes.push("shatters if knocked out");
    if (u.charged) notes.push("charged: double damage");
    return { kind: "attack", min, max, hits: hMin === hMax ? hMin : `${hMin}-${hMax}`, hit: Math.round(p * 100), typeMult: lo.tm,
      ko: min >= tgt.hp ? "sure" : max >= tgt.hp ? "maybe" : null, notes };
  }
  // The best result a move could have this turn, for the move buttons.
  function moveSummary(st, attId, moveKey) {
    const u = unitById(st, attId);
    const mv = u && availableMoves(st, u).find(m => m.key === moveKey);
    if (!mv) return null;
    if (mv.target === "self") return previewMove(st, attId, moveKey, attId);
    let best = null;
    for (const id of legalTargets(st, u, mv)) {
      const pv = previewMove(st, attId, moveKey, id); if (!pv) continue;
      const score = pv.max * (pv.hit / 100) + (pv.ko ? 1000 : 0) + pv.typeMult;
      if (!best || score > best.score) best = Object.assign({ score, target: unitById(st, id).name }, pv);
    }
    return best;
  }

  const api = { TYPES, TYPE_MOVES, COST, MAX_TEAM, typeMult, newBattle, startDraft, draftSeat, pick, finishPicking, pointsLeft, costOf, activeUnit, availableMoves, legalTargets, act, effStat, enemiesOf, unitById, typeMoveOf, maxOf, previewMove, moveSummary };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BattleEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
