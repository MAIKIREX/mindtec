const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Neuromarketing
content = content.replace(
    /Reduce el margen de error en\s+decisiones creativas y estratégicas\./g,
    "Explorar Neuromarketing →"
);

// 2. IA
content = content.replace(
    /<div class="cap-footer">Permite decisiones más rápidas y basadas en evidencia\.<\/div>/g,
    '<div class="cap-footer"><a href="#" style="color: inherit; text-decoration: underline; font-weight: 700;">Ver capacidades de IA →</a></div>'
);

// 3. Equipo
content = content.replace(
    /<li>Análisis estructurado de experiencia de cliente<\/li>\s*<\/ul>\s*<\/div>\s*<!-- Item 4 -->/g,
    `<li>Análisis estructurado de experiencia de cliente</li>
                            </ul>
                            <div class="cap-footer"><a href="firma.html" style="color: inherit; text-decoration: underline; font-weight: 700;">Conocer al equipo →</a></div>
                        </div>
                        <!-- Item 4 -->`
);

// 4. Big Data
content = content.replace(
    /<li>Seguimiento estructurado<\/li>\s*<\/ul>\s*<\/div>\s*<!-- Item 5 -->/g,
    `<li>Seguimiento estructurado</li>
                            </ul>
                            <div class="cap-footer"><a href="metodologia.html" style="color: inherit; text-decoration: underline; font-weight: 700;">Ver metodología →</a></div>
                        </div>
                        <!-- Item 5 -->`
);

// 5. Retail
content = content.replace(
    /Garantiza precisión y rigor\s*analítico sobre la dinámica de mercado\./g,
    "Explorar Auditoría Retail →"
);

// Añadimos font-weight: 700 a los que no lo tenían (Neuro y Retail)
content = content.replace(
    /<a href="neuromarketing-bolivia\.html"\s*style="color: inherit; text-decoration: underline;">Explorar Neuromarketing →<\/a>/g,
    '<a href="neuromarketing-bolivia.html" style="color: inherit; text-decoration: underline; font-weight: 700;">Explorar Neuromarketing →</a>'
);
content = content.replace(
    /<a href="auditoria-retail-bolivia\.html"\s*style="color: inherit; text-decoration: underline;">Explorar Auditoría Retail →<\/a>/g,
    '<a href="auditoria-retail-bolivia.html" style="color: inherit; text-decoration: underline; font-weight: 700;">Explorar Auditoría Retail →</a>'
);

fs.writeFileSync('index.html', content);
console.log("CTAs updated successfully.");
