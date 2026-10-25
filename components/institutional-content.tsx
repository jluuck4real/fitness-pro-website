/* eslint-disable @next/next/no-img-element */
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Zap,
  ScanLine,
  Dumbbell,
  BookOpen,
  Target,
  ShieldCheck,
  HeartHandshake,
  Layers,
  Smartphone,
  Camera,
  GitBranch,
  MoveUpRight,
  Sparkles,
  Check,
} from "lucide-react";
import InstitutionalShell from "./institutional-shell";
import PoseDemonstration from "./pose-demonstration";
import AppShowcase from "./app-showcase";
import Link from "./site-link";
import { team, faqs } from "@/lib/project-content";
export function SectionHeading({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="inst-section-heading" data-reveal>
      <div>
        <span className="inst-kicker">{label}</span>
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}
export function TeamSection({ full = false }: { full?: boolean }) {
  const MemberHeading = full ? "h2" : "h3";
  return (
    <section
      className={`inst-team inst-section ${full ? "inst-team-full" : ""}`}
      id="equipe"
    >
      <div className="inst-team-heading" data-reveal>
        <span className="inst-kicker">QUEM FAZ ACONTECER</span>
        <h2>
          Pessoas por trás
          <br />
          do <span>movimento.</span>
        </h2>
        <p>
          Três perspectivas. Um projeto em comum.
          <br />
          Conheça a equipe que conecta desenvolvimento, design e pesquisa no
          Fitness Pro.
        </p>
      </div>
      <div className="inst-team-grid">
        {team.map((p, i) => (
          <article
            className="inst-member"
            key={p.name}
            data-reveal
            style={{ "--reveal-delay": `${i * 75}ms` } as React.CSSProperties}
          >
            <div className="inst-member-image">
              <img
                src={p.image}
                alt={`Retrato de ${p.name}, integrante da equipe Fitness Pro`}
                width="680"
                height="850"
                loading={full && i === 0 ? "eager" : "lazy"}
                fetchPriority={full && i === 0 ? "high" : "auto"}
                style={{ objectPosition: p.position }}
              />
              <div className="inst-member-shade" />
              <span className="inst-member-role">{p.role}</span>
              <span className="inst-member-index">0{i + 1}</span>
              <MemberHeading className="inst-member-name">
                {p.name.split(" ")[0]}
                <br />
                {p.name.split(" ").slice(1).join(" ")}
              </MemberHeading>
            </div>
            <div className="inst-member-details">
              <span>{p.area}</span>
              <p>{p.description}</p>
            </div>
          </article>
        ))}
      </div>
      {full ? (
        <p className="inst-source-note">
          Nomes confirmados na seção “Sobre” do aplicativo. Responsabilidades e
          retratos do site original. Links profissionais ainda não fornecidos.
        </p>
      ) : (
        <Link className="inst-text-link inst-team-link" href="/equipe">
          Conheça nossa equipe <ArrowUpRight size={17} />
        </Link>
      )}
    </section>
  );
}
export function AboutSection() {
  return (
    <section className="inst-section inst-about" id="aplicativo">
      <div className="inst-about-visual" data-reveal>
        <div className="inst-about-grid" />
        <div className="inst-phone inst-about-phone">
          <span className="inst-phone-camera" />
          <img
            src="/institutional/screens/exercises.webp"
            width="520"
            height="987"
            alt="Biblioteca real do Fitness Pro, com busca, grupos musculares e instruções"
            loading="lazy"
          />
        </div>
        <div className="inst-about-tag">
          <BookOpen size={23} />
          <div>
            <strong>Conhecimento que acompanha.</strong>
            <span>Do primeiro contato à próxima sessão.</span>
          </div>
        </div>
        <span className="inst-capture-label">
          INTERFACE REAL DO APLICATIVO · AMBIENTE DE TESTES
        </span>
      </div>
      <div className="inst-about-copy" data-reveal>
        <span className="inst-kicker">O QUE É O FITNESS APP?</span>
        <h2>
          Mais clareza.
          <br />
          Mais intenção.
          <br />
          <span>Em cada treino.</span>
        </h2>
        <p>
          Fitness Pro é um aplicativo desenvolvido como projeto de TCC para
          reunir exercícios, organização de treinos e acompanhamento de
          progresso em uma experiência educativa.
        </p>
        <p>
          O ponto de partida é uma necessidade concreta: compreender melhor o
          que fazer durante o treino. Instruções, vídeos e uma análise corporal
          experimental ajudam a explorar os movimentos com mais informação.
        </p>
        <div className="inst-about-principles">
          <span>
            <BookOpen size={17} />
            Aprender a execução
          </span>
          <span>
            <Target size={17} />
            Organizar a rotina
          </span>
          <span>
            <ScanLine size={17} />
            Explorar o movimento
          </span>
        </div>
        <Link href="/#funcionalidades" className="inst-text-link">
          Conheça o aplicativo por dentro <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
export function MissionSection() {
  return (
    <section className="inst-mission" id="missao">
      <div className="inst-section inst-mission-inner">
        <div className="inst-manifesto" data-reveal>
          <span className="inst-kicker">O QUE NOS COLOCA EM MOVIMENTO</span>
          <h2>
            Tecnologia com
            <br />
            um propósito.
            <br />
            <span>Você no centro.</span>
          </h2>
          <div className="inst-editorial-label">
            <span /> PROPOSTA INSTITUCIONAL
          </div>
          <p>
            Missão, visão e valores apresentados como propostas editoriais,
            preparadas para validação pela equipe.
          </p>
        </div>
        <div className="inst-mission-content">
          <article data-reveal>
            <span>01 / NOSSA MISSÃO</span>
            <h3>Tornar o conhecimento parte do treino.</h3>
            <p>
              Aproximar treinamento físico, educação e tecnologia para ajudar as
              pessoas a compreender melhor os exercícios e organizar sua
              experiência de treino.
            </p>
          </article>
          <article data-reveal>
            <span>02 / NOSSA VISÃO</span>
            <h3>Um futuro mais intuitivo para se movimentar.</h3>
            <p>
              Explorar o encontro entre inteligência artificial e atividade
              física para construir experiências que informam, orientam e
              valorizam a autonomia de cada pessoa.
            </p>
          </article>
        </div>
        <div className="inst-values" data-reveal>
          <div>
            <HeartHandshake size={22} />
            <h3>Acessibilidade</h3>
            <p>Informação clara e interfaces que acolhem.</p>
          </div>
          <div>
            <Zap size={22} />
            <h3>Inovação com propósito</h3>
            <p>Tecnologia aplicada a necessidades reais.</p>
          </div>
          <div>
            <ShieldCheck size={22} />
            <h3>Educação responsável</h3>
            <p>Respeito aos limites e à orientação profissional.</p>
          </div>
          <div>
            <Layers size={22} />
            <h3>Evolução e qualidade</h3>
            <p>Cuidado com a informação e com a experiência.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function TechnologySection() {
  return (
    <section className="inst-section inst-technology" id="tecnologia">
      <SectionHeading
        label="VISÃO COMPUTACIONAL / INTELIGÊNCIA EM MOVIMENTO"
        title="Quando o movimento vira informação."
        text="No aplicativo, a câmera abre uma nova perspectiva sobre o exercício. Veja o caminho entre a imagem e o acompanhamento das repetições."
      />
      <div className="inst-technology-grid">
        <PoseDemonstration />
        <div className="inst-tech-flow">
          {[
            [
              Camera,
              "A imagem é o começo.",
              "A câmera captura os movimentos no aplicativo móvel, após permissão.",
            ],
            [
              GitBranch,
              "Pontos que contam uma história.",
              "O Google ML Kit identifica articulações e pontos corporais no dispositivo.",
            ],
            [
              MoveUpRight,
              "Geometria em movimento.",
              "O analisador calcula ângulos e reconhece fases nos exercícios compatíveis.",
            ],
            [
              Check,
              "Uma leitura do seu movimento.",
              "Regras experimentais acompanham amplitude e repetições, com feedback na tela.",
            ],
          ].map(([Icon, title, description], i) => (
            <article key={String(title)} data-reveal>
              <span className="inst-flow-icon">
                {typeof Icon !== "string" && <Icon size={20} />}
              </span>
              <div>
                <span>0{i + 1}</span>
                <h3>{String(title)}</h3>
                <p>{String(description)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="inst-tech-bottom">
        <div>
          <span className="inst-kicker">IMPLEMENTAÇÃO NO APLICATIVO</span>
          <p>
            Regras experimentais para agachamento, roscas, desenvolvimento e
            elevação lateral. A regra abdominal se aplica a movimentos dinâmicos
            compatíveis, não à prancha.
          </p>
        </div>
        <div>
          <ShieldCheck size={21} />
          <p>
            Processamento local. O app não grava a câmera. Estimativas 2D
            dependem do enquadramento e não substituem avaliação profissional ou
            validação em aparelho físico.
          </p>
        </div>
      </div>
    </section>
  );
}
export function FeaturesSection() {
  return (
    <section className="inst-section inst-features" id="funcionalidades">
      <SectionHeading
        label="POR DENTRO DO FITNESS PRO"
        title="Pensado para acompanhar sua jornada."
        text="Conheça os recursos existentes no aplicativo. Toque nas opções para explorar as telas reais do projeto."
      />
      <AppShowcase />
    </section>
  );
}
export default function InstitutionalHome() {
  return (
    <InstitutionalShell>
      <section className="inst-hero" id="inicio">
        <div className="inst-hero-grid" />
        <div className="inst-hero-copy">
          <span className="inst-kicker">
            <span className="inst-online-dot" /> FITNESS PRO · O FITNESS APP DO
            NOSSO TCC
          </span>
          <h1>
            Entenda o<br />
            movimento.
            <br />
            <span>
              Transforme
              <br className="inst-mobile-break" /> seu treino.
            </span>
          </h1>
          <p>
            Um aplicativo que conecta exercícios, conhecimento e visão
            computacional. Para colocar mais consciência em cada repetição.
          </p>
          <div className="inst-hero-actions">
            <Link href="/#aplicativo" className="button primary">
              Conheça o aplicativo <ArrowRight size={18} />
            </Link>
            <Link href="/assistente" className="button inst-ghost">
              <span>
                <Sparkles size={16} />
              </span>
              Explorar nossa IA
            </Link>
          </div>
          <div className="inst-hero-byline">
            <span className="inst-mini-logo">
              <Zap size={12} fill="currentColor" />
            </span>
            <span>
              Um projeto de tecnologia.
              <br />
              <strong>Feito por pessoas, para pessoas.</strong>
            </span>
          </div>
        </div>
        <div className="inst-hero-showcase">
          <div className="inst-hero-orbit" />
          <div className="inst-hero-orbit inst-orbit-second" />
          <span className="inst-hero-coordinate">
            INTERFACE + INTELIGÊNCIA + MOVIMENTO
          </span>
          <div className="inst-hero-phone inst-phone">
            <span className="inst-phone-camera" />
            <img
              src="/institutional/screens/onboarding.webp"
              srcSet="/institutional/screens/onboarding-small.webp 320w, /institutional/screens/onboarding.webp 520w"
              sizes="(max-width:540px) 205px, 270px"
              width="520"
              height="987"
              fetchPriority="high"
              alt="Tela real de apresentação do Fitness Pro: Seu treino, sua evolução"
            />
          </div>
          <div className="inst-hero-pose">
            <PoseDemonstration compact />
          </div>
          <div className="inst-hero-app-label">
            <span>
              <Smartphone size={17} />
            </span>
            <div>
              <strong>Fitness Pro</strong>
              <span>O aplicativo. Uma nova perspectiva.</span>
            </div>
            <ArrowUpRight size={17} />
          </div>
          <span className="inst-hero-real-label">
            CAPTURA REAL DO APLICATIVO
          </span>
        </div>
        <a className="inst-scroll-link" href="#aplicativo">
          <ArrowDown size={14} /> DESCUBRA O QUE NOS MOVE
        </a>
        <span className="inst-hero-edition">BLUE FUTURE / FITNESS APP</span>
      </section>
      <div className="inst-ribbon">
        <span>
          <BookOpen size={17} />
          Conhecimento aplicado
        </span>
        <span>
          <Dumbbell size={17} />
          Organização de treinos
        </span>
        <span>
          <ScanLine size={17} />
          Visão computacional
        </span>
        <span>
          <ShieldCheck size={17} />
          Tecnologia responsável
        </span>
      </div>
      <AboutSection />
      <MissionSection />
      <FeaturesSection />
      <TechnologySection />
      <section className="inst-conversation-band">
        <div className="inst-section">
          <span className="inst-band-symbol">
            <Sparkles size={38} />
          </span>
          <div data-reveal>
            <span className="inst-kicker">DÊ ESPAÇO PARA A CURIOSIDADE</span>
            <h2>
              Uma boa pergunta
              <br />
              pode ser o próximo passo.
            </h2>
            <p>
              Converse sobre exercícios, conheça o projeto e descubra
              <br />
              onde encontrar o que você procura no site.
            </p>
          </div>
          <Link href="/assistente" className="button primary">
            Conversar com a IA <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <TeamSection />
      <section className="inst-section inst-home-faq">
        <SectionHeading
          label="ANTES DO PRÓXIMO PASSO"
          title="Perguntas que fazem parte da jornada."
          text="Tecnologia fica melhor quando é fácil de entender. Comece pelas dúvidas mais frequentes."
        />
        <div className="inst-faq-preview">
          {faqs
            .filter((q) =>
              ["o-que-e", "ia", "android", "gratuito"].includes(q.id),
            )
            .map((q) => (
              <details key={q.id}>
                <summary>
                  {q.question}
                  <span>+</span>
                </summary>
                <div>
                  <p>{q.answer}</p>
                </div>
              </details>
            ))}
        </div>
        <Link className="inst-text-link" href="/faq">
          Todas as perguntas <ArrowUpRight size={18} />
        </Link>
      </section>
      <section className="inst-contact-banner inst-section" id="contato">
        <div>
          <span className="inst-kicker">O PROJETO CONTINUA NA CONVERSA</span>
          <h2>
            Vamos construir
            <br />o próximo movimento?
          </h2>
          <p>
            Ideias, dúvidas ou interesse pelo projeto.
            <br />
            Esse espaço é para começar uma conversa.
          </p>
        </div>
        <Link className="button primary" href="/contato">
          Fale com a equipe <ArrowUpRight size={18} />
        </Link>
        <span className="inst-banner-line" />
      </section>
    </InstitutionalShell>
  );
}
export function InstitutionalArticle({ kind }: { kind: string }) {
  const labels: Record<string, string> = {
    sobre: "O aplicativo",
    missao: "Nossa missão",
    funcionalidades: "Funcionalidades",
    tecnologia: "Tecnologia",
  };
  return (
    <InstitutionalShell page={kind}>
      <div className="inst-breadcrumb inst-section">
        <Link href="/">Início</Link>
        <span>/</span>
        {labels[kind]}
      </div>
      {kind === "sobre" ? (
        <AboutSection />
      ) : kind === "missao" ? (
        <MissionSection />
      ) : kind === "funcionalidades" ? (
        <FeaturesSection />
      ) : (
        <TechnologySection />
      )}
      <div className="inst-page-bottom inst-section">
        <Link href="/" className="inst-text-link">
          Explore o projeto completo <ArrowRight size={17} />
        </Link>
      </div>
    </InstitutionalShell>
  );
}
