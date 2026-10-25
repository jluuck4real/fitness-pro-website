"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import { features, project } from "@/lib/project-content";
export default function AppShowcase() {
  const [selected, setSelected] = useState(0);
  const f = features[selected];
  return (
    <div className="inst-showcase">
      <div
        className="inst-showcase-menu"
        role="tablist"
        aria-label="Funcionalidades do aplicativo"
        aria-orientation="vertical"
      >
        {features.map((item, i) => (
          <button
            role="tab"
            id={`feature-tab-${i}`}
            aria-selected={i === selected}
            aria-controls="feature-panel"
            tabIndex={i === selected ? 0 : -1}
            key={item.id}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const next =
                  (i + (e.key === "ArrowDown" ? 1 : -1) + features.length) %
                  features.length;
                setSelected(next);
                document.getElementById(`feature-tab-${next}`)?.focus();
              }
            }}
          >
            <span>0{i + 1}</span>
            <div>
              <strong>
                {
                  [
                    "Biblioteca de exercícios",
                    "Vídeos demonstrativos",
                    "Organização dos treinos",
                    "Acompanhamento de progresso",
                  ][i]
                }
              </strong>
              <small>
                {
                  [
                    "Conhecimento em cada movimento",
                    "Aprenda com referências visuais",
                    "Séries, tempo e descanso",
                    "Seu histórico no aplicativo",
                  ][i]
                }
              </small>
            </div>
            <ArrowUpRight size={18} />
          </button>
        ))}
      </div>
      <div
        className="inst-feature-panel"
        id="feature-panel"
        role="tabpanel"
        aria-labelledby={`feature-tab-${selected}`}
      >
        <div className="inst-feature-copy">
          <span className="inst-kicker">{f.label}</span>
          <h3>{f.title}</h3>
          <p>{f.description}</p>
          <ul>
            {f.tags.map((t) => (
              <li key={t}>
                <Check size={15} />
                {t}
              </li>
            ))}
          </ul>
          <span className="inst-feature-footnote">
            UM RECURSO DO APLICATIVO <ArrowRight size={15} />
          </span>
        </div>
        <div className="inst-feature-phone">
          <div className="inst-phone">
            <span className="inst-phone-camera" />
            <img
              key={f.screen}
              src={`/institutional/screens/${f.screen}.webp`}
              srcSet={`/institutional/screens/${f.screen}-small.webp 320w, /institutional/screens/${f.screen}.webp 520w`}
              sizes="(max-width:540px) 210px, 240px"
              width="520"
              height="987"
              alt={f.alt}
              loading="lazy"
            />
          </div>
          <span>CAPTURA REAL / FITNESS PRO</span>
        </div>
        <p className="inst-capture-note">{project.screenshots}</p>
      </div>
    </div>
  );
}
