import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['essay', 'tech', 'life', 'learn']),
    tone: z.string().default('#cce8f3'),
    mark: z.string().default('筆記'),
    coverLabel: z.string().optional(),
    coverHint: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
