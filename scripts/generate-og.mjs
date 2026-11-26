// Membangkitkan og-image.png dan apple-touch-icon.png tanpa dependensi.
// Jalankan: node scripts/generate-og.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const INK = hex("#111111");
const CREAM = hex("#FFF8E7");
const SURFACE = hex("#FFFFFF");
const YELLOW = hex("#FFD43B");
const PINK = hex("#FF8FB1");

// Font bitmap 5x7 lengkap (A-Z dan tanda baca)
const FONT = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  J: ["..###", "...#.", "...#.", "...#.", "#..#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".###.", "#...#", "#....", ".###.", "....#", "#...#", ".###."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#...#", "#.#.#", "#.#.#", ".#.#."],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
  ",": [".....", ".....", ".....", ".....", ".....", "..#..", ".#..."],
  ".": [".....", ".....", ".....", ".....", ".....", "..#..", "..#.."],
  "'": ["..#..", "..#..", ".#...", ".....", ".....", ".....", "....."],
  "&": [".###.", "#...#", "#..#.", ".#...", "#.#.#", "#...#", ".###."],
  "/": ["....#", "...#.", "...#.", "..#..", ".#...", ".#...", "#...."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};

function render(w, h, draw) {
  const buf = Buffer.alloc(w * h * 3);
  const set = (x, y, c) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 3;
    buf.set(c, i);
  };
  const fill = (x, y, ww, hh, c) => {
    for (let yy = y; yy < y + hh; yy += 1) {
      for (let xx = x; xx < x + ww; xx += 1) set(xx, yy, c);
    }
  };
  const text = (str, x, y, scale, c) => {
    let cx = x;
    for (const ch of str.toUpperCase()) {
      const g = FONT[ch] || FONT[" "];
      for (let r = 0; r < 7; r += 1) {
        const row = g[r];
        for (let col = 0; col < 5; col += 1) {
          if (row[col] === "#") fill(cx + col * scale, y + r * scale, scale, scale, c);
        }
      }
      cx += 6 * scale;
    }
  };
  const wrapText = (str, x, y, scale, maxWidth, lineHeight, c) => {
    const words = str.split(" ");
    let line = "";
    let cy = y;
    const charWidth = 6 * scale;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      if (testLine.length * charWidth > maxWidth && line) {
        text(line, x, cy, scale, c);
        line = word;
        cy += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) text(line, x, cy, scale, c);
  };

  draw({ fill, text, wrapText });
  return buf;
}

let crcTable = null;
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Int32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crcTable[n] = c;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function writePng(file, pix, w, h) {
  const stride = w * 3;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y += 1) {
    raw.writeUInt8(0, y * (stride + 1));
    pix.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // color type RGB

  const signature = Buffer.from("89504e470d0a1a0a", "hex");
  const png = Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(file, png);
  console.log(`wrote ${file} (${png.length} bytes)`);
}

mkdirSync("public", { recursive: true });

// og-image 1200 x 630
const og = render(1200, 630, ({ fill, text, wrapText }) => {
  fill(0, 0, 1200, 630, CREAM);
  fill(40, 40, 1136, 566, INK); // bayangan
  fill(24, 24, 1136, 566, INK); // kerangka
  fill(28, 28, 1128, 558, SURFACE); // isi kartu

  // Dekorasi kotak kanan atas
  fill(1016, 72, 96, 96, INK);
  fill(1020, 76, 88, 88, YELLOW);
  fill(1064, 196, 72, 72, INK);
  fill(1068, 200, 64, 64, PINK);

  // Badge label kecil di atas nama
  fill(64, 76, 360, 44, INK);
  fill(60, 72, 360, 44, YELLOW);
  fill(60, 72, 360, 3, INK);
  fill(60, 113, 360, 3, INK);
  fill(60, 72, 3, 44, INK);
  fill(417, 72, 3, 44, INK);
  text("PERSONAL PORTFOLIO", 80, 84, 3, INK);

  // Nama utama
  text("ANDHIKAALVN", 60, 160, 11, INK);

  // Garis pemisah kuning
  fill(64, 274, 180, 12, INK);
  fill(60, 270, 180, 12, YELLOW);

  // Deskripsi dengan auto word-wrap
  wrapText(
    "JUST AN INFORMATICS STUDENT SHARING COOL STUFF I'VE BUILT, MILESTONES, AND MY GO-TO TOOLS.",
    60,
    325,
    3,
    980,
    36,
    INK
  );
});
writePng("public/og-image.png", og, 1200, 630);

// apple-touch-icon 180 x 180
const icon = render(180, 180, ({ fill, text }) => {
  fill(0, 0, 180, 180, CREAM);
  fill(22, 22, 144, 144, INK); // bayangan
  fill(14, 14, 144, 144, INK); // border luar
  fill(18, 18, 136, 136, YELLOW); // isi kotak
  text("A", 46, 30, 16, INK);
});
writePng("public/apple-touch-icon.png", icon, 180, 180);
