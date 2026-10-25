# Vercel

O `vercel.json` seleciona Next.js e executa `npx next build`. Os scripts existentes de Sites/Cloudflare foram preservados. Para executar a versão Next.js localmente, use `npx next dev`; para testar um build, `npx next build` e `npx next start`.

Configure `GEMINI_API_KEY` como variável sensível de servidor na Vercel e `GEMINI_MODEL=gemini-3.6-flash`. Não use prefixos `NEXT_PUBLIC_` ou `VITE_`. `.dev.vars` continua sendo configuração exclusiva do ambiente Sites/local e não é enviada à Vercel. `SITE_URL` é opcional: sem ela, o domínio de produção da Vercel determina os links canônicos.

Na Vercel, o chatbot atende visitantes sem exigir o login exclusivo do ambiente ChatGPT. A origem é validada e a identidade para limitação utiliza um hash do IP fornecido pelo proxy confiável da Vercel; cabeçalhos de identidade ChatGPT são ignorados. Na hospedagem Sites, o login anterior permanece obrigatório. Não há coleta de perfis ou histórico no servidor.

Os limites existentes (8 mensagens/minuto e 3 contatos/hora) são por instância do servidor. Em ambiente serverless, reinícios e múltiplas instâncias podem reiniciar ou distribuir esses limites; antes de ampliar o tráfego, configure uma limitação compartilhada e limites de consumo no provedor de IA.

Contato depende de `RESEND_API_KEY`, `CONTACT_FROM` e `CONTACT_TO`. Sem essas variáveis, o formulário informa configuração pendente e não simula envio.

`lib/server-environment.ts` lê as variáveis no Node.js. O alias do Vite seleciona `lib/server-environment.cloudflare.ts` na hospedagem Sites, preservando seus bindings. Credenciais e artefatos locais estão excluídos do Git e do upload da Vercel.
