// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// GitHub Pages 專案站：https://brian861114-coder.github.io/public-showcase/
// 本機預設 base='/'；CI 會注入 BASE=/public-showcase/
const site = process.env.SITE ?? 'https://brian861114-coder.github.io';
const base = process.env.BASE ?? '/';

// Keystatic 後台只在本機 `astro dev` 啟用；正式 build 維持純靜態站給 GitHub Pages。
const enableKeystatic = process.argv.includes('dev');

export default defineConfig({
  site,
  base,
  // Keystatic 後台路徑不含強制結尾斜線；用 ignore 避免 /keystatic 404。
  trailingSlash: 'ignore',
  integrations: [mdx(), react(), ...(enableKeystatic ? [keystatic()] : [])],
});
