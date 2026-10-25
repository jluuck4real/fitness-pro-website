# FitnessPro · Blue Future Fitness

## Origem e arquitetura

O site anterior está preservado na pasta pai, sem alterações. O aplicativo original foi localizado em `C:/src/fitness_app` e somente lido.

- `lib/theme/app_theme.dart`: paleta Blue Future, tipografia Manrope e superfícies azuis.
- `lib/models/exercise_catalog.dart`: oito nomes, categorias, descrições, passos e IDs de vídeos importados, sem inventar uma biblioteca maior.
- `lib/services/pose_tracking_service.dart`: ML Kit no app, confiança mínima de 0,75, escolha de lado estável e intervalo de 120 ms.
- `lib/services/movement_analyzer.dart`: regras de ângulo e confirmação em três observações.
- `docs/iafit_reference/main.py` e `utils.py`: referência histórica YOLO e cálculo de ângulos.

React 19 + TypeScript com Vinext (API de roteamento compatível com Next.js), Vite e Cloudflare Workers. Esta escolha mantém rotas de servidor e permite publicar pelo Sites. Tailwind 4 e CSS personalizado formam o design system; Motion anima as entradas; Lucide fornece ícones; Recharts renderiza dados reais. Assistente, gráficos e laboratório são carregados em módulos separados.

Os links usam navegação nativa entre documentos e melhoria progressiva com View Transitions. O teste no Worker de produção detectou uma falha de prefetch/navegação RSC no Vinext beta, ausente em desenvolvimento; os anchors sem interceptação evitam essa falha e mantêm URLs diretas e acessíveis.

## Dados e privacidade

Perfil, foto, preferência de movimento, planos ajustados, conversas opcionais e sessões ficam em `localStorage`, no navegador atual. O site começa sem histórico. O cronômetro mede o tempo real e uma sessão só é registrada após marcar todas as séries e pressionar concluir. Não há estimativa de calorias nem sincronização com o banco SQLite do app.

O Site publicado é privado, com autenticação do próprio Sites. Não há cadastro de senhas adicional. A API de IA exige identidade autenticada. Localmente, o starter fornece uma identidade de teste: não use esse modo de desenvolvimento como servidor público.

Em dispositivos compartilhados, qualquer pessoa com acesso ao mesmo perfil do navegador pode ler os registros. O usuário pode exportar perfil e sessões ou apagar o histórico. Histórico de conversas é opt-in e pode ser apagado no assistente.

## Exercícios e planejamento

Os oito exercícios do catálogo original têm busca normalizada para acentos, filtros de categoria e equipamento, página individual, passos, vídeo incorporado apenas após ação e link alternativo ao YouTube. As fotos são ilustrativas, hospedadas com o site; não são vídeos instrutivos nem imagens biomecânicas específicas.

Equipamentos, nível, dicas e erros comuns são complementos editoriais identificados nos detalhes. As três rotinas web são referências editoriais feitas com exercícios reais, sem importar os números ilustrativos de calorias e duração do app como registros pessoais. O usuário pode ajustar séries e repetições antes de iniciar; ajustes ficam no dispositivo. Duração exibida no catálogo é uma estimativa, o histórico usa tempo medido.

## IA real

`app/api/chat/route.ts` utiliza a API REST Gemini `streamGenerateContent`. A chave nunca é enviada ao cliente. Sem configuração, `/api/chat` informa `configured: false` e o campo de envio fica desabilitado, com estado pendente explícito.

Proteções: origem igual à origem do servidor, identidade autenticada, validação Zod de papéis/conteúdo/alternância, limite de 12 mensagens com até 2.000 caracteres cada, limite de corpo de 30.000 caracteres, até oito solicitações por minuto por usuário no processo/isolate, saída de até 1.800 tokens, timeout de 60 segundos, erros sem detalhes do provedor e cancelamento do streaming. O contexto é formado pelo catálogo real e pela conversa recente; não transmite o perfil, histórico de treinos nem vídeo.

O limite em memória não é uma quota global entre isolates ou reinicializações. Antes de abrir acesso público em escala, configure limitação distribuída no provedor/Cloudflare e orçamento no provedor da IA. O Site permanece privado.

O modelo padrão é configurável. Verifique a disponibilidade na conta do provedor antes de ativar. Não foi feito teste com credencial real, pois nenhuma foi fornecida/configurada nesta tarefa.

Referência: https://ai.google.dev/api/generate-content

## Análise corporal

MediaPipe Pose Landmarker usa webcam somente após ação e permissão. WASM e modelo público são carregados sob demanda. Frames permanecem no dispositivo; o site não grava nem envia vídeo. Inferência CPU limitada a cerca de oito quadros por segundo reduz custo, mas roda na thread principal; dispositivos muito lentos podem apresentar quedas de fluidez. Um worker dedicado é uma evolução possível.

Regras portadas do app:

| Exercício | Articulação | Posição inicial | Alvo |
| --- | --- | --- | --- |
| Agachamento | Quadril–joelho–tornozelo | > 160° | < 90° |
| Rosca direta | Ombro–cotovelo–punho | > 160° | < 50° |
| Elevação lateral | Quadril–ombro–cotovelo | < 40° | > 90° |

Cada fase exige três leituras consecutivas. Uma repetição é contada ao atingir o alvo depois da posição inicial; exige retorno à posição inicial para rearmar. Pontos coincidentes, baixa visibilidade, mais de uma pessoa e perda de detecção desarmam o contador. A mudança de lado também desarma. O ângulo usa coordenadas de pixels para evitar distorção da proporção da imagem.

São estimativas 2D experimentais, não uma avaliação completa de técnica ou risco de lesão. Os limiares são critérios computacionais herdados do app, não prescrições universais de amplitude. Desenvolvimento e abdominal não são apresentados como suportados para contagem na web. Regras foram testadas com sequências sintéticas; webcam foi testada com dispositivo virtual sem corpo para validar inicialização, carregamento do modelo e desligamento. Não houve validação humana da contagem com câmera física nesta sessão.

A figura da Home é uma escultura em coordenadas 3D projetadas em Canvas 2D, formada por partículas e conexões; reage ao cursor e respeita movimento reduzido. É visualização artística, identificada como tal, independente da câmera.

Referência: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js

## Manutenção

Dados importados em `lib/imported-exercises.json`. Para reimportar do app: `node scripts/import-fitness.mjs`, depois `node scripts/cache-images.mjs`. O importador interrompe se o formato ou número de exercícios mudar. O cache baixa as fotos ilustrativas do Unsplash para o próprio site. Licenças e permissões de vídeos são dos respectivos autores; o fallback de YouTube permanece disponível.

Fontes Google Manrope e DM Sans têm fallback local. Vídeos e o modelo exigem rede. Se o usuário bloquear a câmera ou os recursos externos, a interface mostra erro ou alternativa e não inventa resultados.
