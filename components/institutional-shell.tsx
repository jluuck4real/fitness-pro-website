"use client";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, ArrowRight, Menu, X, Zap, Sparkles } from "lucide-react";
import Link from "./site-link";
const links = [
  ["aplicativo", "O aplicativo"],
  ["missao", "Nossa missão"],
  ["funcionalidades", "Recursos"],
  ["tecnologia", "Tecnologia"],
  ["equipe", "Equipe"],
  ["faq", "FAQ"],
];
export function InstitutionBrand() {
  return (
    <Link href="/" className="inst-brand" aria-label="fitnesspro — Início">
      <span>
        <Zap size={24} fill="currentColor" />
      </span>
      <span>
        fitness<span className="inst-brand-light">pro</span>
        <i />
      </span>
    </Link>
  );
}
export default function InstitutionalShell({
  children,
  page = "home",
}: {
  children: ReactNode;
  page?: string;
}) {
  const [menu, setMenu] = useState(false),
    [active, setActive] = useState("");
  useEffect(() => {
    if (page !== "home") return;
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [page]);
  useEffect(() => {
    if (!menu) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [menu]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.remove("inst-reveal-pending");
            observer.unobserve(e.target);
          }
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((e) => {
      if (e.getBoundingClientRect().top > innerHeight) {
        e.classList.add("inst-reveal-pending");
        observer.observe(e);
      }
    });
    return () => {
      observer.disconnect();
      document
        .querySelectorAll(".inst-reveal-pending")
        .forEach((e) => e.classList.remove("inst-reveal-pending"));
    };
  }, [page]);
  return (
    <div className="institutional">
      <a href="#conteudo" className="inst-skip">
        Pular para o conteúdo
      </a>
      <header className="inst-header">
        <div className="inst-header-inner">
          <InstitutionBrand />
          <nav
            id="institutional-nav"
            aria-label="Navegação principal"
            className={menu ? "inst-nav is-open" : "inst-nav"}
          >
            {links.map(([id, label]) => {
              const home = [
                "aplicativo",
                "missao",
                "funcionalidades",
                "tecnologia",
              ].includes(id);
              return (
                <Link
                  key={id}
                  href={home ? `/#${id}` : `/${id}`}
                  onClick={() => setMenu(false)}
                  aria-current={
                    page === id || (page === "home" && active === id)
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/contato"
              className="inst-mobile-contact"
              onClick={() => setMenu(false)}
            >
              Contato
            </Link>
          </nav>
          <div className="inst-header-actions">
            <Link className="inst-ai-link" href="/assistente">
              <Sparkles size={15} />
              Explorar nossa IA
              <ArrowUpRight size={14} />
            </Link>
            <button
              type="button"
              className="inst-menu-button"
              aria-label={menu ? "Fechar menu" : "Abrir menu"}
              aria-controls="institutional-nav"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
      <main id="conteudo">{children}</main>
      <footer className="inst-footer">
        <div className="inst-footer-grid">
          <div>
            <InstitutionBrand />
            <p>
              Tecnologia para compreender.
              <br />
              Movimento para evoluir.
            </p>
            <span className="inst-footer-caption">
              FITNESS APP · PROJETO DE TCC
            </span>
          </div>
          <div>
            <h2>Conheça o projeto</h2>
            <Link href="/#aplicativo">Sobre o aplicativo</Link>
            <Link href="/#missao">Nossa missão</Link>
            <Link href="/#funcionalidades">Funcionalidades</Link>
          </div>
          <div>
            <h2>Explore</h2>
            <Link href="/#tecnologia">Visão computacional</Link>
            <Link href="/equipe">Nossa equipe</Link>
            <Link href="/assistente">Assistente do projeto</Link>
          </div>
          <div>
            <h2>Vamos conversar</h2>
            <Link href="/faq">Perguntas frequentes</Link>
            <Link href="/contato">
              Entre em contato <ArrowUpRight size={13} />
            </Link>
            <span>Projeto acadêmico em desenvolvimento.</span>
          </div>
        </div>
        <div className="inst-footer-bottom">
          <span>
            © {new Date().getFullYear()} Fitness Pro. Um projeto de João Lucas,
            Raul Dias e Renato Silva.
          </span>
          <Link href="/faq#privacidade">
            Privacidade e uso responsável <ArrowRight size={12} />
          </Link>
        </div>
      </footer>
      {page !== "assistente" && (
        <Link
          className="inst-floating-ai"
          href="/assistente"
          aria-label="Converse com a IA — assistente do Fitness Pro"
        >
          <Sparkles size={21} />
          <span>Converse com a IA</span>
          <span className="inst-online-dot" />
        </Link>
      )}
    </div>
  );
}
