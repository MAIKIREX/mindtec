const fs = require('fs');

const getCard = (url, title, desc) => `
                    <a href="${url}" style="display: block; background: #fff; padding: 2rem; border-radius: 8px; border: 1px solid #e2e8f0; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.borderColor='var(--color-primary)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)';" onmouseout="this.style.borderColor='#e2e8f0';this.style.transform='none';this.style.boxShadow='none';">
                        <h4 style="font-size: 1.1rem; color: var(--color-secondary); margin-bottom: 0.5rem; line-height: 1.3;">${title}</h4>
                        <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 1.5rem; line-height: 1.5;">${desc}</p>
                        <span style="font-weight: 700; color: var(--color-primary); font-size: 0.9rem; text-transform: uppercase;">Explorar →</span>
                    </a>`;

const getWrapper = (cardsHTML) => `
        <!-- 🟦 CROSS-LINKING ESTRATÉGICO -->
        <section class="elementor-section premium-section-padding bg-slate" style="padding: 5rem 0; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
            <div class="container elementor-container" style="max-width: 900px;">
                <h3 class="text-navy" style="font-size: 1.8rem; margin-bottom: 2rem; text-align: center;">Otras áreas de inteligencia relacionadas</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${cardsHTML}
                </div>
            </div>
        </section>
`;

const linkData = {
    'estudio-de-mercado-bolivia.html': [
        getCard('estudio-de-precios-bolivia.html', 'Estudio de Precios', 'Defina la política de pricing óptima basándose en el valor y demanda.'),
        getCard('percepcion-de-marca-bolivia.html', 'Percepción de Marca', 'Incorpore el análisis de reputación y posicionamiento actual.'),
        getCard('auditoria-retail-bolivia.html', 'Auditoría Retail', 'Mida viabilidad del modelo analizando el piso de venta real.')
    ],
    'estudio-de-precios-bolivia.html': [
        getCard('estudio-de-mercado-bolivia.html', 'Estudio de Mercado', 'Investigue la viabilidad integral de su sector y competidores.'),
        getCard('auditoria-retail-bolivia.html', 'Auditoría Retail', 'Monitoree el precio en anaquel frente a competencia táctica.'),
        getCard('neuromarketing-bolivia.html', 'Neuromarketing', 'Mida experimentalmente el dolor de pago de forma biométrica.')
    ],
    'percepcion-de-marca-bolivia.html': [
        getCard('neuromarketing-bolivia.html', 'Neuromarketing', 'Valide elementos visuales de marca a través de la neurociencia.'),
        getCard('estudio-de-mercado-bolivia.html', 'Estudio de Mercado', 'Evalúe integralmente su audiencia para re-alinear atributos.')
    ],
    'auditoria-retail-bolivia.html': [
        getCard('estudio-de-precios-bolivia.html', 'Estudio de Precios', 'Analice estratégicamente cómo rentabilizar el pricing detectado.'),
        getCard('estudio-de-mercado-bolivia.html', 'Estudio de Mercado', 'Amplíe su visión del canal combinándolo con analítica sectorial.')
    ],
    'neuromarketing-bolivia.html': [
        getCard('percepcion-de-marca-bolivia.html', 'Percepción de Marca', 'Entienda el estado de pertenencia y afecto de sus clientes.'),
        getCard('auditoria-retail-bolivia.html', 'Auditoría Retail', 'Traduzca hallazgos biométricos a planogramas aplicados al PDV.')
    ]
};

// 1. Solution Pages Cross Linking
for (const [file, cards] of Object.entries(linkData)) {
    if (fs.existsSync(file)) {
        let text = fs.readFileSync(file, 'utf8');
        // Find CTA Final to inject right before
        text = text.replace(/(<!-- 🟦 CTA FINAL -->|<section class="cta-section-modern[^>]*>)/, getWrapper(cards.join('')) + '\n        $1');
        fs.writeFileSync(file, text);
    }
}

console.log('Solution internal links added.');

// 2. Minor adjustments
// servicios.html -> add metodologia
if (fs.existsSync('servicios.html')) {
    let html = fs.readFileSync('servicios.html', 'utf8');
    if (!html.includes('href="metodologia.html"')) {
        // Enforce methodology cross-link in secondary area
        html = html.replace(/<\/main>/, `
        <section class="elementor-section bg-slate" style="padding: 4rem 0; text-align: center; border-top: 1px solid #eee;">
            <div class="container" style="max-width: 600px;">
                <h3 class="text-navy" style="margin-bottom: 1rem;">¿Cómo logramos estos resultados?</h3>
                <p style="color: #64748b; margin-bottom: 1.5rem;">Conozca nuestra arquitectura científica donde los datos de campo se combinan con biometría.</p>
                <a href="metodologia.html" class="btn btn-outline" style="padding: 10px 20px;">Explorar nuestra metodología</a>
            </div>
        </section>\n    </main>`);
        fs.writeFileSync('servicios.html', html);
    }
}

// metodologia.html -> add estudio-de-mercado, contacto
if (fs.existsSync('metodologia.html')) {
    let html = fs.readFileSync('metodologia.html', 'utf8');
    if (!html.includes('href="estudio-de-mercado-bolivia.html"')) {
        html = html.replace(/<\/main>/, `
        <section class="elementor-section bg-slate" style="padding: 4rem 0; text-align: center; border-top: 1px solid #eee;">
            <div class="container" style="max-width: 600px;">
                <h3 class="text-navy" style="margin-bottom: 1rem;">Aplíquelo en su Estudio de Mercado</h3>
                <p style="color: #64748b; margin-bottom: 1.5rem;">Vea cómo este modelo robustece nuestro principal diagnóstico B2B reduciendo márgenes de error.</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <a href="estudio-de-mercado-bolivia.html" class="btn btn-navy-outline" style="padding: 10px 20px;">Ver solución integral</a>
                    <a href="contacto.html" class="btn btn-primary" style="padding: 10px 20px;">Solicitar sesión de evaluación</a>
                </div>
            </div>
        </section>\n    </main>`);
        fs.writeFileSync('metodologia.html', html);
    }
}

// firma.html -> add metodologia, servicios
if (fs.existsSync('firma.html')) {
    let html = fs.readFileSync('firma.html', 'utf8');
    html = html.replace(/<\/main>/, `
        <section class="elementor-section bg-slate" style="padding: 4rem 0; text-align: center; border-top: 1px solid #eee;">
            <div class="container">
                <h3 class="text-navy" style="margin-bottom: 1.5rem;">Nuestros pilares comerciales</h3>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <a href="metodologia.html" class="btn btn-navy-outline" style="padding: 10px 20px;">Ver rigor metodológico</a>
                    <a href="servicios.html" class="btn btn-outline" style="padding: 10px 20px;">Explorar soluciones por directorio</a>
                </div>
            </div>
        </section>\n    </main>`);
    fs.writeFileSync('firma.html', html);
}

// contacto.html -> add servicios
if (fs.existsSync('contacto.html')) {
    let html = fs.readFileSync('contacto.html', 'utf8');
    html = html.replace(/<\/main>/, `
        <section class="elementor-section bg-white" style="padding: 3rem 0; text-align: center; border-top: 1px dashed #ccc;">
            <div class="container">
                <p style="color: #64748b; margin-bottom: 1rem;">¿Aún no está seguro de qué evaluar puntualmente?</p>
                <a href="servicios.html" style="color: var(--color-primary); font-weight: 600; text-decoration: none;">Revise nuestras soluciones a detalle antes de agendar →</a>
            </div>
        </section>\n    </main>`);
    fs.writeFileSync('contacto.html', html);
}

console.log('General internal links added.');

// blog.html -> ya tiene el navbar que enlaza y footer. Enlace cruzado extra a servicios.
if (fs.existsSync('blog.html')) {
    let html = fs.readFileSync('blog.html', 'utf8');
    html = html.replace(/<\/main>/, `
        <section class="elementor-section bg-white" style="padding: 3rem 0; text-align: center;">
            <div class="container">
                <p style="color: #64748b; margin-bottom: 1rem;">La investigación profunda sustenta cada área de negocio.</p>
                <a href="servicios.html" style="color: var(--color-primary); font-weight: 600; text-decoration: none;">Conozca nuestras áreas de consultoría →</a>
            </div>
        </section>\n    </main>`);
    fs.writeFileSync('blog.html', html);
}

console.log('Cross-links fully implemented!');
