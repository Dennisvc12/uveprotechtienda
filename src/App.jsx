import React, { useMemo, useState } from 'react'
import productsData from './data/products.json'
import { slugify, productImage } from './lib'

function Badge({ children }) {
  return <span className="text-xs px-2 py-1 rounded-full bg-brand-100 text-brand-700">{children}</span>
}

function Price({ value }) {
  return <span className="font-semibold text-brand-700">S/ {value.toFixed(2)}</span>
}

function Header({ total, onSearch }) {
  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" className="w-6 h-6" alt="logo" />
          <h1 className="text-lg font-bold">Tienda de Celulares</h1>
        </div>
        <div className="flex-1" />
        <input
          type="search"
          placeholder="Buscar modelo o marca..."
          className="w-full max-w-sm rounded-xl border px-3 py-2 text-sm"
          onChange={(e)=>onSearch(e.target.value)}
        />
        <div className="ml-3 text-sm">
          <Badge>{total} productos</Badge>
        </div>
      </div>
    </header>
  )
}

function Filters({ brands, activeBrand, setActiveBrand, maxPrice, setMaxPrice, maxAvailable }) {
  return (
    <aside className="w-full lg:w-64 space-y-4">
      <div className="p-4 bg-white rounded-2xl shadow-soft">
        <h3 className="font-semibold mb-3">Filtrar</h3>
        <label className="text-sm block mb-2">Marca</label>
        <select
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={activeBrand}
          onChange={(e)=>setActiveBrand(e.target.value)}
        >
          <option value="">Todas</option>
          {brands.map(b=>(<option key={b} value={b}>{b}</option>))}
        </select>
        <div className="mt-4">
          <label className="text-sm block">Precio máximo: <span className="font-medium">S/ {Math.round(maxPrice)}</span></label>
          <input
            type="range" min="0" max={Math.ceil(maxAvailable)} value={maxPrice}
            onChange={(e)=>setMaxPrice(Number(e.target.value))} className="w-full"
          />
        </div>
      </div>
      <div className="p-4 bg-white rounded-2xl shadow-soft">
        <h3 className="font-semibold mb-2">¿Cómo funciona?</h3>
        <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
          <li>Edita <code>src/data/products.json</code> con nombres y precios de tu PDF.</li>
          <li>Las imágenes se cargan desde la web (Unsplash) según el nombre del modelo.</li>
          <li>Si agregas una imagen local en <code>public/images/&lt;slug&gt;.jpg</code>, se usará esa.</li>
        </ul>
      </div>
    </aside>
  )
}

function Card({ p, onAdd }) {
  const { local, remote } = productImage(p.name)
  const [src, setSrc] = useState(local)
  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          src={src}
          alt={p.name}
          className="w-full h-full object-cover"
          onError={()=>setSrc(remote)}
          loading="lazy"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-gray-500">{p.brand}</div>
        <h3 className="font-semibold">{p.name}</h3>
        <div className="mt-auto flex items-center justify-between">
          <Price value={p.price} />
          <button
            onClick={()=>onAdd(p)}
            className="text-sm px-3 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

function Cart({ items, onRemove, onClear }) {
  const total = items.reduce((s,i)=>s + i.price, 0)
  return (
    <div className="p-4 bg-white rounded-2xl shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Carrito</h3>
        <button onClick={onClear} className="text-xs underline">Vaciar</button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no agregas productos.</p>
      ) : (
        <ul className="divide-y">
          {items.map((p, idx)=>(
            <li key={idx} className="py-2 flex items-center justify-between text-sm">
              <span className="truncate mr-2">{p.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-medium">S/ {p.price.toFixed(2)}</span>
                <button onClick={()=>onRemove(idx)} className="text-xs underline">Quitar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Total</span>
        <span className="font-semibold">S/ {total.toFixed(2)}</span>
      </div>
      <button className="mt-3 w-full px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700">
        Finalizar compra
      </button>
    </div>
  )
}

export default function App() {
  const [q, setQ] = useState('')
  const [brand, setBrand] = useState('')
  const [maxPrice, setMaxPrice] = useState(()=>Math.max(...productsData.map(p=>p.price)) || 5000)
  const [cart, setCart] = useState([])

  const brands = useMemo(()=>Array.from(new Set(productsData.map(p=>p.brand).filter(Boolean))).sort(), [])
  const maxAvailable = useMemo(()=>Math.max(...productsData.map(p=>p.price)) || 5000, [])

  const products = useMemo(()=>{
    return productsData
      .filter(p => (brand ? p.brand === brand : true))
      .filter(p => p.price <= maxPrice)
      .filter(p => (q ? (p.name.toLowerCase().includes(q.toLowerCase()) || (p.brand||'').toLowerCase().includes(q.toLowerCase())) : true))
  }, [q, brand, maxPrice])

  const add = (p) => setCart(c => [...c, p])
  const remove = (idx) => setCart(c => c.filter((_,i)=>i!==idx))
  const clear = () => setCart([])

  return (
    <div className="min-h-screen">
      <Header total={products.length} onSearch={setQ} />
      <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-[16rem,1fr,20rem] gap-6">
        <Filters
          brands={brands}
          activeBrand={brand}
          setActiveBrand={setBrand}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          maxAvailable={maxAvailable}
        />
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(p => <Card key={p.id} p={p} onAdd={add} />)}
          </div>
        </section>
        <aside className="w-full">
          <Cart items={cart} onRemove={remove} onClear={clear} />
          <div className="mt-4 p-4 bg-white rounded-2xl shadow-soft text-xs text-gray-600">
            <p><strong>SEO:</strong> Títulos, meta y URLs amigables. Imágenes con <code>loading="lazy"</code>.</p>
            <p className="mt-2"><strong>Deploy:</strong> Netlify (build <code>npm run build</code>, publish <code>dist</code>).</p>
          </div>
        </aside>
      </main>
      <footer className="py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Tienda de Celulares — Hecho con React + Tailwind
      </footer>
    </div>
  )
}
