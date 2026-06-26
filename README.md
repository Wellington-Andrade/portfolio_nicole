# Portfólio Nicole Kvsh

Protótipo em React + Vite + Motion para um portfólio leve de artista plástica.

## Rodar localmente

```bash
npm install
npm run dev
```

## Onde trocar mídias

- `src/App.jsx`: listas `fallbackGalleryItems`, `collections`, `matarazzoPlan` e `extras`.
- `src/lib/sanityClient.js`: busca das obras publicadas no Sanity.
- `src/styles.css`: estilos dos placeholders em `.media-slot`.
- Para colocar imagens ou vídeos reais, substitua o componente `MediaSlot` por `<img>` ou `<video>` dentro do bloco desejado.

## Sanity CMS

Copie `.env.example` para `.env` e preencha:

```env
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2026-06-26
```

No painel do Sanity, libere as origins de desenvolvimento:

```text
http://localhost:5500
http://127.0.0.1:5500
```

O site não usa token privado no frontend e não usa nenhuma imagem do `Portifolio experimental`; as mídias de fallback são espaços visuais provisórios.
