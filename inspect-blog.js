const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/#/blog');
  await page.waitForTimeout(2000);
  const titleLabel = await page.locator('label:has-text("Назва")').count();
  const titleInput = await page.locator('input#title').count();
  const titleAria = await page.locator('input[aria-label="Назва"]').count();
  const blogText = await page.locator('text=Поки що немає постів').count();
  console.log('label count', titleLabel);
  console.log('input#title count', titleInput);
  console.log('aria-label count', titleAria);
  console.log('blog text count', blogText);
  const content = await page.content();
  console.log(content.includes('Назва') ? 'content has Назва' : 'content lacks Назва');
  console.log('CONTENT SNIPPET:\n', content.slice(0, 1200));
  await browser.close();
})();
