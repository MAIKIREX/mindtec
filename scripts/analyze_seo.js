import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const DIST_DIR = path.resolve('dist');
const REPORT_PATH = 'C:/Users/Wil/.gemini/antigravity-ide/brain/6a039a53-7ba1-4035-b4fd-315c20859c26/seo_audit_report.md';

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

function analyzeFile(filePath) {
  const relativePath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);

  const errors = [];
  const warnings = [];
  const info = [];

  // 1. Title tag
  const titleTag = $('title');
  const titleText = titleTag.text().trim();
  if (!titleText) {
    errors.push('Missing <title> tag');
  } else {
    const len = titleText.length;
    if (len < 30) {
      warnings.push(`Title is too short (${len} chars). Recommend 50-60 chars. Title: "${titleText}"`);
    } else if (len > 60) {
      warnings.push(`Title is too long (${len} chars). Recommend 50-60 chars. Title: "${titleText}"`);
    } else {
      info.push(`Title is good (${len} chars): "${titleText}"`);
    }
  }

  // 2. Meta description
  const metaDesc = $('meta[name="description"]');
  const descText = metaDesc.attr('content')?.trim() || '';
  if (!descText) {
    errors.push('Missing <meta name="description"> tag');
  } else {
    const len = descText.length;
    if (len < 120) {
      warnings.push(`Meta description is too short (${len} chars). Recommend 120-160 chars.`);
    } else if (len > 160) {
      warnings.push(`Meta description is too long (${len} chars). Recommend 120-160 chars.`);
    } else {
      info.push(`Meta description is good (${len} chars)`);
    }
  }

  // 3. Canonical URL
  const canonical = $('link[rel="canonical"]');
  const canonicalHref = canonical.attr('href')?.trim() || '';
  if (!canonicalHref) {
    errors.push('Missing <link rel="canonical"> tag');
  } else {
    if (!canonicalHref.startsWith('https://www.mindtecbolivia.com')) {
      errors.push(`Canonical URL points to incorrect domain or format: "${canonicalHref}"`);
    } else {
      info.push(`Canonical URL is correct: "${canonicalHref}"`);
    }
  }

  // 4. H1 tag
  const h1s = $('h1');
  if (h1s.length === 0) {
    errors.push('Missing <h1> tag. Every page must have exactly one <h1>');
  } else if (h1s.length > 1) {
    errors.push(`Multiple <h1> tags found (${h1s.length}). Only one <h1> is allowed per page.`);
  } else {
    info.push(`Exactly one <h1> found: "${$(h1s[0]).text().trim()}"`);
  }

  // 5. Headings hierarchy
  const headings = $('h1, h2, h3, h4, h5, h6').map((i, el) => el.tagName.toLowerCase()).get();
  // Simple check if there are headings
  if (headings.length === 0) {
    warnings.push('No headings found (h1-h6).');
  }

  // 6. Image alt tags
  const imgs = $('img');
  let missingAltCount = 0;
  const missingAltImgs = [];
  imgs.each((i, img) => {
    const alt = $(img).attr('alt');
    const src = $(img).attr('src') || $(img).attr('data-src') || '';
    if (alt === undefined || alt === null || alt.trim() === '') {
      missingAltCount++;
      if (missingAltImgs.length < 5) {
        missingAltImgs.push(src);
      }
    }
  });
  if (imgs.length > 0) {
    if (missingAltCount > 0) {
      warnings.push(`${missingAltCount} out of ${imgs.length} images are missing "alt" attribute.`);
    } else {
      info.push(`All ${imgs.length} images have "alt" attributes.`);
    }
  }

  // 7. Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogUrl = $('meta[property="og:url"]').attr('content');

  const ogMissing = [];
  if (!ogTitle) ogMissing.push('og:title');
  if (!ogDesc) ogMissing.push('og:description');
  if (!ogImage) ogMissing.push('og:image');
  if (!ogUrl) ogMissing.push('og:url');

  if (ogMissing.length > 0) {
    warnings.push(`Missing Open Graph tags: ${ogMissing.join(', ')}`);
  } else {
    info.push('Open Graph tags are fully configured.');
  }

  // 8. Twitter Card tags
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  if (!twitterCard) {
    warnings.push('Missing twitter:card meta tag');
  }

  return {
    relativePath,
    errors,
    warnings,
    info,
    missingAltImgs,
    missingAltCount,
    totalImgs: imgs.length
  };
}

function runAudit() {
  console.log('Starting SEO Audit...');
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: "dist" folder not found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = getHtmlFiles(DIST_DIR);
  console.log(`Found ${files.length} HTML files to analyze.`);

  const results = files.map(analyzeFile);

  // Calculate scores and summary
  let totalErrors = 0;
  let totalWarnings = 0;
  results.forEach(r => {
    totalErrors += r.errors.length;
    totalWarnings += r.warnings.length;
  });

  const overallScore = Math.max(0, 100 - (totalErrors * 8) - (totalWarnings * 2));

  // Generate markdown report
  let md = `# SEO Audit Report - www.mindtecbolivia.com\n\n`;
  md += `**Date:** ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
  md += `**Overall SEO Score:** \`${overallScore.toFixed(0)}/100\`\n\n`;

  md += `## Executive Summary\n\n`;
  md += `- **Total Pages Audited:** ${results.length}\n`;
  md += `- **Critical Errors Found:** ${totalErrors} 🚨\n`;
  md += `- **Warnings / Recommendations:** ${totalWarnings} ⚠️\n\n`;

  if (totalErrors > 0) {
    md += `> [!WARNING]\n`;
    md += `> There are **${totalErrors} critical SEO issues** that should be resolved immediately to ensure optimal ranking and indexing.\n\n`;
  } else {
    md += `> [!NOTE]\n`;
    md += `> Excellent! No critical errors found. Just some warnings and optimization opportunities remain.\n\n`;
  }

  md += `## Key Recommendations\n\n`;
  
  // Collect top issues across the site
  const missingTitles = results.filter(r => r.errors.some(e => e.includes('Missing <title>')));
  const missingDescs = results.filter(r => r.errors.some(e => e.includes('Missing <meta name="description">')));
  const missingCanonical = results.filter(r => r.errors.some(e => e.includes('Missing <link rel="canonical">')));
  const badH1s = results.filter(r => r.errors.some(e => e.includes('1>')));
  const missingAlts = results.filter(r => r.missingAltCount > 0);
  const missingOG = results.filter(r => r.warnings.some(w => w.includes('Missing Open Graph')));

  let recNum = 1;
  if (missingTitles.length > 0) {
    md += `${recNum++}. **Add missing page titles:** ${missingTitles.length} pages are missing titles.\n`;
  }
  if (missingDescs.length > 0) {
    md += `${recNum++}. **Add missing meta descriptions:** ${missingDescs.length} pages are missing a meta description. This directly impacts CTR in search engine result pages (SERPs).\n`;
  }
  if (badH1s.length > 0) {
    md += `${recNum++}. **Fix H1 structure:** ${badH1s.length} pages have multiple or zero H1 tags. Ensure exactly one H1 exists per page.\n`;
  }
  if (missingAlts.length > 0) {
    md += `${recNum++}. **Add Image Alt Attributes:** ${missingAlts.length} pages have images without \`alt\` tags. This hurts image search SEO and accessibility.\n`;
  }
  if (missingOG.length > 0) {
    md += `${recNum++}. **Configure Open Graph tags:** ${missingOG.length} pages are missing Facebook/LinkedIn share meta tags.\n`;
  }
  md += `\n---\n\n`;

  md += `## Detailed Results by Page\n\n`;

  results.forEach(r => {
    md += `### 📄 \`/${r.relativePath}\`\n\n`;
    const pageScore = Math.max(0, 100 - (r.errors.length * 15) - (r.warnings.length * 3));
    md += `**Page Score:** \`${pageScore}/100\`\n\n`;

    if (r.errors.length > 0) {
      md += `#### 🚨 Critical Errors (${r.errors.length})\n`;
      r.errors.forEach(e => {
        md += `- ${e}\n`;
      });
      md += `\n`;
    }

    if (r.warnings.length > 0) {
      md += `#### ⚠️ Warnings (${r.warnings.length})\n`;
      r.warnings.forEach(w => {
        md += `- ${w}\n`;
      });
      if (r.missingAltImgs.length > 0) {
        md += `  *Sample images missing alt:* \n`;
        r.missingAltImgs.forEach(src => {
          md += `    - \`${src}\`\n`;
        });
      }
      md += `\n`;
    }

    if (r.info.length > 0) {
      md += `<details>\n<summary><b>View Passed Audits (${r.info.length})</b></summary>\n\n`;
      r.info.forEach(i => {
        md += `- ✅ ${i}\n`;
      });
      md += `\n</details>\n\n`;
    }

    md += `\n---\n\n`;
  });

  fs.writeFileSync(REPORT_PATH, md);
  console.log(`SEO Audit completed successfully! Report written to ${REPORT_PATH}`);
}

runAudit();
