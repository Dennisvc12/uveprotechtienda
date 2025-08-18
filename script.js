const PRODUCTS = window.__PRODUCTS__ || [];

const els = {
  grid: document.getElementById('products'),
  search: document.getElementById('search'),
  brand: document.getElementById('brand-filter'),
  tier: document.getElementById('tier-filter'),
  price: document.getElementById('price-filter'),
  priceVal: document.getElementById('price-value'),
  count: document.getElementById('count'),
  offerStrip: document.getElementById('offer-strip'),
  cartList: document.getElementById('cart-items'),
  cartTotal: document.getElementById('cart-total'),
  clearCart: document.getElementById('clear-cart'),
};

// Build brand list
const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();
brands.forEach(b => {
  const opt = document.createElement('option');
  opt.value = b; opt.textContent = b;
  els.brand.appendChild(opt);
});

// Offers: pick first 6 low-tier and show small discount
const lowOffers = PRODUCTS.filter(p => p.tier === 'baja').slice(0, 6).map(p => ({...p, offer: (p.price * 0.9)}));
lowOffers.forEach(p => {
  const card = document.createElement('div');
  card.className = 'offer-card';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <div class="offer-price">
      <span>${p.name.split(' ').slice(0,3).join(' ')}</span>
      <span><del>S/ ${p.price.toFixed(0)}</del> <strong>S/ ${p.offer.toFixed(0)}</strong></span>
    </div>`;
  els.offerStrip.appendChild(card);
});

// Cart
let cart = [];
function addToCart(p){
  cart.push(p);
  renderCart();
}
function removeFromCart(i){
  cart.splice(i,1);
  renderCart();
}
function renderCart(){
  els.cartList.innerHTML = '';
  let total = 0;
  cart.forEach((p,i) => {
    total += p.price;
    const li = document.createElement('li');
    li.innerHTML = `<span>${p.name}</span> <span>S/ ${p.price.toFixed(2)} <button class="btn-secondary" style="padding:.2rem .4rem" onclick="removeFromCart(${i})">x</button></span>`;
    els.cartList.appendChild(li);
  });
  els.cartTotal.textContent = total.toFixed(2);
}
window.removeFromCart = removeFromCart;

// Catalog
function render(){
  els.grid.innerHTML='';
  const q = (els.search.value || '').toLowerCase();
  const brand = els.brand.value;
  const tier = els.tier.value;
  const maxP = Number(els.price.value);

  const filtered = PRODUCTS.filter(p => {
    const okQ = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const okB = brand ? p.brand === brand : true;
    const okT = tier ? p.tier === tier : true;
    const okP = p.price <= maxP;
    return okQ && okB && okT && okP;
  });

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="info">
        <div class="meta">${p.brand} · ${p.tier.toUpperCase()}</div>
        <h4>${p.name}</h4>
        <div class="price">S/ ${p.price.toFixed(2)}</div>
        <button class="btn">Agregar</button>
      </div>`;
    card.querySelector('button').addEventListener('click', () => addToCart(p));
    els.grid.appendChild(card);
  });

  els.count.textContent = filtered.length;
}

els.price.addEventListener('input', () => {
  els.priceVal.textContent = els.price.value;
  render();
});
['search','brand','tier'].forEach(id => els[id].addEventListener('input', render));

renderCart();
render();

// Expose for inline onclick (safety)
window.addToCart = addToCart;
