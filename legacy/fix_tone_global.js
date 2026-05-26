const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Mute fear lines to protection+opportunity:
    content = content.replace(/fin de la ansiedad decisional/g, "mayor claridad y precisión decisional");
    content = content.replace(/El mercado castiga la\s*improvisación/g, "El mercado recompensa la estrategia basada en evidencia");
    content = content.replace(/Evita inversiones inviables/g, "Prioriza inversiones de alto rendimiento");
    content = content.replace(/múltiples proyectos fracasan no por falta de producto, sino por falta de validación/g, "el éxito de los grandes proyectos depende tanto del producto como de una validación estructurada");
    content = content.replace(/evitando así inversiones publicitarias a ciegas/g, "optimizando el retorno de cada inversión publicitaria");
    content = content.replace(/Reduce probabilidad de fracaso/g, "Minimiza riesgos y potencia oportunidades");
    content = content.replace(/Reducimos la ansiedad corporativa/g, "Desarrollamos ventajas competitivas");
    content = content.replace(/Saldremos de las suposiciones y pisaremos el terreno/g, "Dejaremos las suposiciones de lado para validar oportunidades reales en el terreno");

    fs.writeFileSync(file, content);
    console.log('Updated tone in:', file);
});
