"use client";
import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
export function Arrow() {
  return <ArrowUpRight size={19} />;
}
export function Intro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function useLocal<T>(key: string, initial: T) {
  const [value, set] = useState<T>(initial),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem(key);
        if (saved) set(JSON.parse(saved));
      } catch {
        setError("Não foi possível recuperar os dados deste navegador.");
      }
      setReady(true);
    });
  }, [key]);
  function update(v: T) {
    set(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
      setError("");
    } catch {
      setError(
        "O navegador não permitiu salvar. Exporte seus registros antes de sair.",
      );
    }
  }
  return [value, update, ready, error] as const;
}

export function formatTime(s: number) {
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}
