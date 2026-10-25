"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Send,
  ShieldCheck,
  MessageSquare,
  LoaderCircle,
} from "lucide-react";
import InstitutionalShell from "./institutional-shell";
import Link from "./site-link";
export default function InstitutionalContact() {
  const [configured, setConfigured] = useState<boolean | null>(null),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(""),
    [success, setSuccess] = useState(false);
  const form = useRef<HTMLFormElement>(null),
    requestId = useRef("");
  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json() as Promise<{ configured: boolean }>)
      .then((d) => setConfigured(d.configured))
      .catch(() =>
        setStatus(
          "Não foi possível verificar o serviço de envio. Tente novamente.",
        ),
      );
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setSuccess(false);
    setStatus("");
    const data = new FormData(event.currentTarget);
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
          requestId: requestId.current,
        }),
      });
      const result = (await res.json()) as {
        error?: string;
        accepted?: boolean;
      };
      if (!res.ok || !result.accepted)
        throw Error(
          result.error || "Não foi possível enviar. Tente novamente.",
        );
      setSuccess(true);
      setStatus(
        "Mensagem aceita pelo serviço de e-mail. A entrega final depende do provedor.",
      );
      form.current?.reset();
      requestId.current = "";
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Conexão interrompida. Nenhuma confirmação de envio recebida.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <InstitutionalShell page="contato">
      <section className="inst-section inst-page-intro">
        <span className="inst-kicker">ABERTO A NOVAS PERSPECTIVAS</span>
        <h1>
          O próximo movimento
          <br />
          <span>pode começar aqui.</span>
        </h1>
        <p>
          Uma ideia, uma dúvida ou uma nova possibilidade para o projeto.
          Compartilhe sua mensagem com a equipe do Fitness Pro.
        </p>
      </section>
      <section className="inst-section inst-contact-page">
        <div className="inst-contact-copy">
          <span className="inst-contact-symbol">
            <MessageSquare size={34} />
          </span>
          <h2>
            Vamos conversar
            <br />
            sobre o projeto.
          </h2>
          <p>
            O Fitness Pro é um trabalho acadêmico que aproxima desenvolvimento,
            design e pesquisa para explorar novas formas de compreender o
            treino.
          </p>
          <div className="inst-contact-detail">
            <span>QUEM ESTÁ POR TRÁS</span>
            <p>João Lucas · Raul Dias · Renato Silva</p>
            <Link href="/equipe" className="inst-text-link">
              Conhecer a equipe <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="inst-contact-detail">
            <span>CANAIS INSTITUCIONAIS</span>
            <p>
              E-mail institucional e links profissionais ainda não fornecidos.
              Este espaço será atualizado quando a equipe confirmar os canais
              oficiais.
            </p>
          </div>
        </div>
        <form ref={form} className="inst-contact-form" onSubmit={submit}>
          <div className="inst-form-heading">
            <span className="inst-kicker">UMA CONVERSA DE CADA VEZ</span>
            <h2>Deixe sua mensagem.</h2>
          </div>
          {configured === false && (
            <div className="inst-form-config">
              <ShieldCheck size={18} />
              <p>
                <strong>O envio ainda não está disponível.</strong> O serviço de
                e-mail está aguardando configuração. Nenhuma mensagem será
                enviada enquanto essa integração não estiver ativa.
              </p>
            </div>
          )}
          <label htmlFor="contact-name">
            Seu nome
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              placeholder="Como podemos chamar você?"
            />
          </label>
          <label htmlFor="contact-email">
            Seu e-mail
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={160}
              placeholder="voce@exemplo.com"
            />
          </label>
          <label htmlFor="contact-message">
            Sua mensagem
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={4000}
              rows={5}
              placeholder="Conte um pouco sobre o que você tem em mente."
            />
          </label>
          <div className="inst-honeypot" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="inst-consent">
            <input type="checkbox" required />
            Entendo que, quando o envio estiver ativo, meus dados serão
            compartilhados com a equipe e com o serviço de e-mail para responder
            à mensagem.
          </label>
          <button
            type="submit"
            className="button primary"
            disabled={busy || configured === null}
          >
            {busy ? (
              <LoaderCircle size={17} className="inst-spinner" />
            ) : (
              <Send size={17} />
            )}{" "}
            {busy ? "Enviando…" : "Enviar mensagem"}
          </button>
          {status && (
            <div
              role={success ? "status" : "alert"}
              className={success ? "inst-form-success" : "inst-form-error"}
            >
              {success && <CheckCircle2 size={17} />}
              <span>{status}</span>
            </div>
          )}
          <p className="inst-form-privacy">
            <ShieldCheck size={14} />O formulário não grava seu contato no
            navegador.
          </p>
        </form>
      </section>
    </InstitutionalShell>
  );
}
