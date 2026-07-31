import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");

function markSvg(size) {
  const inset = Math.round(size * 0.0625);
  const radius = Math.round(size * 0.22);
  const play = [
    [size * 0.405, size * 0.305],
    [size * 0.405, size * 0.695],
    [size * 0.71, size * 0.5],
  ].map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(" ");

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="${radius}" fill="#f8f5ed"/>
      <rect x="${inset}" y="${inset}" width="${size - inset * 2}" height="${size - inset * 2}" rx="${radius - inset / 2}" fill="#171b1a"/>
      <circle cx="${Math.round(size * 0.76)}" cy="${Math.round(size * 0.24)}" r="${Math.round(size * 0.065)}" fill="#71d5a2"/>
      <polygon points="${play}" fill="#d9ff62"/>
    </svg>
  `);
}

async function png(size) {
  return sharp(markSvg(size)).png({ compressionLevel: 9 }).toBuffer();
}

function icoFromPng(pngBuffer, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size === 256 ? 0 : size, 6);
  header.writeUInt8(size === 256 ? 0 : size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(pngBuffer.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, pngBuffer]);
}

const [small, apple, icon192, icon512] = await Promise.all([
  png(32),
  png(180),
  png(192),
  png(512),
]);

await Promise.all([
  writeFile(path.join(publicDir, "favicon-32x32.png"), small),
  writeFile(path.join(publicDir, "favicon.ico"), icoFromPng(small, 32)),
  writeFile(path.join(publicDir, "apple-touch-icon.png"), apple),
  writeFile(path.join(publicDir, "totube-icon-192.png"), icon192),
  writeFile(path.join(publicDir, "totube-icon-512.png"), icon512),
]);
