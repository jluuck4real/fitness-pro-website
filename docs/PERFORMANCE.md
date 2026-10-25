# Desempenho e acessibilidade — auditoria mobile

Auditoria do build Worker de produção, servido localmente em http://127.0.0.1:4173, com Chrome headless e Lighthouse. Form factor mobile, throttling simulado padrão, sem desabilitar categorias ou alterar resultados. Meta: pelo menos 90 em Performance, Acessibilidade e Boas Práticas.

| Medição | Página | Performance | Acessibilidade | Boas Práticas |
| --- | --- | --- | --- | --- |
| Inicial | Home | 91 | 100 | 100 |
| Inicial | Equipe | 94 | 98 | 100 |
| Final | Home | 93 | 100 | 100 |
| Final | Equipe | 93 | 100 | 100 |

A variação de 94 para 93 em Performance na equipe foi preservada, sem seleção do melhor resultado. Foram corrigidos a hierarquia dos títulos dos integrantes e os nomes acessíveis de links. A prioridade do primeiro retrato também foi ajustada. Não houve avisos de execução nas duas auditorias finais.

| Métrica final | Home | Equipe |
| --- | --- | --- |
| First Contentful Paint | 1,9 s | 1,8 s |
| Largest Contentful Paint | 2,9 s | 3,0 s |
| Cumulative Layout Shift | 0 | 0 |
| Total Blocking Time | 30 ms | 70 ms |

## Relatórios completos

Os arquivos HTML e JSON brutos estão em outputs/institutional/:

- lighthouse-baseline-home.html e .json
- lighthouse-baseline-team.html e .json
- lighthouse-home.html e .json — medição final
- lighthouse-team.html e .json — medição final

Os relatórios mantêm também oportunidades não resolvidas, incluindo CSS/JavaScript não utilizados, descoberta de dependências e sugestões de entrega de imagens. Atingir a meta não significa ausência de melhorias possíveis.

Esses números representam esta execução local com simulação de rede e CPU. Não são garantia de pontuação para toda rede, aparelho ou para a origem publicada, que permanece com acesso privado.

## Otimizações aplicadas

Fonte Manrope local pré-carregada, capturas e retratos WebP, variantes responsivas de imagens, dimensões reservadas, carregamento tardio abaixo da dobra, priorização do LCP e separação do CSS antigo. O conjunto das doze imagens de telas otimizadas ocupa aproximadamente 254 KB. O novo conteúdo institucional não carrega o detector corporal nem gráficos de treino na Home.

O bonequinho usa um SVG pequeno com controles, sem sistema de partículas ou WebGL. Seu loop só funciona quando há animação solicitada e o elemento está visível, com limite de vinte atualizações por segundo. A preferência de movimento reduzido interrompe as animações; no mobile, deslocamentos e delays são menores.
