const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const pngFiles = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

const DOMAIN = 'https://mindtecbolivia.com';

// 1. Minify CSS
let cssContent = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
cssContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
                       .replace(/\r?\n|\r/g, '')       // remove newlines
                       .replace(/\s{2,}/g, ' ')        // collapse spaces
                       .replace(/\s*([{:;])\s*/g, '$1')// remove spaces around syntax
                       .trim();

// 2. Process images
async function processImages() {
    for (const file of pngFiles) {
        const webpFile = file.replace('.png', '.webp');
        console.log(`Converting ${file} to ${webpFile}...`);
        await sharp(path.join(dir, file))
            .webp({ quality: 80 })
            .toFile(path.join(dir, webpFile));
    }
}

// 3. Process HTMLs
function processHtmls() {
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        let titleMatch = content.match(/<title>(.*?)<\/title>/i);
        let title = titleMatch ? titleMatch[1] : 'Mindtec Bolivia';
        let descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
        let desc = descMatch ? descMatch[1] : '';

        // Clean existing Open Graph / Canonical to avoid duplicates
        content = content.replace(/<link rel="canonical"[^>]*>\n?/g, '');
        content = content.replace(/<meta property="?og:[^>]*>\n?/g, '');
        content = content.replace(/<meta name="?twitter:[^>]*>\n?/g, '');
        content = content.replace(/<meta name="?geo\.[^>]*>\n?/g, '');
        content = content.replace(/<meta http-equiv="content-language"[^>]*>\n?/g, '');
        content = content.replace(/<link rel="alternate" hreflang=[^>]*>\n?/g, '');

        // --- META TAGS ---
        let metaTags = `
    <!-- SEO & Open Graph -->
    <link rel="canonical" href="${DOMAIN}/${file === 'index.html' ? '' : file}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${DOMAIN}/logo-mindtec-oscuro.webp">
    <meta property="og:url" content="${DOMAIN}/${file === 'index.html' ? '' : file}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_BO">
    <meta property="og:site_name" content="Mindtec Neuromarketing & Consulting">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">
    <meta name="twitter:image" content="${DOMAIN}/logo-mindtec-oscuro.webp">
    <meta name="geo.region" content="BO">
    <meta name="geo.placename" content="La Paz">
    <meta http-equiv="content-language" content="es">
    <link rel="alternate" hreflang="es" href="${DOMAIN}/${file === 'index.html' ? '' : file}">
`;

        // Service Schema
        let serviceType = "Consultoría Estratégica";
        if (file.includes('mercado')) serviceType = "Investigación de mercados";
        else if (file.includes('precios')) serviceType = "Estudio de precios";
        else if (file.includes('retail')) serviceType = "Auditoría retail";
        else if (file.includes('percepcion') || file.includes('branding')) serviceType = "Percepción de marca";
        else if (file.includes('neuro')) serviceType = "Neuromarketing";

        if (file !== 'index.html' && file !== 'contacto.html' && file !== 'firma.html') {
            metaTags += `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${title.split('|')[0].trim()}",
      "description": "${desc}",
      "provider": {
        "@type": "Organization",
        "name": "Mindtec Neuromarketing & Consulting",
        "url": "https://mindtecbolivia.com"
      },
      "areaServed": {"@type": "Country", "name": "Bolivia"},
      "serviceType": "${serviceType}"
    }
    </script>
`;
        }

        // FAQs Schema
        const faqRegex = /class="faq-item"[\s\S]*?<h4[^>]*>(.*?)<\/h4>[\s\S]*?<p[^>]*>(.*?)<\/p>/g;
        let faqMatches = [...content.matchAll(faqRegex)];
        if (faqMatches.length > 0) {
            let faqEntities = faqMatches.map(m => {
                return `{
      "@type": "Question",
      "name": "${m[1].trim()}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${m[2].trim().replace(/"/g, '\\"')}"
      }
    }`;
            });
            metaTags += `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        ${faqEntities.join(',\n        ')}
      ]
    }
    </script>
`;
        }
        
        // Organization Schema for index.html
        if (file === 'index.html') {
            metaTags += `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Mindtec Neuromarketing & Consulting",
      "alternateName": "Mindtec Bolivia",
      "description": "Firma boliviana de investigación de mercados con neurociencia e inteligencia artificial para decisiones empresariales estratégicas",
      "url": "https://mindtecbolivia.com",
      "logo": "https://mindtecbolivia.com/logo-mindtec-oscuro.webp",
      "image": "https://mindtecbolivia.com/logo-mindtec-oscuro.webp",
      "telephone": "+591-72599201",
      "email": "info@mindtecbolivia.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "La Paz",
        "addressRegion": "La Paz",
        "addressCountry": "BO"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -16.5,
        "longitude": -68.15
      },
      "areaServed": [
        {"@type": "Country", "name": "Bolivia"},
        {"@type": "City", "name": "La Paz"},
        {"@type": "City", "name": "Santa Cruz"},
        {"@type": "City", "name": "Cochabamba"}
      ],
      "serviceType": [
        "Investigación de mercados",
        "Neuromarketing",
        "Estudio de precios",
        "Auditoría retail",
        "Percepción de marca",
        "Análisis competitivo"
      ],
      "knowsAbout": [
        "Investigación de mercados en Bolivia",
        "Neuromarketing",
        "Inteligencia artificial aplicada a investigación",
        "Psicoantropología de mercados"
      ],
      "priceRange": "$$-$$$"
    }
    </script>
`;
        }

        // --- REPLACE CSS ---
        // remove existing stylesheet link
        content = content.replace(/<link rel="stylesheet" href="style\.css">/i, `<style>${cssContent}</style>`);
        
        // --- ADD META TAGS ---
        content = content.replace('</head>', `${metaTags}\n</head>`);

        // --- REPLACE PNG TO WEBP AND ADD LAZY LOADING ---
        content = content.replace(/\.png/g, '.webp');
        // add lazy loading to imgs that dont have it
        content = content.replace(/<img(.*?)(?<!loading="lazy")>/gi, (match, p1) => {
             if (p1.includes('loading=')) return match;
             return `<img${p1} loading="lazy">`;
        });
        
        // Ensure viewport
        if (!content.includes('<meta name="viewport"')) {
            content = content.replace('<head>', '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
        }

        fs.writeFileSync(path.join(dir, file), content);
        console.log(`Processed ${file}`);
    });
}

processImages().then(() => {
    processHtmls();
    console.log("ALL DONE!");
}).catch(console.error);

