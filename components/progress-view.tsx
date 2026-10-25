"use client";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Dumbbell,
  Clock,
  Flame,
  Target,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Profile, Session } from "@/lib/fitness-data";
import { Intro, Arrow, formatTime } from "./fitness-ui";
export default function Progress({
  sessions,
  profile,
  ready,
}: {
  sessions: Session[];
  profile: Profile;
  ready: boolean;
}) {
  const total = sessions.reduce((s, x) => s + x.seconds, 0);
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  const weekly = sessions.filter((s) => new Date(s.date) >= start).length;
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 13 + i);
    const key = d.toLocaleDateString("pt-BR");
    return {
      date: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      minutos: Math.round(
        sessions
          .filter((s) => new Date(s.date).toLocaleDateString("pt-BR") === key)
          .reduce((n, s) => n + s.seconds, 0) / 60,
      ),
    };
  });
  return (
    <>
      <Intro
        eyebrow="CADA SESSÃO CONTA"
        title={
          profile.name
            ? `${profile.name}, veja sua evolução.`
            : "Sua consistência tem forma."
        }
        description="Dados dos treinos que você concluiu neste navegador. Seu ponto de partida é tão importante quanto a chegada."
      />
      {!ready ? (
        <div className="skeleton" />
      ) : (
        <>
          <div className="stats-grid">
            {[
              [Dumbbell, sessions.length, "Sessões concluídas"],
              [Clock, `${Math.floor(total / 60)} min`, "Tempo acumulado"],
              [Flame, weekly, "Sessões nesta semana"],
              [
                Target,
                `${Math.min(weekly, profile.weeklyGoal)}/${profile.weeklyGoal}`,
                "Meta semanal",
              ],
            ].map(([Icon, n, label]) => (
              <div className="panel stat" key={String(label)}>
                {typeof Icon !== "string" && typeof Icon !== "number" && (
                  <Icon size={21} />
                )}
                <motion.strong
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {String(n)}
                </motion.strong>
                <span>{String(label)}</span>
              </div>
            ))}
          </div>
          <div className="progress-grid">
            <div className="panel chart-panel">
              <div className="section-heading compact">
                <div>
                  <span className="eyebrow">CONSISTÊNCIA EM MOVIMENTO</span>
                  <h3>Seu ritmo nos últimos 14 dias</h3>
                </div>
                <span className="pill">MINUTOS</span>
              </div>
              {sessions.length ? (
                <div style={{ height: 270, width: "100%" }}>
                  <ResponsiveContainer>
                    <AreaChart data={days} margin={{ right: 15, left: -20 }}>
                      <defs>
                        <linearGradient
                          id="progressfill"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop
                            offset="1"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e2c43" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#111e36",
                          border: "1px solid #263854",
                          borderRadius: 12,
                        }}
                      />
                      <Area
                        dataKey="minutos"
                        type="monotone"
                        stroke="#60a5fa"
                        fill="url(#progressfill)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="empty-chart">
                  <BarChart3 size={38} />
                  <h3>Seu gráfico começa com você.</h3>
                  <p>Conclua seu primeiro treino para ver seus dados aqui.</p>
                  <Link href="/treinos" className="text-link">
                    Encontrar meu primeiro treino <Arrow />
                  </Link>
                </div>
              )}
            </div>
            <div className="panel weekly-panel">
              <Target size={25} />
              <h3>Um passo de cada vez.</h3>
              <div
                className="goal-circle"
                style={{
                  background: `conic-gradient(var(--accent) ${Math.min(weekly / profile.weeklyGoal, 1) * 360}deg,#1a2840 0deg)`,
                }}
              >
                <span>
                  <strong>
                    {Math.round(Math.min(weekly / profile.weeklyGoal, 1) * 100)}
                    %
                  </strong>
                  da meta semanal
                </span>
              </div>
              <p>
                {weekly} de {profile.weeklyGoal} sessões nesta semana
              </p>
              <Link href="/perfil" className="text-link">
                Ajustar minha meta <Arrow />
              </Link>
            </div>
          </div>
          <div className="panel">
            <div className="section-heading compact">
              <h3>Seu histórico de treinos</h3>
              <span className="small">Salvo neste dispositivo</span>
            </div>
            {sessions.length ? (
              <div className="history-table">
                <div className="history-row table-head">
                  <span>Treino</span>
                  <span>Data</span>
                  <span>Tempo</span>
                  <span>Séries</span>
                </div>
                {[...sessions].reverse().map((s) => (
                  <div className="history-row" key={s.id}>
                    <strong>
                      <CheckCircle2 size={16} />
                      {s.name}
                    </strong>
                    <span>{new Date(s.date).toLocaleDateString("pt-BR")}</span>
                    <span>{formatTime(s.seconds)}</span>
                    <span>{s.sets}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-history">
                Nenhuma sessão concluída ainda. Seu próximo treino pode ser o
                primeiro.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
