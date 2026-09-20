const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generateIconPNG(size) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  const center = size / 2;
  const radius = size * 0.45;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: rounded badge / circle with indigo-to-violet gradient
      if (dist <= radius) {
        const t = (x + y) / (2 * size);
        // Gradient between Indigo #4f46e5 (79, 70, 229) and Emerald #10b981 (16, 185, 129)
        const r = Math.round(79 * (1 - t) + 16 * t);
        const g = Math.round(70 * (1 - t) + 185 * t);
        const b = Math.round(229 * (1 - t) + 129 * t);

        // Draw inner white icon (book / graduation cap motif or 'S')
        const relX = (x - center) / radius;
        const relY = (y - center) / radius;

        // Simple academic / spark icon shape in white
        let isForeground = false;
        // Central star/spark or book polygon
        if (Math.abs(relX) < 0.55 && Math.abs(relY) < 0.45) {
          // Open book representation
          const spineDist = Math.abs(relX);
          if (relY > -0.2 && relY < 0.35 && spineDist > 0.08 && spineDist < 0.48) {
            isForeground = true;
          }
          // Cap or roof
          if (relY <= -0.1 && Math.abs(relX) <= (0.35 - (relY + 0.1) * 0.8)) {
            isForeground = true;
          }
        }

        if (isForeground) {
          rawData[offset++] = 255;
          rawData[offset++] = 255;
          rawData[offset++] = 255;
          rawData[offset++] = 255;
        } else {
          // Smooth edge antialiasing
          const alpha = dist > radius - 1 ? Math.round(255 * (radius - dist)) : 255;
          rawData[offset++] = r;
          rawData[offset++] = g;
          rawData[offset++] = b;
          rawData[offset++] = Math.max(0, Math.min(255, alpha));
        }
      } else {
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0; // transparent
      }
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach(size => {
  const buffer = generateIconPNG(size);
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated ${filePath} (${buffer.length} bytes)`);
});
