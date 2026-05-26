const fs = require('fs');

let html = fs.readFileSync('neuromarketing-bolivia.html', 'utf8');

// A) Eliminar emojis
html = html.replace('📦 Packaging y diseño de etiqueta', 'Packaging y diseño de etiqueta');
html = html.replace('📢 Campañas y piezas maestras', 'Campañas y piezas maestras');
html = html.replace('🏪 Punto de venta (retail)', 'Punto de venta (retail)');
html = html.replace('📱 UX/UI y apps', 'UX/UI y apps');
html = html.replace('🎯 Branding y rebranding', 'Branding y rebranding');

// B) Agregar fila a tabla comparativa
const tableRow = `<tr>
                            <td>Resultados en semanas</td>
                            <td>Hallazgos accionables desde 7 días</td>
                        </tr>
                    </tbody>`;
html = html.replace('</tbody>', tableRow);

// C) Agregar sección antes de FAQs
const c_section = `<!-- 🟦 NUEVA SECCIÓN: CLIENTES IDEALES -->
        <section class="elementor-section premium-section-padding bg-slate" style="padding: 5rem 0; background: #f8fafc;">
            <div class="container elementor-container" style="max-width: 900px;">
                <h2 class="text-navy text-center" style="font-size: 2.5rem; margin-bottom: 3rem;">Clientes que más se benefician del neuromarketing</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                    <div style="background: #fff; padding: 2rem; border-left: 4px solid var(--color-primary); box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-radius: 4px;">
                        <span style="display: block; color: var(--color-primary); font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">01.</span>
                        <h4 style="color: var(--color-secondary); font-size: 1.1rem; margin-bottom: 0;">Gerencias de Marketing que aprueban campañas de alto presupuesto</h4>
                    </div>
                    <div style="background: #fff; padding: 2rem; border-left: 4px solid var(--color-primary); box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-radius: 4px;">
                        <span style="display: block; color: var(--color-primary); font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">02.</span>
                        <h4 style="color: var(--color-secondary); font-size: 1.1rem; margin-bottom: 0;">Equipos de diseño que lanzan packaging sin validación previa</h4>
                    </div>
                    <div style="background: #fff; padding: 2rem; border-left: 4px solid var(--color-primary); box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-radius: 4px;">
                        <span style="display: block; color: var(--color-primary); font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">03.</span>
                        <h4 style="color: var(--color-secondary); font-size: 1.1rem; margin-bottom: 0;">Directores de producto que necesitan defender decisiones ante comité</h4>
                    </div>
                    <div style="background: #fff; padding: 2rem; border-left: 4px solid var(--color-primary); box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-radius: 4px;">
                        <span style="display: block; color: var(--color-primary); font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">04.</span>
                        <h4 style="color: var(--color-secondary); font-size: 1.1rem; margin-bottom: 0;">Empresas en proceso de rebranding que no quieren arriesgar su identidad</h4>
                    </div>
                </div>
            </div>
        </section>

        <!-- 🟦 9️⃣ FAQ -->`;

html = html.replace('<!-- 🟦 9️⃣ FAQ -->', c_section);

fs.writeFileSync('neuromarketing-bolivia.html', html);
console.log('Task 9.1 applied!');
