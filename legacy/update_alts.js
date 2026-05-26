const fs = require('fs');

const files = [
    'index.html',
    'servicios.html',
    'metodologia.html',
    'firma.html',
    'estudio-de-mercado-bolivia.html',
    'estudio-de-precios-bolivia.html',
    'percepcion-de-marca-bolivia.html',
    'auditoria-retail-bolivia.html',
    'neuromarketing-bolivia.html',
    'contacto.html',
    'blog.html'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Actualizar logo en header
        content = content.replace(
            /(<div class="logo">[\s\S]*?<img src="logo-mindtec-oscuro\.webp") alt="[^"]*"/g,
            '$1 alt="Mindtec Neuromarketing y Consulting - Investigación de mercados en Bolivia"'
        );

        // Si no tenía alt tag en el header por alguna razón
        content = content.replace(
            /<div class="logo">\s*<a href="index\.html">\s*<img src="logo-mindtec-oscuro\.webp"(?! alt) /g,
            '<div class="logo">\n                <a href="index.html">\n                    <img src="logo-mindtec-oscuro.webp" alt="Mindtec Neuromarketing y Consulting - Investigación de mercados en Bolivia" '
        );

        // Actualizar logo en footer
        content = content.replace(
            /(<div class="footer-col about">[\s\S]*?<img src="logo-mindtec-oscuro\.webp") alt="[^"]*"/g,
            '$1 alt="Mindtec Bolivia - Consultora de investigación de mercados"'
        );

        // Ajustes para index.html específicos
        if (file === 'index.html') {
            content = content.replace(
                /<img src="service_intelligence_mindtec_v2_1771034207586.png"(.*?)>/g,
                '<img src="service_intelligence_mindtec_v2_1771034207586.png" alt="Servicio de investigación de mercado y estudios de precios en Bolivia - Mindtec"$1>'
            );
            content = content.replace(
                /<img src="service_intelligence_premium_1771034174670.png"(.*?)>/g,
                '<img src="service_intelligence_premium_1771034174670.png" alt="Servicio de branding y posicionamiento de marca en Bolivia - Mindtec"$1>'
            );
            content = content.replace(
                /<img src="service_intelligence_mindtec_1771034090767.png"(.*?)>/g,
                '<img src="service_intelligence_mindtec_1771034090767.png" alt="Servicio de análisis competitivo y auditoría retail en Bolivia - Mindtec"$1>'
            );
        }

        fs.writeFileSync(file, content);
        console.log(`Alt tags actualizados en ${file}`);
    }
}
