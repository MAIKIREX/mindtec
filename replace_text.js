const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const regex = /<p>En los negocios, lo que no se mide, asume riesgos invisibles\. Se necesita precisión extrema, no\s*intuición\.<\/p>\s*<p style="margin-top: 0\.5rem; font-size: 1\.1rem; color: var\(--text-color\);">En este escenario\s*hipercompetitivo, una investigación de mercados en Bolivia bien estructurada deja de ser un\s*gasto y se convierte en el antídoto más poderoso contra la incertidumbre\.<\/p>/;

const replacement = `<p>Cada uno de estos escenarios es una oportunidad de crecimiento — si se aborda con la evidencia correcta.</p>
                    <p style="margin-top: 0.5rem; font-size: 1.1rem; color: var(--text-color);">La diferencia entre las empresas que crecen y las que se estancan no es el tamaño del presupuesto, sino la calidad de la inteligencia detrás de cada decisión.</p>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('index.html', content);
    console.log("Successfully replaced the message.");
} else {
    console.log("Failed to match the regex. Current snippet around class modern-quote:");
    const match = content.match(/<div class="problem-statement modern-quote">([\s\S]*?)<\/div>/);
    if(match) console.log(match[1]);
}
