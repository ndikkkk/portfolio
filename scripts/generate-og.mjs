// Membangkitkan og-image.png dan apple-touch-icon.png tanpa dependensi.
// Jalankan: node scripts/generate-og.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const INK = [17, 17, 17];
const CREAM = [255, 248, 231];
const SURFACE = [255, 255, 255];
const YELLOW = [255, 212, 59];
const PINK = [255, 143, 177];

// Font bitmap 5x7. '#' berarti piksel terisi.
const FONT = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".###.", "#...#", "#....", "#.###", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#...#", "#.#.#", "#.#.#", ".#.#."],
  "&": [".###.", "#...#", "#..#.", ".#...", "#.#.#", "#...#", ".###."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};

function render(w, h, draw) {
  const buf = Buffer.alloc(w * h * 3);
  const set = (x, y, c) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 3;
    buf[i] = c[0];
    buf[i + 1] = c[1];
    buf[i + 2] = c[2];
  };
  const fill = (x, y, ww, hh, c) => {
    for (let yy = y; yy < y + hh; yy += 1) {
      for (let xx = x; xx < x + ww; xx += 1) set(xx, yy, c);
    }
  };
  const text = (str, x, y, scale, c) => {
    let cx = x;
    for (const ch of str) {
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
  draw({ fill, text });
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
    raw[y * (stride + 1)] = 0;
    pix.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(file, png);
  console.log(`wrote ${file} (${png.length} bytes)`);
}

mkdirSync("public", { recursive: true });

// og-image 1200 x 630
const og = render(1200, 630, ({ fill, text }) => {
  fill(0, 0, 1200, 630, CREAM);
  fill(40, 40, 1152, 582, INK); // bayangan
  fill(24, 24, 1152, 582, INK); // kerangka
  fill(28, 28, 1144, 574, SURFACE); // isi kartu

  fill(1016, 72, 96, 96, INK);
  fill(1020, 76, 88, 88, YELLOW);
  fill(1084, 196, 72, 72, INK);
  fill(1088, 200, 64, 64, PINK);

  fill(61, 297, 140, 10, INK);
  fill(65, 301, 132, 6, YELLOW);

  text("ANDHIKAALVN", 60, 180, 9, INK);
  text("AI ENGINEER & WEB DEVELOPER", 60, 342, 3, INK);
});
writePng("public/og-image.png", og, 1200, 630);

// apple-touch-icon 180 x 180
const icon = render(180, 180, ({ fill, text }) => {
  fill(0, 0, 180, 180, CREAM);
  fill(12, 12, 156, 156, INK);
  fill(4, 4, 156, 156, INK);
  fill(10, 10, 144, 144, YELLOW);
  text("A", 50, 34, 16, INK);
});
writePng("public/apple-touch-icon.png", icon, 180, 180);