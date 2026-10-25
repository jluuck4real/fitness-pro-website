# Implementação institucional — Fitness Pro

## Escopo e arquitetura

A Home foi reformulada para apresentar o aplicativo Fitness Pro, projeto de TCC de João Lucas, Raul Dias e Renato Silva. A navegação principal contém apresentação, missão proposta, recursos, tecnologia, equipe, FAQ, contato e chatbot. O website não executa o Flutter nem tenta substituir o aplicativo.

A stack existente foi preservada: React 19, TypeScript, Vinext/Vite compatível com rotas Next.js, Tailwind 4 e Cloudflare Workers. A navegação usa anchors nativos e View Transitions como melhoria progressiva, preservando a correção do problema de navegação RSC observado anteriormente em produção. Nenhuma biblioteca 3D foi adicionada. Lighthouse foi adicionado exclusivamente como dependência de desenvolvimento para auditoria.

Conteúdo central em lib/project-content.ts; a auditoria de fontes e pendências está em docs/CONTENT_AUDIT.md. O relatório anterior foi preservado em docs/LEGACY_PLATFORM.md. O Flutter em C:/src/fitness_app e os arquivos HTML da pasta pai permaneceram intactos.

## Identidade e imagens reais

A paleta do app e a fonte Manrope foram preservadas. A fonte é hospedada localmente com sua licença OFL. Capturas reais em artifacts/previews foram convertidas para WebP em duas resoluções; a Home apresenta a tela de onboarding original, e o seletor de recursos apresenta biblioteca, detalhes, sessão e progresso. Dados de teste existentes nas capturas são identificados como ilustrativos.

Os retratos e as responsabilidades da equipe vêm de team.html. O nome dos integrantes também foi confirmado na seção Sobre do aplicativo. Não há biografias, links profissionais, preços, downloads públicos ou números de usuários inventados. Missão, visão e valores são propostas editoriais identificadas para aprovação pela equipe.

## Bonequinho de visão computacional na Home

components/pose-demonstration.tsx desenha uma figura SVG com pontos corporais e conexões. Há duas posições e um botão para animar o movimento dos braços. Esta é uma representação visual explícita, sem acessar a câmera do visitante ou simular uma detecção real.

O desenho utiliza apenas quatorze pontos estilizados e quinze conexões para explicar o conceito; não pretende reproduzir todos os landmarks do ML Kit. As coordenadas são interpoladas a no máximo vinte atualizações por segundo, sem atualizar estado React por frame. O loop de animação é cancelado fora da tela, durante pausa e quando movimento reduzido está ativo. Há uma pequena resposta ao cursor apenas em desktop. O aplicativo real continua usando Google ML Kit e o analisador Dart; o chatbot é um serviço separado do site.

## Animações e desempenho

- Conteúdo institucional renderizado no servidor, com imagens e espaço reservado para prevenir deslocamentos.
- Scroll reveal por Intersection Observer; elementos já visíveis não são ocultados na hidratação, e o conteúdo permanece acessível sem animações.
- Stagger curto, restrito a transform e opacity; reduções de deslocamento e atraso em mobile.
- SVG pequeno; sem sistema de partículas, WebGL, vídeo de fundo ou modelo de visão computacional carregado na Home.
- Fonte local pré-carregada, imagens WebP locais, srcset nos mockups principais e lazy loading abaixo da dobra.
- Primeiro retrato priorizado na página da equipe, conforme a descoberta de LCP na auditoria inicial.
- Chatbot, biblioteca de gráficos e laboratório antigo são módulos separados. A Home institucional não solicita webcam, modelo ML Kit/MediaPipe ou biblioteca 3D.
- Links nativos e View Transitions opcionais; prefers-reduced-motion respeitado tanto no CSS quanto no SVG.

## Chatbot

Integração Gemini real via app/api/chat/route.ts e streaming SSE. GEMINI_API_KEY e GEMINI_MODEL permanecem somente no servidor. O prompt inclui o catálogo importado e informações institucionais verificadas: equipe, propósito, FAQ, rotas e limites do projeto. O assistente não alega ter acesso à câmera ou a dados privados, não inventa informações pendentes e possui finalidade educativa.

Proteções existentes preservadas: origem, autenticação Sites, Zod, tamanho de corpo, até doze mensagens de dois mil caracteres, até oito requisições por minuto por usuário/isolate, timeout e limite de tokens. A quota em memória não é uma quota global distribuída; antes de ampliar acesso público, use limitação distribuída e orçamento no provedor.

A conversa da sessão usa sessionStorage; o histórico persistente opcional foi preservado. O usuário pode iniciar uma nova conversa e apagar históricos. A rolagem automática acompanha a resposta somente quando o visitante está próximo ao fim, sem puxá-lo enquanto lê mensagens anteriores. Sem chave, há configuração pendente explícita. Não foi feita uma chamada ao provedor com credencial real.

## Contato

app/api/contact/route.ts integra a API de e-mail Resend sem SDK adicional. Variáveis: RESEND_API_KEY, CONTACT_FROM (remetente verificado), CONTACT_TO (destinatário real). O frontend nunca recebe a chave ou a configuração interna dos endereços.

Validação de nome/e-mail/mensagem no navegador e no servidor, limites de tamanho, honeypot, origem, identidade autenticada quando configurado, até três tentativas por hora por usuário/isolate, timeout de doze segundos e chave de idempotência por mensagem. O sucesso informa apenas aceitação pelo serviço, não entrega garantida. Nenhum envio real foi feito nesta sessão.

Sem serviço configurado, o formulário informa isso e a API responde 503 sem enviar ou registrar uma mensagem. E-mail institucional e links sociais ainda não foram fornecidos. Documentação primária consultada: https://github.com/resend/resend-skills/blob/main/skills/resend/references/sending/overview.md.

## Preservação

As páginas antigas /exercicios, /treinos, /progresso, /perfil e /analise continuam disponíveis e seus arquivos foram preservados, fora do foco da navegação institucional. Nenhum localStorage anterior foi apagado. A navegação principal e a Home agora apresentam o app, sem recriar treinos e dashboards como foco do site.

## Verificação e relatórios

- TypeScript, lint, build de produção e testes unitários de análise e validação de contato.
- E2E institucional: demonstração corporal, recursos, equipe, busca/categorias/accordion por teclado, contato não configurado, honeypot, origem e chatbot pendente.
- Responsividade verificada em 360, 390, 768 e 1440 pixels, sem overflow horizontal.
- Testes anteriores executados para garantir os fluxos de biblioteca, treino, persistência e perfil.
- Interface de streaming e restauração da conversa testadas com fixture explicitamente identificada somente no teste; não valida a API de IA real sem chave.
- Lighthouse em Chrome headless, build Worker de produção local, simulação mobile e throttling padrão. Relatórios HTML/JSON brutos em outputs/institutional/; medições iniciais preservadas com prefixo lighthouse-baseline. A auditoria final é registrada em docs/PERFORMANCE.md.

Pontuações são observações do ambiente de teste, não garantias para todo dispositivo ou para a rede da publicação. Metadados, descrições, canonical e Open Graph foram atualizados. robots/noindex permanece adequado ao acesso privado existente do Site; a audiência não foi alterada.
