import { test, expect } from '@playwright/test';

const mockArticles = [
  {
    title: 'Mock Election News',
    description: 'The latest updates on the upcoming elections.',
    content: 'Detailed content about the elections.',
    url: 'https://example.com/election-news',
    image: 'https://placehold.co/600x400',
    publishedAt: '2023-11-01T10:00:00Z',
    source: { name: 'MockSource', url: 'https://example.com' },
  },
  {
    title: 'Apple Releases New Tech',
    description: 'New gadgets announced today.',
    content: 'Detailed content about new Apple technology.',
    url: 'https://example.com/apple-news',
    image: 'https://placehold.co/600x400',
    publishedAt: '2023-11-02T12:00:00Z',
    source: { name: 'TechMock', url: 'https://example.com' },
  },
];

const mockSportsArticles = [
  {
    title: 'Local Team Wins Championship',
    description: 'A historic victory for the local sports team.',
    content: 'Detailed match report and interviews.',
    url: 'https://example.com/sports-news',
    image: 'https://placehold.co/600x400',
    publishedAt: '2023-11-03T15:00:00Z',
    source: { name: 'SportsMock', url: 'https://example.com' },
  },
];

test.describe('News Portal UI and Features', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept all static GNews data files with single route handler
    await page.route('**/gnews/*.json', async (route) => {
      const url = route.request().url();
      if (url.includes('sports.json')) {
        await route.fulfill({ json: mockSportsArticles });
      } else if (url.includes('all.json') || url.includes('general.json')) {
        await route.fulfill({ json: mockArticles });
      } else {
        // Fallback to mock articles for any other category
        await route.fulfill({ json: mockArticles });
      }
    });
  });

  test('Navigation, Category Tabs, and Search in News Feed', async ({ page }) => {
    await page.goto('/');

    // Check Home page (uses top-headlines)
    await expect(page.getByRole('heading', { name: 'Mock Election News' }).first()).toBeVisible();

    // Navigate to News Feed
    await page.getByRole('link', { name: 'Стрічка новин' }).click();
    await expect(page).toHaveURL(/.*news/);

    // Initial load should show general articles
    await expect(page.getByRole('heading', { name: 'Mock Election News' }).first()).toBeVisible();

    // Click on 'Спорт' category tab
    await page.getByRole('button', { name: 'Спорт' }).click();

    // Should now show sports articles
    await expect(page.getByRole('heading', { name: 'Local Team Wins Championship' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mock Election News' })).not.toBeVisible();

    // Search functionality
    const searchInput = page.getByPlaceholder(/Пошук/i);
    await searchInput.fill('Apple');

    // Should trigger search API and return mockArticles
    await expect(page.getByRole('heading', { name: 'Apple Releases New Tech' })).toBeVisible();
  });

  test('Article page displays content and comments are restricted for guests', async ({ page }) => {
    // Navigate directly to article page using state (simulating click from feed)
    // To do this simply in a test, we can mock the fetch on the article page, but since we
    // are passing state now, it's easier to click through from the feed.
    await page.goto('/#/news');

    await page.getByRole('heading', { name: 'Mock Election News' }).click();

    // Check metadata
    await expect(page.getByRole('heading', { name: 'Mock Election News' })).toBeVisible();
    await expect(page.getByText('Джерело: MockSource')).toBeVisible();

    // Check that the comment form is not visible for guests
    await expect(page.getByPlaceholder(/Напишіть ваш коментар/i)).not.toBeVisible();
    await expect(page.getByText(/Увійдіть, щоб залишити коментар/i)).toBeVisible();
  });

  test('Blog (Колонки читачів) CRUD remains functional', async ({ page }) => {
    await page.goto('/#/register');
    await page.getByLabel('Нікнейм').fill('Journalist');
    await page.getByLabel('Email').fill('journalist@test.com');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Зареєструватися' }).click();
    await expect(page.getByText('Вітаємо, Journalist!')).toBeVisible({ timeout: 10000 });

    await page.goto('/#/blog');
    await expect(page.getByText('Поки що немає постів')).toBeVisible();

    await page.getByLabel(/Назва/i).fill('Моя перша колонка');
    await page.getByLabel(/Текст/i).fill('Це контент для авторської колонки.');
    await page.getByRole('button', { name: 'Опублікувати' }).click();

    await expect(page.getByRole('heading', { name: 'Моя перша колонка' })).toBeVisible();
    await expect(page.getByText('Це контент для авторської колонки.')).toBeVisible();
    await expect(page.getByText('Journalist', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Видалити' }).click();
    await expect(page.getByRole('heading', { name: 'Моя перша колонка' })).toBeHidden();
  });
});
