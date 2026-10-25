import { chromium } from "@playwright/test";
import fs from "node:fs";
fs.mkdirSync("outputs", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.screenshot({ path: "outputs/home-desktop.png", fullPage: true });
console.log("Home:", await page.title());
await page.goto("http://127.0.0.1:5173/exercicios", {
  waitUntil: "networkidle",
});
await page.getByLabel("Buscar exercícios").fill("agachamento");
if ((await page.locator(".exercise-card").count()) !== 1)
  throw Error("Busca falhou");
await page.locator(".exercise-card").click();
await page.waitForURL("**/exercicios/agachamento");
await page
  .getByRole("heading", { name: "Agachamento livre", exact: true })
  .waitFor();
if (
  !(await page
    .getByRole("link", { name: /Abrir no YouTube/ })
    .getAttribute("href"))
)
  throw Error("Vídeo ausente");
await page.goto("http://127.0.0.1:5173/progresso", {
  waitUntil: "networkidle",
});
await page.getByText("Seu gráfico começa com você.").waitFor();
await page.goto("http://127.0.0.1:5173/treinos/controle", {
  waitUntil: "networkidle",
});
await page
  .getByLabel("Séries de Desenvolvimento", { exact: true })
  .selectOption("2");
await page
  .getByLabel("Repetições de Desenvolvimento", { exact: true })
  .fill("8");
await page.reload({ waitUntil: "networkidle" });
if (
  (await page
    .getByLabel("Séries de Desenvolvimento", { exact: true })
    .inputValue()) !== "2"
)
  throw Error("Séries personalizadas não persistiram");
if (
  (await page
    .getByLabel("Repetições de Desenvolvimento", { exact: true })
    .inputValue()) !== "8"
)
  throw Error("Repetições personalizadas não persistiram");
await page.goto("http://127.0.0.1:5173/treinos/fundamentos", {
  waitUntil: "networkidle",
});
await page.getByRole("button", { name: "Iniciar treino", exact: true }).click();
await page.waitForTimeout(1300);
await page.getByRole("button", { name: "Pausar", exact: true }).click();
const paused = await page.locator(".timer").innerText();
await page.waitForTimeout(1100);
if ((await page.locator(".timer").innerText()) !== paused)
  throw Error("Cronômetro não pausou");
await page
  .getByRole("button", { name: "Continuar treino", exact: true })
  .click();
for (const button of await page.locator(".set-buttons button").all())
  await button.click();
await page.getByRole("button", { name: "Concluir e salvar" }).click();
await page.getByText("Sessão registrada", { exact: true }).waitFor();
await page.getByRole("link", { name: "Ver meu progresso" }).click();
await page.locator(".history-row").nth(1).waitFor();
const sessions = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("fitnesspro.sessions.v1") || "[]"),
);
if (sessions.length !== 1 || sessions[0].sets !== 12 || sessions[0].seconds < 1)
  throw Error("Persistência de treino falhou");
await page.reload({ waitUntil: "networkidle" });
await page.locator(".history-row").nth(1).waitFor();
await page.goto("http://127.0.0.1:5173/perfil", { waitUntil: "networkidle" });
await page.getByPlaceholder("Seu nome").fill("Pessoa de teste");
await page.getByRole("button", { name: "Salvar preferências" }).click();
await page.reload({ waitUntil: "networkidle" });
if (
  (await page.getByPlaceholder("Seu nome").inputValue()) !== "Pessoa de teste"
)
  throw Error("Perfil não persistiu");
await page.goto("http://127.0.0.1:5173/assistente", {
  waitUntil: "networkidle",
});
await page
  .getByText("A IA ainda precisa ser conectada.", { exact: true })
  .waitFor();
await page.screenshot({ path: "outputs/chat-desktop.png", fullPage: true });
await page.goto("http://127.0.0.1:5173/analise", { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: "Ativar câmera", exact: true })
  .waitFor();
await page.screenshot({ path: "outputs/lab-desktop.png", fullPage: true });
for (const route of [
  "/exercicios",
  "/treinos",
  "/treinos/fundamentos",
  "/perfil",
  "/progresso",
  "/assistente",
  "/analise",
]) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:5173" + route, {
    waitUntil: "networkidle",
  });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  if (overflow) throw Error("Overflow em " + route);
  if (route === "/") {
    await page.screenshot({ path: "outputs/home-mobile.png", fullPage: true });
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Exercícios", exact: true })
      .click();
    await page.waitForURL("**/exercicios");
  }
  if (route === "/assistente")
    await page.screenshot({ path: "outputs/chat-mobile.png", fullPage: true });
}
const config = await page.request.get("http://127.0.0.1:5173/api/chat");
if ((await config.json()).configured !== false)
  throw Error("Estado de configuração incorreto");
const rejected = await page.request.post("http://127.0.0.1:5173/api/chat", {
  headers: { origin: "https://evil.example" },
  data: { messages: [] },
});
if (rejected.status() !== 403) throw Error("Origem externa não foi rejeitada");
if (errors.length) throw Error("Erros de navegador: " + errors.join("\n"));
console.log(
  "PASS: navegação, busca, vídeos, treino, persistência, perfil, IA pendente, mobile sem overflow e validação de origem.",
);
await browser.close();
