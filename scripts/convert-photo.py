"""Konversi foto pribadi (HEIC) untuk dipakai di web.

Menghasilkan dua file:
- public/photos/portrait.webp        foto asli untuk lapisan bawah
- public/photos/portrait-pixel.webp  versi pixel untuk lapisan atas (hover reveal)

Folder public/photos/ sengaja di-gitignore (lihat .gitignore), jadi file foto
tidak ikut ke GitHub. Jalankan ulang bila foto sumber berubah:

    python scripts/convert-photo.py

Bergantung pada: pillow, pillow-heif.
"""

from pathlib import Path

from PIL import Image

import pillow_heif

pillow_heif.register_heif_opener()

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "IMG_9450.HEIC"
OUT_DIR = ROOT / "public" / "photos"
OUT_DIR.mkdir(parents=True, exist_ok=True)

MAX_SIDE = 1024   # batasi ukuran foto asli agar ringan
PIXEL_GRID = 48   # lebar grid versi pixel (makin kecil makin chunkylook)
ORIGINAL = OUT_DIR / "portrait.webp"
PIXEL = OUT_DIR / "portrait-pixel.webp"


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Foto sumber tidak ditemukan: {SRC}")

    with Image.open(SRC) as im:
        im = im.convert("RGB")

        # Foto asli, dibatasi sisi terpanjang.
        original = im.copy()
        if max(original.size) > MAX_SIDE:
            original.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        original.save(ORIGINAL, "WEBP", quality=85, method=6)
        print(f"wrote {ORIGINAL.relative_to(ROOT)} {original.size}")

        # Versi pixel: kecilkan lalu perbesar dengan NEAREST agar blok tegas.
        w, h = original.size
        small_w = PIXEL_GRID
        small_h = max(1, round(h * small_w / w))
        small = original.resize((small_w, small_h), Image.LANCZOS)
        pixel = small.resize(original.size, Image.NEAREST)
        pixel.save(PIXEL, "WEBP", quality=90, method=0)
        print(f"wrote {PIXEL.relative_to(ROOT)} {pixel.size}")


if __name__ == "__main__":
    main()