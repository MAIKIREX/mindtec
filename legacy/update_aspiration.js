const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const regex1 = /En los negocios, lo que no se mide.*? intuición\./i;
const regex2 = /En este escenario hipercompetitivo.*? incertidumbre\./i;

if (regex1.test(content) || regex2.test(content)) {
    content = content.replace(regex1, "Cada uno de estos escenarios es una oportunidad de crecimiento — si se aborda con la evidencia correcta.");
    content = content.replace(regex2, "La diferencia entre las empresas que crecen y las que se estancan no es el tamaño del presupuesto, sino la calidad de la inteligencia detrás de cada decisión.");
    fs.writeFileSync('index.html', content);
    console.log("Aspirational text successfully replaced in index.html");
} else {
    console.log("Could not find the target text.");
}
