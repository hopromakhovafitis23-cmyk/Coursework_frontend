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
];

test.describe('Auth, Bookmarking, and Comments Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept static GNews data files to prevent quota usage and ensure stability
    await page.route('**/gnews/*.json', async (route) => {
      await route.fulfill({ json: mockArticles });
    });
  });

  test('Register, Add Article to Saved, Comment, and Check Saved Articles', async ({ page }) => {
    // 1. Registration
    await page.goto('/');

    await page.getByRole('link', { name: 'Реєстрація' }).click();
    await expect(page).toHaveURL(/.*register/);

    await page.getByLabel('Нікнейм').fill('ReaderTest');
    await page.getByLabel('Email').fill('reader@example.com');
    await page.getByLabel('Пароль').fill('password123');
    await page.getByRole('button', { name: 'Зареєструватися' }).click();

    await expect(page.getByText('Вітаємо, ReaderTest!')).toBeVisible({ timeout: 5000 });

    // 2. Go to news feed, find article and Save it directly from the card
    await page.goto('/#/news');

    // Find the save button on the article card
    const saveButton = page.getByRole('button', { name: 'Зберегти' }).first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Check if the button state changed
    await expect(
      page.getByRole('button', { name: 'Видалити зі збережених' }).first()
    ).toBeVisible();

    // 3. Go to article page to leave a comment
    // Click on the article link (which contains the heading)
    await page.getByRole('link').filter({ has: page.getByText('Mock Election News').first() }).first().click();

    // Leave a comment
    const commentInput = page.getByPlaceholder(/Напишіть ваш коментар/i);
    await expect(commentInput).toBeVisible();
    await commentInput.fill('Дуже цікава стаття!');
    await page.getByRole('button', { name: 'Відправити' }).click();

    // Check if comment is visible
    await expect(page.getByText('Дуже цікава стаття!')).toBeVisible();
    await expect(page.getByText('ReaderTest', { exact: true })).toBeVisible();

    // 4. Check Saved Articles page
    await page.getByRole('link', { name: 'Збережене' }).click();
    await expect(page).toHaveURL(/.*saved/);

    await expect(page.getByRole('heading', { name: 'Збережені статті' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mock Election News' })).toBeVisible();

    // 5. Remove from saved directly from the saved page
    const removeButton = page.getByRole('button', { name: 'Видалити зі збережених' });
    await removeButton.click();
    await expect(page.getByRole('heading', { name: 'Mock Election News' })).toBeHidden();
    await expect(page.getByText('Ви ще не зберегли жодної статті.')).toBeVisible();
  });
});
