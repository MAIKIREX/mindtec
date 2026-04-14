const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const newSchema = `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Mindtec Neuromarketing & Consulting",
      "description": "Firma boliviana de investigación de mercados con neurociencia e inteligencia artificial",
      "url": "https://mindtecbolivia.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "La Paz",
        "addressCountry": "BO"
      },
      "areaServed": "Bolivia",
      "serviceType": ["Market Research", "Neuromarketing", "Competitive Intelligence", "Retail Audit"],
      "knowsAbout": ["Investigación de mercados", "Neuromarketing", "Inteligencia artificial", "Auditoría retail"]
    }
    </script>`;

// Reemplazar el primer bloque de json-ld
html = html.replace(/<script type="application\/ld\+json">\s*\{[\s\S]*?"serviceType"[\s\S]*?\}\s*<\/script>/, newSchema);

fs.writeFileSync('index.html', html);
console.log('Task GLOBAL 3 applied!');
