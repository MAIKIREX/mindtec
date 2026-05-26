const fs = require('fs');
const path = require('path');

const pages = [
  'estudio-de-mercado-bolivia.astro',
  'auditoria-retail-bolivia.astro',
  'neuromarketing-bolivia.astro',
  'percepcion-de-marca-bolivia.astro'
];

const replacements = [
  { from: /href="estudio-de-precios-bolivia\.html"/g, to: 'href="/estudio-de-precios-bolivia"' },
  { from: /href="estudio-de-mercado-bolivia\.html"/g, to: 'href="/estudio-de-mercado-bolivia"' },
  { from: /href="auditoria-retail-bolivia\.html"/g, to: 'href="/auditoria-retail-bolivia"' },
  { from: /href="neuromarketing-bolivia\.html"/g, to: 'href="/neuromarketing-bolivia"' },
  { from: /href="percepcion-de-marca-bolivia\.html"/g, to: 'href="/percepcion-de-marca-bolivia"' },
  { from: /href="contacto\.html"/g, to: 'href="/contacto"' },
  { from: /href="firma\.html"/g, to: 'href="/firma"' },
  { from: /href="metodologia\.html"/g, to: 'href="/metodologia"' },
  { from: /href="servicios\.html"/g, to: 'href="/servicios"' },
  { from: /href="blog\.html"/g, to: 'href="/blog"' },
  { from: /href="index\.html"/g, to: 'href="/"' }
];

pages.forEach(page => {
  const filePath = path.join(__dirname, '..', 'src', 'pages', page);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned links in: ${page}`);
  } else {
    console.log(`No links needed cleaning in: ${page}`);
  }
});
