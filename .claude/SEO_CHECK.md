# Control SEO obligatorio

Antes de publicar, desplegar o dar por terminada una página nueva, ejecuta:

```bash
npm run seo:check
```

No publiques mientras el comando falle. Corrige los enlaces internos rotos, las
canonicales, las URL del sitemap y las redirecciones señaladas por el informe.

Al crear o renombrar una URL pública, usa la ruta canónica con `/` final. Si una
URL anterior deja de existir, añade una redirección `301` a su reemplazo más
equivalente en `public/_redirects`; no la redirijas a la portada por defecto.
