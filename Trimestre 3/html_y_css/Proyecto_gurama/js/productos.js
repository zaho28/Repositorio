// vistas/productos.js
const productos = [
  {
    id: 1,
    nombre: "Virgencitas de crochet de 20 CM",
    descripcion: "Hechas totalmente a mano con hilo de algodón. Tamaño 20 cm. Ideales para regalo o decoración.",
    precio: "$45.000",
    Oferta: "Ofertas del 15%",
    imagen: "../imagenes/1.png"
  },
  {
    id: 2,
    nombre: "Ramo de tulipanes tejidos",
    descripcion: "Tulipanes de hilo 100% algodón. Ramo de 7 flores con cinta decorativa. Perfecto para regalar.",
    precio: "$38.000",
    imagen: "../imagenes/2.png"
  },
  {
    id: 3,
    nombre: "Cubrelecho español",
    descripcion: "Cubrelecho tamaño doble, diseño elegante y suave al tacto. Incluye dos fundas.",
    precio: "$120.000",
    imagen: "../imagenes/3.png"
  },
  {
    id: 4,
    nombre: "Amigurumi Stitch",
    descripcion: "Muñeco tejido a mano con lana antialérgica. Altura 25 cm. Detalles cuidadosamente bordados.",
    precio: "$55.000",
    imagen: "../imagenes/4.png"
  },
  {
    id: 5,
    nombre: "Amigurumi perrito",
    descripcion: "Perrito tejido con hilo de algodón y relleno hipoalergénico. Ideal como regalo.",
    precio: "$48.000",
    imagen: "../imagenes/5.png"
  },
  {
    id: 6,
    nombre: "Accesorios para maleta - pack 1",
    descripcion: "Set de accesorios tejidos decorativos para maletas. Hechos a mano con amor.",
    precio: "$20.000",
    imagen: "../imagenes/6.png"
  },
  {
    id: 7,
    nombre: "Accesorios para maleta - pack 2",
    descripcion: "Accesorios tejidos a crochet para decorar tus maletas o bolsos.",
    precio: "$22.000",
    imagen: "../imagenes/7.png"
  },
  {
    id: 8,
    nombre: "Sábanas para cama doble",
    descripcion: "Juego de sábanas suaves y frescas. Incluye sábana superior, inferior y fundas.",
    precio: "$95.000",
    imagen: "../imagenes/8.png"
  },
  {
    id: 9,
    nombre: "Pareja de perritos amigurumi",
    descripcion: "Dos perritos tejidos con hilo de algodón, ideales para regalar en pareja.",
    precio: "$60.000",
    imagen: "../imagenes/9.png"
  },
  {
    id: 10,
    nombre: "Llavero corazón tejido",
    descripcion: "Llavero decorativo con diseño de corazón. Ideal para mochilas o bolsos.",
    precio: "$12.000",
    imagen: "../imagenes/10.png"
  },
  {
    id: 11,
    nombre: "Tulipán tejido individual",
    descripcion: "Tulipán tejido con hilo 100% algodón. Perfecto como detalle personalizado.",
    precio: "$10.000",
    imagen: "../imagenes/11.png"
  },
  {
    id: 12,
    nombre: "Cojín decorativo tejido",
    descripcion: "Cojín suave con forro tejido a mano. Perfecto para habitación o sala.",
    precio: "$35.000",
    imagen: "../imagenes/12.png"
  },
  {
    id: 13,
    nombre: "Juego de llaveros personalizados",
    descripcion: "Llaveros tejidos de personajes o figuras a elección. Pack de 2 unidades.",
    precio: "$25.000",
    imagen: "../imagenes/13.png"
  },
  {
    id: 14,
    nombre: "Osito navideño tejido",
    descripcion: "Adorno navideño de osito tejido a crochet. Perfecto para decorar en diciembre.",
    precio: "$40.000",
    imagen: "../imagenes/14.png"
  },
  {
    id: 15,
    nombre: "Muñeca artesanal amigurumi",
    descripcion: "Muñeca tejida a mano con ropa removible y detalles personalizados.",
    precio: "$65.000",
    imagen: "../imagenes/15.png"
  },
  {
    id: 16,
    nombre: "Cubrelecho floral doble faz",
    descripcion: "Cubrelecho de diseño floral reversible, incluye dos fundas decorativas.",
    precio: "$110.000",
    imagen: "../imagenes/16.png"
  },
  {
    id: 17,
    nombre: "Cubrelecho infantil azul",
    descripcion: "Cubrelecho temático para niños, suave y lavable. Ideal para cama sencilla.",
    precio: "$95.000",
    imagen: "../imagenes/17.png"
  },
  {
    id: 18,
    nombre: "Cubrelecho juvenil blanco",
    descripcion: "Diseño moderno y minimalista. Tela fresca y de fácil lavado.",
    precio: "$100.000",
    imagen: "../imagenes/18.png"
  },
  {
    id: 19,
    nombre: "Cubrelecho infantil temático",
    descripcion: "Cubrelecho con estampado de dibujos animados. Suave, cómodo y lavable.",
    precio: "$98.000",
    imagen: "../imagenes/19.png"
  },
  {
    id: 20,
    nombre: "Cubrelecho gris con líneas",
    descripcion: "Diseño elegante en tonos neutros, ideal para dormitorio moderno.",
    precio: "$115.000",
    imagen: "../imagenes/20.png"
  },
  {
    id: 21,
    nombre: "Rosa tejida a crochet",
    descripcion: "Flor tejida en color rojo con tallo verde. Ideal para obsequiar.",
    precio: "$9.000",
    imagen: "../imagenes/21.png"
  },
  {
    id: 22,
    nombre: "Angelito amigurumi",
    descripcion: "Figura de ángel tejido a mano con detalles dorados y alas suaves.",
    precio: "$45.000",
    imagen: "../imagenes/22.png"
  },
  {
    id: 23,
    nombre: "Pastel amigurumi decorativo",
    descripcion: "Pastelito tejido en lana suave, ideal como adorno o regalo tierno.",
    precio: "$35.000",
    imagen: "../imagenes/23.png"
  },
  {
    id: 24,
    nombre: "Perrito Paco tejido",
    descripcion: "Amigurumi inspirado en la ternura de los perritos reales. Relleno suave.",
    precio: "$50.000",
    imagen: "../imagenes/24.png"
  },
  {
    id: 25,
    nombre: "Spiderman amigurumi",
    descripcion: "Muñeco de Spiderman tejido a crochet. Detallado y resistente.",
    precio: "$60.000",
    imagen: "../imagenes/25.png"
  },
  {
    id: 26,
    nombre: "Llavero ositos tejidos",
    descripcion: "Set de dos llaveros en forma de osito tejidos a mano.",
    precio: "$22.000",
    imagen: "../imagenes/26.png"
  },
  {
    id: 27,
    nombre: "Minions tejidos",
    descripcion: "Divertidos minions tejidos a crochet. Altura 10 cm. Se venden por pareja.",
    precio: "$35.000",
    imagen: "../imagenes/27.png"
  },
  {
    id: 28,
    nombre: "Charlie Brown y Snoopy tejidos",
    descripcion: "Pareja de personajes clásicos tejidos a mano. Coleccionables.",
    precio: "$65.000",
    imagen: "../imagenes/28.png"
  },
  {
    id: 29,
    nombre: "Muñeco Vudú amigurumi",
    descripcion: "Figura decorativa estilo vudú, hecha a crochet con detalles bordados.",
    precio: "$42.000",
    imagen: "../imagenes/29.png"
  },
  {
    id: 30,
    nombre: "Kuromi amigurumi",
    descripcion: "Personaje tejido con lana hipoalergénica, ideal para regalo o colección.",
    precio: "$55.000",
    imagen: "../imagenes/30.png"
  }
];

// Mostrar el producto en vistas/productos.html
function mostrarProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    document.getElementById("detalle").innerHTML = "<p>Producto no encontrado</p>";
    return;
  }

  document.getElementById("detalle").innerHTML = `
    <div class="tarjeta">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h2>${producto.nombre}</h2>
      <p>${producto.descripcion}</p>
      <h3>${producto.precio}</h3>
      <a href="../index.html" class="btn">Volver al catálogo</a>
    </div>
  `;
}

if (
  window.location.pathname.includes("/producto.html") ||
  window.location.pathname.includes("/producto_2.html")
) {
  mostrarProducto();
}
