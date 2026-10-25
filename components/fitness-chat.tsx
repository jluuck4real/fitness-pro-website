"use client";
import { useState, useRef, useEffect } from "react";
import Link from "./site-link";
import {
  Sparkles,
  Plus,
  MessageSquare,
  Trash2,
  ShieldCheck,
  Dumbbell,
  Target,
  Activity,
  ScanLine,
  ArrowUpRight,
  User,
  Check,
  Copy,
  Settings2,
  Pause,
  ArrowRight,
  Menu,
} from "lucide-react";
import Markdown from "react-markdown";
import { Arrow, useLocal } from "./fitness-ui";
type Message = { role: "user" | "assistant"; content: string };
type Conversation = { id: string; title: string; messages: Message[] };
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]),
    [input, setInput] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [configured, setConfigured] = useState<boolean | null>(null),
    [history, setHistory] = useLocal<Conversation[]>("fitnesspro.chats.v1", []),
    [remember, setRemember] = useLocal<boolean>(
      "fitnesspro.remember.v1",
      false,
    ),
    [conversation, setConversation] = useState(""),
    [copied, setCopied] = useState(-1),
    [sidebar, setSidebar] = useState(false);
  const end = useRef<HTMLDivElement>(null),
    abort = useRef<AbortController | null>(null);
  const followResponse = useRef(true);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = sessionStorage.getItem("fitnesspro.chat-session.v1");
        if (saved) setMessages(JSON.parse(saved));
      } catch {
        setError("Não foi possível recuperar a conversa desta sessão.");
      }
    });
  }, []);
  useEffect(() => {
    if (messages.length)
      queueMicrotask(() => {
        try {
          sessionStorage.setItem(
            "fitnesspro.chat-session.v1",
            JSON.stringify(messages),
          );
        } catch {
          setError(
            "O navegador não permitiu guardar esta conversa durante a sessão.",
          );
        }
      });
  }, [messages]);
  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json() as Promise<{ configured: boolean }>)
      .then((d) => setConfigured(d.configured === true))
      .catch(() =>
        setError("Não foi possível verificar a conexão. Tente novamente."),
      );
    return () => abort.current?.abort();
  }, []);
  useEffect(() => {
    if (followResponse.current)
      end.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
  }, [messages, busy]);
  function fresh() {
    abort.current?.abort();
    setMessages([]);
    try {
      sessionStorage.removeItem("fitnesspro.chat-session.v1");
    } catch {}
    setConversation("");
    setError("");
    setBusy(false);
    setSidebar(false);
  }
  async function send(text = input) {
    if (busy || !text.trim()) return;
    followResponse.current = true;
    const current = [
      ...messages.filter((m) => m.content.trim()),
      { role: "user" as const, content: text.trim() },
    ].slice(-12);
    if (current[0]?.role === "assistant") current.shift();
    setMessages(current);
    setInput("");
    setBusy(true);
    setError("");
    let answer = "";
    const controller = new AbortController();
    abort.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: current }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        if (res.status === 503) setConfigured(false);
        throw Error(d.error || "Não foi possível responder. Tente novamente.");
      }
      setConfigured(true);
      if (!res.body) throw Error("A resposta não pôde ser transmitida.");
      setMessages([...current, { role: "assistant", content: "" }]);
      const reader = res.body.getReader(),
        decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = JSON.parse(line.slice(5));
          if (data.error) throw Error(data.error);
          if (data.text) {
            answer += data.text;
            setMessages([...current, { role: "assistant", content: answer }]);
          }
        }
      }
      if (!answer)
        throw Error("A IA não retornou texto. Tente reformular sua pergunta.");
      if (remember) {
        const cid = conversation || crypto.randomUUID();
        setConversation(cid);
        setHistory(
          [
            {
              id: cid,
              title: current[0].content.slice(0, 45),
              messages: [
                ...current,
                { role: "assistant" as const, content: answer },
              ],
            },
            ...history.filter((c) => c.id !== cid),
          ].slice(0, 15),
        );
      }
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Conexão interrompida.");
    } finally {
      if (abort.current === controller) setBusy(false);
    }
  }
  return (
    <div className="chat-shell">
      <aside className={sidebar ? "chat-sidebar mobile-open" : "chat-sidebar"}>
        <div className="chat-brand">
          <Sparkles /> FITNESS AI <span className="tiny-badge">BETA</span>
        </div>
        <button className="button primary" onClick={fresh}>
          <Plus size={17} /> Nova conversa
        </button>
        <span className="eyebrow">SUAS CONVERSAS</span>
        <label className="check-label">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />{" "}
          Salvar histórico neste navegador
        </label>
        {remember &&
          history.map((c) => (
            <button
              key={c.id}
              className={`history-item ${conversation === c.id ? "active" : ""}`}
              onClick={() => {
                abort.current?.abort();
                setBusy(false);
                setConversation(c.id);
                setMessages(c.messages);
                setError("");
                setSidebar(false);
              }}
            >
              <MessageSquare size={15} />
              {c.title}
            </button>
          ))}
        {!history.length && (
          <p className="small">
            Suas conversas aparecem aqui quando o histórico está ativado.
          </p>
        )}
        {history.length > 0 && (
          <button
            className="text-button"
            onClick={() => {
              setHistory([]);
              fresh();
            }}
          >
            <Trash2 size={14} /> Limpar histórico
          </button>
        )}
        <div className="sidebar-bottom">
          <ShieldCheck size={20} />
          <p>
            Uma conversa sobre movimento.
            <br />
            No seu ritmo.
          </p>
          <Link href="/tecnologia" className="text-link">
            Nossa visão computacional <Arrow />
          </Link>
        </div>
      </aside>
      <div className="chat-main">
        <div className="chat-topbar">
          <button
            className="icon-button chat-menu"
            aria-label="Histórico e opções de conversa"
            onClick={() => setSidebar(!sidebar)}
          >
            <Menu size={17} />
          </button>
          <button
            className="icon-button chat-new"
            aria-label="Nova conversa"
            onClick={fresh}
          >
            <Plus size={17} />
          </button>
          <span>Conheça o Fitness Pro</span>
          <span className="pill">
            {configured === null
              ? "VERIFICANDO"
              : configured
                ? "API CONECTADA"
                : "CONFIGURAÇÃO PENDENTE"}
          </span>
        </div>
        <div
          className="chat-scroll"
          onScroll={(event) => {
            const e = event.currentTarget;
            followResponse.current =
              e.scrollHeight - e.scrollTop - e.clientHeight < 150;
          }}
        >
          {!messages.length ? (
            <div className="chat-welcome">
              <div className="ai-orb">
                <Sparkles size={40} />
              </div>
              <span className="eyebrow">
                TECNOLOGIA FICA MELHOR COM UMA BOA CONVERSA.
              </span>
              <h2>
                O próximo passo
                <br />
                começa com uma pergunta.
              </h2>
              <p>
                Conheça o aplicativo, explore sua tecnologia e tire suas
                dúvidas.
                <br />O que você quer descobrir sobre o Fitness Pro?
              </p>
              <div className="suggestions">
                {[
                  [
                    "Entender um exercício",
                    "Como executar o agachamento livre?",
                    Dumbbell,
                  ],
                  [
                    "Conhecer o projeto",
                    "O que é o Fitness Pro e quem desenvolve o projeto?",
                    Target,
                  ],
                  [
                    "Entender a tecnologia",
                    "Como funciona a visão computacional do aplicativo?",
                    Activity,
                  ],
                  [
                    "Encontrar informações",
                    "Onde encontro a equipe e as perguntas frequentes?",
                    ScanLine,
                  ],
                ].map(([title, prompt, Icon]) => (
                  <button
                    key={String(title)}
                    onClick={() => setInput(String(prompt))}
                  >
                    {typeof Icon !== "string" && <Icon size={20} />}
                    <strong>{String(title)}</strong>
                    <span>{String(prompt)}</span>
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((m, i) => (
                <div className={`message ${m.role}`} key={i}>
                  <span className="message-avatar">
                    {m.role === "assistant" ? (
                      <Sparkles size={17} />
                    ) : (
                      <User size={17} />
                    )}
                  </span>
                  <div className="message-content">
                    <span className="message-author">
                      {m.role === "assistant" ? "Fitness AI" : "Você"}
                    </span>
                    {m.content ? (
                      <Markdown>{m.content}</Markdown>
                    ) : (
                      <span className="typing">
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                    {m.role === "assistant" && m.content && (
                      <button
                        className="text-button"
                        aria-label="Copiar resposta"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(m.content);
                            setCopied(i);
                            setTimeout(() => setCopied(-1), 1800);
                          } catch {
                            setError(
                              "Não foi possível copiar neste navegador.",
                            );
                          }
                        }}
                      >
                        {copied === i ? (
                          <Check size={13} />
                        ) : (
                          <Copy size={13} />
                        )}{" "}
                        {copied === i ? "Copiado" : "Copiar"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={end} />
            </div>
          )}
        </div>
        <div className="chat-composer-area">
          {configured === false && (
            <div className="config-notice">
              <Settings2 size={17} />
              <span>
                <strong>A IA ainda precisa ser conectada.</strong> A conexão com
                o provedor ainda não foi configurada. Suas perguntas poderão ser
                enviadas quando a integração estiver ativa.
              </span>
            </div>
          )}
          {error && (
            <div className="error" role="alert">
              {error}{" "}
              {messages.length > 0 && (
                <button
                  className="text-button"
                  onClick={() => {
                    const last = messages.findLast((m) => m.role === "user");
                    if (last) {
                      const index = messages.findLastIndex(
                        (m) => m.role === "user",
                      );
                      setMessages(messages.slice(0, index));
                      setInput(last.content);
                      setError("");
                    }
                  }}
                >
                  Reformular e tentar novamente
                </button>
              )}
            </div>
          )}
          <form
            className="chat-composer"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <textarea
              aria-label="Sua mensagem"
              placeholder="O que você quer saber sobre o Fitness Pro?"
              maxLength={2000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <div>
              <span>
                <Sparkles size={14} /> Fitness AI{" "}
                <small>· {input.length}/2000</small>
              </span>
              {busy ? (
                <button
                  type="button"
                  className="send-button"
                  aria-label="Interromper resposta"
                  onClick={() => abort.current?.abort()}
                >
                  <Pause size={18} />
                </button>
              ) : (
                <button
                  className="send-button"
                  disabled={!input.trim() || configured === false}
                  aria-label="Enviar mensagem"
                >
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
          </form>
          <p className="chat-disclaimer">
            Informações educativas. Não substituem profissionais de saúde ou
            educação física.
          </p>
        </div>
      </div>
    </div>
  );
}
