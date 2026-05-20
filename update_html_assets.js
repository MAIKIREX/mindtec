const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newShapesHTML = `
            <!-- Geometric floating shapes (always visible, CSS-animated) -->
            <div class="hero-shapes" aria-hidden="true">
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
            </div>`;

const newWhatsAppSVG = `<svg viewBox="0 0 448 512" class="float-wa-icon"><path fill="#fff" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.1-115-65-157.1zm-157 341.1h-.1c-33 0-65.3-8.9-93.6-25.6l-6.7-4-69.5 18.2 18.5-67.8-4.4-7C48.2 323.5 38.3 289.4 38.3 254c0-102.3 83.2-185.5 185.6-185.5 49.6 0 96.3 19.3 131.4 54.4 35.1 35.1 54.4 81.8 54.4 131.4 0 102.3-83.2 185.5-185.5 185.5zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`;

let updatedShapesCount = 0;
let updatedWaCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace hero shapes
    const shapesRegex = /<!-- Geometric floating shapes[^]*?<\/div>\s*<\/div>/;
    if (shapesRegex.test(content)) {
        content = content.replace(shapesRegex, newShapesHTML.trim());
        changed = true;
        updatedShapesCount++;
    }

    // Replace WhatsApp icon
    const waRegex = /<svg viewBox="0 0 32 32" class="float-wa-icon">[\s\S]*?<\/svg>/;
    if (waRegex.test(content)) {
        content = content.replace(waRegex, newWhatsAppSVG);
        changed = true;
        updatedWaCount++;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
}

console.log(`Done. Updated Shapes in ${updatedShapesCount} files, WhatsApp in ${updatedWaCount} files.`);
