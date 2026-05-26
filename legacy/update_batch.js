const fs = require('fs');

// ----- TASK 4.2: firma.html CTA tone -----
let firma = fs.readFileSync('firma.html', 'utf8');
firma = firma.replace(
    /<h2 style="font-size: 2.8rem; line-height: 1.2; margin-bottom: 1.5rem;">Decisiones respaldadas por evidencia técnica insustituible\.<\/h2>/i,
    '<h2 style="font-size: 2.8rem; line-height: 1.2; margin-bottom: 1.5rem;">Si busca un socio de inteligencia que le ayude a ver lo que otros no ven.</h2>'
);
firma = firma.replace(
    /<p class="cta-subtitle">Programe una sesión inicial para evaluar su desafío junto a nuestro equipo senior\.<\/p>/i,
    '<p class="cta-subtitle">Agende una conversación inicial con nuestro equipo senior. 20 minutos, directo al punto.</p>'
);
firma = firma.replace(
    /Agendar diagnóstico exploratorio →/i,
    'Iniciar conversación →'
);
fs.writeFileSync('firma.html', firma);


// ----- TASK 5.1: estudio-de-mercado-bolivia.html minor tweaks -----
let mercado = fs.readFileSync('estudio-de-mercado-bolivia.html', 'utf8');

// A) Table row
mercado = mercado.replace(
    /<td>Análisis de comportamiento real<\/td>\s*<\/tr>\s*<\/tbody>/i,
    `<td>Análisis de comportamiento real</td>
                        </tr>
                        <tr>
                            <td>Sin seguimiento post-entrega</td>
                            <td>Acompañamiento estratégico post-estudio</td>
                        </tr>
                    </tbody>`
);

// B) 6th Scenario and update class to premium-grid-6
mercado = mercado.replace(
    /<div class="premium-grid-5">/i,
    '<div class="premium-grid-6">'
);
const scenario6 = `<div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem;">
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.1rem;">Respuesta a licitaciones o TDR</h4>
                        <p style="font-size: 0.85rem; margin-top: 0.8rem; color: rgba(255,255,255,0.7); line-height: 1.4;">Cuando necesita fundamentar una propuesta ante instituciones, ONG o cooperación internacional.</p>
                    </div>
                </div>`;
mercado = mercado.replace(
    /<h4 style="margin: 0; font-weight: 600; font-size: 1.1rem;">Reestructuración estratégica \/\s*Cambio de modelo<\/h4>\s*<\/div>\s*<\/div>/i,
    `<h4 style="margin: 0; font-weight: 600; font-size: 1.1rem;">Reestructuración estratégica / Cambio de modelo</h4>
                    </div>
                    ${scenario6}`
);

// C) Add sectors block before FAQ
const sectorsBlock = `
        <!-- 🟦 SECTORES DONDE HEMOS APLICADO (NUEVA SECCIÓN) -->
        <section class="elementor-section premium-section-padding bg-white" style="padding: 5rem 0;">
            <div class="container elementor-container text-center">
                <h2 class="text-navy" style="font-size: 2.2rem; margin-bottom: 3rem;">Sectores donde hemos aplicado estudios de mercado en Bolivia</h2>
                <div class="sectors-wrap" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 2.5rem; margin-top: 2rem;">
                    <div class="sector-tag" style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0;"><span>🏦</span> Banca</div>
                    <div class="sector-tag" style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0;"><span>🛒</span> Consumo masivo</div>
                    <div class="sector-tag" style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0;"><span>🏪</span> Retail</div>
                    <div class="sector-tag" style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0;"><span>🏗️</span> Industrial</div>
                    <div class="sector-tag" style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0;"><span>🏛️</span> Institucional</div>
                    <div class="sector-tag" style="font-size: 1.25rem; font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem; background: #f8fafc; padding: 10px 20px; border-radius: 8px; border: 1px solid #e2e8f0;"><span>🎓</span> Educación</div>
                </div>
            </div>
        </section>

        <!-- 🟦 9️⃣ FAQ -->`;

mercado = mercado.replace(/<\!-- 🟦 9️⃣ FAQ -->/, sectorsBlock);

fs.writeFileSync('estudio-de-mercado-bolivia.html', mercado);
console.log("Tasks 4.2 and 5.1 completed successfully!");
