import fitz, base64, os
from PIL import Image
from io import BytesIO

# PDFs de entrada (en la misma carpeta)
pdfs = [
    "CATALAGO ECONOMICOS UVEPROTECH_compressed.pdf",
    "CATALAGO GAMA MEDIA UVEPROTECH_compressed.pdf",
    "CATALAGO IPHONES UVEPROTECH_compressed.pdf"
]

# Productos desde catálogos (nombres + precios)
productos = {
    "economicos": [
        {"nombre":"Xiaomi Redmi A3 - 3GB/64GB","precio":399},
        {"nombre":"Xiaomi Redmi A3x - 3GB/64GB","precio":389},
        {"nombre":"Xiaomi Redmi A3x - 4GB/128GB","precio":459},
        {"nombre":"Xiaomi Redmi 14C - 4GB/128GB","precio":550},
        {"nombre":"Xiaomi Redmi 14C - 4GB/256GB","precio":599},
        {"nombre":"Xiaomi Redmi 14C - 8GB/256GB","precio":749},
        {"nombre":"Xiaomi Redmi 13 - 6GB/128GB","precio":769},
        {"nombre":"Xiaomi Redmi 13 - 8GB/256GB","precio":849},
        {"nombre":"Samsung Galaxy A06 - 4GB/64GB","precio":439},
        {"nombre":"Samsung Galaxy A06 - 4GB/128GB","precio":569},
        {"nombre":"Samsung Galaxy A16 - 4GB/128GB","precio":760},
        {"nombre":"Samsung Galaxy A16 - 8GB/256GB","precio":899},
        {"nombre":"Honor X6B - 4GB/128GB","precio":580},
        {"nombre":"Honor X6B - 6GB/256GB","precio":650},
        {"nombre":"Honor X7B - 8GB/256GB","precio":780},
        {"nombre":"Honor X6A PLUS - 6GB/256GB","precio":799},
        {"nombre":"Honor X7C - 8GB/256GB","precio":840},
        {"nombre":"Honor X8C - 8GB/256GB","precio":959},
        {"nombre":"Honor X8B - 8GB/256GB","precio":984},
        {"nombre":"Motorola E14 - 2GB/64GB","precio":399},
        {"nombre":"Motorola G04s - 4GB/128GB","precio":518},
        {"nombre":"Motorola G24 - 4GB/256GB","precio":620},
        {"nombre":"Motorola G34 5G - 8GB/256GB","precio":790},
        {"nombre":"ZTE A34 - 3GB/64GB","precio":380},
        {"nombre":"ZTE A54 - 4GB/128GB","precio":440},
        {"nombre":"ZTE A73 - 4GB/256GB","precio":539},
        {"nombre":"ZTE V40 VITA - 4GB/128GB","precio":560},
        {"nombre":"ZTE V40 DESIGN - 6GB/128GB","precio":589},
        {"nombre":"ZTE V50 VITA - 6GB/256GB","precio":629},
        {"nombre":"ZTE V50 VITA - 6GB/256GB","precio":949},
        {"nombre":"TECNO SPARK GO 2024 - 3GB/64GB","precio":430},
        {"nombre":"TECNO SPARK GO 2024 - 4GB/128GB","precio":499},
        {"nombre":"TECNO SPARK 30 - 8GB/256GB","precio":720},
        {"nombre":"TECNO SPARK 30 PRO - 8GB/256GB","precio":850}
    ],
    "gama": [
        {"nombre":"Xiaomi Redmi Note 14 - 6GB/128GB","precio":849},
        {"nombre":"Xiaomi Redmi Note 14 - 8GB/256GB","precio":919},
        {"nombre":"Xiaomi Redmi Note 14 Pro 4G - 8GB/256GB","precio":1269},
        {"nombre":"Xiaomi Redmi Note 14 Pro 5G - 8GB/256GB","precio":1479},
        {"nombre":"Xiaomi Redmi Note 13 Pro Plus 5G - 8GB/256GB","precio":1549},
        {"nombre":"Xiaomi Redmi Note 14 Pro Plus 5G - 8GB/256GB","precio":1689},
        {"nombre":"Xiaomi Redmi Note 13 Pro Plus 5G - 12GB/512GB","precio":1719},
        {"nombre":"Xiaomi Redmi Note 14 Pro Plus 5G - 12GB/512GB","precio":1799},
        {"nombre":"Xiaomi Poco X7 - 12GB/512GB","precio":1460},
        {"nombre":"Xiaomi Poco X6 Pro - 12GB/512GB","precio":1510},
        {"nombre":"Xiaomi Poco X7 Pro - 12GB/256GB","precio":1549},
        {"nombre":"Xiaomi Poco F6 - 12GB/512GB","precio":1690},
        {"nombre":"Xiaomi Poco X7 Pro - 12GB/512GB","precio":1720},
        {"nombre":"Xiaomi Poco F6 Pro - 12GB/256GB","precio":1960},
        {"nombre":"Xiaomi Poco F6 Pro - 12GB/512GB","precio":2099},
        {"nombre":"Samsung Galaxy A25 5G - 6GB/128GB","precio":990},
        {"nombre":"Samsung Galaxy A35 5G - 6GB/128GB","precio":1299},
        {"nombre":"Samsung Galaxy A35 5G - 8GB/256GB","precio":1449},
        {"nombre":"Samsung Galaxy A36 5G - 8GB/256GB","precio":1669},
        {"nombre":"Samsung Galaxy A55 5G - 8GB/128GB","precio":1699},
        {"nombre":"Samsung Galaxy A55 5G - 8GB/256GB","precio":1760},
        {"nombre":"Samsung Galaxy A36 5G - 8GB/256GB","precio":1899},
        {"nombre":"Samsung Galaxy A56 5G - 12GB/512GB","precio":2049},
        {"nombre":"Honor 200 Lite - 8GB/256GB","precio":1160},
        {"nombre":"Honor Magic 7 Lite - 8GB/256GB","precio":1479},
        {"nombre":"Honor Magic 7 Lite - 8GB/512GB","precio":1649},
        {"nombre":"Honor 200 Lite - 12GB/256GB","precio":1920},
        {"nombre":"Motorola G85 5G - 8GB/256GB","precio":1159},
        {"nombre":"Motorola Edge 50 Fusion - 8GB/256GB","precio":1590},
        {"nombre":"Motorola Edge 50 - 12GB/256GB","precio":1850},
        {"nombre":"ZTE Nubia Focus Pro 5G - 8GB/256GB","precio":1259}
    ],
    "iphones": [
        {"nombre":"iPhone 13 - 4GB/128GB","precio":2349},
        {"nombre":"iPhone 14 - 6GB/128GB","precio":2799},
        {"nombre":"iPhone 16e - 8GB/128GB","precio":2979},
        {"nombre":"iPhone 15 - 6GB/128GB","precio":3099},
        {"nombre":"iPhone 16 - 8GB/128GB","precio":3460},
        {"nombre":"iPhone 16 - 8GB/256GB","precio":4349},
        {"nombre":"iPhone 16 Pro - 8GB/128GB","precio":4799},
        {"nombre":"iPhone 16 Pro - 8GB/256GB","precio":4990},
        {"nombre":"iPhone 16 Pro - 8GB/128GB","precio":5199},
        {"nombre":"iPhone 15 Pro Max - 8GB/256GB","precio":5149},
        {"nombre":"iPhone 16 Pro - 8GB/256GB","precio":5399},
        {"nombre":"iPhone 16 Plus - 8GB/256GB","precio":5460},
        {"nombre":"iPhone 16 Pro Max - 8GB/256GB","precio":5699},
        {"nombre":"iPhone 16 Pro Max - 8GB/256GB E-Sim","precio":5499},
        {"nombre":"iPhone 16 Pro Max - 8GB/512GB E-Sim","precio":6199},
        {"nombre":"iPhone 16 Pro Max - 8GB/512GB","precio":6490},
        {"nombre":"iPhone 16 Pro Max - 8GB/1TB","precio":7199}
    ]
}

# 🔹 Extraer imágenes en orden y asignarlas secuencialmente a cada producto
def pdf_images_to_base64(pdfs):
    base64_images = []
    for pdf in pdfs:
        doc = fitz.open(pdf)
        for page in doc:
            for img in page.get_images(full=True):
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                if pix.n - pix.alpha < 4:
                    pil_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    pil_img.thumbnail((300,300))
                    buf = BytesIO()
                    pil_img.save(buf, format="PNG")
                    base64_images.append("data:image/png;base64,"+base64.b64encode(buf.getvalue()).decode())
    return base64_images

imgs = pdf_images_to_base64(pdfs)

# asignar imágenes secuencialmente
index = 0
for categoria in productos:
    for prod in productos[categoria]:
        if index < len(imgs):
            prod["img"] = imgs[index]
            index += 1

# 🔹 Generar HTML
html = """<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8">
<title>UVEPROTECH - Venta de Celulares</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{margin:0;font-family:Arial,sans-serif;background:#f9f9f9}
header{background:#005bbb;color:#fff;padding:15px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center}
header h1{margin:0;font-size:22px;cursor:pointer}
nav{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
nav a{color:#fff;text-decoration:none;font-weight:bold;cursor:pointer}
.carrito{font-size:18px;margin-left:10px}
.buscador{padding:5px;border-radius:5px;border:1px solid #ccc}
.container{padding:20px}
.oferta{background:yellow;padding:15px;margin-bottom:20px;border-radius:10px;font-weight:bold}
.productos{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:15px}
.card{background:#fff;padding:15px;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,0.1);text-align:center}
.card img{width:100%;max-width:180px;height:auto;margin-bottom:10px;border-radius:8px}
.card button{margin:5px;padding:8px 10px;border:none;border-radius:5px;cursor:pointer}
.btn-cart{background:#005bbb;color:#fff}
.btn-wa{background:#25D366;color:#fff}
footer{background:#005bbb;color:#fff;text-align:center;padding:10px;margin-top:20px}
@media(max-width:600px){header{flex-direction:column;align-items:flex-start}nav{justify-content:flex-start}}
</style></head><body>
<header>
  <h1 onclick="navigate('inicio')">UVEPROTECH</h1>
  <nav>
    <a onclick="navigate('inicio')">Inicio</a>
    <a onclick="navigate('economicos')">Económicos</a>
    <a onclick="navigate('gama')">Gama Media</a>
    <a onclick="navigate('iphones')">iPhones</a>
    <input type="text" id="buscar" class="buscador" placeholder="Buscar producto">
    <span class="carrito">🛒 <span id="cartCount">0</span></span>
  </nav>
</header>
<div class="container" id="content"></div>
<footer>© 2025 UVEPROTECH - Venta de celulares</footer>
<script>
let carrito = [];
const productos = """+str(productos).replace("'",'"')+""";

function renderOferta(){
  return `<div class="oferta">
  📢 Ofertas Especiales:<br>
  - iPhone 14 - S/2,799<br>
  - Samsung Galaxy A35 5G - S/1,299<br>
  - Xiaomi Redmi A3x - S/389
  </div>`;
}
function renderProductos(lista){
  return `<div class="productos">`+lista.map(p=>`
  <div class="card">
    <img src="${p.img}" alt="${p.nombre}">
    <h3>${p.nombre}</h3>
    <p><b>S/${p.precio}</b></p>
    <button class="btn-cart" onclick="addCart('${p.nombre}')">Agregar al carrito</button>
    <a href="https://wa.me/51949030039?text=Hola,%20me%20interesa%20${encodeURIComponent(p.nombre)}" target="_blank">
      <button class="btn-wa">WhatsApp</button>
    </a>
  </div>`).join('')+`</div>`;
}
function navigate(page){
  let html="";
  if(page==="inicio"){html=renderOferta()+"<h2>Bienvenido a UVEPROTECH</h2><p>Explora nuestras gamas de celulares.</p>";}
  else if(page==="economicos"){html=renderOferta()+"<h2>Celulares Económicos</h2>"+renderProductos(productos.economicos);}
  else if(page==="gama"){html=renderOferta()+"<h2>Celulares Gama Media</h2>"+renderProductos(productos.gama);}
  else if(page==="iphones"){html=renderOferta()+"<h2>iPhones</h2>"+renderProductos(productos.iphones);}
  document.getElementById("content").innerHTML=html;
}
function addCart(nombre){
  carrito.push(nombre);
  document.getElementById("cartCount").innerText=carrito.length;
  alert(nombre+" agregado al carrito");
}
document.getElementById("buscar").addEventListener("input",function(){
  const term=this.value.toLowerCase();
  let res=[];
  Object.values(productos).forEach(lista=>{
    res=res.concat(lista.filter(p=>p.nombre.toLowerCase().includes(term)));
  });
  document.getElementById("content").innerHTML=renderOferta()+"<h2>Resultados de búsqueda</h2>"+renderProductos(res);
});
navigate('inicio');
</script></body></html>"""

with open("index.html","w",encoding="utf-8") as f:
    f.write(html)

print("✅ Archivo index.html generado con todos los productos e imágenes Base64")
