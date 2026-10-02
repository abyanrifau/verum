"""Subsets the self-hosted Geist fonts to the characters the site uses (Latin).

Keeps the variable weight axis and all OpenType features (ss01, zero, kerning).
Run: python scripts/subset-fonts.py   (needs: pip install fonttools brotli)
"""
from pathlib import Path
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,"
    "U+2190-2193,U+2212,U+2605-2606,U+2713"
)
FONTS = {
    "node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2": "src/assets/fonts/geist-latin-wght-normal.woff2",
    "node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2": "src/assets/fonts/geist-mono-latin-wght-normal.woff2",
}
for src, out in FONTS.items():
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.drop_tables += ["DSIG"]
    font = subset.load_font(str(ROOT / src), opts)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=subset.parse_unicodes(UNICODES))
    sub.subset(font)
    subset.save_font(font, str(ROOT / out), opts)
    print(f"{out}: {(ROOT / src).stat().st_size} -> {(ROOT / out).stat().st_size} bytes")
