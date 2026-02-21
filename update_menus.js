const fs = require('fs');

const files = [
    'index.html',
    'servicios.html',
    'metodologia.html',
    'firma.html',
    'contacto.html',
    'estudio-de-mercado-bolivia.html',
    'estudio-de-precios-bolivia.html',
    'percepcion-de-marca-bolivia.html',
    'auditoria-retail-bolivia.html',
    'neuromarketing-bolivia.html'
];

const newFooterLinks = `
            <div class="footer-col links">
                <h4>Empresa</h4>
                <ul>
                    <li><a href="servicios.html">Servicios</a></li>
                    <li><a href="metodologia.html">Metodología</a></li>
                    <li><a href="firma.html">Nuestra Firma</a></li>
                </ul>
            </div>
            <div class="footer-col links">
                <h4>Soluciones Míndtec</h4>
                <ul>
                    <li><a href="estudio-de-mercado-bolivia.html">Estudio de Mercado y Viabilidad</a></li>
                    <li><a href="estudio-de-precios-bolivia.html">Estudio de Precios B2B</a></li>
                    <li><a href="percepcion-de-marca-bolivia.html">Percepción de Marca</a></li>
                    <li><a href="auditoria-retail-bolivia.html">Auditoría Retail</a></li>
                    <li><a href="neuromarketing-bolivia.html">Neuromarketing y Psicología</a></li>
                </ul>
            </div>
`;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Add dropdown CSS right before </head>
        if (!content.includes('.dropdown { position: relative;')) {
            content = content.replace('</head>', `    <style>
        .dropdown { position: relative; display: inline-block; padding: 10px 15px; }
        .dropdown a { text-decoration: none; color: inherit; font-size: 1rem; font-weight: 600; }
        .dropdown-content { display: none; position: absolute; background-color: #ffffff; min-width: 250px; box-shadow: 0px 15px 30px 0px rgba(0,0,0,0.1); z-index: 100; border-radius: 8px; padding: 0.5rem 0; top: 100%; left: 0; }
        .dropdown-content a { color: #333; padding: 12px 20px; text-decoration: none; display: block; font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid #f0f0f0; }
        .dropdown-content a:last-child { border-bottom: none; }
        .dropdown-content a:hover { background-color: #f8fafc; color: var(--primary-color); padding-left: 25px; transition: all 0.2s ease; }
        .dropdown:hover .dropdown-content { display: block; }
    </style>
</head>`);
        }
        
        const navRegex = /<nav class="main-nav">[\s\S]*?<\/nav>/;
        
        const isServicesActive = content.match(/<a href="servicios\.html".*?class="active".*?>/) ? ' class="active"' : '';
        const isMethodologyActive = content.match(/<a href="metodologia\.html".*?class="active".*?>/) ? ' class="active"' : '';
        const isFirmaActive = content.match(/<a href="firma\.html".*?class="active".*?>/) ? ' class="active"' : '';
        const isContactoActiveMatch = content.match(/<a href="contacto\.html" class="([^"]*active[^"]*)">/);
        const isContactoActive = isContactoActiveMatch ? ' class="active btn btn-primary small"' : ' class="btn btn-primary small"';
        
        const newNav = `<nav class="main-nav">
                <a href="servicios.html"${isServicesActive}>Servicios</a>
                <div class="dropdown">
                    <a href="javascript:void(0)" style="cursor:pointer;" class="dropdown-toggle">Soluciones ▾</a>
                    <div class="dropdown-content">
                        <a href="estudio-de-mercado-bolivia.html">Estudio de Mercado y Viabilidad</a>
                        <a href="estudio-de-precios-bolivia.html">Estudio de Precios B2B</a>
                        <a href="percepcion-de-marca-bolivia.html">Percepción de Marca</a>
                        <a href="auditoria-retail-bolivia.html">Auditoría Retail en Bolivia</a>
                        <a href="neuromarketing-bolivia.html">Neuromarketing B2B</a>
                    </div>
                </div>
                <a href="metodologia.html"${isMethodologyActive}>Metodología</a>
                <a href="firma.html"${isFirmaActive}>Nuestra Firma</a>
                <a href="contacto.html"${isContactoActive}>Contacto</a>
            </nav>`;
            
        content = content.replace(navRegex, newNav);
        
        // Footer Regex to match existing footer "Empresa" lists
        const footerLinksRegex = /<div class="footer-col links">\s*<h4>Empresa<\/h4>\s*<ul>\s*<li><a[^>]*>Servicios<\/a><\/li>\s*<li><a[^>]*>Metodología<\/a><\/li>\s*<li><a[^>]*>(?:Nuestra Firma|Sectores)<\/a><\/li>\s*<\/ul>\s*<\/div>/;
        
        content = content.replace(footerLinksRegex, newFooterLinks);
        
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    } catch (e) {
        console.error('Failed processing ' + file + ': ' + e.message);
    }
});
