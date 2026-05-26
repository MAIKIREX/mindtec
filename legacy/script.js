const fs = require('fs');
const file = 'c:/Users/wilve/OneDrive/Escritorio/PAgina web mindtec anti elementor/index.html';
let src = fs.readFileSync(file, 'utf8');
const search = /Aportamos rigor metodol[\s\S]*?comprometer inversión\.<\/p>/gi;
const replacement = \Aportamos rigor metodológico y seguridad corporativa a directorios y tomadores de decisión. Las decisiones estratégicas en sectores clave del país requieren evidencia estructurada antes de comprometer inversión.</p>

                <div class="sectors-grid" style="display: grid; gap: 1.5rem; text-align: left;">
                    <!-- Card 1 -->
                    <div class="glass-card" style="padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">??</div>
                        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--color-text-dark); flex-grow: 1;">Banca y Servicios Financieros</h4>
                        <p style="font-size: 0.9rem; color: #64748b; line-height: 1.4; margin: 0;">CX, segmentación, percepción de marca</p>
                    </div>
                    <!-- Card 2 -->
                    <div class="glass-card" style="padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">??</div>
                        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--color-text-dark); flex-grow: 1;">Consumo Masivo</h4>
                        <p style="font-size: 0.9rem; color: #64748b; line-height: 1.4; margin: 0;">Pricing, test de producto, auditoría de canal</p>
                    </div>
                    <!-- Card 3 -->
                    <div class="glass-card" style="padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">??</div>
                        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--color-text-dark); flex-grow: 1;">Retail y Comercio</h4>
                        <p style="font-size: 0.9rem; color: #64748b; line-height: 1.4; margin: 0;">Auditoría POS, mystery shopper, trade intelligence</p>
                    </div>
                    <!-- Card 4 -->
                    <div class="glass-card" style="padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">???</div>
                        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--color-text-dark); flex-grow: 1;">Instituciones y ONG</h4>
                        <p style="font-size: 0.9rem; color: #64748b; line-height: 1.4; margin: 0;">Líneas base, evaluaciones de impacto, percepción</p>
                    </div>
                    <!-- Card 5 -->
                    <div class="glass-card" style="padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem;">??</div>
                        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--color-text-dark); flex-grow: 1;">Educación</h4>
                        <p style="font-size: 0.9rem; color: #64748b; line-height: 1.4; margin: 0;">Posicionamiento, demanda, satisfacción</p>
                    </div>
                </div>
            <style>
                .sectors-grid {
                    grid-template-columns: repeat(5, 1fr) !important;
                }
                @media (max-width: 1024px) {
                    .sectors-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (max-width: 768px) {
                    .sectors-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
                }
                @media (max-width: 480px) {
                    .sectors-grid { grid-template-columns: 1fr !important; }
                }
            </style>\;
src = src.replace(search, replacement);
fs.writeFileSync(file, src);
console.log('done');
