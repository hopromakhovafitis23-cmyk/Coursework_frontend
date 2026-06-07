import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  console.log('heading count', await page.locator('role=heading[name="Mock Election News"]').count());
  console.log('register count', await page.locator('role=link[name="Реєстрація"]').count());
  console.log('body snippet', (await page.content()).slice(0,2000));
  await browser.close();
})();
