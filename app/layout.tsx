import type { Metadata } from "next";
import "./globals.css";
import "./institutional.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://blue-future-fitness-pepic.duskyflint7.chatgpt.site"),
  ),
  title: {
    default: "Fitness Pro — Tecnologia para compreender o movimento",
    template: "%s | Fitness Pro",
  },
  description:
    "Conheça o Fitness Pro: o aplicativo desenvolvido como projeto de TCC por João Lucas, Raul Dias e Renato Silva. Exercícios, treinos e visão computacional.",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Fitness Pro — O Fitness App do nosso TCC",
    description:
      "Aplicativo, propósito, equipe e tecnologia. Conheça o projeto que aproxima informação, atividade física e visão computacional.",
    type: "website",
    locale: "pt_BR",
  },
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          href="/fonts/Manrope.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
