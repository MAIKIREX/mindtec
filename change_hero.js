const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const replacement = `<div class="hero-content">
                    <span class="eyebrow fade-in">INTELIGENCIA ESTRATÉGICA DE MERCADOS</span>
                    <h1 class="hero-title">Tome decisiones de negocio con evidencia, no con intuición.</h1>
                    <p class="hero-subtitle">Somos la primera firma boliviana que integra neurociencia, inteligencia artificial y consultoría estratégica para revelar lo que su mercado no le está diciendo — y traducirlo en acción comercial.</p>
                    <div class="hero-buttons">
                        <a href="contacto.html" class="btn btn-primary">Agendar diagnóstico inicial</a>
                        <a href="metodologia.html" class="btn btn-secondary">Conozca nuestra metodología</a>
                    </div>
                </div>`;

const regex = /<div class="hero-content">[\s\S]*?<\/div>\s*<div class="hero-visual">/;

if (regex.test(content)) {
    content = content.replace(regex, replacement + '\n                <div class="hero-visual">');
    fs.writeFileSync('index.html', content);
    console.log('Hero section replaced successfully in index.html');
} else {
    console.log('Could not match hero section regex in index.html');
}
