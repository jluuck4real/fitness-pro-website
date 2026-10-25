// Verified against C:/src/fitness_app and the original ../team.html.
// Editorial institutional statements are explicitly labeled below.
export const project = {
  name: "Fitness Pro",
  context: "Fitness App · Projeto de TCC",
  description:
    "Aplicativo educativo de organização de treinos, exercícios e acompanhamento de progresso, desenvolvido por João Lucas, Raul Dias e Renato Silva como projeto acadêmico de TCC.",
  technology: ["Flutter", "Dart", "SQLite", "Google ML Kit"],
  stage: "Projeto acadêmico em desenvolvimento e validação.",
  editorial:
    "Missão, visão e valores: propostas editoriais para validação pela equipe.",
  screenshots:
    "Capturas reais do aplicativo em ambiente de testes. Os dados exibidos nas telas são ilustrativos, não resultados de usuários.",
};
export const team = [
  {
    name: "João Lucas",
    role: "Desenvolvimento",
    area: "Website · Aplicativo · IA",
    image: "/institutional/team/joao.webp",
    position: "50% 32%",
    description:
      "Responsável principal pelo desenvolvimento do website, do aplicativo e da inteligência artificial.",
  },
  {
    name: "Raul Dias",
    role: "Design e concepção",
    area: "Identidade visual · Ideação",
    image: "/institutional/team/raul.webp",
    position: "50% 51%",
    description:
      "Responsável principal pelo design e pela concepção de ideias que dão identidade ao projeto.",
  },
  {
    name: "Renato Silva",
    role: "Pesquisa",
    area: "Pesquisa · Contribuições para a IA",
    image: "/institutional/team/renato.webp",
    position: "50% 35%",
    description:
      "Responsável principal pela pesquisa do projeto, com contribuição direta para a criação da inteligência artificial.",
  },
];
export const features = [
  {
    id: "biblioteca",
    label: "01 / APRENDER",
    title: "Entender antes de executar.",
    description:
      "Uma biblioteca com oito exercícios, instruções específicas e filtros por grupo muscular. O primeiro passo é conhecer o movimento.",
    screen: "exercises",
    alt: "Tela real da biblioteca de exercícios do Fitness Pro",
    tags: ["Catálogo compartilhado", "Instruções de execução"],
  },
  {
    id: "videos",
    label: "02 / VISUALIZAR",
    title: "Veja o movimento ganhar sentido.",
    description:
      "Demonstrações em vídeo acessíveis na biblioteca e durante a sessão. Quando a incorporação não está disponível, o app oferece abrir no YouTube.",
    screen: "exercise_detail",
    alt: "Tela real de detalhes de um exercício no aplicativo",
    tags: ["Vídeos demonstrativos", "Alternativa no YouTube"],
  },
  {
    id: "rotina",
    label: "03 / ORGANIZAR",
    title: "Cada sessão, no seu ritmo.",
    description:
      "Rotinas, séries, repetições, cronômetro e descanso. Ao abrir uma demonstração durante o treino, o aplicativo pausa o tempo da sessão.",
    screen: "session",
    alt: "Tela real de sessão de treino com cronômetro e séries",
    tags: ["Rotinas de treino", "Controle da sessão"],
  },
  {
    id: "evolucao",
    label: "04 / ACOMPANHAR",
    title: "Uma história feita de consistência.",
    description:
      "O aplicativo reúne o histórico de treinos e de peso em gráficos e indicadores. Os registros são armazenados localmente em SQLite.",
    screen: "progress",
    alt: "Tela real de acompanhamento de progresso do aplicativo",
    tags: ["Histórico local", "Gráficos de evolução"],
  },
];
export const faqs = [
  {
    id: "o-que-e",
    category: "O projeto",
    question: "O que é o Fitness App?",
    answer:
      "Fitness App é o projeto do aplicativo Fitness Pro, desenvolvido em Flutter por João Lucas, Raul Dias e Renato Silva como trabalho acadêmico de TCC. Ele reúne organização de treinos, exercícios, conteúdo educativo e acompanhamento de progresso.",
  },
  {
    id: "objetivo",
    category: "O projeto",
    question: "Qual é o objetivo do aplicativo?",
    answer:
      "Aproximar tecnologia e atividade física para ajudar as pessoas a organizar seus treinos e compreender melhor os exercícios. O projeto tem finalidade educativa e informativa; não substitui orientação profissional.",
  },
  {
    id: "ia",
    category: "Tecnologia",
    question: "Como funciona a inteligência artificial?",
    answer:
      "Na versão móvel, a câmera fornece imagens ao Google ML Kit, que identifica pontos corporais no dispositivo. Regras experimentais calculam ângulos e acompanham fases do movimento para contar repetições em exercícios compatíveis. A análise é uma estimativa 2D e não avalia integralmente a técnica ou o risco de lesão.",
  },
  {
    id: "execucao",
    category: "O aplicativo",
    question: "O aplicativo ajuda na execução dos exercícios?",
    answer:
      "Ele oferece instruções específicas e vídeos demonstrativos. A análise experimental da câmera acrescenta acompanhamento de amplitude em movimentos compatíveis. Isso é um apoio educativo, sem diagnóstico ou garantia de execução segura.",
  },
  {
    id: "videos",
    category: "O aplicativo",
    question: "Como funcionam os vídeos demonstrativos?",
    answer:
      "Biblioteca, videoteca e sessão de treino usam o mesmo catálogo de oito demonstrações. Os vídeos do YouTube utilizam o player incorporado oficial. Se o autor ou a plataforma restringir a incorporação, existe a opção de abrir no YouTube.",
  },
  {
    id: "experiencia",
    category: "O aplicativo",
    question: "É necessário ter experiência com academia?",
    answer:
      "Os conteúdos podem ser explorados por quem quer conhecer melhor os exercícios. A escolha de cargas, adaptações e de uma rotina adequada ao seu nível deve ser feita com orientação de um profissional de educação física.",
  },
  {
    id: "android",
    category: "Disponibilidade",
    question: "O aplicativo funciona no Android?",
    answer:
      "Sim. O projeto possui um APK universal de validação para Android. Ele é uma versão de testes; não foi encontrada confirmação de publicação oficial na Play Store. A validação audiovisual e corporal em aparelho físico ainda é necessária.",
  },
  {
    id: "iphone",
    category: "Disponibilidade",
    question: "E no iPhone ou no navegador?",
    answer:
      "O projeto Flutter contempla iOS e tem compilação web para Chrome/Edge. A análise pela câmera do aplicativo é exclusiva da versão móvel. Não foi encontrada uma compilação iOS validada ou publicação confirmada na App Store.",
  },
  {
    id: "internet",
    category: "Tecnologia",
    question: "É necessário ter acesso à internet?",
    answer:
      "Vídeos e miniaturas do YouTube precisam de internet. Perfis e históricos do aplicativo usam armazenamento local, e a análise móvel com ML Kit processa imagens no dispositivo. O chatbot deste site também depende de internet e de uma API configurada.",
  },
  {
    id: "gratuito",
    category: "Disponibilidade",
    question: "O Fitness App é gratuito?",
    answer:
      "Não há política de preços, assinatura ou distribuição pública confirmada nos arquivos do projeto. Essa informação será publicada quando a equipe a definir.",
  },
  {
    id: "privacidade",
    category: "Tecnologia",
    question: "O aplicativo grava a câmera ou envia meus dados?",
    answer:
      "Segundo o código e os textos de privacidade do app, perfil e históricos são locais, a análise corporal é processada no dispositivo e o vídeo da câmera não é gravado. YouTube recebe dados de conexão conforme suas próprias políticas. As mensagens do chatbot do site são enviadas ao provedor de IA quando a integração estiver ativa.",
  },
  {
    id: "contato",
    category: "O projeto",
    question: "Como entrar em contato com a equipe?",
    answer:
      "A página Contato reúne o formulário do projeto. O envio depende da configuração de um serviço de e-mail; enquanto não estiver ativo, o site informa que nenhuma mensagem foi enviada. E-mail institucional e perfis profissionais ainda não foram fornecidos.",
  },
];
export const aiContext = JSON.stringify({
  project,
  team: team.map(({ name, role, description }) => ({
    name,
    role,
    description,
  })),
  features: features.map(({ title, description }) => ({ title, description })),
  faqs,
  routes: {
    aplicativo: "/#aplicativo",
    missao: "/#missao",
    funcionalidades: "/#funcionalidades",
    tecnologia: "/#tecnologia",
    equipe: "/equipe",
    faq: "/faq",
    contato: "/contato",
    chat: "/assistente",
  },
  limits:
    "Este é o site institucional, não uma versão do aplicativo no navegador. A animação de pontos é demonstrativa, não utiliza câmera. A IA de conversa do site é separada da detecção corporal do aplicativo. Não há links públicos de lojas ou preços confirmados.",
});
