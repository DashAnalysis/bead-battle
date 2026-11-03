// The fighters. Edit freely; see README.md for the format.
window.BEAD_FIGHTERS = {
  "artemis-bow": {
    "ability": {
      "below": 0.5,
      "code": "vsLowHp",
      "mult": 1.5,
      "name": "Huntress",
      "text": "Deals 1.5x damage to targets below half HP."
    },
    "attack": 90,
    "defense": 40,
    "hp": 75,
    "move": {
      "accuracy": 95,
      "cat": "phys",
      "fx": [
        {
          "by": -1,
          "chance": 100,
          "fx": "stat",
          "stat": "speed",
          "who": "foe"
        }
      ],
      "name": "Silver Moon Arrow",
      "power": 90,
      "target": "foe",
      "text": "Lowers the target's Speed by 1 stage."
    },
    "name": "Artemis Bow",
    "order": 46,
    "piece": "P9",
    "rarity": "Rare",
    "special": 90,
    "speed": 85,
    "type": "Shadow"
  },
  "axe": {
    "ability": {
      "code": "vsType",
      "mult": 1.5,
      "name": "Woodcutter",
      "text": "Deals 1.5x damage to Nature types.",
      "type": "Nature"
    },
    "attack": 80,
    "defense": 100,
    "hp": 100,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [],
      "name": "Chop",
      "power": 55,
      "target": "foe",
      "text": "No extra effect."
    },
    "name": "Axe",
    "order": 33,
    "piece": "P4",
    "rarity": "Rare",
    "special": 50,
    "speed": 50,
    "type": "Steel"
  },
  "big-sword": {
    "ability": {
      "code": "ignoreDefPct",
      "name": "Heavy Hitter",
      "pct": 15,
      "text": "Attacks ignore 15% of the target's Defense."
    },
    "attack": 110,
    "defense": 90,
    "hp": 100,
    "move": {
      "accuracy": 80,
      "cat": "phys",
      "fx": [
        {
          "by": -1,
          "chance": 100,
          "fx": "stat",
          "stat": "speed",
          "who": "self"
        }
      ],
      "name": "Colossal Cleave",
      "power": 95,
      "target": "foe",
      "text": "Lowers the user's Speed by 1 stage."
    },
    "name": "Big Sword",
    "order": 3,
    "piece": "P22",
    "rarity": "Epic",
    "special": 80,
    "speed": 40,
    "type": "Steel"
  },
  "blue-dagger": {
    "ability": {
      "code": "dodge",
      "name": "Slippery",
      "pct": 10,
      "text": "10% chance to dodge any attack."
    },
    "attack": 65,
    "defense": 45,
    "hp": 50,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "by": -1,
          "chance": 20,
          "fx": "stat",
          "stat": "speed",
          "who": "foe"
        }
      ],
      "name": "Frost Prick",
      "power": 50,
      "target": "foe",
      "text": "20% chance to lower the target's Speed."
    },
    "name": "Blue Dagger",
    "order": 25,
    "piece": "P40",
    "rarity": "Common",
    "special": 45,
    "speed": 95,
    "type": "Storm"
  },
  "blue-lightsaber": {
    "ability": {
      "chance": 20,
      "code": "deflect",
      "name": "Deflect",
      "text": "20% chance to bounce a Special-category attack back at the attacker."
    },
    "attack": 85,
    "defense": 65,
    "hp": 70,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [],
      "name": "Azure Saber",
      "power": 80,
      "target": "foe",
      "text": "No extra effect."
    },
    "name": "Blue Lightsaber",
    "order": 35,
    "piece": "P14",
    "rarity": "Rare",
    "special": 75,
    "speed": 85,
    "type": "Energy"
  },
  "creeper-head": {
    "ability": {
      "code": "fuse",
      "name": "Fuse",
      "pct": 25,
      "text": "If knocked out by a physical attack, the attacker loses 25% of its max HP."
    },
    "attack": 70,
    "defense": 60,
    "hp": 80,
    "move": {
      "accuracy": 100,
      "cat": "spec",
      "fx": [
        {
          "fx": "selfFaint"
        }
      ],
      "name": "Creeper Blast",
      "power": 150,
      "target": "foe",
      "text": "The user faints after attacking."
    },
    "name": "Creeper Head",
    "order": 38,
    "piece": "P2",
    "rarity": "Rare",
    "special": 110,
    "speed": 60,
    "type": "Mob"
  },
  "crystal-blade": {
    "ability": {
      "code": "shatter",
      "name": "Shatter",
      "pct": 20,
      "text": "When knocked out, deals 20% of its max HP to the attacker."
    },
    "attack": 80,
    "defense": 60,
    "hp": 60,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "by": -1,
          "chance": 20,
          "fx": "stat",
          "stat": "defense",
          "who": "foe"
        }
      ],
      "name": "Shard Slice",
      "power": 65,
      "target": "foe",
      "text": "20% chance to lower the target's Defense."
    },
    "name": "Crystal Blade",
    "order": 18,
    "piece": "P3",
    "rarity": "Uncommon",
    "special": 60,
    "speed": 80,
    "type": "Crystal"
  },
  "crystal-shield": {
    "ability": {
      "code": "halveSuperEffective",
      "name": "Prism Wall",
      "text": "Super-effective hits deal half damage."
    },
    "attack": 40,
    "defense": 130,
    "hp": 95,
    "move": {
      "accuracy": 100,
      "cat": "status",
      "fx": [
        {
          "fx": "reflect",
          "pct": 75
        }
      ],
      "name": "Reflect Shine",
      "power": 0,
      "target": "self",
      "text": "Until its next turn, the next attack it takes bounces 75% of the damage back."
    },
    "name": "Crystal Shield",
    "order": 9,
    "piece": "P12",
    "rarity": "Rare",
    "special": 80,
    "speed": 35,
    "type": "Crystal"
  },
  "crystal-sword": {
    "ability": {
      "code": "critBoost",
      "mult": 2,
      "name": "Sharp Facets",
      "text": "Critical-hit chance is doubled."
    },
    "attack": 95,
    "defense": 70,
    "hp": 70,
    "move": {
      "accuracy": 95,
      "cat": "phys",
      "fx": [
        {
          "fx": "highCrit"
        }
      ],
      "name": "Crystal Edge",
      "power": 85,
      "target": "foe",
      "text": "High critical-hit chance."
    },
    "name": "Crystal Sword",
    "order": 14,
    "piece": "P8",
    "rarity": "Rare",
    "special": 70,
    "speed": 75,
    "type": "Crystal"
  },
  "double-sided-axe": {
    "ability": {
      "by": -1,
      "chance": 30,
      "code": "onHitStat",
      "name": "Double Bite",
      "stat": "defense",
      "text": "30% chance for any hit to lower the target's Defense."
    },
    "attack": 90,
    "defense": 90,
    "hp": 90,
    "move": {
      "accuracy": 95,
      "cat": "phys",
      "fx": [
        {
          "fx": "hits",
          "n": 2
        }
      ],
      "name": "Whirl Chop",
      "power": 45,
      "target": "foe",
      "text": "Hits 2 times."
    },
    "name": "Double-Sided Axe",
    "order": 41,
    "piece": "P30",
    "rarity": "Epic",
    "special": 70,
    "speed": 80,
    "type": "Energy"
  },
  "dread-nova": {
    "ability": {
      "code": "eventHorizon",
      "name": "Event Horizon",
      "text": "At the start of battle, lowers every enemy's Attack and Special by 1 stage."
    },
    "attack": 110,
    "defense": 70,
    "hp": 85,
    "move": {
      "accuracy": 90,
      "cat": "phys",
      "fx": [
        {
          "fx": "recoil",
          "pct": 25
        }
      ],
      "name": "Nova Collapse",
      "power": 130,
      "target": "foe",
      "text": "The user loses 25% of its max HP."
    },
    "name": "Dread Nova",
    "order": 37,
    "piece": "P6",
    "rarity": "Legendary",
    "special": 105,
    "speed": 90,
    "type": "Shadow"
  },
  "emerald-hoe": {
    "ability": {
      "code": "typeBoost",
      "name": "Green Thumb",
      "pct": 20,
      "text": "Nature moves deal 20% more damage.",
      "type": "Nature"
    },
    "attack": 60,
    "defense": 65,
    "hp": 70,
    "move": {
      "accuracy": 100,
      "cat": "spec",
      "fx": [
        {
          "fx": "drain",
          "pct": 50
        }
      ],
      "name": "Harvest",
      "power": 60,
      "target": "foe",
      "text": "Heals the user by 50% of the damage dealt."
    },
    "name": "Emerald Hoe",
    "order": 16,
    "piece": "P43",
    "rarity": "Uncommon",
    "special": 85,
    "speed": 60,
    "type": "Nature"
  },
  "figurative-head": {
    "ability": {
      "cat": "spec",
      "code": "catBoost",
      "name": "Deep Thinker",
      "pct": 20,
      "text": "Special-category moves deal 20% more damage."
    },
    "attack": 45,
    "defense": 75,
    "hp": 80,
    "move": {
      "accuracy": 100,
      "cat": "status",
      "fx": [
        {
          "fx": "mindMap"
        },
        {
          "by": 1,
          "chance": 100,
          "fx": "stat",
          "stat": "special",
          "who": "self"
        }
      ],
      "name": "Mind Map",
      "power": 0,
      "target": "self",
      "text": "Special +1 stage, and until its next turn the next attack it takes deals half damage."
    },
    "name": "Figurative Head",
    "order": 13,
    "piece": "P1",
    "rarity": "Uncommon",
    "special": 95,
    "speed": 45,
    "type": "Mob"
  },
  "green-blue-katana": {
    "ability": {
      "code": "flowingCut",
      "max": 2,
      "name": "Flowing Cut",
      "text": "Speed +1 stage after each hit it lands, up to 2 times."
    },
    "attack": 95,
    "defense": 60,
    "hp": 70,
    "move": {
      "accuracy": 95,
      "cat": "phys",
      "fx": [
        {
          "fx": "highCrit"
        }
      ],
      "name": "Tide Leaf Slash",
      "power": 80,
      "target": "foe",
      "text": "High critical-hit chance."
    },
    "name": "Green Blue Katana",
    "order": 45,
    "piece": "P32",
    "rarity": "Rare",
    "special": 60,
    "speed": 95,
    "type": "Nature"
  },
  "green-dagger": {
    "ability": {
      "chance": 20,
      "code": "contactInflict",
      "name": "Poison Tip",
      "status": "poison",
      "text": "Its physical attacks have a 20% chance to poison."
    },
    "attack": 70,
    "defense": 40,
    "hp": 50,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [],
      "name": "Thorn Jab",
      "power": 50,
      "target": "foe",
      "text": "No extra effect."
    },
    "name": "Green Dagger",
    "order": 24,
    "piece": "P38",
    "rarity": "Common",
    "special": 45,
    "speed": 95,
    "type": "Nature"
  },
  "green-head": {
    "ability": {
      "code": "trueSight",
      "name": "Watchful",
      "text": "Its attacks can't be dodged and ignore evasion, and its accuracy can't be lowered."
    },
    "attack": 50,
    "defense": 70,
    "hp": 75,
    "move": {
      "accuracy": 90,
      "cat": "spec",
      "fx": [
        {
          "chance": 50,
          "fx": "status",
          "status": "poison"
        }
      ],
      "name": "Toxic Stare",
      "power": 40,
      "target": "foe",
      "text": "50% chance to poison the target."
    },
    "name": "Green Head",
    "order": 5,
    "piece": "P19",
    "rarity": "Common",
    "special": 65,
    "speed": 40,
    "type": "Mob"
  },
  "green-lightsaber": {
    "ability": {
      "code": "immune",
      "name": "Calm Focus",
      "status": "charm",
      "text": "Can't be charmed."
    },
    "attack": 50,
    "defense": 50,
    "hp": 50,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "heal",
          "pct": 12.5
        }
      ],
      "name": "Jade Saber",
      "power": 75,
      "target": "foe",
      "text": "Heals the user 1/8 of its max HP."
    },
    "name": "Green Lightsaber",
    "order": 29,
    "piece": "P26",
    "rarity": "Common",
    "special": 80,
    "speed": 70,
    "type": "Energy"
  },
  "green-sword": {
    "ability": {
      "below": 0.5,
      "code": "lowHpHeal",
      "name": "Regrowth",
      "pct": 12.5,
      "text": "At the start of its turn, heals 1/8 of its max HP if below half HP."
    },
    "attack": 80,
    "defense": 60,
    "hp": 65,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "highCrit"
        }
      ],
      "name": "Leaf Cutter",
      "power": 70,
      "target": "foe",
      "text": "High critical-hit chance."
    },
    "name": "Green Sword",
    "order": 27,
    "piece": "P39",
    "rarity": "Uncommon",
    "special": 65,
    "speed": 70,
    "type": "Nature"
  },
  "lightning-trident": {
    "ability": {
      "chance": 30,
      "code": "typeInflict",
      "name": "Storm Caller",
      "status": "paralyze",
      "text": "Storm moves have a 30% chance to paralyze.",
      "type": "Storm"
    },
    "attack": 110,
    "defense": 70,
    "hp": 85,
    "move": {
      "accuracy": 95,
      "cat": "phys",
      "fx": [],
      "name": "Skybolt Throw",
      "power": 110,
      "target": "foe",
      "text": "No extra effect."
    },
    "name": "Lightning Trident",
    "order": 21,
    "piece": "P37",
    "rarity": "Legendary",
    "special": 100,
    "speed": 95,
    "type": "Storm"
  },
  "love-axe": {
    "ability": {
      "chance": 20,
      "code": "whenHitContact",
      "name": "Lovestruck",
      "status": "charm",
      "text": "Fighters that hit it with a physical attack have a 20% chance to be charmed and skip their next turn."
    },
    "attack": 85,
    "defense": 65,
    "hp": 80,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "drain",
          "pct": 25
        }
      ],
      "name": "Heartbreaker",
      "power": 75,
      "target": "foe",
      "text": "Heals the user by 25% of the damage dealt."
    },
    "name": "Love Axe",
    "order": 4,
    "piece": "P10",
    "rarity": "Rare",
    "special": 90,
    "speed": 60,
    "type": "Heart"
  },
  "lure-sword-2-0": {
    "ability": {
      "code": "lure",
      "name": "Reel In",
      "text": "Enemies it hits are lured: their next attack must target Lure Sword 2.0."
    },
    "attack": 95,
    "defense": 70,
    "hp": 80,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "quick"
        }
      ],
      "name": "Deep Lure",
      "power": 100,
      "target": "foe",
      "text": "Quick: the user acts first next round."
    },
    "name": "Lure Sword 2.0",
    "order": 22,
    "piece": "P35",
    "rarity": "Epic",
    "special": 90,
    "speed": 85,
    "type": "Storm"
  },
  "lure-sword": {
    "ability": {
      "chance": 40,
      "code": "bait",
      "name": "Bait",
      "text": "When an enemy uses its signature move on it, 40% chance the enemy is distracted and uses its basic move instead."
    },
    "attack": 75,
    "defense": 60,
    "hp": 65,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [],
      "name": "Hook Slash",
      "power": 90,
      "target": "foe",
      "text": "No extra effect."
    },
    "name": "Lure Sword",
    "order": 23,
    "piece": "P24",
    "rarity": "Uncommon",
    "special": 70,
    "speed": 70,
    "type": "Storm"
  },
  "master-sword": {
    "ability": {
      "code": "vsType",
      "mult": 1.5,
      "name": "Blade of Legends",
      "text": "Deals 1.5x damage to Shadow types.",
      "type": "Shadow"
    },
    "attack": 115,
    "defense": 85,
    "hp": 90,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "fullHpBonus",
          "mult": 1.3
        }
      ],
      "name": "Master Strike",
      "power": 100,
      "target": "foe",
      "text": "Deals 30% more damage when the user is at full HP."
    },
    "name": "Master Sword",
    "order": 40,
    "piece": "P17",
    "rarity": "Legendary",
    "special": 75,
    "speed": 95,
    "type": "Crystal"
  },
  "piercer": {
    "ability": {
      "code": "armorPierce",
      "name": "Armor Piercing",
      "text": "Attacks ignore the target's Defense and Special boosts."
    },
    "attack": 105,
    "defense": 50,
    "hp": 65,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "highCrit"
        }
      ],
      "name": "Needle Thrust",
      "power": 75,
      "target": "foe",
      "text": "High critical-hit chance."
    },
    "name": "Piercer",
    "order": 36,
    "piece": "P29",
    "rarity": "Rare",
    "special": 55,
    "speed": 105,
    "type": "Shadow"
  },
  "red-dagger": {
    "ability": {
      "code": "quickStart",
      "name": "Quick Draw",
      "text": "Acts first in the first round."
    },
    "attack": 70,
    "defense": 40,
    "hp": 50,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "chance": 30,
          "fx": "status",
          "status": "burn"
        }
      ],
      "name": "Ember Stab",
      "power": 50,
      "target": "foe",
      "text": "30% chance to burn."
    },
    "name": "Red Dagger",
    "order": 12,
    "piece": "P42",
    "rarity": "Common",
    "special": 45,
    "speed": 95,
    "type": "Redstone"
  },
  "red-lightsaber": {
    "ability": {
      "code": "rageCore",
      "name": "Rage Core",
      "text": "Attack +1 stage when hit by a super-effective move."
    },
    "attack": 100,
    "defense": 55,
    "hp": 70,
    "move": {
      "accuracy": 90,
      "cat": "phys",
      "fx": [
        {
          "chance": 10,
          "fx": "status",
          "status": "burn"
        }
      ],
      "name": "Crimson Saber",
      "power": 90,
      "target": "foe",
      "text": "10% chance to burn."
    },
    "name": "Red Lightsaber",
    "order": 28,
    "piece": "P23",
    "rarity": "Rare",
    "special": 70,
    "speed": 85,
    "type": "Energy"
  },
  "redstone-repeater-sword": {
    "ability": {
      "code": "repeater",
      "max": 3,
      "name": "Repeater",
      "pct": 20,
      "text": "Using the same move on consecutive turns gives it +20% power, up to 3 times."
    },
    "attack": 95,
    "defense": 65,
    "hp": 75,
    "move": {
      "accuracy": 100,
      "cat": "spec",
      "fx": [
        {
          "fx": "hitsRange",
          "max": 4,
          "min": 2
        }
      ],
      "name": "Pulse Chain",
      "power": 30,
      "target": "foe",
      "text": "Hits 2 to 4 times."
    },
    "name": "Redstone Repeater Sword",
    "order": 11,
    "piece": "P13",
    "rarity": "Epic",
    "special": 100,
    "speed": 85,
    "type": "Redstone"
  },
  "shadow-blade": {
    "ability": {
      "code": "dodge",
      "name": "Vanish",
      "pct": 15,
      "text": "15% chance to dodge any attack."
    },
    "attack": 110,
    "defense": 55,
    "hp": 70,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "quick"
        },
        {
          "fx": "cooldown",
          "turns": 2
        }
      ],
      "name": "Shadow Ambush",
      "power": 90,
      "target": "foe",
      "text": "Quick: the user acts first next round. Can't be used again for 2 turns."
    },
    "name": "Shadow Blade",
    "order": 17,
    "piece": "P41",
    "rarity": "Epic",
    "special": 75,
    "speed": 110,
    "type": "Shadow"
  },
  "snow-staff": {
    "ability": {
      "by": -1,
      "chance": 20,
      "code": "onSpecialHitStat",
      "name": "Frostbite",
      "stat": "speed",
      "text": "Special-category hits have a 20% chance to lower the target's Speed."
    },
    "attack": 55,
    "defense": 70,
    "hp": 80,
    "move": {
      "accuracy": 95,
      "cat": "spec",
      "fx": [
        {
          "chance": 20,
          "fx": "status",
          "status": "freeze"
        }
      ],
      "name": "Snowstorm Burst",
      "power": 90,
      "target": "foe",
      "text": "20% chance to freeze the target for 1 turn."
    },
    "name": "Snow Staff",
    "order": 42,
    "piece": "P18",
    "rarity": "Rare",
    "special": 110,
    "speed": 65,
    "type": "Storm"
  },
  "speed-silver-sword": {
    "ability": {
      "code": "soulSteal",
      "name": "soul steal",
      "text": "After knocking out an enemy, it learns that enemy's signature move and can use it for the rest of the battle."
    },
    "attack": 100,
    "defense": 80,
    "hp": 100,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "quick"
        }
      ],
      "name": "Silver Flash",
      "power": 60,
      "target": "foe",
      "text": "Quick: the user acts first next round."
    },
    "name": "Speed Silver Sword",
    "order": 34,
    "piece": "P7",
    "rarity": "Legendary",
    "special": 80,
    "speed": 100,
    "type": "Steel"
  },
  "super-axe": {
    "ability": {
      "code": "berserk",
      "name": "Berserk",
      "text": "Attack +1 stage the first time its HP drops below half."
    },
    "attack": 120,
    "defense": 75,
    "hp": 90,
    "move": {
      "accuracy": 90,
      "cat": "phys",
      "fx": [
        {
          "fx": "breakShields"
        }
      ],
      "name": "Splitting Chop",
      "power": 95,
      "target": "foe",
      "text": "Goes through shields, reflects and damage-halving effects."
    },
    "name": "Super Axe",
    "order": 32,
    "piece": "P25",
    "rarity": "Epic",
    "special": 75,
    "speed": 60,
    "type": "Steel"
  },
  "super-bow": {
    "ability": {
      "code": "neverMiss",
      "name": "Eagle Eye",
      "text": "Its attacks never miss and can't be dodged."
    },
    "attack": 100,
    "defense": 60,
    "hp": 70,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "hits",
          "n": 3
        }
      ],
      "name": "Volley",
      "power": 40,
      "target": "foe",
      "text": "Hits 3 times."
    },
    "name": "Super Bow",
    "order": 19,
    "piece": "P5",
    "rarity": "Epic",
    "special": 95,
    "speed": 95,
    "type": "Storm"
  },
  "super-mace": {
    "ability": {
      "by": -1,
      "chance": 30,
      "code": "onHitStat",
      "name": "Crusher",
      "stat": "defense",
      "text": "30% chance for any hit to lower the target's Defense."
    },
    "attack": 115,
    "defense": 100,
    "hp": 100,
    "move": {
      "accuracy": 90,
      "cat": "phys",
      "fx": [
        {
          "fx": "slowerBonus",
          "mult": 1.5
        }
      ],
      "name": "Ground Pound",
      "power": 100,
      "target": "foe",
      "text": "Deals 50% more damage if the user is slower than the target."
    },
    "name": "Super Mace",
    "order": 30,
    "piece": "P16",
    "rarity": "Legendary",
    "special": 100,
    "speed": 45,
    "type": "Energy"
  },
  "super-pickaxe": {
    "ability": {
      "code": "healOnKO",
      "name": "Ore Finder",
      "pct": 10,
      "text": "Heals 10% of its max HP after knocking out an enemy."
    },
    "attack": 110,
    "defense": 85,
    "hp": 85,
    "move": {
      "accuracy": 90,
      "cat": "phys",
      "fx": [
        {
          "by": -1,
          "chance": 100,
          "fx": "stat",
          "stat": "defense",
          "who": "foe"
        }
      ],
      "name": "Bedrock Breaker",
      "power": 95,
      "target": "foe",
      "text": "Lowers the target's Defense by 1 stage."
    },
    "name": "Super Pickaxe",
    "order": 43,
    "piece": "P28",
    "rarity": "Epic",
    "special": 70,
    "speed": 70,
    "type": "Steel"
  },
  "super-shield": {
    "ability": {
      "code": "surviveFromFull",
      "name": "Bulwark",
      "text": "From full HP, survives any single hit with at least 1 HP."
    },
    "attack": 50,
    "defense": 150,
    "hp": 120,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "useDef"
        }
      ],
      "name": "Shield Bash",
      "power": 70,
      "target": "foe",
      "text": "Uses the user's Defense instead of Attack."
    },
    "name": "Super Shield",
    "order": 20,
    "piece": "P15",
    "rarity": "Epic",
    "special": 70,
    "speed": 30,
    "type": "Crystal"
  },
  "super-spear": {
    "ability": {
      "code": "longReach",
      "name": "Long Reach",
      "text": "Its attacks go through shields, reflects and damage-halving effects."
    },
    "attack": 115,
    "defense": 65,
    "hp": 75,
    "move": {
      "accuracy": 90,
      "cat": "phys",
      "fx": [],
      "name": "Skewer",
      "power": 100,
      "target": "foe",
      "text": "No extra effect."
    },
    "name": "Super Spear",
    "order": 15,
    "piece": "P20",
    "rarity": "Epic",
    "special": 65,
    "speed": 100,
    "type": "Steel"
  },
  "super-trident": {
    "ability": {
      "below": 0.3333333333333333,
      "code": "lowHpTypeBoost",
      "mult": 1.5,
      "name": "Tidal Force",
      "text": "Below 1/3 HP, Storm moves deal 1.5x damage.",
      "type": "Storm"
    },
    "attack": 105,
    "defense": 85,
    "hp": 95,
    "move": {
      "accuracy": 95,
      "cat": "phys",
      "fx": [
        {
          "fx": "heal",
          "pct": 10
        }
      ],
      "name": "Riptide Rush",
      "power": 100,
      "target": "foe",
      "text": "Heals the user 10% of its max HP."
    },
    "name": "Super Trident",
    "order": 26,
    "piece": "P36",
    "rarity": "Legendary",
    "special": 95,
    "speed": 80,
    "type": "Storm"
  },
  "tree-staff": {
    "ability": {
      "code": "endTurnHeal",
      "name": "Photosynthesis",
      "pct": 6.25,
      "text": "Heals 1/16 of its max HP at the end of each of its turns."
    },
    "attack": 50,
    "defense": 75,
    "hp": 85,
    "move": {
      "accuracy": 100,
      "cat": "status",
      "fx": [
        {
          "fx": "heal",
          "pct": 30
        },
        {
          "by": 1,
          "chance": 100,
          "fx": "stat",
          "stat": "defense",
          "who": "self"
        },
        {
          "by": -1,
          "chance": 100,
          "fx": "stat",
          "stat": "speed",
          "who": "self"
        }
      ],
      "name": "Rooted Bloom",
      "power": 0,
      "target": "self",
      "text": "Heals 30% of max HP and takes root: Defense +1, Speed -1."
    },
    "name": "Tree Staff",
    "order": 7,
    "piece": "P34",
    "rarity": "Rare",
    "special": 120,
    "speed": 50,
    "type": "Nature"
  },
  "two-sided-hoe": {
    "ability": {
      "code": "doubleHealing",
      "name": "Double Harvest",
      "text": "All its healing is doubled."
    },
    "attack": 90,
    "defense": 65,
    "hp": 75,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "hits",
          "n": 2
        },
        {
          "fx": "drain",
          "pct": 25
        }
      ],
      "name": "Reap & Sow",
      "power": 40,
      "target": "foe",
      "text": "Hits 2 times; heals the user 25% of the damage dealt."
    },
    "name": "Two-Sided Hoe",
    "order": 39,
    "piece": "P33",
    "rarity": "Rare",
    "special": 75,
    "speed": 75,
    "type": "Nature"
  },
  "weird-looking-shape": {
    "ability": {
      "code": "shapeshift",
      "name": "Shapeshift",
      "text": "At the start of battle, becomes the type that beats the most common enemy type."
    },
    "attack": 68,
    "defense": 68,
    "hp": 68,
    "move": {
      "accuracy": 100,
      "cat": "spec",
      "fx": [
        {
          "fx": "randomPower",
          "max": 110,
          "min": 10
        }
      ],
      "name": "Glitch",
      "power": 0,
      "target": "foe",
      "text": "Power is random, from 10 to 110."
    },
    "name": "Weird Looking Shape",
    "order": 8,
    "piece": "P27",
    "rarity": "Uncommon",
    "special": 68,
    "speed": 68,
    "type": "Mob"
  },
  "yellow-dagger": {
    "ability": {
      "chance": 20,
      "code": "contactInflict",
      "name": "Static Tip",
      "status": "paralyze",
      "text": "Its physical attacks have a 20% chance to paralyze."
    },
    "attack": 70,
    "defense": 40,
    "hp": 50,
    "move": {
      "accuracy": 100,
      "cat": "phys",
      "fx": [
        {
          "fx": "quick"
        }
      ],
      "name": "Spark Stab",
      "power": 45,
      "target": "foe",
      "text": "Quick: the user acts first next round."
    },
    "name": "Yellow Dagger",
    "order": 44,
    "piece": "P21",
    "rarity": "Common",
    "special": 45,
    "speed": 95,
    "type": "Energy"
  },
  "yellow-head": {
    "ability": {
      "code": "statMult",
      "name": "Bright Mind",
      "pct": 10,
      "stat": "special",
      "text": "Special is 10% higher."
    },
    "attack": 55,
    "defense": 60,
    "hp": 70,
    "move": {
      "accuracy": 100,
      "cat": "spec",
      "fx": [
        {
          "by": -1,
          "chance": 100,
          "fx": "stat",
          "stat": "acc",
          "who": "foe"
        }
      ],
      "name": "Flash Glare",
      "power": 40,
      "target": "foe",
      "text": "Lowers the target's accuracy by 1 stage."
    },
    "name": "Yellow Head",
    "order": 6,
    "piece": "P31",
    "rarity": "Common",
    "special": 60,
    "speed": 55,
    "type": "Mob"
  },
  "yellow-lightsaber": {
    "ability": {
      "code": "sureFirstHit",
      "name": "Glowing Edge",
      "text": "Its first attack each battle can't miss."
    },
    "attack": 75,
    "defense": 50,
    "hp": 60,
    "move": {
      "accuracy": 95,
      "cat": "phys",
      "fx": [
        {
          "by": -1,
          "chance": 20,
          "fx": "stat",
          "stat": "acc",
          "who": "foe"
        }
      ],
      "name": "Solar Saber Swing",
      "power": 80,
      "target": "foe",
      "text": "20% chance to lower the target's accuracy."
    },
    "name": "Yellow Lightsaber",
    "order": 1,
    "piece": "P11",
    "rarity": "Uncommon",
    "special": 70,
    "speed": 85,
    "type": "Energy"
  }
};
