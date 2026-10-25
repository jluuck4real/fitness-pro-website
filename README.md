# FitnessPro — Blue Future Fitness

Plataforma fitness responsiva baseada no aplicativo Flutter em C:/src/fitness_app. O site anterior permanece intacto na pasta pai.

## Executar

Requer Node >=22.13. Execute nesta pasta:

    npm ci
    npm run dev

Abra o endereço Local informado no terminal, normalmente http://127.0.0.1:5173/.

## Conectar a IA

Copie .env.example para .dev.vars e preencha GEMINI_API_KEY somente nesse arquivo local ignorado pelo Git. Reinicie o servidor. GEMINI_MODEL é opcional, padrão gemini-2.5-flash. Nunca coloque a chave em variáveis NEXT_PUBLIC_ ou VITE_.

Na publicação Sites, configure GEMINI_API_KEY como segredo de runtime e, opcionalmente, GEMINI_MODEL pelas variáveis do Site. A IA usa Gemini real com streaming, identidade autenticada, validação e limites. Sem chave, a interface mostra configuração pendente; não há respostas simuladas.

## Páginas

- / — Home com escultura interativa de partículas em 3D.
- /exercicios — Catálogo real, busca e filtros.
- /exercicios/agachamento — Exemplo de detalhe, vídeo e instruções.
- /treinos — Rotinas editoriais com exercícios do aplicativo.
- /treinos/fundamentos — Ajuste de séries/repetições, cronômetro e conclusão.
- /assistente — Chat com streaming e histórico opcional.
- /analise — Webcam e MediaPipe, ângulos e contagem real para três exercícios.
- /progresso — Gráficos e sessões efetivamente registradas.
- /perfil — Perfil local, preferências, foto, metas e exportação.
- /sobre — Origem do projeto, recursos e FAQ.

Perfil e sessões são locais ao navegador, sem sincronização com o app. O site publicado é privado. Não há dados fictícios de evolução. A análise corporal é experimental e educativa.

## Verificação

    npx tsc --noEmit
    npm run lint
    npm test
    npm run build

Com o servidor de desenvolvimento aberto:

    npm run test:e2e
    npm run test:camera

Os scripts de navegador usam Chrome instalado no caminho padrão do Windows; ajuste executablePath para outro sistema. test:camera usa câmera virtual exclusivamente no teste, com o detector MediaPipe real. Nenhum resultado de teste é inserido na aplicação. Capturas ficam em outputs/.

Mais detalhes, critérios verificáveis, origem dos dados e limites em docs/IMPLEMENTATION.md.
