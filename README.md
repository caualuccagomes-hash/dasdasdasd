# Trapiche — Restaurante e Pizzaria

Site responsivo em português brasileiro para o Trapiche, em Tianguá (CE).

## Executar

Abra `dist/index.html` no navegador ou sirva a pasta `dist` com qualquer servidor estático. Não exige instalação de dependências nem build. Configure a hospedagem para publicar `dist`.

## Recursos

- Cardápio com 132 opções em 18 categorias, busca e área expansível.
- PDF original do cardápio disponível no site.
- Contato por WhatsApp com mensagem de pedido e links de telefone.
- Link direto para o estabelecimento no Google Maps.
- Fotografias fornecidas pelo cliente e imagens ilustrativas identificadas.
- Animações de entrada, perspectiva nas imagens e botões e fumaça interativa.
- Navegação por teclado, menu mobile e respeito a movimento reduzido.

## Editar

- `dist/index.html`: estrutura e conteúdo.
- `dist/app.js`: contato, localização e dados estruturados.
- `dist/menu-data.json`: referência dos dados transcritos do PDF; os itens exibidos estão no HTML. Atualize ambos ao alterar o cardápio.
- `dist/menu.js` e `dist/menu.css`: busca, categorias e apresentação do cardápio.
- `dist/assets/`: fotografias, imagens e PDF.
- Arquivos `motion`, `food-depth`, `interactive-depth` e `cursor-smoke`: animações.

Os preços são os do PDF fornecido e não são sincronizados. Horários completos ainda precisam de confirmação. Fontes são carregadas pelo Google Fonts, com alternativas locais.

JavaScript validado com `node --check`; estrutura, arquivos e quantidade de itens verificados. Revisão visual completa nos quatro tamanhos de tela ainda pendente.
