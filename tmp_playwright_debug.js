const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  console.log('URL:', page.url());
  console.log('REGISTER count:', await page.locator('text=Реєстрація').count());
  const content = await page.content();
  console.log('BODY START:', content.slice(0, 1000));
  await browser.close();
})();
