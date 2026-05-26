const fs = require('fs');

let content = fs.readFileSync('metodologia.html', 'utf8');

// CAMBIO 3.3 - Quitar emojis y estilizar números en las capas

const cap1 = `<div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid #eee; padding-bottom: 1rem;">
                            <span style="font-size: 2.2rem; font-weight: 900; color: var(--color-primary); line-height: 1;">01</span>
                            <h3 class="text-primary" style="font-size: 1.3rem; margin: 0;">Capa Cuantitativa — Rigor Estadístico</h3>
                        </div>`;
content = content.replace(
    /<h3 class="text-primary"[\s\S]*?>\s*🔹 1️⃣ Capa Cuantitativa \(Rigor Estadístico\)\s*<\/h3>/i,
    cap1
);

const cap2 = `<div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid #eee; padding-bottom: 1rem;">
                            <span style="font-size: 2.2rem; font-weight: 900; color: var(--color-primary); line-height: 1;">02</span>
                            <h3 class="text-primary" style="font-size: 1.3rem; margin: 0;">Capa Cualitativa Profunda</h3>
                        </div>`;
content = content.replace(
    /<h3 class="text-primary"[\s\S]*?>\s*🔹 2️⃣ Capa Cualitativa Profunda\s*<\/h3>/i,
    cap2
);

const cap3 = `<div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid #eee; padding-bottom: 1rem;">
                            <span style="font-size: 2.2rem; font-weight: 900; color: var(--color-primary); line-height: 1;">03</span>
                            <h3 class="text-primary" style="font-size: 1.3rem; margin: 0;">Capa Inconsciente — Neuromarketing</h3>
                        </div>`;
content = content.replace(
    /<h3 class="text-primary"[\s\S]*?>\s*🔹 3️⃣ Capa Inconsciente – Neuromarketing\s*<\/h3>/i,
    cap3
);

const cap4 = `<div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid #eee; padding-bottom: 1rem;">
                            <span style="font-size: 2.2rem; font-weight: 900; color: var(--color-primary); line-height: 1;">04</span>
                            <h3 class="text-primary" style="font-size: 1.3rem; margin: 0;">Capa Cultural — Psicoantropología</h3>
                        </div>`;
content = content.replace(
    /<h3 class="text-primary"[\s\S]*?>\s*🔹 4️⃣ Capa Cultural – Psicoantropología de Mercado\s*<\/h3>/i,
    cap4
);


// CAMBIO 3.4 - Quitar emojis de horizontes y añadir CTA
content = content.replace(/>🔹 Horizonte 7 Días<\/h4>/g, ">Horizonte 7 Días</h4>");
content = content.replace(/>🔹 Horizonte 30 Días<\/h4>/g, ">Horizonte 30 Días</h4>");
content = content.replace(/>🔹 Horizonte 60–90 Días<\/h4>/g, ">Horizonte 60–90 Días</h4>");

const horizonteCTA = `                </div>
                
                <div style="text-align: center; margin-top: 4rem;">
                    <p style="font-size: 1.15rem; color: #4a5b6f; font-weight: 600; margin-bottom: 1.5rem;">
                        ¿No está seguro qué horizonte necesita? Nuestro equipo le ayuda a definirlo en la sesión inicial.
                    </p>
                    <a href="contacto.html" class="btn btn-primary" style="background-color: var(--color-secondary); color: white; padding: 12px 28px;">Solicitar evaluación de horizonte →</a>
                </div>
            </div>
        </section>`;

// Replace end of section 6
content = content.replace(
    /<\/div>\s*<\/div>\s*<\/section>\s*<\!-- 🟦 7️⃣ ARQUITECTURA DE DECISIÓN -->/i,
    `\n${horizonteCTA}\n\n        <!-- 🟦 7️⃣ ARQUITECTURA DE DECISIÓN -->`
);

fs.writeFileSync('metodologia.html', content);
console.log("Metodologia successfully updated step 2!");
