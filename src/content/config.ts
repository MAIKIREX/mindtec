import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    dateISO: z.string().optional(),       // Fecha en formato ISO 8601 para Schema/JSON-LD
    category: z.string(),
    author: z.string().default('Wilmar Velasquez'),
    img: z.string().optional(),
    imgAlt: z.string().optional(),        // Alt text SEO descriptivo para la imagen destacada
    excerpt: z.string().optional(),       // Resumen para tarjetas del blog (150-160 chars)
    description: z.string().optional(),   // Meta description SEO (150-160 chars)
    keywords: z.string().optional(),      // Keywords específicas del artículo
  })
});

export const collections = {
  'posts': postsCollection,
};
