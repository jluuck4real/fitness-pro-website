import dynamic from "next/dynamic";
import type { Metadata } from "next";
import InstitutionalShell from "@/components/institutional-shell";
import {
  TeamSection,
  InstitutionalArticle,
} from "@/components/institutional-content";
import InstitutionalFAQ from "@/components/institutional-faq";
import InstitutionalContact from "@/components/institutional-contact";
import InstitutionalChat from "@/components/institutional-chat";
const LegacyPlatform = dynamic(() => import("@/components/fitness-platform"));
type Props = { params: Promise<{ path: string[] }> };
const titles: Record<string, string> = {
  equipe: "Nossa equipe",
  faq: "Perguntas frequentes",
  contato: "Contato",
  assistente: "Fitness AI",
  sobre: "Sobre o aplicativo",
  missao: "Nossa missão",
  funcionalidades: "Funcionalidades",
  tecnologia: "Visão computacional",
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  return {
    title: titles[path[0]] || "Fitness Pro",
    alternates: { canonical: `/${path.join("/")}` },
    robots: titles[path[0]] ? undefined : { index: false, follow: false },
  };
}
export default async function Page({ params }: Props) {
  const { path } = await params;
  const kind = path[0];
  if (path.length === 1) {
    if (kind === "faq") return <InstitutionalFAQ />;
    if (kind === "contato") return <InstitutionalContact />;
    if (kind === "assistente") return <InstitutionalChat />;
    if (kind === "equipe")
      return (
        <InstitutionalShell page="equipe">
          <div className="inst-section inst-page-intro">
            <span className="inst-kicker">
              DESENVOLVIMENTO + DESIGN + PESQUISA
            </span>
            <h1>
              Uma equipe.
              <br />
              <span>Diferentes perspectivas.</span>
            </h1>
            <p>
              Conheça as pessoas responsáveis pelo Fitness Pro, o Fitness App
              desenvolvido como projeto acadêmico de TCC.
            </p>
          </div>
          <TeamSection full />
        </InstitutionalShell>
      );
    if (["sobre", "missao", "funcionalidades", "tecnologia"].includes(kind))
      return (
        <>
          <div className="sr-only">
            <h1>{titles[kind]}</h1>
          </div>
          <InstitutionalArticle kind={kind} />
        </>
      );
  }
  return <LegacyPlatform />;
}
