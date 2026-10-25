# Fontes institucionais do Fitness Pro

Revisão da pasta `C:/src/fitness_app` e do site HTML original em `../`. Nenhum arquivo do Flutter foi alterado.

| Informação | Fonte | Uso no site |
| --- | --- | --- |
| Nome “Fitness Pro” | `lib/main.dart`, `README.md`, `lib/screens/settings/settings_screen.dart` | Nome oficial; “Fitness App” identifica o projeto |
| Projeto acadêmico de TCC | `lib/screens/settings/settings_screen.dart`, seção Sobre | Apresentação institucional |
| João Lucas, Raul Dias e Renato Silva | Seção Sobre do aplicativo | Equipe real |
| Funções e fotografias | `../team.html`, `../oiiiiiii.jpeg`, `../raul.jpeg`, `../renato.jpeg` | Desenvolvimento; design e concepção; pesquisa. Sem títulos ou links profissionais inventados |
| Paleta e Manrope | `lib/theme/app_theme.dart`, `assets/fonts/Manrope.ttf` e `OFL.txt` | Identidade azul e fonte local licenciada |
| Oito exercícios, instruções e vídeos | `lib/models/exercise_catalog.dart` | Apresentação da biblioteca; contexto do chatbot |
| Rotinas, tempo, séries e descanso | `lib/screens/workouts/workout_detail_screen.dart`, README | Demonstração das funcionalidades do app |
| Histórico local e evolução | `lib/screens/progress/progress_screen.dart`, serviços de SQLite | Apresentação do acompanhamento; nenhuma estatística agregada inventada |
| Visão computacional | `pose_tracking_service.dart`, `movement_analyzer.dart`, README e `docs/IAFIT_ANDROID.md` | ML Kit, pontos, ângulos e contagem experimental. Python/YOLO é referência histórica, não o detector móvel atual |
| Capturas reais de interface | `artifacts/previews/` e `artifacts/MODERNIZACAO.md` | Mockups de smartphone. Os dados sintéticos dos testes são identificados na apresentação, sem alegar resultados reais |
| Android | README e artefatos de release 1.0.3 | APK de validação existente; nenhuma alegação de disponibilidade na Play Store |
| iOS | README, notas de implementação | Não há build iOS validado neste ambiente nem publicação confirmada na App Store |
| Privacidade e uso educativo | `settings_screen.dart` | Processamento local, sem gravação da câmera; vídeos e chatbot dependem de serviços externos |

## Propostas editoriais

A origem acadêmica, os recursos e a equipe são verificáveis. Os textos de missão, visão e valores foram redigidos para o site a partir do pedido do usuário e são identificados visualmente como **propostas institucionais para validação pela equipe**. Não são apresentados como declarações formalmente aprovadas.

## Pendências reais

- Validar a redação final de missão, visão e valores.
- Fornecer e-mail institucional, perfis profissionais e canais oficiais de contato.
- Confirmar política de preços, distribuição pública e eventual publicação em lojas.
- Configurar `GEMINI_API_KEY` para respostas reais do chatbot.
- Configurar `RESEND_API_KEY`, `CONTACT_FROM` e `CONTACT_TO` para o formulário enviar e-mails. O remetente precisa ser autorizado no provedor.
- Concluir a validação audiovisual e corporal do aplicativo em aparelho físico, conforme as notas do próprio projeto.

Sem configuração, chatbot e contato mostram estados pendentes explícitos. O site não inventa respostas, destinatários, mensagens enviadas ou links de download.
