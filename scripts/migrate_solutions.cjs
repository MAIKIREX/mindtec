const fs = require('fs');
const path = require('path');

const pages = [
  'estudio-de-mercado-bolivia',
  'auditoria-retail-bolivia',
  'neuromarketing-bolivia',
  'percepcion-de-marca-bolivia'
];

pages.forEach(page => {
  const htmlPath = path.join(__dirname, '..', 'legacy', `${page}.html`);
  const astroPath = path.join(__dirname, '..', 'src', 'pages', `${page}.astro`);

  if (!fs.existsSync(htmlPath)) {
    console.error(`Legacy HTML file not found: ${htmlPath}`);
    return;
  }

  if (!fs.existsSync(astroPath)) {
    console.error(`Astro file not found: ${astroPath}`);
    return;
  }

  // Read legacy HTML
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Find start and end of main content
  const headerIndex = htmlContent.indexOf('</header>');
  if (headerIndex === -1) {
    console.error(`Could not find </header> in ${htmlPath}`);
    return;
  }
  const contentStart = headerIndex + '</header>'.length;

  const footerIndex = htmlContent.indexOf('<footer class="site-footer');
  if (footerIndex === -1) {
    console.error(`Could not find <footer class="site-footer in ${htmlPath}`);
    return;
  }
  const contentEnd = footerIndex;

  let mainContent = htmlContent.substring(contentStart, contentEnd).trim();

  // Read Astro stub
  const astroContent = fs.readFileSync(astroPath, 'utf8');

  // Extract layout header part of the Astro stub (everything up to and including the opening <Layout ... > tag)
  const layoutMatch = astroContent.match(/([\s\S]*?<Layout[\s\S]*?>)/);
  if (!layoutMatch) {
    console.error(`Could not find opening <Layout> tag in ${astroPath}`);
    return;
  }
  const layoutHeader = layoutMatch[1];

  // Reassemble astro file content
  const newAstroContent = `${layoutHeader}
  <main>
    ${mainContent}
  </main>
</Layout>
`;

  fs.writeFileSync(astroPath, newAstroContent, 'utf8');
  console.log(`Successfully migrated content for: ${page}`);
});
