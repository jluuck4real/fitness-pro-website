import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: [
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
});
const page = await browser.newPage({ permissions: ["camera"] });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173/analise", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Ativar câmera", exact: true }).click();
await page.getByText("● AO VIVO", { exact: true }).waitFor({ timeout: 90000 });
await page.waitForTimeout(2000);
await page
  .getByText("Enquadre as articulações com boa iluminação.", { exact: true })
  .waitFor();
await page.getByRole("button", { name: "Desligar câmera" }).click();
await page.getByText("CÂMERA DESLIGADA", { exact: true }).waitFor();
if (errors.length) throw Error(errors.join("\n"));
console.log(
  "PASS: câmera de teste, modelo MediaPipe real carregado, inferência sem corpo não conta, desligamento. Validação humana de movimento ainda necessária.",
);
await browser.close();
