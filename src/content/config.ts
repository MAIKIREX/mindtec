import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.string(),
    author: z.string().default('Wilmar Velasquez'),
    img: z.string().optional(),
    excerpt: z.string().optional(),
  })
});

export const collections = {
  'posts': postsCollection,
};
