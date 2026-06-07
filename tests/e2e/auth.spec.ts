import { test, expect } from '@playwright/test';

const mockArticles = {
  totalArticles: 1,
  articles: [
    {
      title: 'Mock Election News',
      description: 'The latest updates on the upcoming elections.',
      content: 'Detailed content about the elections.',
      url: 'https://example.com/election-news',
      image: 'https://placehold.co/600x400',
      publishedAt: '2023-11-01T10:00:00Z',
      source: { name: 'MockSource', url: 'https://example.com' },
    },
  ],
};

test.describe('Auth, Bookmarking, and Comments Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept GNews API calls and local static JSON requests to prevent quota usage and ensure stability
    const fulfillMock = async (route: any, body: object) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    };

    await page.route('**/*gnews.io*', async (route) => {
      await fulfillMock(route, mockArticles);
    });

    await page.route('**/*/gnews/*', async (route) => {
      await fulfillMock(route, mockArticles);
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
    await page.getByRole('heading', { name: 'Mock Election News' }).first().click();

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
