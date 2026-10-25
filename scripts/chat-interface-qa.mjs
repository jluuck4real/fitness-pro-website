// Explicit browser-only fixtures: this does NOT validate a live AI provider.
// No fixture text is shipped as application behavior or shown on the live site.
import { chromium } from "@playwright/test";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
let calls = 0;
await page.route("**/api/chat", async (route) => {
  if (route.request().method() === "GET")
    return route.fulfill({ json: { configured: true } });
  calls++;
  const body = route.request().postDataJSON();
  if (body.messages.at(-1)?.role !== "user")
    throw Error("Contexto sem mensagem de usuário");
  return route.fulfill({
    headers: { "Content-Type": "text/event-stream" },
    body: 'data: {"text":"FIXTURE DE TESTE: "}\n\ndata: {"text":"fragmentos recebidos."}\n\n',
  });
});
try {
  await page.goto(base + "/assistente", { waitUntil: "networkidle" });
  await page.getByLabel("Sua mensagem").fill("Pergunta de teste da interface.");
  await page
    .getByRole("button", { name: "Enviar mensagem", exact: true })
    .click();
  await page
    .getByText("FIXTURE DE TESTE: fragmentos recebidos.", { exact: true })
    .waitFor();
  await page.reload({ waitUntil: "networkidle" });
  await page
    .getByText("FIXTURE DE TESTE: fragmentos recebidos.", { exact: true })
    .waitFor();
  await page
    .locator(".chat-sidebar")
    .getByRole("button", { name: "Nova conversa", exact: true })
    .click();
  if (await page.locator(".message").count())
    throw Error("Nova conversa não limpou as mensagens");
  if (
    (await page.evaluate(() =>
      sessionStorage.getItem("fitnesspro.chat-session.v1"),
    )) !== null
  )
    throw Error("Nova conversa não limpou a sessão");
  if (calls !== 1 || errors.length)
    throw Error(errors.join("\n") || "Quantidade incorreta de chamadas");
  console.log(
    "PASS: interface de streaming com fixture explícita, contexto enviado, restauração da sessão e nova conversa. Provedor real não testado sem chave.",
  );
} finally {
  await browser.close();
}
