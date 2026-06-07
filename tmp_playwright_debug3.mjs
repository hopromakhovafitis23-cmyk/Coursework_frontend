import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', (msg) => console.log('console>', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('pageerror>', err.message));
  page.on('requestfailed', (req) => console.log('requestfailed>', req.url(), req.failure()?.errorText));
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  console.log('URL:', page.url());
  console.log('REGISTER count:', await page.locator('text=Реєстрація').count());
  console.log('heading count:', await page.locator('role=heading[name="Mock Election News"]').count());
  console.log('body length:', (await page.content()).length);
  await browser.close();
})();
