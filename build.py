"""Rebuilds bead-battle.html (one self-contained file) from the files in src/.

Run after editing anything in src/:   python3 build.py
"""
import base64, pathlib

here = pathlib.Path(__file__).resolve().parent
src = here / "src"
html = (src / "index.html").read_text(encoding="utf-8")
engine = (src / "engine.js").read_text(encoding="utf-8")
fighters = (src / "fighters.js").read_text(encoding="utf-8")
photo = base64.b64encode((src / "perler-bead-weapons.jpeg").read_bytes()).decode("ascii")
marker = '<script src="fighters.js"></script>\n<script src="engine.js"></script>'
assert marker in html, "src/index.html must load fighters.js then engine.js with plain <script src> tags"
inline = "<script>\n" + fighters + "\nwindow.BEAD_PHOTO_DATA = \"" + photo + "\";\n</script>\n<script>\n" + engine + "\n</script>"
(here / "bead-battle.html").write_text(html.replace(marker, inline), encoding="utf-8")
print("Wrote", here / "bead-battle.html")
