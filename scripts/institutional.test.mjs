import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "../lib/contact-validation.ts";
const valid = {
  name: "Visitante de teste",
  email: "teste@example.com",
  message: "Dúvida sobre o projeto acadêmico.",
  website: "",
  requestId: "ee160958-2ea2-48c0-91a3-ff3db698218d",
};
test("contato aceita uma mensagem válida sem enviar nada", () =>
  assert.equal(contactSchema.safeParse(valid).success, true));
test("contato rejeita e-mail inválido e nome com quebra de linha", () => {
  assert.equal(
    contactSchema.safeParse({ ...valid, email: "nao-e-email" }).success,
    false,
  );
  assert.equal(
    contactSchema.safeParse({ ...valid, name: "Teste\nInjected" }).success,
    false,
  );
});
test("honeypot e limites são verificados", () => {
  assert.equal(
    contactSchema.safeParse({ ...valid, website: "spam.example" }).success,
    false,
  );
  assert.equal(
    contactSchema.safeParse({ ...valid, message: "x".repeat(4001) }).success,
    false,
  );
  assert.equal(
    contactSchema.safeParse({ ...valid, message: "curta" }).success,
    false,
  );
});
