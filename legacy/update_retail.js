const fs = require('fs');

let html = fs.readFileSync('auditoria-retail-bolivia.html', 'utf8');

const s1_s2_s3_s4 = `
        <!-- 🟦 SECCIÓN 1: Variables Auditadas -->
        <section class="elementor-section premium-section-padding bg-slate" style="padding: 5rem 0; background: #f8fafc;">
            <div class="container elementor-container">
                <div class="section-title-center" style="margin-bottom: 4rem;">
                    <h2 class="text-navy" style="font-size: 2.5rem; color: var(--color-secondary);">¿Qué variables auditamos en el punto de venta?</h2>
                </div>
                <div class="premium-grid-6" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Share of Shelf (Anaquel)</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Medición de su participación linear real frente al porcentaje negociado con el canal.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Estado de Material POP</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Verificación de instalación, deterioro físico o remoción de sus exhibidores y bandejas.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Cumplimiento de Precios</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Control sobre etiquetas y banda de precios sugerida para evitar erosión de margen comercial.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Quiebres de Stock</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Detección temprana de out-of-stocks que están desviando ventas directas al competidor.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Exhibición y Facings</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Auditoría estructurada de planogramas: posición de bloque, nivel de ojos vs. inferior.</p>
                    </div>
                    <div class="premium-card-white" style="padding: 2rem;">
                        <h3 class="text-primary" style="font-size: 1.2rem; margin-bottom: 1rem;">Evidencia Georeferenciada</h3>
                        <p class="text-gray-dark" style="font-size: 1rem; margin: 0; color: #475569;">Validación con fotografías y coordenadas GPS (elimina el sesgo de auto-reporte del equipo).</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 🟦 SECCIÓN 2: Cobertura Red -->
        <section class="elementor-section premium-section-padding bg-navy text-white" style="padding: 6rem 0;">
            <div class="container elementor-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
                <div>
                    <h2 class="text-white" style="font-size: 2.2rem; margin-bottom: 1.5rem;">Cobertura de nuestra red de campo</h2>
                    <p style="font-size: 1.1rem; color: rgba(255,255,255,0.85); line-height: 1.7; margin-bottom: 2rem;">Operamos con más de <strong>80 auditores activos</strong> desplegados en La Paz, El Alto, Santa Cruz, Cochabamba y ciudades intermedias de Bolivia.</p>
                    <p style="font-size: 1.1rem; color: rgba(255,255,255,0.85); line-height: 1.7; margin-bottom: 2.5rem;">Cada levantamiento incluye validación fotográfica y trazabilidad geográfica inyectada a reportes dashboard para acelerar las decisiones correctivas del directorio comercial.</p>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <span class="method-tag" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);">Canal Moderno (Supermercados)</span>
                        <span class="method-tag" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);">Canal Tradicional (Mercados)</span>
                    </div>
                </div>
                <div style="text-align: center; position: relative; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 3rem;">
                    <!-- SVG Network Map -->
                    <svg viewBox="0 0 400 300" width="100%" height="auto" style="max-width: 350px; display: block; margin: 0 auto;">
                        <circle cx="200" cy="150" r="120" fill="none" stroke="rgba(255, 102, 0, 0.2)" stroke-width="2" stroke-dasharray="10 5" />
                        <circle cx="200" cy="150" r="80" fill="none" stroke="rgba(255, 102, 0, 0.4)" stroke-width="1" />
                        
                        <!-- SCZ -->
                        <line x1="200" y1="150" x2="260" y2="120" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />
                        <circle cx="260" cy="120" r="10" fill="#FF6600" />
                        <circle cx="260" cy="120" r="25" fill="rgba(255, 102, 0, 0.3)" class="pulse-node" />
                        <text x="260" y="100" text-anchor="middle" fill="#fff" font-family="Inter" font-size="12" font-weight="bold">Santa Cruz</text>

                        <!-- LPZ -->
                        <line x1="200" y1="150" x2="110" y2="90" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />
                        <circle cx="110" cy="90" r="8" fill="#FF6600" />
                        <text x="110" y="75" text-anchor="middle" fill="#fff" font-family="Inter" font-size="12" font-weight="bold">La Paz / El Alto</text>

                        <!-- CBB -->
                        <line x1="200" y1="150" x2="130" y2="210" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2" />
                        <circle cx="130" cy="210" r="8" fill="#FF6600" />
                        <text x="130" y="235" text-anchor="middle" fill="#fff" font-family="Inter" font-size="12" font-weight="bold">Cochabamba</text>

                        <!-- Otros nodos -->
                        <line x1="200" y1="150" x2="290" y2="220" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" />
                        <circle cx="290" cy="220" r="5" fill="#fff" />
                        <line x1="200" y1="150" x2="100" y2="180" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" />
                        <circle cx="100" cy="180" r="4" fill="#fff" />
                        
                        <style>
                            @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
                            .pulse-node { transform-origin: center; animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
                        </style>
                    </svg>
                </div>
            </div>
        </section>

        <!-- 🟦 SECCIÓN 3: Cuándo necesita -->
        <section class="elementor-section premium-section-padding bg-white" style="padding: 5rem 0;">
            <div class="container elementor-container">
                <div class="section-title-center" style="margin-bottom: 3rem;">
                    <h2 class="text-navy" style="font-size: 2.2rem; color: var(--color-secondary);">Cuándo necesita una auditoría de canal</h2>
                </div>
                <div class="premium-grid-5" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem; background:#f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">📉</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.05rem; color: var(--color-secondary); line-height: 1.5;">Su equipo comercial reporta buena ejecución in-situ, pero los volúmenes de venta no cuadran.</h4>
                    </div>
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem; background:#f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">⚖️</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.05rem; color: var(--color-secondary); line-height: 1.5;">Necesita validar con precisión si los distribuidores y cadenas cumplen los acuerdos pactados.</h4>
                    </div>
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem; background:#f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">🛒</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.05rem; color: var(--color-secondary); line-height: 1.5;">Quiere comprender exactamente cuán agresiva se ve su marca cruzada contra la competencia en anaquel.</h4>
                    </div>
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem; background:#f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">🎯</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.05rem; color: var(--color-secondary); line-height: 1.5;">Está planificando o midiendo el ROI inmediato de una fuerte inversión en promotores o Trade Marketing.</h4>
                    </div>
                    <div class="dark-glass-card" style="text-align: center; padding: 2rem 1.5rem; background:#f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <span style="font-size: 2rem; display:block; margin-bottom: 1rem;">🌎</span>
                        <h4 style="margin: 0; font-weight: 600; font-size: 1.05rem; color: var(--color-secondary); line-height: 1.5;">Comenzará a expandir masivamente los canales de distribución de su producto a nuevas ciudades.</h4>
                    </div>
                </div>
            </div>
        </section>

        <!-- 🟦 SECCIÓN 4: Tabla Comparativa -->
        <section class="elementor-section premium-section-padding bg-slate" style="padding: 5rem 0; background: #fff;">
            <div class="container elementor-container">
                <div class="section-title-center" style="max-width: 800px; margin: 0 auto 3rem auto;">
                    <h2 class="text-navy" style="font-size: 2.2rem; color: var(--color-secondary);">Por qué separar la auditoría del equipo de ventas</h2>
                </div>
                
                <table class="comparison-table" style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); text-align: left;">
                    <thead>
                        <tr>
                            <th style="padding: 1.5rem; text-align: left; background-color: var(--color-secondary); color: white; font-weight: 600; font-size: 1.1rem; border-bottom: 1px solid #eee; width: 50%;">Auditoría interna tradicional</th>
                            <th style="padding: 1.5rem; text-align: left; background-color: var(--color-secondary); color: white; font-weight: 600; font-size: 1.1rem; border-bottom: 1px solid #eee; width: 50%;">Auditoría Retail Mindtec</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #64748b; font-weight: 500;">Reportada por su propio equipo de campo</td>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #0f172a; font-weight: 700; background-color: rgba(255,102,0,0.03);">Evaluación objetiva y blindada a conflictos de interés</td>
                        </tr>
                        <tr>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #64748b; font-weight: 500;">Subjetiva, depende del criterio del mercaderista</td>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #0f172a; font-weight: 700; background-color: rgba(255,102,0,0.03);">Evidencia fotográfica georreferenciada con métricas</td>
                        </tr>
                        <tr>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #64748b; font-weight: 500;">Reporte manual en hojas de cálculo tardías</td>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: 1px solid #eee; color: #0f172a; font-weight: 700; background-color: rgba(255,102,0,0.03);">Dashboard interactivo de cumplimiento táctico</td>
                        </tr>
                        <tr>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: none; color: #64748b; font-weight: 500;">Visión aislada, solo mide su marca</td>
                            <td style="padding: 1.5rem; text-align: left; border-bottom: none; color: #0f172a; font-weight: 700; background-color: rgba(255,102,0,0.03);">Comparación frontal de exhibición vs. competidores directos</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        
        <!-- FAQ Section -->`;

// Replace FAQ Section start with new sections + FAQ Section start
html = html.replace(/<!-- FAQ Section -->/, s1_s2_s3_s4);

const faqsHTML = `
                <div class="faq-list">
                    <div class="faq-item" style="background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #eee;">
                        <h4 style="color: var(--color-secondary); margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">¿Por qué no debería encargar la auditoría a mi mismo equipo comercial?</h4>
                        <p style="color: #475569; margin: 0; font-size: 1rem; line-height: 1.6;">Existe un conflicto de interés natural. El vendedor que acomodó el producto es el mismo que reporta que "todo está excelente" para asegurar su comisión. Mindtec le aporta una vista agnóstica para encontrar las verdaderas limitantes de venta.</p>
                    </div>
                    <div class="faq-item" style="background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #eee;">
                        <h4 style="color: var(--color-secondary); margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">¿Tienen la capacidad operativa para auditar a nivel nacional en Bolivia?</h4>
                        <p style="color: #475569; margin: 0; font-size: 1rem; line-height: 1.6;">Sí. Nuestra red mantiene más de 80 auditores distribuidos desde el eje central metropolitano (Retail) hasta circuitos de distribución de canal tradicional en ciudades intermedias o mercados de abasto populares.</p>
                    </div>
                    <div class="faq-item" style="background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #eee;">
                        <h4 style="color: var(--color-secondary); margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">¿Cómo garantizan que la información del punto de venta es fidedigna?</h4>
                        <p style="color: #475569; margin: 0; font-size: 1rem; line-height: 1.6;">Nadie audita con reportes manuales. Entregamos reportes vivos; las aplicaciones de auditoría registran la coordenada GPS satelital, y exigimos respaldo fotográfico que sube inmediatamente permitiendo la evaluación ocular de los gerentes.</p>
                    </div>
                    <div class="faq-item" style="background: #fff; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); border: 1px solid #eee;">
                        <h4 style="color: var(--color-secondary); margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">¿Qué sucede si detectan precios adulterados al consumidor final?</h4>
                        <p style="color: #475569; margin: 0; font-size: 1rem; line-height: 1.6;">Nuestro modelo emite banderas rojas. Esto le permite convocar a las cadenas o distribuidores para alinear de inmediato los acuerdos que están restando competitividad o destrozando la percepción de su ecosistema de precios.</p>
                    </div>
                </div>`;

// Replace old faqs list with new faqs
html = html.replace(/<div class="faq-list">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, faqsHTML + '\n            </div>\n        </section>');

fs.writeFileSync('auditoria-retail-bolivia.html', html);
console.log("Task 8.1 completed successfully!");
