import { chromium } from "@playwright/test";
import fs from "node:fs";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
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
fs.mkdirSync("outputs/institutional", { recursive: true });
try {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: /Entenda o/ }).waitFor();
  await page.screenshot({ path: "outputs/institutional/hero-desktop.png" });
  const pose = page.locator(".inst-hero-pose");
  const before = await pose.locator("[data-joint]").nth(6).getAttribute("cy");
  await pose.getByRole("button", { name: "Mudar posição" }).click();
  await page.waitForTimeout(150);
  const after = await pose.locator("[data-joint]").nth(6).getAttribute("cy");
  if (before === after) throw Error("Bonequinho não mudou de posição");
  if (await page.locator("video").count())
    throw Error("Câmera ou vídeo não deveriam carregar na Home institucional");
  await page.getByRole("tab", { name: /Acompanhamento de progresso/ }).click();
  await page
    .getByRole("heading", { name: "Uma história feita de consistência." })
    .waitFor();
  await page.getByRole("tab", { name: /Biblioteca de exercícios/ }).focus();
  await page.keyboard.press("ArrowDown");
  if (
    (await page
      .getByRole("tab", { name: /Vídeos demonstrativos/ })
      .getAttribute("aria-selected")) !== "true"
  )
    throw Error("Teclado nos recursos falhou");
  for (let y = 0; y < 8500; y += 650) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(45);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({
    path: "outputs/institutional/home-desktop.png",
    fullPage: true,
  });
  await page.goto(base + "/equipe", { waitUntil: "networkidle" });
  for (const name of ["João Lucas", "Raul Dias", "Renato Silva"])
    if (
      !(await page
        .locator(".inst-member-name")
        .filter({ hasText: name.split(" ")[0] })
        .count())
    )
      throw Error("Integrante ausente: " + name);
  await page.screenshot({
    path: "outputs/institutional/team-desktop.png",
    fullPage: true,
  });
  await page.goto(base + "/faq", { waitUntil: "networkidle" });
  await page.getByLabel("Buscar perguntas").fill("gratuito");
  if ((await page.locator(".inst-faq-list details").count()) !== 1)
    throw Error("Busca FAQ falhou");
  const summary = page.locator(".inst-faq-list summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await page.getByText("Não há política de preços", { exact: false }).waitFor();
  await page.keyboard.press("Enter");
  if (
    (await page.locator(".inst-faq-list details").getAttribute("open")) !== null
  )
    throw Error("FAQ não fechou pelo teclado");
  await page.getByLabel("Buscar perguntas").fill("");
  await page.getByRole("button", { name: "Tecnologia", exact: true }).click();
  if ((await page.locator(".inst-faq-list details").count()) !== 3)
    throw Error("Filtro FAQ falhou");
  await page.goto(base + "/contato", { waitUntil: "networkidle" });
  await page
    .getByText("O envio ainda não está disponível.", { exact: true })
    .waitFor();
  await page.getByLabel("Seu nome", { exact: true }).fill("Teste de validação");
  await page
    .getByLabel("Seu e-mail", { exact: true })
    .fill("teste@example.com");
  await page
    .getByLabel("Sua mensagem", { exact: true })
    .fill("Mensagem exclusiva para testar o estado não configurado.");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Enviar mensagem", exact: true })
    .click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Nenhuma mensagem foi enviada." })
    .waitFor();
  await page.goto(base + "/assistente", { waitUntil: "networkidle" });
  await page
    .getByText("A IA ainda precisa ser conectada.", { exact: true })
    .waitFor();
  await page.getByRole("button", { name: /Conhecer o projeto/ }).click();
  if (
    !(await page.getByLabel("Sua mensagem").inputValue()).includes(
      "quem desenvolve",
    )
  )
    throw Error("Sugestão institucional ausente");
  await page.screenshot({
    path: "outputs/institutional/chat-desktop.png",
    fullPage: true,
  });
  for (const width of [360, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      "/",
      "/equipe",
      "/faq",
      "/contato",
      "/assistente",
      "/tecnologia",
    ]) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        )
      )
        throw Error(`Overflow ${width} ${route}`);
      if (route === "/" && width === 390) {
        await page.screenshot({
          path: "outputs/institutional/hero-mobile.png",
        });
        await page
          .getByRole("button", { name: "Abrir menu", exact: true })
          .click();
        await page
          .getByRole("navigation")
          .getByRole("link", { name: "Equipe", exact: true })
          .click();
        await page.waitForURL("**/equipe");
      }
      if (route === "/equipe" && width === 390)
        await page.screenshot({
          path: "outputs/institutional/team-mobile.png",
          fullPage: true,
        });
    }
  }
  // Run adversarial API probes after ordinary browser journeys; keep transport tests isolated.
  const invalid = await page.request.post(base + "/api/contact", {
    headers: { origin: base },
    data: {
      name: "A",
      email: "invalido",
      message: "x",
      website: "",
      requestId: crypto.randomUUID(),
    },
  });
  if (invalid.status() !== 400) throw Error("Contato inválido não rejeitado");
  const spam = await page.request.post(base + "/api/contact", {
    headers: { origin: base },
    data: {
      name: "Teste",
      email: "teste@example.com",
      message: "Teste sem envio externo real.",
      website: "spam",
      requestId: crypto.randomUUID(),
    },
  });
  if (spam.status() !== 400) throw Error("Honeypot não rejeitou");
  const origin = await page.request.post(base + "/api/contact", {
    headers: { origin: "https://other.example" },
    data: {},
  });
  if (origin.status() !== 403) throw Error("Origem externa não rejeitada");
  if (errors.length) throw Error(errors.join("\n"));
  console.log(
    "PASS: Home institucional, bonequinho interativo, recursos, equipe real, FAQ por busca/filtro/teclado, contato sem envio falso, validação/spam/origem, chatbot pendente, mobile 360/390/768 sem overflow.",
  );
} finally {
  await browser.close();
}
