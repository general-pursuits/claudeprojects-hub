from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).with_name("linkedin-profile-banner.png")

W, H = 1584, 396
BG = (26, 25, 22)
IVORY = (236, 231, 221)
LAVENDER = (180, 156, 224)

canvas = Image.new("RGB", (W, H), BG)

# Mountain panel on the right; the left stays quiet for LinkedIn's profile-photo overlap.
mountain = Image.open(ROOT / "images" / "hero-mountain.webp").convert("L")
mountain = ImageEnhance.Contrast(mountain).enhance(1.25)
mountain = ImageOps.fit(mountain, (900, H), method=Image.Resampling.LANCZOS, centering=(0.68, 0.52))
mountain = Image.merge("RGB", (mountain, mountain, mountain))
canvas.paste(mountain, (W - 900, 0))

# Charcoal gradient makes the transition and copy area feel intentional.
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
shade_px = shade.load()
for x in range(W):
    if x < 610:
        alpha = 245
    elif x < 1080:
        alpha = int(245 - (x - 610) * 150 / 470)
    else:
        alpha = 95
    for y in range(H):
        shade_px[x, y] = (26, 25, 22, alpha)
canvas = Image.alpha_composite(canvas.convert("RGBA"), shade)

draw = ImageDraw.Draw(canvas)
impact = "/System/Library/Fonts/Supplemental/Impact.ttf"
helvetica = "/System/Library/Fonts/Helvetica.ttc"
headline = ImageFont.truetype(impact, 68)
small = ImageFont.truetype(helvetica, 18)
tag = ImageFont.truetype(helvetica, 15)

# Fine technical rules echo the live website without becoming decorative clutter.
draw.line((508, 0, 508, H), fill=(237, 234, 227, 42), width=1)
draw.line((548, 0, 548, H), fill=(237, 234, 227, 24), width=1)
draw.line((548, 76, 1508, 76), fill=(237, 234, 227, 32), width=1)
draw.line((548, 316, 1508, 316), fill=(237, 234, 227, 28), width=1)

# Convert the supplied stippled mark to a clean white overlay.
mark_source = Image.open(ROOT / "images" / "mark.png").convert("RGBA")
mark = ImageOps.fit(mark_source.getchannel("A"), (128, 74), method=Image.Resampling.LANCZOS)
mark_rgba = Image.new("RGBA", mark.size, (237, 234, 227, 0))
mark_rgba.putalpha(mark)
canvas.alpha_composite(mark_rgba, (590, 92))

x = 748
draw.text((x, 92), "OPPORTUNITY DESIGNED", font=headline, fill=IVORY)
draw.line((x + 2, 174, 1478, 174), fill=LAVENDER, width=3)
draw.text((x + 3, 198), "GROWTH STRATEGY FOR CONSUMER BRANDS & RETAILERS", font=small, fill=LAVENDER)
draw.text((x + 3, 252), "SEE WHAT OTHERS MISS.", font=tag, fill=IVORY)

canvas.convert("RGB").save(OUT, quality=95)
print(OUT)
