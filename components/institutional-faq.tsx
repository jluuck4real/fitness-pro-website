"use client";
import { useState } from "react";
import { Search, ArrowRight, Plus } from "lucide-react";
import { faqs } from "@/lib/project-content";
import InstitutionalShell from "./institutional-shell";
import Link from "./site-link";
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function InstitutionalFAQ() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("Todas");
  const filtered = faqs.filter(
    (q) =>
      (category === "Todas" || q.category === category) &&
      normalize(q.question + " " + q.answer).includes(normalize(query)),
  );
  return (
    <InstitutionalShell page="faq">
      <section className="inst-section inst-page-intro">
        <span className="inst-kicker">
          CLAREZA TAMBÉM É PARTE DA EXPERIÊNCIA
        </span>
        <h1>
          Boas perguntas.
          <br />
          <span>Respostas com transparência.</span>
        </h1>
        <p>
          Conheça o aplicativo, sua tecnologia e o estágio real do projeto. O
          que ainda não foi definido fica claro por aqui.
        </p>
      </section>
      <section
        className="inst-section inst-faq-page"
        aria-label="Perguntas frequentes"
      >
        <div className="inst-faq-toolbar">
          <label>
            <Search size={19} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar perguntas"
              placeholder="O que você quer saber?"
            />
          </label>
          <div
            className="inst-category-tabs"
            aria-label="Categorias de perguntas"
          >
            {["Todas", ...new Set(faqs.map((q) => q.category))].map((c) => (
              <button
                className={category === c ? "active" : ""}
                aria-pressed={category === c}
                key={c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <p className="inst-search-results" role="status">
          {filtered.length}{" "}
          {filtered.length === 1
            ? "pergunta encontrada"
            : "perguntas encontradas"}
        </p>
        <div className="inst-faq-list">
          {filtered.map((q) => (
            <details key={q.id} id={q.id}>
              <summary>
                <span>
                  <small>{q.category}</small>
                  {q.question}
                </span>
                <Plus size={20} />
              </summary>
              <div>
                <p>{q.answer}</p>
                {q.id === "contato" && (
                  <Link className="inst-text-link" href="/contato">
                    Ir para Contato <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
        {!filtered.length && (
          <div className="inst-empty">
            <Search size={30} />
            <h2>Vamos tentar outra pergunta?</h2>
            <p>Use uma palavra diferente ou remova os filtros.</p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery("");
                setCategory("Todas");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
        <div className="inst-faq-help">
          <SparkleMark />
          <div>
            <h2>A conversa pode continuar.</h2>
            <p>Explore o projeto com o nosso assistente.</p>
          </div>
          <Link className="button secondary" href="/assistente">
            Explorar nossa IA <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </InstitutionalShell>
  );
}
function SparkleMark() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m20 3 4 13 13 4-13 4-4 13-4-13L3 20l13-4L20 3Z"
        stroke="#60a5fa"
        strokeWidth="1.5"
      />
    </svg>
  );
}
