import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const DIST_DIR = path.resolve('dist');
const REPORT_PATH = path.resolve('ai_seo_coverage_report.md');

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

function extractJsonLd(html) {
  const $ = cheerio.load(html);
  const blocks = [];
  $('script[type="application/ld+json"]').each((i, el) => {
    const raw = $(el).html();
    try {
      blocks.push(JSON.parse(raw));
    } catch (e) {
      blocks.push({ __parseError: e.message });
    }
  });
  return blocks;
}

function flattenTypes(blocks) {
  const types = [];
  for (const b of blocks) {
    if (b.__parseError) { types.push('INVALID_JSON'); continue; }
    const nodes = Array.isArray(b['@graph']) ? b['@graph'] : [b];
    for (const n of nodes) {
      if (n['@type']) types.push(Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type']);
    }
  }
  return types;
}

function analyzeFile(filePath) {
  const relativePath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);
  const blocks = extractJsonLd(html);
  const types = flattenTypes(blocks);

  return {
    relativePath,
    schemaTypes: types,
    hasInvalidJson: types.includes('INVALID_JSON'),
    hasOrganization: types.includes('Organization'),
    hasWebSite: types.includes('WebSite'),
    hasBreadcrumb: types.includes('BreadcrumbList'),
    hasFAQ: types.includes('FAQPage'),
    hasArticle: types.includes('Article'),
    hasDateModified: html.includes('"dateModified"'),
    hasDirectAnswerBox: html.includes('direct-answer-box'),
    hasFreshnessTag: html.includes('freshness-tag'),
    hasSameAs: html.includes('"sameAs"'),
    robotsMetaNoindex: $('meta[name="robots"]').attr('content')?.includes('noindex') || false,
  };
}

function runAudit() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: "dist" folder not found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = getHtmlFiles(DIST_DIR);
  const results = files.map(analyzeFile);

  const total = results.length;
  const count = (key) => results.filter(r => r[key]).length;

  let md = `# AI SEO / Schema Coverage Report\n\n`;
  md += `**Date:** ${new Date().toISOString()}\n`;
  md += `**Total pages built:** ${total}\n\n`;

  md += `## Global coverage\n\n`;
  md += `| Check | Pages passing | % |\n|---|---|---|\n`;
  md += `| Has Organization schema (site-wide, via Layout) | ${count('hasOrganization')} | ${Math.round(100*count('hasOrganization')/total)}% |\n`;
  md += `| Has WebSite schema (site-wide, via Layout) | ${count('hasWebSite')} | ${Math.round(100*count('hasWebSite')/total)}% |\n`;
  md += `| Has sameAs (social links) | ${count('hasSameAs')} | ${Math.round(100*count('hasSameAs')/total)}% |\n`;
  md += `| Has BreadcrumbList | ${count('hasBreadcrumb')} | ${Math.round(100*count('hasBreadcrumb')/total)}% |\n`;
  md += `| Has FAQPage | ${count('hasFAQ')} | ${Math.round(100*count('hasFAQ')/total)}% |\n`;
  md += `| Article pages with dateModified | ${count('hasDateModified')} | (of Article pages) |\n`;
  md += `| Has direct-answer-box (hero) | ${count('hasDirectAnswerBox')} | ${Math.round(100*count('hasDirectAnswerBox')/total)}% |\n`;
  md += `| Has visible freshness-tag | ${count('hasFreshnessTag')} | ${Math.round(100*count('hasFreshnessTag')/total)}% |\n`;
  md += `| Invalid JSON-LD found | ${count('hasInvalidJson')} | must be 0 |\n\n`;

  const noBreadcrumb = results.filter(r => !r.hasBreadcrumb && !r.robotsMetaNoindex);
  const noDirectAnswer = results.filter(r => !r.hasDirectAnswerBox && !r.robotsMetaNoindex && !r.relativePath.startsWith('blog/') && r.relativePath !== 'index.html');

  md += `## Pages still missing BreadcrumbList (excluding noindex)\n\n`;
  md += noBreadcrumb.length ? noBreadcrumb.map(r => `- ${r.relativePath}`).join('\n') : '_None — full coverage._';
  md += `\n\n`;

  md += `## Pages still missing direct-answer-box (service-style pages only)\n\n`;
  md += noDirectAnswer.length ? noDirectAnswer.map(r => `- ${r.relativePath}`).join('\n') : '_None — full coverage on eligible pages._';
  md += `\n\n`;

  md += `## Per-page detail\n\n`;
  results.forEach(r => {
    md += `### /${r.relativePath}\n`;
    md += `- Schema types: ${r.schemaTypes.length ? r.schemaTypes.join(', ') : '_none_'}\n`;
    md += `- Breadcrumb: ${r.hasBreadcrumb ? '✅' : (r.robotsMetaNoindex ? '⏭️ noindex' : '❌')} | FAQ: ${r.hasFAQ ? '✅' : '—'} | direct-answer-box: ${r.hasDirectAnswerBox ? '✅' : '—'} | freshness-tag: ${r.hasFreshnessTag ? '✅' : '—'}\n\n`;
  });

  fs.writeFileSync(REPORT_PATH, md);
  console.log(`AI SEO coverage report written to ${REPORT_PATH}`);
  console.log(`\nSummary: ${total} pages | Organization ${count('hasOrganization')}/${total} | WebSite ${count('hasWebSite')}/${total} | Breadcrumb ${count('hasBreadcrumb')}/${total} | FAQ ${count('hasFAQ')}/${total} | direct-answer-box ${count('hasDirectAnswerBox')}/${total} | freshness-tag ${count('hasFreshnessTag')}/${total} | Invalid JSON: ${count('hasInvalidJson')}`);
}

runAudit();
