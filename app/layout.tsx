import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "FitnessPro — Seu corpo. Seu potencial. Sem limites.",
  description:
    "Treinos com propósito, biblioteca de exercícios, inteligência artificial e reconhecimento corporal. Conheça a próxima evolução do seu movimento.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "FitnessPro — Blue Future Fitness",
    description:
      "Tecnologia que entende o seu movimento. Treinos que acompanham a sua evolução.",
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
      <body>{children}</body>
    </html>
  );
}
