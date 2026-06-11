import { chromium } from 'playwright';

const url = process.argv[2];
const out = process.argv[3];
const colorScheme = process.argv[4] || 'dark';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ colorScheme });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
