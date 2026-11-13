#!/usr/bin/env python3
"""Compose the About us OG card with Daniel's /about/ portrait. Draft only until approved."""

from __future__ import annotations

import importlib.util
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PHOTO = ROOT / "public/daniel-larson-suit.webp"
LOGO = ROOT / "public/fastpass-logo.webp"
DRAFT = Path("/workspace/draft-site/og/about-v4.png")

W, H = 1200, 630
GOLD = (212, 160, 23, 255)
GOLD2 = (240, 193, 75, 255)
WHITE = (255, 255, 255, 255)
MUTED = (184, 199, 221, 255)


def load_gen():
    spec = importlib.util.spec_from_file_location("gen", ROOT / "scripts/generate-og-images.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def rounded_rect_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return mask


def rounded_photo(photo: Image.Image, size: tuple[int, int], radius: int) -> Image.Image:
    # Full-frame 2:3 portrait, no face crop — only a high-quality downscale.
    fitted = photo.convert("RGBA").resize(size, Image.Resampling.LANCZOS)
    mask = rounded_rect_mask(size, radius)
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.paste(fitted, (0, 0))
    out.putalpha(mask)
    return out


def compose() -> Image.Image:
    gen = load_gen()

    # Background + gold bars, but no default left logo (we place a smaller one).
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

    # Portrait panel on the right: keep the full 2:3 frame so the face, hair,
    # and shoulders stay intact. Downscale only (source is 720x1080).
    photo_h = 546
    photo_w = int(round(photo_h * (720 / 1080)))  # 364
    radius = 28
    right_pad = 44
    photo_x = W - right_pad - photo_w
    photo_y = (H - photo_h) // 2

    source = Image.open(PHOTO)
    portrait = rounded_photo(source, (photo_w, photo_h), radius)

    # Soft drop shadow, then a gold border matching the site's rounded photos.
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle(
        [photo_x + 4, photo_y + 10, photo_x + photo_w + 4, photo_y + photo_h + 12],
        radius=radius,
        fill=(0, 0, 0, 160),
    )
    img = Image.alpha_composite(img, shadow.filter(ImageFilter.GaussianBlur(16)))

    border = 4
    frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(frame)
    fd.rounded_rectangle(
        [photo_x - border, photo_y - border, photo_x + photo_w + border - 1, photo_y + photo_h + border - 1],
        radius=radius + 2,
        fill=GOLD,
    )
    img = Image.alpha_composite(img, frame)
    img.paste(portrait, (photo_x, photo_y), portrait)

    # Logo on the left, slightly smaller so the type and portrait have room.
    logo_size = 240
    logo = Image.open(LOGO).convert("RGBA").resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    logo_x = 52
    logo_y = (H - logo_size) // 2 + 4
    img.paste(logo, (logo_x, logo_y), logo)

    # Type block between logo and portrait — same system as the v3 cards.
    text_x = logo_x + logo_size + 40
    max_width = photo_x - border - 36 - text_x

    kicker_font = gen.inter(20, 650, 14)
    brand_font = gen.inter(56, 760, 24)
    headline_font = gen.inter(44, 620, 20)
    kicker = "A DANIEL LARSON TRAINING SCHOOL"
    brand_lines = ["Real Estate", "FastPass"]
    headlines = ["About us"]

    kicker_h, rule_h, brand_h, gap, headline_h = 34, 22, 62 * 2, 16, 54
    block_h = kicker_h + rule_h + brand_h + gap + headline_h
    y = max(96, (H - block_h) // 2 - 6)

    draw = ImageDraw.Draw(img)
    draw.text((text_x, y), kicker, font=kicker_font, fill=GOLD2)
    y += kicker_h
    kw = min(draw.textlength(kicker, font=kicker_font), 260)
    # If the kicker is wider than the reserved rule, still draw the full kicker
    # as in v3, but keep the rule at the familiar 260px cap when it fits.
    draw.rectangle([text_x, y, text_x + kw, y + 4], fill=GOLD)
    y += rule_h
    for line in brand_lines:
        draw.text((text_x, y), line, font=brand_font, fill=WHITE)
        y += 62
    y += gap
    for line in headlines:
        draw.text((text_x, y), line, font=headline_font, fill=MUTED)
        y += 54

    # Guard: kicker must not collide with the gold frame.
    kicker_w = draw.textlength(kicker, font=kicker_font)
    if text_x + kicker_w > photo_x - border - 16:
        raise SystemExit(f"kicker collides with photo: ends at {text_x + kicker_w:.0f}, photo at {photo_x}")

    return img.convert("RGB")


def main() -> int:
    image = compose()
    DRAFT.parent.mkdir(parents=True, exist_ok=True)
    image.save(DRAFT, "PNG", optimize=True)
    print(f"wrote {DRAFT} ({DRAFT.stat().st_size} bytes) {image.size}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
