const fs = require('fs');

let html = fs.readFileSync('contacto.html', 'utf8');

// The new 2-column layout wrapper and trust panel
const twoColumnWrapperStart = `
            <div class="container elementor-container" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 4rem; align-items: start; max-width: 1100px; margin: 0 auto;">
                <!-- COLUMNA IZQUIERDA: Formulario -->
                <div class="form-container" style="margin: 0; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">`;

const twoColumnWrapperEnd = `
                    </form>
                </div>

                <!-- COLUMNA DERECHA: Trust Panel -->
                <div class="trust-panel" style="background: rgba(11, 43, 64, 0.03); padding: 3rem 2.5rem; border-radius: 12px; border-left: 4px solid var(--color-primary);">
                    <h3 style="color: var(--color-secondary); font-size: 1.3rem; margin-bottom: 1.5rem;">Lo que puede esperar:</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 2.5rem; color: #475569; font-size: 1.05rem;">
                        <li style="margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 10px;"><strong style="color: var(--color-primary);">✓</strong> Respuesta en menos de 24 horas hábiles</li>
                        <li style="margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 10px;"><strong style="color: var(--color-primary);">✓</strong> Sesión de 20 minutos, directo al punto</li>
                        <li style="margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 10px;"><strong style="color: var(--color-primary);">✓</strong> Confidencialidad absoluta sobre su escenario</li>
                        <li style="margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 10px;"><strong style="color: var(--color-primary);">✓</strong> Sin compromiso de contratación</li>
                    </ul>

                    <h3 style="color: var(--color-secondary); font-size: 1.1rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Datos de contacto directo:</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 2.5rem; color: #475569;">
                        <li style="margin-bottom: 0.8rem;">📧 <a href="mailto:info@mindtecbolivia.com" style="color: inherit; text-decoration: none; font-weight: 600;">info@mindtecbolivia.com</a></li>
                        <li style="margin-bottom: 0.8rem;">📱 WhatsApp: <a href="https://wa.me/59172599201" target="_blank" style="color: inherit; text-decoration: none; font-weight: 600;">+591 72599201</a></li>
                        <li style="margin-bottom: 0.8rem;">📍 La Paz, Bolivia</li>
                    </ul>

                    <h3 style="color: var(--color-secondary); font-size: 1.1rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Horario de atención:</h3>
                    <p style="color: #475569; margin: 0;">Lunes a viernes: 8:30 – 18:00 (Bolivia)</p>
                </div>
            </div>
            
            <style>
                @media (max-width: 900px) {
                    .container.elementor-container[style*="display: grid"] {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }
            </style>`;

// Add microcopy to form
const formEndReplace = `
                        <button type="submit" class="btn btn-primary btn-submit">Agendar sesión ejecutiva confidencial</button>
                        <p style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: #64748b; line-height: 1.5;">Su información es estrictamente confidencial y solo será utilizada para contactarle respecto a su consulta específica. <strong>No compartimos datos con terceros.</strong></p>`;


// Replacing the DOM wrappers
// 1. Find the wrapper start and replace it
html = html.replace(/<div class="container elementor-container">\s*<div class="form-container">/, twoColumnWrapperStart);

// 2. Add microcopy before the end of the form
html = html.replace(/<button type="submit" class="btn btn-primary btn-submit">Agendar sesión ejecutiva\n\s*confidencial<\/button>[\s\S]*?(?=<\/form>)/, formEndReplace);

// 3. Close wrapper and append trust panel
html = html.replace(/<\/form>\s*<\/div>\s*<\/div>/, twoColumnWrapperEnd);

fs.writeFileSync('contacto.html', html);
console.log('Task 10.1 and 10.2 applied!');
