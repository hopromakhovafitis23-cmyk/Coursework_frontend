import fs from 'fs/promises';
import path from 'path';

const API_KEY = process.env.VITE_GNEWS_API_KEY || 'fc7b88b8060f4ce1c43c9112b18d008d';
const BASE_URL = 'https://gnews.io/api/v4';
const categories = [
  'general',
  'world',
  'nation',
  'business',
  'technology',
  'entertainment',
  'sports',
  'science',
  'health',
];
const outputDir = path.resolve(process.cwd(), 'public', 'gnews');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchCategory = async (category) => {
  const url = `${BASE_URL}/top-headlines?lang=uk&category=${category}&apikey=${API_KEY}`;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.articles || [];
    }

    if (response.status === 429 && attempt < 3) {
      console.warn(`Rate limited fetching ${category}, retrying after delay (attempt ${attempt})`);
      await sleep(2000);
      continue;
    }

    throw new Error(`Failed to fetch ${category}: ${response.status} ${response.statusText}`);
  }

  throw new Error(`Failed to fetch ${category} after retries.`);
};

const run = async () => {
  await fs.mkdir(outputDir, { recursive: true });
  const allArticles = [];

  for (const category of categories) {
    const articles = await fetchCategory(category);
    await fs.writeFile(
      path.join(outputDir, `${category}.json`),
      JSON.stringify(articles, null, 2),
      'utf-8'
    );
    allArticles.push(...articles);
    console.log(`Fetched ${articles.length} articles for ${category}`);
    await sleep(1500);
  }

  await fs.writeFile(path.join(outputDir, 'all.json'), JSON.stringify(allArticles, null, 2), 'utf-8');
  console.log(`Generated ${allArticles.length} total articles for search corpus.`);
};

run().catch((error) => {
  console.error('Failed to fetch GNews data:', error);
  process.exit(1);
});
