import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { contactSchema } from "@/lib/contact-validation";
const windows = new Map<string, { count: number; until: number }>();
function config() {
  const values = env as unknown as Record<string, string | undefined>;
  return {
    key: values.RESEND_API_KEY || process.env.RESEND_API_KEY,
    to: values.CONTACT_TO || process.env.CONTACT_TO,
    from: values.CONTACT_FROM || process.env.CONTACT_FROM,
  };
}
export async function GET() {
  const c = config();
  return Response.json(
    { configured: Boolean(c.key && c.to && c.from) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    await request.body?.cancel();
    return Response.json({ error: "Origem não permitida." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") || 0) > 22000)
    return Response.json(
      { error: "A mensagem excedeu o limite permitido." },
      { status: 413 },
    );
  let data;
  try {
    const raw = await request.text();
    if (raw.length > 7000) throw Error();
    data = contactSchema.parse(JSON.parse(raw));
  } catch {
    return Response.json(
      {
        error:
          "Verifique nome, e-mail e mensagem. Use entre 10 e 4.000 caracteres na mensagem.",
      },
      { status: 400 },
    );
  }
  const { key, to, from } = config();
  if (!key || !to || !from)
    return Response.json(
      {
        error:
          "O serviço de e-mail ainda não está configurado. Nenhuma mensagem foi enviada.",
      },
      { status: 503 },
    );
  const user = await getChatGPTUser();
  if (!user)
    return Response.json(
      { error: "Entre no site para enviar uma mensagem." },
      { status: 401 },
    );
  const now = Date.now();
  for (const [key, v] of windows) if (v.until < now) windows.delete(key);
  const window = windows.get(user.userId) || { count: 0, until: now + 3600000 };
  if (window.count >= 3)
    return Response.json(
      { error: "Limite de envio atingido. Tente novamente mais tarde." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((window.until - now) / 1000)),
        },
      },
    );
  window.count++;
  windows.set(user.userId, window);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(12000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "Idempotency-Key": `fitnesspro-contact-${user.userId}-${data.requestId}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Fitness Pro · Mensagem de ${data.name}`,
        text: `Nome: ${data.name}\nE-mail: ${data.email}\n\n${data.message}`,
      }),
    });
    if (!response.ok)
      return Response.json(
        {
          error:
            "O serviço de e-mail não confirmou o envio. Aguarde e tente novamente.",
        },
        { status: 502 },
      );
    const result = (await response.json()) as { id?: string };
    if (!result.id) throw Error();
    return Response.json(
      { accepted: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        error:
          "A conexão com o serviço de e-mail foi interrompida. Nenhuma confirmação de envio recebida.",
      },
      { status: 502 },
    );
  }
}
