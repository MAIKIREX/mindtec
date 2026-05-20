const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

const shapesHTML = `
            <!-- Geometric floating shapes (always visible, CSS-animated) -->
            <div class="hero-shapes" aria-hidden="true">
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
                <div class="hero-shape"></div>
            </div>
            <!-- Mobile-first neural canvas background -->
            <div class="hero-mobile-canvas" id="hero-mobile-canvas" aria-hidden="true"></div>`;

let updatedCount = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if it has a hero-section
    if (content.includes('class="hero-section')) {
        // Only insert if not already present
        if (!content.includes('class="hero-shapes"')) {
            content = content.replace(/(<section[^>]*class="[^"]*hero-section[^>]*>)/i, `$1\n${shapesHTML}`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
            updatedCount++;
        } else {
            console.log(`Skipped ${file} - already has shapes`);
        }
    }
}

console.log(`Done. Updated ${updatedCount} files.`);
