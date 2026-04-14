const fs = require('fs');

let precios = fs.readFileSync('estudio-de-precios-bolivia.html', 'utf8');

// TASK 6.1: Update the Curve SVG
// Change gradient
precios = precios.replace(
    /<stop offset="0%" stop-color="#3b82f6" \/>/,
    '<stop offset="0%" stop-color="#ef4444" />'
);
// Add labels for Desconfianza and Rechazo
precios = precios.replace(
    /<!-- Etiquetas Ejes -->/,
    `<!-- Etiquetas Zonas -->
                        <text x="100" y="55" text-anchor="middle" font-family="Inter" font-size="12" fill="#ef4444" font-weight="700">Desconfianza</text>
                        <text x="300" y="55" text-anchor="middle" font-family="Inter" font-size="12" fill="#ef4444" font-weight="700">Rechazo</text>
                        <!-- Etiquetas Ejes -->`
);
// Update text description below SVG
precios = precios.replace(
    /<strong style="color: #3b82f6;">A la izquierda:<\/strong>/,
    '<strong style="color: #ef4444;">A la izquierda:</strong>'
);

// TASK 6.2: Add anchor nav
const navBar = `
        <!-- MINI NAVEGACIÓN ANCLAS -->
        <div style="background: rgba(11, 43, 64, 0.02); border-bottom: 1px solid #e2e8f0; padding: 1.5rem 0; position: sticky; top: 90px; z-index: 999; backdrop-filter: blur(10px);">
            <div class="container elementor-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; align-items: center; font-size: 0.95rem; font-weight: 600; color: #475569;">
                <span style="color: var(--color-primary); margin-right: 0.5rem; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">En esta página:</span>
                <a href="#problema" style="color: #0f172a; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: all 0.3s;">Problema</a>
                <span style="color: #cbd5e1;">→</span>
                <a href="#framework" style="color: #0f172a; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: all 0.3s;">Framework</a>
                <span style="color: #cbd5e1;">→</span>
                <a href="#neuro-pricing" style="color: #0f172a; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: all 0.3s;">Neuro-Pricing</a>
                <span style="color: #cbd5e1;">→</span>
                <a href="#comparativa" style="color: #0f172a; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: all 0.3s;">Comparativa</a>
                <span style="color: #cbd5e1;">→</span>
                <a href="#entregables" style="color: #0f172a; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: all 0.3s;">Entregables</a>
                <span style="color: #cbd5e1;">→</span>
                <a href="#faqs" style="color: #0f172a; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: all 0.3s;">FAQs</a>
            </div>
            <style>
                .mini-nav-links a:hover { background: #f8fafc !important; color: var(--color-primary) !important; }
            </style>
        </div>`;

// Insert after hero section
precios = precios.replace(
    /<\/section>\s*<!-- 🟦 1️⃣ EL ERROR MÁS COSTOSO -->/,
    `</section>\n${navBar}\n        <!-- 🟦 1️⃣ EL ERROR MÁS COSTOSO -->`
);

// Add class for styling to a tag
precios = precios.replace(/<div class="container elementor-container"/g, (match, offset, str) => {
    // Only target the one inside the anchor if we can, but simpler:
    return match; // We already used inline styles + a child style block, so no need here.
});

// Fix style tag addition in navBar
precios = precios.replace(`transition: all 0.3s;">`, `transition: all 0.3s;" class="anchor-nav-link">`); // Just do replace globally inside the navbar block
precios = precios.replace(/<a href="#/g, '<a class="anchor-nav-link" href="#');
precios = precios.replace(/<style>[\s\S]*?<\/style>/, `<style>.anchor-nav-link:hover { background: #f8fafc !important; color: var(--color-primary) !important; }</style>`);

// Add IDs to sections
precios = precios.replace(/<!-- 🟦 1️⃣ EL ERROR MÁS COSTOSO -->\s*<section class="/, '<!-- 🟦 1️⃣ EL ERROR MÁS COSTOSO -->\n        <section id="problema" class="');
precios = precios.replace(/<!-- 🟦 2️⃣ MODELO 4D DE VALIDACIÓN DE PRECIO MINDTEC® -->\s*<section class="/, '<!-- 🟦 2️⃣ MODELO 4D DE VALIDACIÓN DE PRECIO MINDTEC® -->\n        <section id="framework" class="');
precios = precios.replace(/<!-- 🟦 3️⃣ GRÁFICA CONCEPTUAL – DOLOR DE PAGO -->\s*<section class="/, '<!-- 🟦 3️⃣ GRÁFICA CONCEPTUAL – DOLOR DE PAGO -->\n        <section id="neuro-pricing" class="');
precios = precios.replace(/<!-- 🟦 4️⃣ TABLA COMPARATIVA -->\s*<section class="/, '<!-- 🟦 4️⃣ TABLA COMPARATIVA -->\n        <section id="comparativa" class="');
precios = precios.replace(/<!-- 🟦 5️⃣ DASHBOARD EJECUTIVO DINÁMICO -->\s*<section class="/, '<!-- 🟦 5️⃣ DASHBOARD EJECUTIVO DINÁMICO -->\n        <section id="entregables" class="');
precios = precios.replace(/<!-- 🟦 8️⃣ FAQ \(SEO\) -->\s*<section class="/, '<!-- 🟦 8️⃣ FAQ (SEO) -->\n        <section id="faqs" class="');

fs.writeFileSync('estudio-de-precios-bolivia.html', precios);
console.log("Tasks 6.1 and 6.2 completed successfully!");
