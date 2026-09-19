# MGL Growth — Be Found

Site estático completo, com o banner aprovado pelo utilizador, retrato central e animação de scroll, portefólio interativo e apresentação da MGL Presence.

## Editar

- `dist/content.js`: projetos, imagens, preços, WhatsApp e agendamento.
- `dist/index.html`: textos e estrutura das secções.
- `dist/styles.css`: composição, cores e responsive.
- `dist/site.js`: scroll, galeria, menu, preços e diálogos.
- `dist/scene.js`: experiência WebGL anterior, conservada mas já não carregada pela página.
- `dist/style-tile.html`: quadro de identidade visual usando os estilos reais.

Em `content.js`, preencher `whatsappNumber` com os dígitos do número internacional e `meetingUrl` com o URL de agendamento. Até lá, os botões mostram uma mensagem explícita de prévia, sem simular envio ou reserva. Substituir os objetos `projects` pelos casos reais; atualizar os rótulos e declarações de conceito apenas quando os trabalhos forem reais e autorizados.

Para visualizar, servir `dist` por HTTP, por exemplo `python3 -m http.server 4174 --directory dist`. Abrir `http://localhost:4174`. Abrir os ficheiros por `file://` não executa o módulo Three.js. Alterações locais só chegam ao site alojado após nova publicação.

## Direção e história visual

Rosto de Arthur centrado e dominante, banner a cores fornecido pelo utilizador, informação nas margens. Sem fotografia fictícia de Lisboa. Contraste entre o primeiro ecrã claro, manifesto escuro e arquivo editorial claro. DM Sans + Instrument Serif, servidas localmente.

| Scene | Visual story | Website copy |
| --- | --- | --- |
| 01 — Presença humana | Retrato grande, centrado, com os contornos e o wireframe presentes na imagem aprovada. | Presença digital. Negócios reais. |
| 02 — Transição | A informação lateral sai; uma expansão circular escura ocupa o ecrã e revela a frase. | BE FOUND. |
| 03 — O motivo | Tipografia monumental revela a necessidade de estar presente durante a pesquisa. | Seus clientes já estão procurando. Faça com que encontrem você. |
| 04 — Exploração | Mosaico desloca-se suavemente com o rato; hover recupera cor; clique abre o estudo. | Ideias que ganham presença. |
| 05 — A proposta | Serviços, assinatura e contacto em leitura normal, com entradas contidas. | Sua presença. Sob os nossos cuidados. |

Hero: 100% da altura visível + 1,3 alturas de deslocamento ativo. Timeline com avanço contido, saída de texto, expansão circular, revelação de texto e pausa. Reversível com scroll. O resto flui normalmente. Redução de movimento desativa pinning, Lenis e animações, mantendo o conteúdo. Mobile recompõe a galeria como grelha tátil, com três estudos e variações de enquadramento.

## Referências e tecnologia

Inspeção em browser dos sites Lando Norris e Studio Freight em 16/09/2026, incluindo estados de scroll/hover e scripts públicos. No bundle de Lando foram identificados GSAP 3.13.0, ScrollTrigger, Lenis 1.1.20 e Three.js r174. Estas versões são servidas localmente em `dist/vendor`. Studio Freight também usa GSAP/ScrollTrigger e Lenis, com Nuxt/Vue. A MGL mantém HTML sem framework; não reproduz o CMS ou toda a arquitetura das referências.

As animações, geometrias e código da MGL são próprios. Não foram copiados os modelos, o capacete, a fotografia de Lando, as imagens de portefólio ou o código proprietário das referências. A mesma biblioteca não torna uma animação idêntica. O retrato WebGL do Lando não carregou integralmente no browser headless; a composição também foi conferida com as capturas fornecidas pelo utilizador.

## Assets e proveniência

- Hero atual: banner fornecido pelo utilizador em 17/09/2026 (1708 × 921), convertido para WebP sem alterar o conteúdo. O capacete e as linhas fazem parte da imagem enviada. Sem recorte SVG, filtro monocromático ou sobreposição adicional de WebGL. No desktop, enquadramento central em ecrã completo; no mobile e tablet vertical, imagem a 90% da altura, alinhada à base, com rosto central e navegação no topo.
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
- A hero atual não depende de WebGL; o banner permanece visível sem esse recurso. Scroll de ida e volta e menu móvel verificados após a troca. Verificados também 360×740, 768×1024 e 2560×1080.

## Pendências

WhatsApp e URL de reuniões ainda precisam dos dados do proprietário. Os três conceitos devem ser substituídos por projetos reais quando estiverem disponíveis. Publicação inicial privada, para revisão do proprietário.
# Contactos e agendamento

O formulário em #lead guarda nome, empresa, telefone e email na tabela privada
leads (D1). Não existe endpoint público para consultar contactos. O proprietário
pode consultar os registos através das ferramentas de base de dados do Sites.
Não há envio automático de email nesta versão.

Instagram: editar instagramUrl em dist/content.js.
Google Calendar: editar GOOGLE_BOOKING_URL no mesmo ficheiro.
Enquanto não houver links reais, os respetivos controlos indicam indisponibilidade.

O site tem agora um Worker para POST /api/leads e assets em dist/client.
Build: npm run build. Migrações: npm run db:generate.
Os ficheiros de design continuam em dist/; client e server são gerados.
