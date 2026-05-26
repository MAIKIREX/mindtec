const fs = require('fs');

let content = fs.readFileSync('metodologia.html', 'utf8');

// CAMBIO 3.1 - Hero: Reducir H1
content = content.replace(
    /<h1 class="hero-title"[\s\S]*?>[\s\S]*?Modelo Híbrido con Neuromarketing, IA y\s*Validación en Campo\s*<\/h1>\s*<p class="hero-subtitle"[\s\S]*?>[\s\S]*?<\/p>/i,
    `<h1 class="hero-title" style="font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem;">
                        Modelo Híbrido: Neurociencia + IA + Validación en Campo
                    </h1>
                    <p class="hero-subtitle" style="font-size: 1.25rem; margin-bottom: 2.5rem; max-width: 800px;">
                        Nuestra metodología de investigación de mercados en Bolivia integra 4 capas de análisis simultáneo para eliminar los puntos ciegos que los métodos tradicionales no pueden resolver.
                    </p>`
);

// CAMBIO 3.2 - Comparativa Visual en 2 columnas
const methodComparisonHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3.5rem;">
                        <!-- Tradicional -->
                        <div style="background-color: #fff5f5; border-left: 4px solid #fc8181; padding: 2rem; border-radius: 8px;">
                            <h3 style="color: #c53030; font-size: 1.3rem; margin-bottom: 1.5rem;">Método Tradicional</h3>
                            <ul class="service-list-minimal" style="font-size: 1.05rem; padding-left: 1.2rem;">
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#fc8181; position:absolute; left:-1.2rem;">✖</span> Encuesta declarativa aislada</li>
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#fc8181; position:absolute; left:-1.2rem;">✖</span> Focus groups genéricos</li>
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#fc8181; position:absolute; left:-1.2rem;">✖</span> Reportes descriptivos de 80+ páginas</li>
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#fc8181; position:absolute; left:-1.2rem;">✖</span> Datos sin validación territorial</li>
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#fc8181; position:absolute; left:-1.2rem;">✖</span> Solo mide lo que la gente dice</li>
                            </ul>
                        </div>
                        
                        <!-- Mindtec -->
                        <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 2rem; border-radius: 8px; box-shadow: 0 10px 25px rgba(72, 187, 120, 0.1);">
                            <h3 style="color: #276749; font-size: 1.3rem; margin-bottom: 1.5rem;">Modelo Mindtec</h3>
                            <ul class="service-list-minimal" style="font-size: 1.05rem; padding-left: 1.2rem;">
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#48bb78; position:absolute; left:-1.2rem;">✓</span> 4 capas simultáneas de análisis</li>
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#48bb78; position:absolute; left:-1.2rem;">✓</span> Investigación profunda + neuromarketing</li>
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#48bb78; position:absolute; left:-1.2rem;">✓</span> Executive brief + dashboard interactivo</li>
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative;"><span style="color:#48bb78; position:absolute; left:-1.2rem;">✓</span> Red nacional de validación en campo</li>
                                <li style="padding: 0.5rem 0; border:none; list-style-type: none; position:relative; font-weight:700;"><span style="color:#48bb78; position:absolute; left:-1.2rem;">✓</span> Mide lo que la gente hace, piensa y siente</li>
                            </ul>
                        </div>
                    </div>
`;

content = content.replace(
    /<p class="text-gray-dark leading-relaxed"[\s\S]*?Muchas consultoras aplican:\s*<\/p>\s*<ul class="service-list-minimal"[\s\S]*?<\/ul>/i,
    methodComparisonHTML
);

// We should also remove "El problema" block completely as it becomes visually redundant or just adapt it below as an accent. 
// "Las decisiones millonarias no pueden basarse solo en lo que la gente dice. El comportamiento real y el subconsciente determinan resultados."
// Actually, this text serves as a strong conclusion to the comparison! So I will leave the "El problema:" text exactly where it is below the new grid. It will look like a synthesis.

fs.writeFileSync('metodologia.html', content);
console.log("Metodologia successfully updated!");
