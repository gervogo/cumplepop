import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:3000');
await page.waitForTimeout(2000);

const splashVisible = await page.isVisible('#splash');
console.log('Splash visible:', splashVisible);

const btnExists = await page.isVisible('#startBtn');
console.log('Start button visible:', btnExists);

await page.click('#startBtn');
await page.waitForTimeout(500);

const countdownVisible = await page.isVisible('#countdown');
console.log('Countdown visible after click:', countdownVisible);

await page.waitForTimeout(4000);

const splashGone = await page.isHidden('#splash');
console.log('Splash hidden after game start:', splashGone);

const canvasExists = await page.isVisible('canvas');
console.log('Canvas visible:', canvasExists);

console.log('JS errors:', errors.length > 0 ? errors : 'none');

await browser.close();
