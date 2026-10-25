"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, ScanLine, MoveUpRight } from "lucide-react";
const presets = {
  base: [
    [160, 60],
    [157, 90],
    [123, 108],
    [197, 108],
    [107, 170],
    [213, 170],
    [94, 228],
    [226, 228],
    [138, 218],
    [182, 218],
    [132, 301],
    [188, 301],
    [127, 375],
    [193, 375],
  ],
  lift: [
    [160, 60],
    [157, 90],
    [123, 108],
    [197, 108],
    [68, 93],
    [252, 93],
    [28, 57],
    [292, 57],
    [138, 218],
    [182, 218],
    [132, 301],
    [188, 301],
    [127, 375],
    [193, 375],
  ],
};
const connections = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [4, 6],
  [3, 5],
  [5, 7],
  [2, 8],
  [3, 9],
  [8, 9],
  [8, 10],
  [10, 12],
  [9, 11],
  [11, 13],
];
export default function PoseDemonstration({
  compact = false,
}: {
  compact?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null),
    [running, setRunning] = useState(false),
    [mode, setMode] = useState<"base" | "lift">("base");
  useEffect(() => {
    const svg = ref.current!;
    let visible = false;
    let tick = 0;
    let frame = 0;
    let last = 0;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) render(performance.now());
    });
    io.observe(svg);
    const circles = svg.querySelectorAll<SVGCircleElement>("[data-joint]"),
      lines = svg.querySelectorAll<SVGLineElement>("[data-connection]");
    function render(now: number) {
      if (visible && (!running || media.matches || now - last > 50)) {
        last = now;
        const t =
          running && !media.matches
            ? Math.sin(tick * 0.025) * 0.5 + 0.5
            : mode === "lift"
              ? 1
              : 0;
        const p = presets.base.map((a, i) => [
          a[0] + (presets.lift[i][0] - a[0]) * t,
          a[1] + (presets.lift[i][1] - a[1]) * t,
        ]);
        circles.forEach((c, i) => {
          c.setAttribute("cx", String(p[i][0]));
          c.setAttribute("cy", String(p[i][1]));
        });
        lines.forEach((l, i) => {
          const [a, b] = connections[i];
          l.setAttribute("x1", String(p[a][0]));
          l.setAttribute("y1", String(p[a][1]));
          l.setAttribute("x2", String(p[b][0]));
          l.setAttribute("y2", String(p[b][1]));
        });
        if (running && !media.matches) tick++;
      }
      if (visible && running && !media.matches)
        frame = requestAnimationFrame(render);
    }
    const preferenceChanged = () => {
      cancelAnimationFrame(frame);
      if (visible) render(performance.now());
    };
    media.addEventListener("change", preferenceChanged);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      media.removeEventListener("change", preferenceChanged);
    };
  }, [running, mode]);
  function pointer(e: React.PointerEvent<HTMLDivElement>) {
    if (
      innerWidth < 800 ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--pointer-x",
      `${((e.clientX - rect.left) / rect.width - 0.5) * 5}deg`,
    );
    e.currentTarget.style.setProperty(
      "--pointer-y",
      `${((e.clientY - rect.top) / rect.height - 0.5) * -4}deg`,
    );
  }
  return (
    <div
      className={`inst-pose ${compact ? "is-compact" : ""}`}
      onPointerMove={pointer}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--pointer-x", "0deg");
        e.currentTarget.style.setProperty("--pointer-y", "0deg");
      }}
    >
      <div className="inst-pose-top">
        <span>
          <ScanLine size={14} /> VISÃO COMPUTACIONAL
        </span>
        <span>DEMONSTRAÇÃO VISUAL</span>
      </div>
      <div className="inst-pose-scene">
        <div className="inst-pose-grid" />
        <svg
          ref={ref}
          viewBox="0 0 320 420"
          role="img"
          aria-label="Bonequinho com pontos corporais conectados, demonstrando o acompanhamento de um movimento de braços"
        >
          <defs>
            <linearGradient
              id={compact ? "pose-gradient-hero" : "pose-gradient-section"}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
          <g
            stroke={`url(#${compact ? "pose-gradient-hero" : "pose-gradient-section"})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            {connections.map(([a, b], i) => (
              <line
                data-connection
                key={i}
                x1={presets.base[a][0]}
                y1={presets.base[a][1]}
                x2={presets.base[b][0]}
                y2={presets.base[b][1]}
              />
            ))}
          </g>
          <ellipse
            cx="160"
            cy="52"
            rx="19"
            ry="25"
            fill="#2563eb0d"
            stroke="#60a5fa55"
          />
          <g fill="#93c5fd" stroke="#0b1c33" strokeWidth="2">
            {presets.base.map(([x, y], i) => (
              <circle data-joint key={i} cx={x} cy={y} r={i < 2 ? 5 : 6} />
            ))}
          </g>
          <g fill="#7d9abe" fontSize="8" fontFamily="Manrope">
            <text x="215" y="115">
              OMBRO
            </text>
            <text x="228" y="178">
              COTOVELO
            </text>
            <text x="204" y="305">
              JOELHO
            </text>
          </g>
          <path
            d="M220 108H244V85H282M222 175H268M194 301H252"
            stroke="#5476a45e"
            fill="none"
          />
          <ellipse
            cx="160"
            cy="398"
            rx="82"
            ry="9"
            fill="#2563eb0f"
            stroke="#2563eb33"
          />
        </svg>
        <span className="inst-pose-tag">
          <MoveUpRight size={13} /> Pontos → conexões → movimento
        </span>
      </div>
      <div className="inst-pose-controls">
        <button onClick={() => setRunning(!running)} aria-pressed={running}>
          {running ? <Pause size={13} /> : <Play size={13} />}{" "}
          {running ? "Pausar demonstração" : "Animar movimento"}
        </button>
        <button
          className={mode === "lift" ? "is-active" : ""}
          disabled={running}
          onClick={() => setMode(mode === "base" ? "lift" : "base")}
        >
          Mudar posição
        </button>
      </div>
      <p>Ilustração interativa. Sem câmera ou análise do visitante.</p>
    </div>
  );
}
