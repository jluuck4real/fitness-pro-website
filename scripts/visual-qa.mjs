import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.getByRole("heading", { name: /Seu corpo/ }).waitFor();
await page.waitForTimeout(1300);
await page.screenshot({ path: "outputs/hero-desktop.png" });
for (let y = 0; y < 3600; y += 650) {
  await page.evaluate((y) => scrollTo(0, y), y);
  await page.waitForTimeout(220);
}
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(800);
await page.screenshot({ path: "outputs/home-desktop.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: "outputs/hero-mobile.png" });
for (let y = 0; y < 6000; y += 650) {
  await page.evaluate((y) => scrollTo(0, y), y);
  await page.waitForTimeout(200);
}
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: "outputs/home-mobile.png", fullPage: true });
console.log("PASS: capturas após entrada e scroll reveal.");
await browser.close();
