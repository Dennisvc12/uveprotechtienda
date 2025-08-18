# Tienda de Celulares (React + Vite + Tailwind)

Responsive, lista para GitHub + Netlify.

## 🚀 Scripts
- `npm install`
- `npm run dev` (desarrollo)
- `npm run build` (producción)
- `npm run preview` (previsualizar build)

## 🧩 Datos de productos
Edita `src/data/products.json` y pega **solo los nombres y precios** de tu PDF.
El sistema buscará imágenes automáticamente desde Unsplash en base al nombre del modelo.

> Si quieres fijar imágenes estáticas, coloca archivos en `public/images/<slug>.jpg`
> con el mismo `slug` que el producto y se usará esa imagen local.

## ☁️ Deploy en Netlify
1. Sube el repo a GitHub.
2. En Netlify, **New site from Git**, conecta tu repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
