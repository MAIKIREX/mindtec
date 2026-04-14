const fs = require('fs');

let html = fs.readFileSync('percepcion-de-marca-bolivia.html', 'utf8');

const s1_s2_s3 = `
        <!-- 🟦 SECCIÓN 1: ¿Cuándo es crítico? -->
        <section class="elementor-section premium-section-padding bg-navy text-white" style="padding: 5rem 0;">
            <div class="container elementor-container">
                <div class="section-title-center" style="margin-bottom: 3rem;">
                    <h2 class="text-white" style="font-size: 2.5rem;">¿Cuándo es crítico medir la percepción de marca?</h2>
                </div>
                <div class="premium-grid-5" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">🔄</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.1rem; color: #fff;">Antes de un rebranding o cambio de identidad visual</h4>
                    </div>
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">📈</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.1rem; color: #fff;">Costo de adquisición de clientes subiendo sin explicación</h4>
                    </div>
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">⚠️</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.1rem; color: #fff;">Después de una crisis reputacional o PR negativo</h4>
                    </div>
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">🗺️</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.1rem; color: #fff;">Al ingresar a un nuevo mercado geográfico</h4>
                    </div>
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">🤝</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.1rem; color: #fff;">Cuando hay fusión, adquisición o cambio de propiedad</h4>
                    </div>
                </div>
            </div>
        </section>

        <!-- 🟦 SECCIÓN 2: Qué evalúa -->
        <section class="elementor-section premium-section-padding bg-slate" style="padding: 5rem 0; background: #f8fafc;">
            <div class="container elementor-container">
                <div class="section-title-center" style="margin-bottom: 4rem;">
                    <h2 class="text-navy" style="font-size: 2.5rem; color: var(--color-secondary);">Qué evalúa un estudio de percepción de marca Mindtec</h2>
                </div>
                <div class="premium-grid-6" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Awareness espontáneo y asistido</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Medición de recordación de marca directa para conocer el share of mind en el mercado.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Atributos funcionales y emocionales</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Valores estructurales (calidad, tiempo) e intangibles (confianza, estatus) vinculados.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Net Promoter Score (NPS) y lealtad</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Factor de recomendación activa del cliente frente a promesas institucionales o B2B.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Mapa perceptual vs. competidores</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Cuadrantes estratégicos comparando su marca cara a cara contra el líder del rubro.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Análisis de brecha (Identidad vs. Percepción)</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Distancia entre el ADN con el que creyó fundar la empresa y cómo la define el mercado.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Evaluación neuro-visual de piezas</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Medición de logotipo, isotipo e identidad de marca con eye-tracking y biometría.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 🟦 SECCIÓN 3: Tabla Comparativa -->
        <section class="elementor-section premium-section-padding bg-white" style="padding: 5rem 0;">
            <div class="container elementor-container">
                <div class="section-title-center" style="max-width: 800px; margin: 0 auto 3rem auto;">
                    <h2 class="text-navy" style="font-size: 2.2rem; color: var(--color-secondary);">Por qué superar la encuesta tradicional de imagen</h2>
                </div>
                
                <table class="comparison-table" style="width: 100%; border-collapse: collapse; margin-top: 2rem; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);">
                    <thead>
                        <tr>
                            <th style="padding: 1.5rem; text-align: left; background-color: var(--color-secondary); color: white; font-weight: 600; font-size: 1.1rem; border-bottom: 1px solid #eee;">Auditoría de marca tradicional</th>
                            <th style="padding: 1.5rem; text-align: left; background-color: var(--color-secondary); color: white; font-weight: 600; font-size: 1.1rem; border-bottom: 1px solid #eee;">Método Mindtec</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #64748b; font-weight: 500;">Encuesta de imagen</td>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #0f172a; font-weight: 700; background-color: #f8fafc;">Mapa perceptual multicapa + neuromarketing</td>
                        </tr>
                        <tr>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #64748b; font-weight: 500;">Datos declarativos</td>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #0f172a; font-weight: 700; background-color: #f8fafc;">Respuesta emocional real + análisis cultural</td>
                        </tr>
                        <tr>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #64748b; font-weight: 500;">Reporte descriptivo</td>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #0f172a; font-weight: 700; background-color: #f8fafc;">Executive brief + recomendación de acción</td>
                        </tr>
                        <tr>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: none; color: #64748b; font-weight: 500;">Sin seguimiento</td>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: none; color: #0f172a; font-weight: 700; background-color: #f8fafc;">Acompañamiento estratégico post-estudio</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        
        <!-- FAQ Section -->`;

// Replace FAQ Section start with new sections + FAQ Section start
html = html.replace(/<!-- FAQ Section -->/, s1_s2_s3);

const faqsHTML = `
                <div class="faq-list">
                    <div class="faq-item" style="background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #eee;">
                        <h4 style="color: var(--color-secondary); margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">¿Cuánto tarda un estudio de percepción de marca?</h4>
                        <p style="color: #475569; margin: 0; font-size: 1rem; line-height: 1.6;">Normalmente entre 4 a 6 semanas, dependiendo del alcance metodológico y si incluye mediciones biométricas en laboratorio.</p>
                    </div>
                    <div class="faq-item" style="background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #eee;">
                        <h4 style="color: var(--color-secondary); margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">¿Se puede medir por ciudad?</h4>
                        <p style="color: #475569; margin: 0; font-size: 1rem; line-height: 1.6;">Sí, segmentamos de forma inteligente para que el directorio analice si la marca tiene un posicionamiento nacional o solo micro-fidelizaciones regionales.</p>
                    </div>
                    <div class="faq-item" style="background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #eee;">
                        <h4 style="color: var(--color-secondary); margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">¿Incluye análisis competitivo?</h4>
                        <p style="color: #475569; margin: 0; font-size: 1rem; line-height: 1.6;">Sí, la identidad solo puede medirse en contraste. Mapeamos su marca directamente contra sus top competidores para evidenciar brechas o fortalezas.</p>
                    </div>
                    <div class="faq-item" style="background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #eee;">
                        <h4 style="color: var(--color-secondary); margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">¿Sirve para preparar un rebranding?</h4>
                        <p style="color: #475569; margin: 0; font-size: 1rem; line-height: 1.6;">Es el paso más crítico antes de cambiar el logo o la comunicación corporativa. Extraemos qué elementos subconscientes deben preservarse para no destruir el valor histórico, y qué anclas rechaza el consumidor.</p>
                    </div>
                </div>`;

// Replace old faqs list with new faqs
html = html.replace(/<div class="faq-list">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, faqsHTML + '\n            </div>\n        </section>');

fs.writeFileSync('percepcion-de-marca-bolivia.html', html);
console.log("Task 7.1 completed successfully!");
