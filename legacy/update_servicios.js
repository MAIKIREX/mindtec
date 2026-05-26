const fs = require('fs');
let content = fs.readFileSync('servicios.html', 'utf8');

// 1. Hero subtitle
content = content.replace(
    /Decisiones sustentadas en evidencia\. Reduzca la exposición financiera y[\s\S]*?estructurado\./,
    "No entregamos reportes de datos. Entregamos decisiones defendibles ante su directorio — respaldadas por neurociencia, inteligencia artificial y validación territorial."
);

// 2. Timeline section HTML
const processHTML = `
        <!-- Proceso de Trabajo (Timeline) -->
        <section class="process-section elementor-section" style="padding: 5rem 0; background-color: var(--color-accent); border-top: 1px solid #eaeaea;">
            <div class="container elementor-container">
                <div class="section-header text-center" style="margin-bottom: 4rem;">
                    <h2>Del desafío a la decisión en 4 pasos</h2>
                </div>
                
                <div class="timeline-container">
                    <!-- Conector de linea -->
                    <div class="timeline-line"></div>
                    
                    <div class="timeline-grid">
                        <!-- Paso 1 -->
                        <div class="timeline-step">
                            <div class="step-circle">
                                <span class="step-number">1</span>
                                <div class="step-icon">🎯</div>
                            </div>
                            <h4>Diagnóstico</h4>
                            <p>Sesión inicial de 20 min para entender su escenario y urgencia.</p>
                        </div>
                        
                        <!-- Paso 2 -->
                        <div class="timeline-step">
                            <div class="step-circle">
                                <span class="step-number">2</span>
                                <div class="step-icon">📐</div>
                            </div>
                            <h4>Diseño</h4>
                            <p>Arquitectura metodológica a medida (cuanti + cuali + neuro según necesidad).</p>
                        </div>
                        
                        <!-- Paso 3 -->
                        <div class="timeline-step">
                            <div class="step-circle">
                                <span class="step-number">3</span>
                                <div class="step-icon">🧪</div>
                            </div>
                            <h4>Investigación</h4>
                            <p>Ejecución en campo, laboratorio y análisis con IA. Plazo: 7-60 días.</p>
                        </div>
                        
                        <!-- Paso 4 -->
                        <div class="timeline-step">
                            <div class="step-circle">
                                <span class="step-number">4</span>
                                <div class="step-icon">💡</div>
                            </div>
                            <h4>Activación</h4>
                            <p>Executive brief + dashboard + workshop de recomendaciones priorizadas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <style>
            .timeline-container { position: relative; max-width: 1000px; margin: 0 auto; z-index: 1;}
            .timeline-line { position: absolute; top: 40px; left: 10%; right: 10%; height: 3px; background: rgba(255,102,0,0.2); z-index: -1; }
            .timeline-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5rem; position: relative;}
            .timeline-step { text-align: center; }
            .step-circle { width: 85px; height: 85px; background: #fff; border: 3px solid var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; position: relative; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transition: transform 0.3s; }
            .step-circle:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(255,102,0,0.2); }
            .step-number { position: absolute; top: -5px; right: -5px; width: 30px; height: 30px; background: var(--color-secondary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.95rem; border: 2px solid #fff; }
            .step-icon { font-size: 2rem; }
            .timeline-step h4 { color: var(--color-secondary); margin-bottom: 0.8rem; font-size: 1.15rem; font-weight: 800;}
            .timeline-step p { font-size: 0.95rem; color: #555; line-height: 1.5; font-weight: 500;}
            
            @media (max-width: 768px) {
                .timeline-line { display: none; }
                .timeline-grid { grid-template-columns: 1fr; gap: 3rem; }
                .step-circle { margin-bottom: 1rem; }
                .timeline-step { display: flex; flex-direction: column; align-items: center; padding: 0 1.5rem; }
            }
        </style>
`;

content = content.replace(
    /<\/section>\s*<\!-- Services Loop -->\s*<section class="services-section/i,
    `</section>\n${processHTML}\n        <!-- Services Loop -->\n        <section class="services-section`
);

fs.writeFileSync('servicios.html', content);
console.log("Servicios successfully updated!");
