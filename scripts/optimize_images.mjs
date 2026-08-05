import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const srcDir = path.join(root, "src");
const MIN_SIZE = 400 * 1024; // only touch files heavier than this
const MAX_WIDTH = 2200;
const QUALITY = 82;

function walk(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, exts, out);
    else if (exts.includes(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

const targets = walk(publicDir, [".jpg", ".jpeg", ".png"]).filter(
  (p) => fs.statSync(p).size > MIN_SIZE,
);

console.log(`Found ${targets.length} candidate images > ${MIN_SIZE / 1024}KB`);

const mapping = []; // { oldRel, newRel, oldBytes, newBytes }

for (const file of targets) {
  const oldBytes = fs.statSync(file).size;
  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  const webpPath = path.join(dir, `${base}.webp`);

  const img = sharp(file);
  const meta = await img.metadata();
  let pipeline = img;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH });
  }
  pipeline = pipeline.webp({ quality: QUALITY });

  await pipeline.toFile(webpPath);
  const newBytes = fs.statSync(webpPath).size;

  const oldRel = "/" + path.relative(publicDir, file).split(path.sep).join("/");
  const newRel = "/" + path.relative(publicDir, webpPath).split(path.sep).join("/");

  mapping.push({ oldRel, newRel, oldBytes, newBytes, file, webpPath });
  console.log(
    `${oldRel} -> ${newRel}  ${(oldBytes / 1024).toFixed(0)}KB -> ${(newBytes / 1024).toFixed(0)}KB`,
  );
}

// Update references in source files
const srcFiles = walk(srcDir, [".astro", ".md", ".mdx", ".ts", ".tsx", ".js"]);
let filesChanged = 0;
for (const file of srcFiles) {
  let content = fs.readFileSync(file, "utf-8");
  let changed = false;
  for (const m of mapping) {
    if (content.includes(m.oldRel)) {
      content = content.split(m.oldRel).join(m.newRel);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, "utf-8");
    filesChanged++;
  }
}
console.log(`Updated references in ${filesChanged} source files.`);

fs.writeFileSync(
  path.join(root, "scripts", "optimize_images_mapping.json"),
  JSON.stringify(mapping.map(({ file, webpPath, ...rest }) => rest), null, 2),
);

const totalOld = mapping.reduce((s, m) => s + m.oldBytes, 0);
const totalNew = mapping.reduce((s, m) => s + m.newBytes, 0);
console.log(
  `Total: ${(totalOld / 1024 / 1024).toFixed(1)}MB -> ${(totalNew / 1024 / 1024).toFixed(1)}MB (saved ${((1 - totalNew / totalOld) * 100).toFixed(0)}%)`,
);
