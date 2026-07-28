import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const siteUrl = 'https://www.mindtecbolivia.com';
const distDir = path.resolve('dist');
const sitemapPath = path.join(distDir, 'sitemap-0.xml');
const redirectsPath = path.resolve('public/_redirects');
const errors = [];

function fail(message) {
  errors.push(message);
}

function pagePathname(url) {
  const pathname = new URL(url, siteUrl).pathname;
  return pathname === '/' ? '/' : pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function htmlPathFor(pathname) {
  return pathname === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, pathname.slice(1), 'index.html');
}

function readSitemapUrls() {
  if (!fs.existsSync(sitemapPath)) {
    fail('No se encontró dist/sitemap-0.xml. La compilación debe generar un sitemap.');
    return [];
  }

  return [...fs.readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, url]) => url.trim());
}

function checkIndexablePages(sitemapUrls) {
  for (const url of sitemapUrls) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      fail(`El sitemap contiene una URL inválida: ${url}`);
      continue;
    }

    if (parsed.origin !== siteUrl) {
      fail(`El sitemap contiene una URL fuera del dominio canónico: ${url}`);
      continue;
    }

    const pathname = pagePathname(url);
    const htmlPath = htmlPathFor(pathname);
    if (!fs.existsSync(htmlPath)) {
      fail(`La URL del sitemap no genera una página HTML: ${pathname}`);
      continue;
    }

    const $ = cheerio.load(fs.readFileSync(htmlPath, 'utf8'));
    const canonical = $('link[rel="canonical"]').attr('href');
    const expectedCanonical = `${siteUrl}${pathname}`;
    const robots = $('meta[name="robots"]').attr('content') || '';

    if (!canonical) {
      fail(`${pathname}: falta la etiqueta canonical.`);
    } else if (canonical !== expectedCanonical) {
      fail(`${pathname}: canonical inválida (${canonical}); se esperaba ${expectedCanonical}.`);
    }

    if (/\bnoindex\b/i.test(robots)) {
      fail(`${pathname}: una URL incluida en el sitemap no puede usar noindex.`);
    }

    if (!$('title').text().trim()) fail(`${pathname}: falta el título SEO.`);
    if (!$('meta[name="description"]').attr('content')?.trim()) {
      fail(`${pathname}: falta la meta descripción.`);
    }

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href')?.trim();
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return;

      let target;
      try {
        target = new URL(href, `${siteUrl}${pathname}`);
      } catch {
        fail(`${pathname}: enlace interno inválido (${href}).`);
        return;
      }

      if (target.origin !== siteUrl) return;
      if (path.extname(target.pathname)) return;

      const targetPathname = pagePathname(target.href);
      if (target.pathname !== '/' && !target.pathname.endsWith('/')) {
        fail(`${pathname}: el enlace interno ${href} debe terminar en /.`);
      }
      if (!fs.existsSync(htmlPathFor(targetPathname))) {
        fail(`${pathname}: enlace interno roto (${href}).`);
      }
    });
  }
}

function checkRedirects() {
  if (!fs.existsSync(redirectsPath)) {
    fail('Falta public/_redirects.');
    return;
  }

  const redirects = fs.readFileSync(redirectsPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('/'))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts.length >= 3)
    .map(([source, destination, status]) => ({ source, destination, status }));
  const exactRedirects = new Map(redirects.filter(({ source }) => !source.includes('*'))
    .map(({ source, destination }) => [source, destination]));

  for (const { source, destination, status } of redirects) {
    if (status !== '301') fail(`${source}: las migraciones permanentes deben usar 301.`);
    if (!destination.startsWith('/')) continue;
    if (!fs.existsSync(htmlPathFor(pagePathname(destination)))) {
      fail(`${source}: el destino ${destination} no genera una página.`);
    }

    const next = exactRedirects.get(destination);
    if (next) fail(`${source}: redirección encadenada a ${destination}. Debe apuntar al destino final.`);
  }
}

if (!fs.existsSync(distDir)) {
  fail('No existe dist/. Ejecute npm run build antes de esta comprobación.');
} else {
  const sitemapUrls = readSitemapUrls();
  checkIndexablePages(sitemapUrls);
  checkRedirects();
  console.log(`SEO: se revisaron ${sitemapUrls.length} URL indexables y las redirecciones configuradas.`);
}

if (errors.length) {
  console.error(`\nSEO CHECK FALLÓ: ${errors.length} problema(s).`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('SEO CHECK OK: sitemap, canonicales, enlaces internos y redirecciones validados.');
