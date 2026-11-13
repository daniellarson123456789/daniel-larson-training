#!/usr/bin/env python3
"""Generate versioned 1200x630 Open Graph images in the FastPass navy/gold style."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PAGES = json.loads((ROOT / "src/data/og-pages.json").read_text())
OUT_DIR = ROOT / "public/og"
LOGO_PATH = ROOT / "public/fastpass-logo.webp"
FONT = Path("/usr/share/fonts/truetype/sand-box/google/Inter/Inter-VariableFont_opsz,wght.ttf")

W, H = 1200, 630
GOLD = (212, 160, 23, 255)
GOLD2 = (240, 193, 75, 255)
WHITE = (255, 255, 255, 255)
MUTED = (184, 199, 221, 255)


def inter(size: int, weight: int = 700, opsz: float = 14) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(FONT), size=size)
    font.set_variation_by_axes([opsz, weight])
    return font


def measure(text: str, font: ImageFont.FreeTypeFont) -> float:
    dummy = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    return dummy.textlength(text, font=font)


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    if "\n" in text:
        return [line.strip() for line in text.splitlines() if line.strip()]
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        if measure(trial, font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines or [text]


def base_art() -> Image.Image:
    img = Image.new("RGBA", (W, H), (8, 4, 38, 255))
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        for x in range(W):
            s = x / (W - 1)
            r = int(8 + 2 * s + 8 * t * 0.35)
            g = int(4 + 14 * (0.25 * s + 0.6 * t))
            b = int(38 + 38 * t * 0.55 + 3 * s)
            px[x, y] = (r, g, b, 255)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).rectangle([0, 0, W, 36], fill=(212, 160, 23, 36))
    img = Image.alpha_composite(img, glow.filter(ImageFilter.GaussianBlur(14)))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, W, 8], fill=GOLD)
    draw.rectangle([0, H - 8, W, H], fill=GOLD)

    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo_size = 300
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_x, logo_y = 72, (H - logo_size) // 2 + 6
    img.paste(logo, (logo_x, logo_y), logo)
    return img, logo_x + logo_size + 52


def render_card(headline: str) -> Image.Image:
    img, text_x = base_art()
    draw = ImageDraw.Draw(img)
    max_width = W - text_x - 64

    kicker_font = inter(20, 650, 14)
    brand_font = inter(56, 760, 24)
    headline_font = inter(44, 620, 20)

    kicker = "A DANIEL LARSON TRAINING SCHOOL"
    brand_lines = ["Real Estate", "FastPass"]
    headlines = wrap_text(headline, headline_font, max_width)
    if len(headlines) > 2:
        headline_font = inter(38, 620, 18)
        headlines = wrap_text(headline, headline_font, max_width)

    # Measure the text block and vertically center it against the logo.
    kicker_h = 34
    rule_h = 22
    brand_h = 62 * len(brand_lines)
    gap = 16
    headline_h = 54 * len(headlines)
    block_h = kicker_h + rule_h + brand_h + gap + headline_h
    y = max(96, (H - block_h) // 2 - 6)

    draw.text((text_x, y), kicker, font=kicker_font, fill=GOLD2)
    y += kicker_h
    kw = min(draw.textlength(kicker, font=kicker_font), 260)
    draw.rectangle([text_x, y, text_x + kw, y + 4], fill=GOLD)
    y += rule_h

    for line in brand_lines:
        draw.text((text_x, y), line, font=brand_font, fill=WHITE)
        y += 62

    y += gap
    for line in headlines:
        draw.text((text_x, y), line, font=headline_font, fill=MUTED)
        y += 54

    return img.convert("RGB")


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written = []
    for page in PAGES:
        dest = ROOT / "public" / page["image"].lstrip("/")
        dest.parent.mkdir(parents=True, exist_ok=True)
        image = render_card(page["headline"])
        image.save(dest, "PNG", optimize=True)
        written.append((page["id"], dest, dest.stat().st_size))
        print(f"wrote {dest.relative_to(ROOT)} ({dest.stat().st_size} bytes) — {page['headline']}")

    # Keep the default share path in sync so leftover references stay on-brand
    default = next(p for p in PAGES if p["id"] == "default")
    default_img = Image.open(ROOT / "public" / default["image"].lstrip("/"))
    social = ROOT / "public/social-share.png"
    default_img.save(social, "PNG", optimize=True)
    print(f"synced {social.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
