const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const waHtml = `
    <!-- WhatsApp Floating Button -->
    <a href="https://wa.me/59178955329" class="float-wa" target="_blank" aria-label="Consulta rápida">
        <div class="float-wa-text">Consulta rápida</div>
        <svg viewBox="0 0 32 32" class="float-wa-icon"><path d="M16 2.004c-7.72 0-14 6.278-14 14.004 0 2.457.636 4.846 1.84 6.966l-1.956 7.14 7.297-1.916a13.914 13.914 0 006.82 1.81h.006c7.718 0 13.996-6.282 13.996-14.004 0-3.743-1.458-7.26-4.06-9.907-2.6-2.646-6.064-4.103-9.944-4.093zM16 27.567h-.004a11.58 11.58 0 01-5.918-1.616l-.426-.252-4.398 1.155 1.176-4.286-.277-.442A11.53 11.53 0 014.39 16.008c0-6.386 5.2-11.584 11.597-11.584 3.097.004 6.008 1.214 8.197 3.41 2.19 2.193 3.396 5.105 3.396 8.204.002 6.388-5.197 11.58-11.58 11.58v-.051zm6.353-8.667c-.347-.174-2.057-1.016-2.375-1.134-.318-.114-.55-.172-.782.174-.233.348-.9 1.133-1.102 1.365-.203.232-.405.26-.753.087-.348-.175-1.468-.542-2.796-1.724-.103-.092-.2-.19-.3-.292-1.036-1.036-1.554-1.874-1.785-2.222-.232-.348-.025-.536.148-.71.157-.156.348-.405.522-.607.174-.204.232-.347.348-.58.115-.23.058-.433-.03-.607-.086-.174-.78-1.88-.1-2.607.608-.65 1.258-.59 1.62-.592.348-.002.775-.002 1.096-.002.502.046 1.05.228 1.5.836.577.784 1.54 3.23.636 4.39-.21.268-.48.455-.71.696-.197.206-.408.435-.183.82.226.386 1.006 1.66 2.164 2.696 1.5 1.34 2.822 1.764 3.208 1.954.385.19.61.162.842-.1.23-.263.985-1.144 1.246-1.536.26-.39.522-.32.835-.2.55.207 2.053.97 2.404 1.144.348.174.58.26.666.406.088.145.088.84-.26 1.652z" fill="#fff" fill-rule="evenodd" clip-rule="evenodd"/></svg>
    </a>
</body>`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Footer year: 2024 -> 2025
    content = content.replace(/© 2024/g, '© 2025');
    content = content.replace(/&copy; 2024/g, '&copy; 2025');

    // 2. Míndtec -> Mindtec in footers mostly, but we can do globally if safe. Let's do Soluciones Míndtec -> Soluciones Mindtec
    content = content.replace(/Míndtec/g, 'Mindtec');
    content = content.replace(/MÍNDTEC/g, 'MINDTEC');

    // 3. Link "Insights" in nav. We look for the "Nuestra Firma" link.
    // If it doesn't already have Insights:
    if (!content.includes('href="blog.html"')) {
        content = content.replace(/(<a href="firma\.html"[^>]*>Nuestra Firma<\/a>)/g, '$1\n                <a href="blog.html">Insights</a>');
    }

    // 4. WhatsApp button
    if (!content.includes('class="float-wa"')) {
        content = content.replace(/<\/body>/, waHtml);
    }

    fs.writeFileSync(file, content);
    console.log('Processed:', file);
});
