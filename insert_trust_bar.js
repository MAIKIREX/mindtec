const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const trustBar = `</section>

        <!-- Trust Bar Section -->
        <section class="trust-bar-section" style="background-color: #f5f5f5; padding: 40px 0;">
            <div class="container elementor-container text-center">
                <h4 style="color: #88929c; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2rem; font-weight: 700;">Empresas e instituciones que han confiado en nuestra inteligencia de mercados</h4>
                <div class="trust-numbers-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; align-items: start;">
                    <div class="trust-item" style="padding: 1rem;">
                        <span style="display: block; font-size: 2.8rem; font-weight: 900; color: var(--color-primary); line-height: 1;">10+</span>
                        <span style="display: block; font-size: 0.95rem; color: #4A5B6F; font-weight: 600; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Años de exp.</span>
                    </div>
                    <div class="trust-item" style="padding: 1rem;">
                        <span style="display: block; font-size: 2.8rem; font-weight: 900; color: var(--color-primary); line-height: 1;">80+</span>
                        <span style="display: block; font-size: 0.95rem; color: #4A5B6F; font-weight: 600; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Encuestadores</span>
                    </div>
                    <div class="trust-item" style="padding: 1rem;">
                        <span style="display: block; font-size: 2.8rem; font-weight: 900; color: var(--color-primary); line-height: 1;">1er</span>
                        <span style="display: block; font-size: 0.95rem; color: #4A5B6F; font-weight: 600; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Lab. Neuromarketing</span>
                    </div>
                    <div class="trust-item" style="padding: 1rem;">
                        <span style="display: block; font-size: 2.8rem; font-weight: 900; color: var(--color-primary); line-height: 1;">4</span>
                        <span style="display: block; font-size: 0.95rem; color: #4A5B6F; font-weight: 600; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Bases operativas</span>
                    </div>
                </div>
            </div>
        </section>
        <style>
            @media (max-width: 768px) {
                .trust-numbers-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
                .trust-item span:first-child { font-size: 2.2rem !important; }
            }
        </style>

        <!-- Section 1: The Problem -->
        <section class="problem-section`;

const modifiedMatch = /<\/section>\s*<\!-- Section 1: The Problem -->\s*<section class="problem-section/;
if (modifiedMatch.test(content)) {
    content = content.replace(modifiedMatch, trustBar);
    fs.writeFileSync('index.html', content);
    console.log("Trust bar inserted!");
} else {
    console.log("Could not find insertion boundary in index.html");
}

