# MGL Growth — Be Found

Site estático completo, com retrato central, animação de scroll, portefólio interativo e apresentação da MGL Presence.

## Editar

- `dist/content.js`: projetos, imagens, preços, WhatsApp e agendamento.
- `dist/index.html`: textos e estrutura das secções.
- `dist/styles.css`: composição, cores e responsive.
- `dist/site.js`: scroll, galeria, menu, preços e diálogos.
- `dist/scene.js`: estrutura tridimensional discreta da hero.
- `dist/style-tile.html`: quadro de identidade visual usando os estilos reais.

Em `content.js`, preencher `whatsappNumber` com os dígitos do número internacional e `meetingUrl` com o URL de agendamento. Até lá, os botões mostram uma mensagem explícita de prévia, sem simular envio ou reserva. Substituir os objetos `projects` pelos casos reais; atualizar os rótulos e declarações de conceito apenas quando os trabalhos forem reais e autorizados.

Para visualizar, servir `dist` por HTTP, por exemplo `python3 -m http.server 4174 --directory dist`. Abrir `http://localhost:4174`. Abrir os ficheiros por `file://` não executa o módulo Three.js. Alterações locais só chegam ao site alojado após nova publicação.

## Direção e história visual

Rosto de Arthur centrado e dominante, preto e branco, informação nas margens. Sem fotografia fictícia de Lisboa. Contraste entre o primeiro ecrã claro, manifesto escuro e arquivo editorial claro. DM Sans + Instrument Serif, servidas localmente.

| Scene | Visual story | Website copy |
| --- | --- | --- |
| 01 — Presença humana | Retrato grande, centrado, com contornos discretos e estrutura tridimensional atrás do rosto. | Presença digital. Negócios reais. |
| 02 — Transição | A informação lateral sai; uma expansão circular escura ocupa o ecrã e revela a frase. | BE FOUND. |
| 03 — O motivo | Tipografia monumental revela a necessidade de estar presente durante a pesquisa. | Seus clientes já estão procurando. Faça com que encontrem você. |
| 04 — Exploração | Mosaico desloca-se suavemente com o rato; hover recupera cor; clique abre o estudo. | Ideias que ganham presença. |
| 05 — A proposta | Serviços, assinatura e contacto em leitura normal, com entradas contidas. | Sua presença. Sob os nossos cuidados. |

Hero: 100% da altura visível + 1,3 alturas de deslocamento ativo. Timeline com avanço contido, saída de texto, expansão circular, revelação de texto e pausa. Reversível com scroll. O resto flui normalmente. Redução de movimento desativa pinning, Lenis e animações, mantendo o conteúdo. Mobile recompõe a galeria como grelha tátil, com três estudos e variações de enquadramento.

## Referências e tecnologia

Inspeção em browser dos sites Lando Norris e Studio Freight em 16/09/2026, incluindo estados de scroll/hover e scripts públicos. No bundle de Lando foram identificados GSAP 3.13.0, ScrollTrigger, Lenis 1.1.20 e Three.js r174. Estas versões são servidas localmente em `dist/vendor`. Studio Freight também usa GSAP/ScrollTrigger e Lenis, com Nuxt/Vue. A MGL mantém HTML sem framework; não reproduz o CMS ou toda a arquitetura das referências.

As animações, geometrias e código da MGL são próprios. Não foram copiados os modelos, o capacete, a fotografia de Lando, as imagens de portefólio ou o código proprietário das referências. A mesma biblioteca não torna uma animação idêntica. O retrato WebGL do Lando não carregou integralmente no browser headless; a composição também foi conferida com as capturas fornecidas pelo utilizador.

## Assets e proveniência

- Hero: edição gerada pelo image_gen integrado do ChatGPT a partir das fotografias de Arthur, com instrução para preservar identidade. Original RGB conservado no pacote de fontes; recorte aplicado por SVG no browser. Não existe alpha verdadeiro no bitmap.
- Sobre: fotografia pessoal original fornecida (Arthur de óculos ao ar livre), convertida para WebP e tratada em preto e branco por CSS.
- Super Bock, A Padaria Portuguesa e Millennium bcp: estudos visuais gerados a pedido do utilizador, identificados como conceitos não comissionados. Não são clientes, resultados ou campanhas reais da MGL. Prompts e PNGs originais incluídos no pacote de fontes.
- Logotipo: master SVG tipográfico editável; fontes entregues. A marca é MGL, com Arthur como fundador.
- A arquitetura fictícia rejeitada não está no site nem no pacote final.
- Não há vídeo gerado. O efeito cinematográfico combina retrato, WebGL, canvas e animações de elementos HTML.

## Validação executada

- Desktop 1440×950 e mobile 390×844; sem transbordamento horizontal observado.
- Scroll real da roda para avançar e voltar: timeline reversível.
- Deslocamento da galeria ao rato, alternância explorar/índice, abertura e fecho por Escape.
- Abertura de projetos por toque no mobile; menu móvel.
- Alternância €89 / R$497 e diálogos de contacto honestos.
- Preferência de movimento reduzido: sem pinning e sem scroll suave.
- Sem erros JavaScript observados nos fluxos testados. Teste em Chromium; Safari e dispositivos físicos ainda não verificados.
- Densidade de canvas limitada a 1,5×; renderização de WebGL pausada fora da hero; fallback de retrato se WebGL não estiver disponível.

## Pendências

WhatsApp e URL de reuniões ainda precisam dos dados do proprietário. Os três conceitos devem ser substituídos por projetos reais quando estiverem disponíveis. Publicação inicial privada, para revisão do proprietário.
