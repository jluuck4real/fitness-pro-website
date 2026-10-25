"use client";
import "@/app/legacy.css";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "./site-link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Clock,
  Dumbbell,
  Menu,
  Pause,
  Play,
  Plus,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  User,
  X,
  Smartphone,
  CheckCircle2,
  Camera,
  Download,
  Settings2,
} from "lucide-react";
import BodyCloud from "./body-cloud";
import dynamic from "next/dynamic";
import { Intro, Arrow, useLocal, formatTime } from "./fitness-ui";
const PoseLab = dynamic(() => import("./pose-lab"), {
  loading: () => <div className="skeleton" />,
});
const Chat = dynamic(() => import("./fitness-chat"), {
  loading: () => <div className="skeleton" />,
});
const Progress = dynamic(() => import("./progress-view"), {
  loading: () => <div className="skeleton" />,
});
import {
  exercises,
  routines,
  defaultProfile,
  type Profile,
  type Session,
  type Exercise,
} from "@/lib/fitness-data";
const nav = [
  ["/", "Início"],
  ["/exercicios", "Exercícios"],
  ["/treinos", "Treinos"],
  ["/analise", "Análise corporal"],
  ["/progresso", "Meu progresso"],
];
function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
function Brand() {
  return (
    <Link href="/" className="brand" aria-label="FitnessPro início">
      <span className="brand-mark">
        <Activity size={25} />
      </span>
      fitness<span className="brand-light">pro</span>
      <span className="brand-dot" />
    </Link>
  );
}
export default function FitnessPlatform() {
  const path = usePathname(),
    [menu, setMenu] = useState(false);
  const [profile, setProfile, ready, storageError] = useLocal<Profile>(
    "fitnesspro.profile.v1",
    defaultProfile,
  );
  const [sessions, setSessions, , sessionError] = useLocal<Session[]>(
    "fitnesspro.sessions.v1",
    [],
  );
  const view = path.split("/")[1] || "home",
    id = path.split("/")[2];
  function record(s: Session) {
    setSessions([...sessions, s]);
  }
  const content =
    view === "home" ? (
      <Home reduced={profile.reducedMotion} />
    ) : view === "exercicios" ? (
      id ? (
        <ExerciseDetail id={id} />
      ) : (
        <Library />
      )
    ) : view === "treinos" ? (
      id ? (
        <Workout id={id} onComplete={record} />
      ) : (
        <Workouts />
      )
    ) : view === "assistente" ? (
      <Chat />
    ) : view === "analise" ? (
      <>
        <Intro
          eyebrow="INTELIGÊNCIA EM MOVIMENTO"
          title="Conheça seu movimento."
          description="Reconhecimento corporal real, diretamente no navegador. A mesma lógica do Fitness App, em uma nova experiência."
        />
        <PoseLab />
        <div className="info-strip">
          <ShieldCheck /> Câmera ativada apenas com sua permissão · Sem
          gravações · MediaPipe Pose
        </div>
      </>
    ) : view === "progresso" ? (
      <Progress sessions={sessions} profile={profile} ready={ready} />
    ) : view === "perfil" ? (
      <ProfilePage
        key={ready ? "loaded" : "loading"}
        profile={profile}
        save={setProfile}
        sessions={sessions}
        clear={() => setSessions([])}
      />
    ) : view === "sobre" ? (
      <About />
    ) : (
      <>
        <Intro
          eyebrow="404"
          title="Vamos voltar ao caminho?"
          description="Esta página não foi encontrada."
        />
        <Link className="button primary" href="/">
          Ir para o início <ArrowRight size={17} />
        </Link>
      </>
    );
  return (
    <MotionConfig reducedMotion={profile.reducedMotion ? "always" : "user"}>
      <div
        className={`site ${profile.accent === "cyan" ? "accent-cyan" : ""} ${profile.reducedMotion ? "reduce-motion" : ""}`}
      >
        <a href="#main" className="skip-link">
          Pular para o conteúdo
        </a>
        <header className="site-header">
          <div className="header-inner">
            <Brand />
            <nav
              aria-label="Navegação principal"
              className={menu ? "nav open" : "nav"}
            >
              {nav.map(([url, title]) => (
                <Link
                  key={url}
                  href={url}
                  onClick={() => setMenu(false)}
                  aria-current={
                    (url === "/" ? path === "/" : path.startsWith(url))
                      ? "page"
                      : undefined
                  }
                >
                  {title}
                </Link>
              ))}
              <Link
                className="mobile-profile"
                href="/perfil"
                onClick={() => setMenu(false)}
              >
                Meu perfil
              </Link>
            </nav>
            <div className="header-actions">
              <Link href="/assistente" className="ai-nav">
                <Sparkles size={15} /> Fitness AI{" "}
                <span className="tiny-badge">BETA</span>
              </Link>
              <Link
                href="/perfil"
                className="avatar"
                aria-label="Abrir meu perfil"
              >
                {profile.photo ? (
                  <img src={profile.photo} alt="" />
                ) : (
                  <User size={18} />
                )}
              </Link>
              <button
                className="icon-button menu-toggle"
                aria-label={menu ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                {menu ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </header>
        <main id="main" className={view === "home" ? "home-main" : "page-main"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
          {(storageError || sessionError) && (
            <p role="alert" className="error">
              {storageError || sessionError}
            </p>
          )}
        </main>
        <footer>
          <div className="footer-top">
            <div>
              <Brand />
              <p>
                Seu movimento. Sua evolução.
                <br />
                Uma nova perspectiva.
              </p>
            </div>
            <div>
              <span>EXPLORE</span>
              <Link href="/exercicios">Biblioteca de exercícios</Link>
              <Link href="/treinos">Planos de treino</Link>
              <Link href="/analise">Movement Lab</Link>
            </div>
            <div>
              <span>SEU ESPAÇO</span>
              <Link href="/assistente">Fitness AI</Link>
              <Link href="/progresso">Meu progresso</Link>
              <Link href="/perfil">Perfil e privacidade</Link>
            </div>
            <div>
              <span>O PROJETO</span>
              <Link href="/sobre">Sobre o Fitness App</Link>
              <Link href="/sobre#faq">Perguntas frequentes</Link>
              <span className="footer-status">
                <i /> Feito para se mover.
              </span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} FitnessPro · Blue Future Fitness
            </span>
            <span>
              Informação educativa. Evolua com orientação profissional.
            </span>
            <span>DESIGNED FOR YOUR NEXT.</span>
          </div>
        </footer>
        {view !== "assistente" && (
          <Link
            href="/assistente"
            className="floating-ai"
            aria-label="Conversar com Fitness AI"
          >
            <Sparkles size={21} />
            <span>Pergunte à AI</span>
            <i />
          </Link>
        )}
      </div>
    </MotionConfig>
  );
}
function Home({ reduced }: { reduced: boolean }) {
  const [tab, setTab] = useState("Movimento");
  return (
    <>
      <section className="hero">
        <div className="hero-grid-pattern" />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="hero-label">
              <span className="status-dot" /> A PRÓXIMA EVOLUÇÃO DO SEU TREINO{" "}
              <span className="label-line" />
            </div>
            <h1>
              Seu corpo.
              <br />
              Seu potencial.
              <br />
              <span>Sem limites.</span>
            </h1>
            <p>
              Tecnologia que entende o seu movimento.
              <br className="desktop-break" /> Treinos que acompanham a sua
              evolução.
            </p>
            <div className="hero-buttons">
              <Link href="/treinos" className="button primary">
                Começar minha jornada <ArrowRight size={18} />
              </Link>
              <Link href="/analise" className="button ghost">
                <span className="play-circle">
                  <Play size={13} fill="currentColor" />
                </span>
                Conhecer a tecnologia
              </Link>
            </div>
            <div className="hero-note">
              <ShieldCheck size={15} />
              <span>Seu ritmo. Seus dados. Seu próximo nível.</span>
            </div>
          </motion.div>
        </div>
        <div className="hero-visual">
          <div className="orbital orbit-one" />
          <div className="orbital orbit-two" />
          <div className="visual-coordinates">
            <span>HUMAN PERFORMANCE SYSTEM</span>
            <span>FP / 01</span>
          </div>
          <BodyCloud reduced={reduced} />
          <div className="body-badge badge-top">
            <span className="badge-icon">
              <ScanLine size={19} />
            </span>
            <div>
              <strong>Movimento, decodificado.</strong>
              <span>Inteligência em cada detalhe</span>
            </div>
            <i className="status-dot" />
          </div>
          <div className="body-badge badge-bottom">
            <div className="wave-icon">
              <Activity size={24} />
            </div>
            <div>
              <span>SEU POTENCIAL</span>
              <strong>Uma nova dimensão.</strong>
            </div>
            <ArrowUpRight size={18} />
          </div>
          <div className="visual-tabs">
            {["Movimento", "Precisão", "Evolução"].map((t, i) => (
              <button
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
                key={t}
              >
                <span>0{i + 1}</span>
                {t}
              </button>
            ))}
          </div>
          <div className="visual-caption">
            {tab === "Movimento"
              ? "VISUALIZAÇÃO 3D INTERATIVA · MOVA O CURSOR"
              : tab === "Precisão"
                ? "ANÁLISE REAL DISPONÍVEL NO MOVEMENT LAB"
                : "SESSÕES CONCLUÍDAS CONSTROEM SEU HISTÓRICO"}
          </div>
        </div>
        <a href="#explorar" className="scroll-cue">
          <ArrowDown size={14} /> EXPLORE SEU PRÓXIMO NÍVEL
        </a>
        <div className="hero-index">
          01 <span>/ 05</span>
        </div>
      </section>
      <div className="capability-ribbon">
        <span>
          <ScanLine />
          Reconhecimento corporal
        </span>
        <span>
          <Sparkles />
          Inteligência artificial
        </span>
        <span>
          <Dumbbell />
          Treinos com propósito
        </span>
        <span>
          <BarChart3 />
          Evolução de verdade
        </span>
        <span className="ribbon-end">
          TUDO CONECTADO A VOCÊ <ArrowUpRight size={15} />
        </span>
      </div>
      <section className="section" id="explorar">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">MENOS ACHISMO. MAIS EVOLUÇÃO.</span>
            <h2>
              O próximo nível
              <br />
              começa com <span>você.</span>
            </h2>
          </div>
          <p>
            Conheça seu corpo. Encontre seu ritmo.
            <br />
            Transforme cada treino em um passo à frente.
          </p>
        </Reveal>
        <div className="feature-grid">
          <Reveal className="feature feature-big">
            <div className="feature-image">
              <img
                loading="lazy"
                src={exercises[1].image}
                alt="Atleta em uma sessão de treinamento"
              />
              <div className="image-shade" />
              <span className="image-tag">
                <Dumbbell size={14} /> TRAIN WITH PURPOSE
              </span>
            </div>
            <div className="feature-content">
              <span className="eyebrow">01 / TREINAMENTO</span>
              <h3>
                Mais intenção.
                <br />
                Em cada repetição.
              </h3>
              <p>
                Explore os movimentos do Fitness App e organize uma rotina que
                faça sentido para você.
              </p>
              <Link href="/exercicios" className="text-link">
                Explorar exercícios <Arrow />
              </Link>
            </div>
          </Reveal>
          <Reveal className="feature feature-ai">
            <div className="feature-top">
              <span className="feature-icon">
                <Sparkles />
              </span>
              <span className="pill">FITNESS AI</span>
            </div>
            <h3>
              Uma boa pergunta.
              <br />
              Um novo caminho.
            </h3>
            <p>
              Um assistente para entender exercícios, explorar a biblioteca e
              conversar sobre sua rotina.
            </p>
            <div className="mini-chat">
              <span>
                <User size={13} /> Como organizar meus treinos?
              </span>
              <div>
                <Sparkles size={17} />
                <span>
                  Seu objetivo é o ponto de partida.
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <small>Exemplo de pergunta · Respostas dependem da API</small>
            </div>
            <Link href="/assistente" className="text-link">
              Conhecer meu assistente <Arrow />
            </Link>
          </Reveal>
          <Reveal className="feature feature-progress">
            <div className="feature-top">
              <span className="feature-icon">
                <BarChart3 />
              </span>
              <span className="pill">SEU PROGRESSO</span>
            </div>
            <h3>
              Consistência
              <br />
              que você enxerga.
            </h3>
            <p>
              Sessões, tempo e frequência. Sua evolução contada pelos treinos
              que você realmente fez.
            </p>
            <div className="decor-chart" aria-hidden="true">
              <svg viewBox="0 0 350 95">
                <defs>
                  <linearGradient id="chartfill" x1="0" x2="0" y1="0" y2="1">
                    <stop stopColor="#2563eb" stopOpacity=".35" />
                    <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 85 Q30 90 55 65 T110 69 T165 40 T220 50 T280 25 T350 5 V95 H0Z"
                  fill="url(#chartfill)"
                />
                <path
                  d="M0 85 Q30 90 55 65 T110 69 T165 40 T220 50 T280 25 T350 5"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                />
              </svg>
              <span>Ilustração · seus dados começam com o primeiro treino</span>
            </div>
            <Link href="/progresso" className="text-link">
              Acompanhar minha evolução <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>
      <section className="movement-section">
        <div className="movement-art">
          <div className="scan-corners" />
          <ScanLine className="giant-scan" />
          <div className="joint-map" aria-hidden="true">
            <svg viewBox="0 0 400 300">
              <path
                d="M200 40L200 95M125 100L275 100M125 100L95 170L60 220M275 100L305 170L340 220M200 95L200 175M160 175L240 175M160 175L140 245L120 290M240 175L260 245L280 290"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
              />
              {[
                [200, 40],
                [200, 95],
                [125, 100],
                [275, 100],
                [95, 170],
                [305, 170],
                [60, 220],
                [340, 220],
                [160, 175],
                [240, 175],
                [140, 245],
                [260, 245],
                [120, 290],
                [280, 290],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill="#93c5fd" />
              ))}
            </svg>
          </div>
          <span className="art-caption">
            MOVEMENT LAB / VISUALIZAÇÃO CONCEITUAL
          </span>
        </div>
        <Reveal className="movement-copy">
          <span className="eyebrow">SEU MOVIMENTO MERECE ATENÇÃO.</span>
          <h2>
            Não é só treinar.
            <br />É <span>se entender.</span>
          </h2>
          <p>
            Experimente o reconhecimento de pontos corporais pela câmera.
            Acompanhe ângulos articulares e conte repetições nos exercícios
            compatíveis.
          </p>
          <div className="tech-facts">
            <span>
              <CheckCircle2 /> Processamento no seu dispositivo
            </span>
            <span>
              <CheckCircle2 /> Regras adaptadas do Fitness App
            </span>
            <span>
              <CheckCircle2 /> Sua câmera, sob seu controle
            </span>
          </div>
          <Link href="/analise" className="button primary">
            Entrar no Movement Lab <ArrowRight size={17} />
          </Link>
        </Reveal>
      </section>
      <section className="section">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">
              SIMPLES PARA COMEÇAR. FEITO PARA CONTINUAR.
            </span>
            <h2>
              Do primeiro passo
              <br />
              ao próximo <span>objetivo.</span>
            </h2>
          </div>
          <Link href="/perfil" className="text-link">
            Personalizar minha jornada <Arrow />
          </Link>
        </Reveal>
        <div className="steps-grid">
          {[
            [
              "01",
              "Encontre seu foco",
              "Escolha seu objetivo e explore os movimentos que fazem parte da sua rotina.",
              Target,
            ],
            [
              "02",
              "Entre em movimento",
              "Inicie um treino, acompanhe as séries e dê atenção a cada execução.",
              Dumbbell,
            ],
            [
              "03",
              "Veja sua evolução",
              "Conclua a sessão e acompanhe a consistência que você está construindo.",
              BarChart3,
            ],
          ].map(([n, t, d, Icon]) => (
            <Reveal key={String(n)} className="step">
              <span className="step-num">{String(n)}</span>
              {typeof Icon !== "string" && <Icon size={26} />}
              <h3>{String(t)}</h3>
              <p>{String(d)}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="app-banner">
        <Smartphone size={50} />
        <div>
          <span className="eyebrow">
            DO FITNESS APP PARA UMA NOVA EXPERIÊNCIA.
          </span>
          <h2>
            A mesma essência.
            <br />
            Um novo universo de possibilidades.
          </h2>
          <p>
            Catálogo e identidade do aplicativo. Uma experiência criada para a
            web.
            <br />
            Os registros deste navegador são independentes do app.
          </p>
        </div>
        <Link href="/sobre" className="button secondary">
          Conhecer o projeto <Arrow />
        </Link>
      </section>
    </>
  );
}
function ExerciseCard({ e }: { e: Exercise }) {
  return (
    <Link className="exercise-card" href={`/exercicios/${e.id}`}>
      <div className="exercise-image">
        <img src={e.image} alt={e.name} loading="lazy" />
        <span className="pill">{e.muscle}</span>
        <span className="card-arrow">
          <Arrow />
        </span>
      </div>
      <div className="exercise-copy">
        <span className="eyebrow">{e.equipment}</span>
        <h3>{e.name}</h3>
        <div>
          <span>{e.level}</span>
          <span>
            <Play size={12} /> Ver execução
          </span>
        </div>
      </div>
    </Link>
  );
}
function Library() {
  const [search, setSearch] = useState(""),
    [muscle, setMuscle] = useState("Todos"),
    [equipment, setEquipment] = useState("Todos");
  const filtered = exercises.filter(
    (e) =>
      (muscle === "Todos" || e.muscle === muscle) &&
      (equipment === "Todos" || e.equipment === equipment) &&
      e.name
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          search
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
        ),
  );
  return (
    <>
      <Intro
        eyebrow="BIBLIOTECA DE MOVIMENTO"
        title="Conheça. Execute. Evolua."
        description="Os oito exercícios do Fitness App, com instruções e demonstrações para dar mais intenção ao seu treino."
      />
      <div className="library-tools">
        <label className="search-box">
          <Search size={18} />
          <input
            aria-label="Buscar exercícios"
            placeholder="Qual movimento você quer explorar?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="equipment-filter">
          <Settings2 size={17} />
          <select
            aria-label="Filtrar equipamento"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          >
            <option value="Todos">Todos os equipamentos</option>
            {[...new Set(exercises.map((e) => e.equipment))].map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="filter-tabs">
        {["Todos", ...new Set(exercises.map((e) => e.muscle))].map((t) => (
          <button
            key={t}
            className={muscle === t ? "active" : ""}
            onClick={() => setMuscle(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="result-line">
        <span>{filtered.length} movimentos encontrados</span>
        <span>CATÁLOGO FITNESS APP</span>
      </div>
      <div className="exercise-grid">
        {filtered.map((e) => (
          <Reveal key={e.id}>
            <ExerciseCard e={e} />
          </Reveal>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Search />
          <h3>Nenhum movimento encontrado.</h3>
          <p>Experimente outro nome ou remova os filtros.</p>
          <button
            className="button secondary"
            onClick={() => {
              setSearch("");
              setMuscle("Todos");
              setEquipment("Todos");
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </>
  );
}
function ExerciseDetail({ id }: { id: string }) {
  const e = exercises.find((e) => e.id === id);
  const [video, setVideo] = useState(false);
  if (!e)
    return (
      <Intro
        eyebrow="EXERCÍCIO"
        title="Movimento não encontrado."
        description="Volte à biblioteca para explorar os exercícios disponíveis."
      />
    );
  return (
    <>
      <Link href="/exercicios" className="back-link">
        ← Voltar à biblioteca
      </Link>
      <Intro
        eyebrow={`${e.muscle.toUpperCase()} / ${e.equipment.toUpperCase()}`}
        title={e.name}
        description={e.description}
      />
      <div className="detail-grid">
        <div>
          <div className="video-box">
            {video ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${e.videoId}`}
                title={`Demonstração de ${e.name}`}
                allow="encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img src={e.image} alt={e.name} />
                <button
                  className="button primary video-play"
                  onClick={() => setVideo(true)}
                >
                  <Play size={18} /> Assistir demonstração
                </button>
              </>
            )}
          </div>
          <a
            className="text-link video-external"
            href={`https://www.youtube.com/watch?v=${e.videoId}`}
            target="_blank"
            rel="noreferrer"
          >
            Vídeo indisponível aqui? Abrir no YouTube <Arrow />
          </a>
          <div className="panel">
            <span className="eyebrow">PASSO A PASSO</span>
            <h2>A execução faz a diferença.</h2>
            <ol className="instruction-list">
              {e.steps.map((s, i) => (
                <li key={s}>
                  <span>0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <aside>
          <div className="panel">
            <span className="feature-icon">
              <Dumbbell />
            </span>
            <h3>O movimento em foco</h3>
            <dl>
              <dt>Grupo muscular</dt>
              <dd>{e.muscle}</dd>
              <dt>Equipamento</dt>
              <dd>{e.equipment}</dd>
              <dt>Nível</dt>
              <dd>{e.level}</dd>
            </dl>
            <Link href="/treinos" className="button primary">
              Encontrar um treino <ArrowRight size={16} />
            </Link>
          </div>
          <div className="panel">
            <h3>
              <CheckCircle2 size={19} /> Atenção aos detalhes
            </h3>
            <p>{e.tips}</p>
            <h3>
              <Target size={19} /> Erros comuns
            </h3>
            <p>{e.errors}</p>
            <small>{e.source}</small>
          </div>
        </aside>
      </div>
      <div className="section-heading compact">
        <h2>Continue explorando.</h2>
        <Link href="/exercicios" className="text-link">
          Toda a biblioteca <Arrow />
        </Link>
      </div>
      <div className="exercise-grid related">
        {exercises
          .filter((x) => x.id !== id)
          .sort(
            (a, b) =>
              Number(b.muscle === e.muscle) - Number(a.muscle === e.muscle),
          )
          .slice(0, 3)
          .map((e) => (
            <ExerciseCard e={e} key={e.id} />
          ))}
      </div>
    </>
  );
}
function Workouts() {
  const [filter, setFilter] = useState("Todos");
  return (
    <>
      <Intro
        eyebrow="SEU PRÓXIMO DESAFIO"
        title="Treine com propósito."
        description="Escolha um ponto de partida. Ajuste as séries ao seu nível e construa uma rotina com orientação profissional."
      />
      <div className="filter-tabs">
        {["Todos", "CORPO INTEIRO", "MEMBROS SUPERIORES", "OMBROS + CORE"].map(
          (t) => (
            <button
              key={t}
              className={filter === t ? "active" : ""}
              onClick={() => setFilter(t)}
            >
              {t === "Todos" ? t : t.toLocaleLowerCase("pt-BR")}
            </button>
          ),
        )}
      </div>
      <div className="workout-grid">
        {routines
          .filter((r) => filter === "Todos" || r.tag === filter)
          .map((r, i) => (
            <Reveal key={r.id}>
              <Link href={`/treinos/${r.id}`} className="workout-card">
                <img src={r.image} alt="Ambiente de treinamento" />
                <div className="workout-overlay" />
                <div className="workout-card-top">
                  <span className="pill">PLANO 0{i + 1}</span>
                  <Arrow />
                </div>
                <div className="workout-card-copy">
                  <span className="eyebrow">{r.tag}</span>
                  <h2>{r.name}</h2>
                  <p>{r.description}</p>
                  <div>
                    <span>
                      <Clock size={15} /> ~{r.minutes} min
                    </span>
                    <span>
                      <Dumbbell size={15} />
                      {r.items.length} exercícios
                    </span>
                  </div>
                  <span className="button secondary">
                    Explorar treino <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
      </div>
      <div className="info-strip">
        <ShieldCheck /> Rotinas editoriais de referência, feitas com os
        exercícios reais do app. Não são prescrições personalizadas.
      </div>
      <div className="plan-prompt panel">
        <Sparkles />
        <div>
          <h3>Seu treino começa com uma boa conversa.</h3>
          <p>Explore seus objetivos e tire dúvidas com o Fitness AI.</p>
        </div>
        <Link href="/assistente" className="button secondary">
          Conversar <Arrow />
        </Link>
      </div>
    </>
  );
}
function Workout({
  id,
  onComplete,
}: {
  id: string;
  onComplete: (s: Session) => void;
}) {
  const r = routines.find((r) => r.id === id);
  const [items, setItems, , planError] = useLocal(
    `fitnesspro.plan.${id}.v1`,
    r?.items || [],
  );
  const [running, setRunning] = useState(false),
    [started, setStarted] = useState(false),
    [elapsed, setElapsed] = useState(0),
    [done, setDone] = useState<string[]>([]),
    [saved, setSaved] = useState(false),
    [rest, setRest] = useState(0);
  const anchor = useRef(0),
    base = useRef(0);
  useEffect(() => {
    if (!running) return;
    anchor.current = Date.now();
    const timer = setInterval(
      () =>
        setElapsed(
          base.current + Math.floor((Date.now() - anchor.current) / 1000),
        ),
      250,
    );
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (rest <= 0 || !running) return;
    const timer = setTimeout(() => setRest(rest - 1), 1000);
    return () => clearTimeout(timer);
  }, [rest, running]);
  if (!r)
    return (
      <Intro
        eyebrow="TREINO"
        title="Plano não encontrado."
        description="Selecione uma das rotinas disponíveis."
      />
    );
  const total = items.reduce((s, e) => s + e.sets, 0);
  const toggle = () => {
    if (running) {
      base.current = elapsed;
      setRunning(false);
    } else {
      setStarted(true);
      setRunning(true);
    }
  };
  function finish() {
    if (saved || !r) return;
    base.current = elapsed;
    setRunning(false);
    onComplete({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name: r.name,
      seconds: elapsed,
      sets: done.length,
    });
    setSaved(true);
  }
  return (
    <>
      <Link href="/treinos" className="back-link">
        ← Todos os treinos
      </Link>
      <Intro
        eyebrow={`${r.tag} / ${r.level.toUpperCase()}`}
        title={r.name}
        description={r.description}
      />
      <div className="workout-detail">
        <div>
          <div className="info-strip">
            <ShieldCheck /> Faça um aquecimento adequado. Séries e repetições
            são referências; ajuste com orientação.
          </div>
          <p className="small plan-help">
            Personalize séries e repetições antes de iniciar. Seus ajustes são
            salvos neste navegador.
          </p>
          {planError && (
            <p className="error" role="alert">
              {planError}
            </p>
          )}
          {items.map((item) => {
            const e = exercises.find((x) => x.id === item.id)!;
            return (
              <div className="session-exercise panel" key={item.id}>
                <img src={e.image} alt="" />
                <div>
                  <Link href={`/exercicios/${e.id}`}>
                    <h3>
                      {e.name} <ArrowUpRight size={15} />
                    </h3>
                  </Link>
                  <p>
                    {item.sets} séries · {item.reps} repetições
                    {item.id === "prancha" ? " / tempo" : ""}
                  </p>
                  {!started && (
                    <div className="plan-edit">
                      <label>
                        Séries
                        <select
                          aria-label={`Séries de ${e.name}`}
                          value={item.sets}
                          onChange={(event) =>
                            setItems(
                              items.map((x) =>
                                x.id === item.id
                                  ? { ...x, sets: Number(event.target.value) }
                                  : x,
                              ),
                            )
                          }
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option value={n} key={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Repetições / tempo
                        <input
                          aria-label={`Repetições de ${e.name}`}
                          maxLength={30}
                          value={item.reps}
                          onChange={(event) =>
                            setItems(
                              items.map((x) =>
                                x.id === item.id
                                  ? { ...x, reps: event.target.value }
                                  : x,
                              ),
                            )
                          }
                        />
                      </label>
                    </div>
                  )}
                  <div className="set-buttons">
                    {Array.from({ length: item.sets }, (_, i) => {
                      const k = `${item.id}-${i}`,
                        checked = done.includes(k);
                      return (
                        <button
                          key={k}
                          aria-pressed={checked}
                          disabled={!started || saved}
                          className={checked ? "done" : ""}
                          onClick={() => {
                            setDone(
                              checked
                                ? done.filter((d) => d !== k)
                                : [...done, k],
                            );
                            if (!checked) setRest(60);
                          }}
                        >
                          {checked ? <Check size={14} /> : i + 1} Série {i + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <aside className="panel timer-panel">
          <span className="eyebrow">SEU TEMPO, SEU RITMO.</span>
          <div className="timer">{formatTime(elapsed)}</div>
          <p>
            {saved
              ? "Sessão registrada"
              : running
                ? "Treino em andamento"
                : started
                  ? "Treino pausado"
                  : "Tudo pronto para começar?"}
          </p>
          <div className="progress-track">
            <span style={{ width: `${(done.length / total) * 100}%` }} />
          </div>
          <span className="small">
            {done.length} de {total} séries concluídas
          </span>
          <button className="button primary" disabled={saved} onClick={toggle}>
            {running ? <Pause size={18} /> : <Play size={18} />}{" "}
            {running
              ? "Pausar"
              : started
                ? "Continuar treino"
                : "Iniciar treino"}
          </button>
          {started && !saved && (
            <div className="rest-box">
              <Clock size={17} />
              <span>
                {rest > 0
                  ? `Descanso · ${formatTime(rest)}`
                  : "Pronto para a próxima série"}
              </span>
              <button onClick={() => setRest(0)} className="text-button">
                Pular
              </button>
            </div>
          )}
          <button
            className="button secondary"
            disabled={done.length !== total || saved || elapsed < 1}
            onClick={finish}
          >
            <CheckCircle2 size={17} />{" "}
            {saved ? "Treino salvo" : "Concluir e salvar"}
          </button>
          {saved ? (
            <Link href="/progresso" className="text-link">
              Ver meu progresso <Arrow />
            </Link>
          ) : (
            <p className="small">
              Marque cada série realizada. O treino só será registrado ao
              concluir todas as séries.
            </p>
          )}
          <p className="small">
            Registros salvos apenas neste navegador. O cronômetro pausa quando
            você pausa o treino.
          </p>
        </aside>
      </div>
    </>
  );
}
function ProfilePage({
  profile,
  save,
  sessions,
  clear,
}: {
  profile: Profile;
  save: (p: Profile) => void;
  sessions: Session[];
  clear: () => void;
}) {
  const [draft, setDraft] = useState(profile),
    [notice, setNotice] = useState(""),
    [confirm, setConfirm] = useState(false);
  function exportData() {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { profile, sessions, exportedAt: new Date().toISOString() },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "fitnesspro-meus-dados.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <Intro
        eyebrow="SEU ESPAÇO"
        title="A sua melhor versão é sua."
        description="Personalize sua jornada. Suas preferências e seus registros ficam neste navegador, sem publicação em páginas públicas."
      />
      <form
        className="profile-grid"
        onSubmit={(e) => {
          e.preventDefault();
          save(draft);
          setNotice("Preferências atualizadas.");
        }}
      >
        <div className="panel profile-summary">
          <div className="profile-photo">
            {draft.photo ? (
              <img src={draft.photo} alt="Sua foto de perfil" />
            ) : (
              <User size={42} />
            )}
          </div>
          <h2>{draft.name || "Seu próximo nível"}</h2>
          <p>{draft.goal}</p>
          <label className="button secondary">
            <Camera size={16} /> Alterar foto
            <input
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (
                  !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
                  f.size > 1024 * 1024
                ) {
                  setNotice("Escolha JPG, PNG ou WebP de até 1 MB.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () =>
                  setDraft({ ...draft, photo: String(reader.result) });
                reader.readAsDataURL(f);
              }}
            />
          </label>
          {draft.photo && (
            <button
              type="button"
              className="text-button"
              onClick={() => setDraft({ ...draft, photo: "" })}
            >
              Remover foto
            </button>
          )}
          <div className="profile-badges">
            <span>
              <Dumbbell size={17} />
              {sessions.length} sessões registradas
            </span>
            <span>
              <ShieldCheck size={17} />
              Perfil local e privado
            </span>
          </div>
        </div>
        <div className="panel profile-form">
          <h3>Sua jornada, suas escolhas.</h3>
          <label>
            Como podemos chamar você?
            <input
              maxLength={50}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Seu nome"
              autoComplete="given-name"
            />
          </label>
          <label>
            Seu objetivo
            <select
              value={draft.goal}
              onChange={(e) => setDraft({ ...draft, goal: e.target.value })}
            >
              {[
                "Criar consistência",
                "Ganhar força",
                "Melhorar condicionamento",
                "Desenvolver mobilidade",
              ].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label>
            Meta semanal de sessões
            <input
              type="number"
              min={1}
              max={14}
              required
              value={draft.weeklyGoal}
              onChange={(e) =>
                setDraft({ ...draft, weeklyGoal: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Personalização visual
            <select
              value={draft.accent}
              onChange={(e) => setDraft({ ...draft, accent: e.target.value })}
            >
              <option value="blue">Electric Blue</option>
              <option value="cyan">Future Cyan</option>
            </select>
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={draft.reducedMotion}
              onChange={(e) =>
                setDraft({ ...draft, reducedMotion: e.target.checked })
              }
            />{" "}
            Reduzir animações e movimento
          </label>
          <button className="button primary" type="submit">
            Salvar preferências <Check size={17} />
          </button>
          <p role="status" className="notice">
            {notice}
          </p>
        </div>
      </form>
      <div className="panel privacy-panel">
        <ShieldCheck />
        <div>
          <h3>Seus dados pertencem a você.</h3>
          <p>
            Os dados ficam no armazenamento deste navegador, sem sincronização
            com o aplicativo. Em um dispositivo compartilhado, outras pessoas
            com acesso ao navegador podem vê-los. Exporte seus registros antes
            de limpar os dados do navegador.
          </p>
        </div>
        <button className="button secondary" onClick={exportData}>
          <Download size={16} /> Exportar dados
        </button>
        <button className="text-button danger" onClick={() => setConfirm(true)}>
          <Trash2 size={15} /> Apagar histórico de treinos
        </button>
      </div>
      {confirm && (
        <div className="modal-backdrop">
          <div
            className="panel modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <h2 id="delete-title">Apagar os treinos registrados?</h2>
            <p>
              Essa ação remove o histórico de treinos deste navegador. Exporte
              seus dados antes de continuar.
            </p>
            <button
              autoFocus
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              Cancelar
            </button>
            <button
              className="button danger-button"
              onClick={() => {
                clear();
                setConfirm(false);
                setNotice("Histórico de treinos apagado.");
              }}
            >
              Apagar histórico
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function About() {
  return (
    <>
      <Intro
        eyebrow="UM PROJETO EM MOVIMENTO"
        title="Do app para o seu próximo nível."
        description="FitnessPro conecta treinamento e reconhecimento corporal. Esta plataforma mantém a identidade e os dados do Fitness App com uma experiência própria para a web."
      />
      <div className="about-grid">
        <div className="panel">
          <Smartphone size={30} />
          <h2>A essência do Fitness App.</h2>
          <p>
            A paleta Blue Future e os oito exercícios, instruções e links de
            vídeo foram importados do projeto Flutter original.
          </p>
          <p>
            O aplicativo utiliza Google ML Kit para detecção corporal. Na web, o
            MediaPipe Pose permite detectar os pontos no navegador, adaptando a
            lógica de cálculo de ângulos.
          </p>
        </div>
        <div className="panel">
          <ScanLine size={30} />
          <h2>Tecnologia com transparência.</h2>
          <p>
            Agachamento, rosca e elevação lateral têm contagem real por limiares
            angulares e confirmação em três observações. A análise é uma
            estimativa 2D experimental, sem avaliação clínica de postura.
          </p>
          <p>
            A escultura de partículas da Home é uma visualização artística. O
            assistente depende de uma API configurada; o histórico de treinos
            começa vazio.
          </p>
        </div>
      </div>
      <div id="faq" className="faq">
        <span className="eyebrow">PERGUNTAS FREQUENTES</span>
        <h2>Antes do próximo passo.</h2>
        {[
          [
            "Meus dados são sincronizados com o aplicativo?",
            "Ainda não. O perfil, as preferências e os treinos são salvos apenas neste navegador. Você pode exportar seus registros no perfil.",
          ],
          [
            "Preciso permitir acesso à câmera?",
            "Apenas ao usar o Movement Lab. A câmera só é ativada após sua ação e a permissão do navegador. Os frames são processados localmente.",
          ],
          [
            "O Fitness AI substitui um profissional?",
            "Não. O assistente fornece informações educativas e usa o catálogo de exercícios como contexto. Prescrição individual, diagnóstico e reabilitação exigem profissionais habilitados.",
          ],
          [
            "Por que a IA mostra configuração pendente?",
            "Uma chave GEMINI_API_KEY precisa estar configurada apenas no servidor. Sem ela, o site não gera respostas artificiais para simular uma conexão.",
          ],
          [
            "O que fazer quando um vídeo não carrega?",
            "Use o link “Abrir no YouTube” disponível na página de cada exercício. A incorporação depende das permissões do autor do vídeo.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Plus size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
