const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const missingCss = `
    <style>
        .dropdown {
            position: relative;
            display: inline-block;
            padding: 10px 15px;
        }

        .dropdown a {
            text-decoration: none;
            color: inherit;
            font-size: 1rem;
            font-weight: 600;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #ffffff;
            min-width: 250px;
            box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.1);
            z-index: 100;
            border-radius: 8px;
            padding: 0.5rem 0;
            top: 100%;
            left: 0;
        }

        .dropdown-content a {
            color: #333 !important;
            padding: 12px 20px !important;
            text-decoration: none !important;
            display: block !important;
            font-size: 0.95rem !important;
            font-weight: 500 !important;
            border-bottom: 1px solid #f0f0f0 !important;
        }

        .dropdown-content a:last-child {
            border-bottom: none !important;
        }

        .dropdown-content a:hover {
            background-color: #f8fafc !important;
            color: var(--color-primary) !important;
            padding-left: 25px !important;
            transition: all 0.2s ease !important;
        }

        .dropdown:hover .dropdown-content {
            display: block;
        }
    </style>
`;

if (!html.includes('.dropdown-content {')) {
    html = html.replace('</head>', missingCss + '\n</head>');
    fs.writeFileSync('index.html', html);
    console.log('Restaurados los estilos del dropdown!');
} else {
    console.log('Los estilos del dropdown ya existen.');
}

// También voy a restaurar el script json-ld de la organización (el que borré por el regex)
const orgScript = `    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Mindtec Bolivia",
      "email": "info@mindtecbolivia.com",
      "areaServed": "Bolivia",
      "service": "Investigación de Mercados"
    }
    </script>`;

if (!html.includes('"@type": "Organization"')) {
    html = html.replace('</head>', orgScript + '\n</head>');
    fs.writeFileSync('index.html', html);
    console.log('Restaurado el schema de Organization!');
}
