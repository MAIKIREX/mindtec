const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="cta-content-v2">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<\/main>/;

const replacement = `<div class="cta-content-v2">
                    <h2>Las empresas que lideran su mercado no adivinan. Deciden con inteligencia.</h2>
                    <p class="cta-subtitle">Agende una sesión inicial de 20 minutos con nuestro equipo senior. Confidencial, sin compromiso, directo al punto.</p>
                    <div class="cta-actions">
                        <a href="contacto.html" class="btn btn-primary lg">Agendar diagnóstico inicial →</a>
                    </div>
                </div>
            </div>
        </section>
    </main>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('index.html', content);
    console.log("Final CTA successfully updated in index.html");
} else {
    console.log("Could not find the final CTA matching regex!");
}
