const fs = require('fs');

const metaUpdates = {
    'index.html': "Investigación de mercados en Bolivia con neurociencia e IA. Insights accionables para directorios y gerencias. Mindtec Neuromarketing & Consulting.",
    'servicios.html': "Servicios de investigación de mercados B2B en Bolivia: estudios de mercado, pricing, percepción de marca y auditoría retail. Mindtec.",
    'metodologia.html': "Metodología híbrida de investigación: neuromarketing + IA + validación en campo. Modelo multicapa exclusivo de Mindtec Bolivia.",
    'firma.html': "Conozca a Mindtec: primera firma boliviana en integrar neurociencia e IA en investigación de mercados. Equipo, principios y experiencia.",
    'estudio-de-mercado-bolivia.html': "Estudio de mercado en Bolivia para evaluar viabilidad y reducir riesgo de inversión. Dimensionamiento, demanda real y análisis competitivo.",
    'estudio-de-precios-bolivia.html': "Estudio de precios en Bolivia con neuro-pricing y análisis competitivo. Optimice margen y proteja rentabilidad. Mindtec.",
    'percepcion-de-marca-bolivia.html': "Estudio de percepción de marca en Bolivia. Auditoría de reputación, mapa perceptual y diagnóstico pre-rebranding con neuromarketing.",
    'auditoria-retail-bolivia.html': "Auditoría retail en Bolivia: share of shelf, precios, POP y ejecución en punto de venta. Red nacional de 80+ auditores. Mindtec.",
    'neuromarketing-bolivia.html': "Neuromarketing en Bolivia: eye tracking, EEG y facial coding para validar campañas, packaging y UX antes de invertir. Mindtec.",
    'contacto.html': "Agende un diagnóstico inicial gratuito de investigación de mercados en Bolivia. 20 minutos, confidencial, sin compromiso. Mindtec.",
    'blog.html': "Insights de investigación de mercados en Bolivia: tendencias, metodología, neuromarketing y análisis del consumidor boliviano."
};

for (const [filename, newMeta] of Object.entries(metaUpdates)) {
    try {
        let html = fs.readFileSync(filename, 'utf8');

        // Regex para cazar y reemplazar meta description estándar
        html = html.replace(/<meta name="description"\s+content="[^"]*">/g, `<meta name="description"\n        content="${newMeta}">`);
        html = html.replace(/<meta name="description" content="[^"]*">/g, `<meta name="description" content="${newMeta}">`);
        
        // Regex para OpenGraph
        html = html.replace(/<meta property="og:description" content="[^"]*">/g, `<meta property="og:description" content="${newMeta}">`);

        // Regex para Twitter
        html = html.replace(/<meta name="twitter:description" content="[^"]*">/g, `<meta name="twitter:description" content="${newMeta}">`);

        fs.writeFileSync(filename, html);
        console.log(`Updated meta tags in ${filename}`);
    } catch (err) {
        console.log(`Error updating ${filename}: ${err.message}`);
    }
}
