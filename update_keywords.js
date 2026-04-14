const fs = require('fs');

const keywordMap = {
    'index.html': "investigación de mercados en Bolivia, estudio de mercado Bolivia, empresa de investigación de mercados, empresa de investigación de mercados con IA en Bolivia, consultora, inteligencia de mercados, análisis competitivo, neuromarketing Bolivia",
    'servicios.html': "servicios de investigación de mercados Bolivia, servicios estudio de mercado B2B Bolivia, servicios de investigación de mercados para empresas en Bolivia, pricing, auditoría, branding, análisis",
    'metodologia.html': "metodología investigación de mercados, modelo híbrido neuromarketing IA, metodología de investigación de mercados con neuromarketing y validación en campo, cuantitativa, cualitativa, multicapa, psicoantropología",
    'firma.html': "consultora investigación de mercados Bolivia, empresa de neuromarketing Bolivia, primera consultora boliviana de inteligencia de mercados con neurociencia, equipo, experiencia, principios, confidencialidad",
    'estudio-de-mercado-bolivia.html': "estudio de mercado en Bolivia, estudio de viabilidad Bolivia, dimensionamiento de mercado, estudio de mercado para empresas en Bolivia para evaluar viabilidad, TAM, SAM, SOM, demanda, competencia, riesgo de inversión",
    'estudio-de-precios-bolivia.html': "estudio de precios en Bolivia, análisis de precios Bolivia, pricing strategy Bolivia, estudio de precios con neuro-pricing para empresas en Bolivia, Van Westendorp, elasticidad, margen, rentabilidad, sensibilidad",
    'percepcion-de-marca-bolivia.html': "estudio de percepción de marca Bolivia, auditoría de marca Bolivia, reputación corporativa Bolivia, estudio de percepción de marca para empresas en Bolivia, posicionamiento, rebranding, atributos de marca, NPS",
    'auditoria-retail-bolivia.html': "auditoría retail Bolivia, auditoría punto de venta Bolivia, trade intelligence Bolivia, auditoría de ejecución en punto de venta en Bolivia, share of shelf, POP, quiebres de stock, góndola, mystery shopper",
    'neuromarketing-bolivia.html': "neuromarketing en Bolivia, estudio de neuromarketing Bolivia, eye tracking Bolivia, estudios de neuromarketing para validar campañas y packaging en Bolivia, EEG, facial coding, atención visual, respuesta emocional, biometría",
    'contacto.html': "contacto investigación de mercados Bolivia, agendar estudio de mercado Bolivia, contactar consultora de investigación de mercados en Bolivia",
    'blog.html': "blog investigación de mercados Bolivia, insights consumidor boliviano"
};

for (const [file, keywords] of Object.entries(keywordMap)) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Check if meta keywords exists
        if (content.includes('<meta name="keywords"')) {
            // Replace existing
            content = content.replace(
                /<meta\s+name="keywords"\s+content="[^"]*">/is,
                `<meta name="keywords" content="${keywords}">`
            );
        } else {
            // Create right after meta description (which is known to exist)
            content = content.replace(
                /(<meta name="description"[^>]*>)/is,
                `$1\n    <meta name="keywords" content="${keywords}">`
            );
        }

        fs.writeFileSync(file, content);
    }
}
console.log('Metadatos de keywords (SEO-9) aplicados a todas las páginas.');
