const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let shapes = '';
for (let i = 0; i < 40; i++) {
    shapes += '                <div class="hero-shape"></div>\n';
}

const newShapesHTML = `
            <!-- Geometric floating shapes (always visible, CSS-animated) -->
            <div class="hero-shapes" aria-hidden="true">
${shapes.trimEnd()}
            </div>`;

let updatedShapesCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace hero shapes block regardless of how many divs it currently has
    const shapesRegex = /<!-- Geometric floating shapes[^]*?<\/div>\s*<\/div>/;
    if (shapesRegex.test(content)) {
        content = content.replace(shapesRegex, newShapesHTML.trim());
        changed = true;
        updatedShapesCount++;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file} with 40 shapes`);
    }
}

console.log(`Done. Updated Shapes in ${updatedShapesCount} files.`);
