const fs = require('fs');

// 1. Update index.html CTA
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
    /(<div class="cta-content-v2">\s*)<h2([^>]*)>(.*?)<\/h2>/, 
    '$1<p class="cta-heading" style="font-size: 2.5rem; margin-bottom: 1.5rem; color: #fff; font-weight: 800; line-height: 1.2;">$3</p>'
);
fs.writeFileSync('index.html', indexHtml);
console.log('Fixed H2 CTA in index.html');

// 2. Update metodologia.html title
let metHtml = fs.readFileSync('metodologia.html', 'utf8');
metHtml = metHtml.replace(
    /<title>.*?<\/title>/s,
    '<title>Metodología de Investigación de Mercados en Bolivia: Modelo Híbrido con Neuromarketing, IA y Validación en Campo | Mindtec</title>'
);
fs.writeFileSync('metodologia.html', metHtml);
console.log('Fixed title in metodologia.html');
