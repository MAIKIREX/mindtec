const fs = require('fs');

let content = fs.readFileSync('servicios.html', 'utf8');

const pilar1Insert = `</ul>
                            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.05);">
                                <p style="font-size: 0.9rem; color: #777; font-weight: 500; margin: 0;">Horizonte típico de ejecución: 3–8 semanas | Formato: Proyecto puntual o retainer</p>
                            </div>
                        </div>
                    </div>`;

const pilar2Insert = `</ul>
                            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);">
                                <p style="font-size: 0.9rem; color: rgba(255,255,255,0.85); font-weight: 500; margin: 0;">Horizonte típico de ejecución: 4–6 semanas | Formato: Proyecto puntual o retainer</p>
                            </div>
                        </div>
                    </div>`; 

const pilar3Insert = `</ul>
                            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.05);">
                                <p style="font-size: 0.9rem; color: #777; font-weight: 500; margin: 0;">Horizonte típico de ejecución: 2–6 semanas | Formato: Proyecto puntual o retainer</p>
                            </div>
                        </div>
                    </div>`;

content = content.replace(
    /<li>Dashboard de seguimiento \(cuando aplica\)<\/li>\s*<\/ul>\s*<\/div>\s*<\/div>\s*<\!-- Pilar 2 -->/,
    `<li>Dashboard de seguimiento (cuando aplica)</li>\n                            ${pilar1Insert}\n                    <!-- Pilar 2 -->`
);

content = content.replace(
    /<li>Dashboard de seguimiento \(cuando aplica\)<\/li>\s*<\/ul>\s*<\/div>\s*<\/div>\s*<\!-- Pilar 3 -->/,
    `<li>Dashboard de seguimiento (cuando aplica)</li>\n                            ${pilar2Insert}\n                    <!-- Pilar 3 -->`
);

content = content.replace(
    /<li>Dashboard de seguimiento \(cuando aplica\)<\/li>\s*<\/ul>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `<li>Dashboard de seguimiento (cuando aplica)</li>\n                            ${pilar3Insert}\n                </div>\n            </div>\n        </section>`
);


const regexCTA = /<h2>Proteja el capital y ahorre tiempo directivo\. Decida con escenarios controlados\.<\/h2>\s*<p class="cta-subtitle">Si requiere fundamentar su próxima gran acción corporativa ante un\s*directorio, contáctenos\.<\/p>\s*<div class="cta-actions">\s*<a href="contacto\.html" class="btn btn-primary lg">Agendar sesión ejecutiva confidencial<\/a>/;

const rCTA = `<h2>Convierta su próxima decisión estratégica en una ventaja competitiva medible.</h2>
                    <p class="cta-subtitle">Hable con un estratega senior de Mindtec. 20 minutos, confidencial, sin compromiso.</p>
                    <div class="cta-actions">
                        <a href="contacto.html" class="btn btn-primary lg">Agendar diagnóstico →</a>`;

if (regexCTA.test(content)) {
    content = content.replace(regexCTA, rCTA);
    fs.writeFileSync('servicios.html', content);
    console.log("Pilares and CTA successfully updated!");
} else {
    // maybe it failed the exact match due to formatting, lets do fallback
    content = content.replace(/<h2>Proteja el capital y ahorre tiempo directivo\. Decida con escenarios controlados\.<\/h2>/, 
        `<h2>Convierta su próxima decisión estratégica en una ventaja competitiva medible.</h2>`);
    content = content.replace(/<p class="cta-subtitle">Si requiere fundamentar su próxima gran acción corporativa ante un\s*directorio, contáctenos\.<\/p>/,
        `<p class="cta-subtitle">Hable con un estratega senior de Mindtec. 20 minutos, confidencial, sin compromiso.</p>`);
    content = content.replace(/<a href="contacto\.html" class="btn btn-primary lg">Agendar sesión ejecutiva confidencial<\/a>/,
        `<a href="contacto.html" class="btn btn-primary lg">Agendar diagnóstico →</a>`);
        
    fs.writeFileSync('servicios.html', content);
    console.log("Pilares and CTA updated via fallback");
}
