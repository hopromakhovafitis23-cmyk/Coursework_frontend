import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('/gnews/') || url.includes('gnews.io')) {
      console.log('REQUEST', url, req.method());
    }
  });
  page.on('requestfinished', (req) => {
    const url = req.url();
    if (url.includes('/gnews/') || url.includes('gnews.io')) {
      console.log('FINISHED', url, req.response()?.status());
    }
  });
  page.on('requestfailed', (req) => {
    const url = req.url();
    if (url.includes('/gnews/') || url.includes('gnews.io')) {
      console.log('FAILED', url, req.failure()?.errorText);
    }
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(5000);
  await browser.close();
})();
