let sum = 0;
let precioPostal = 0;
let carrito = [];

class libros {
  constructor(id, img, titulo, autor, precio, cantidadCompra = 0) {
    this.id = id;
    this.img = img;
    this.titulo = titulo;
    this.autor = autor;
    this.precio = precio;
    this.cantidadCompra = cantidadCompra;
  }
}

const libro = [
  new libros(1, "./img/libro1.jpg", "Escuela de mujeres", "Inma López Silva", 5000),
  new libros(2, "./img/libro2.jpg", "Madera de cerezo", "Marica Bodrožić", 8000),
  new libros(3, "./img/libro3.jpg", "QED, las cosas como son", "Gertrude Stein", 6000),
  new libros(4, "./img/libro4.jpg", "Pombero", "Marina Closs", 7000),
  new libros(5, "./img/libro5.jpg", "Estado del malestar", "Nina Lykke", 4000),
  new libros(6, "./img/libro6.jpg", "Cartas a Emma Bowlcut", "Bill Callahan", 1000),
  new libros(7, "./img/libro7.jpg", "Los años", "Annie Ernaux", 3000),
  new libros(8, "./img/libro8.jpg", "Una dama perdida", "Willa Cather", 9000),
  new libros(9, "./img/libro9.jpg", "Las cosas que digo son ciertas", "Blanca Varela", 4500),
  new libros(10, "./img/libro10.jpg", "Van Gogh el suicidado por la sociedad", "Antonin Artaud", 4000),
  new libros(11, "./img/libro11.jpg", "El niño que cargaba agua en el colador", "Manoel de Barros", 9000),
  new libros(12, "./img/libro12.jpg", "La vida secreta de las plantas", "Christopher Bird", 7500),
];

/* CARGA EN EL STORAGE */
JSON.parse(localStorage.getItem("libro")) || localStorage.setItem("libro", JSON.stringify(libro));

let libroDisponibles = JSON.parse(localStorage.getItem("libro"))

/* FUNCIÓN PARA RENDERIZAR EL CARRITO */
const renderizarCarrito = () => {
    sum = 0;
    precioPostal = 0;
    document.getElementById("datosCompra").className = "novisible";
    document.getElementById("precioFinal").className = "novisible";
    document.getElementById("finalizar-compra").className = "novisible";
    document.getElementById("codigo").className = "novisible";
    document.getElementById("carrito").className = "visible";

    let contenedor =  document.getElementById("carrito")
    contenedor.innerHTML = "";
    carrito.forEach((item) => {
      let divCarrito = document.createElement("div");
      divCarrito.innerHTML = `
        <div class="caja-libro">
            <h3 id="titulo">${item.titulo}</h3>
            <p>${item.autor}</p>
            <p>Cantidad: ${item.cantidadCompra + 1}</p>
            <b>$${item.precio}</b><br><br>
            <button id="btnEliminar${item.id}">Eliminar</button>
        </div>
    `;

    document.getElementById("carrito").append(divCarrito);
    let btnEliminar = document.getElementById(`btnEliminar${item.id}`);
    btnEliminar.addEventListener("click", () => eliminarCarrito(item.id));
     })
     carrito.length > 0 ? 
        (document.getElementById("continuar").className = "visible")
      : 
        (document.getElementById("continuar").className = "novisible",     document.getElementById("envio").className = "novisible")

      let continuarEnvio = document.getElementById("continuar");
      continuarEnvio.addEventListener("click", () => {document.getElementById("envio").className = "visible",
     document.getElementById("finalizar-compra").className = "visible"
    })

      if (document.querySelector('input[name="tipo-envio"]')) {
        
        document.querySelectorAll('input[name="tipo-envio"]').forEach((elem) => {
            
            elem.addEventListener("change", function(event) {
                let item = event.target.outerHTML;
                if (item.indexOf("delivery") > -1) {

                document.getElementById("codigo").className = "visible";

            } else {
                document.getElementById("codigo").className = "novisible";
            }
            });
        });
      }
}

const envio = (codigopostal) => {
    switch(codigopostal.toUpperCase()){
        case 'CABA':
            precioPostal = 500;
            break;

        case 'BUENOS AIRES':
            precioPostal = 800;
            break;
        default:
            precioPostal = 1200;
            break;
    }
}

/* FUNCION AGREGAR EN CARRITO */
const agregarCarrito = (id) => {

    let catalogoDisponible = libroDisponibles.find((libro) => libro.id === id);
    if (!carrito.includes(catalogoDisponible)) { 
        carrito.push(catalogoDisponible);
        renderizarCarrito();
        } else {
        carrito.forEach((element) => {
            element === catalogoDisponible && element.cantidadCompra++; 
        });
        renderizarCarrito();}
     };

/* FUNCION ELIMINAR DEL CARRITO */
const eliminarCarrito = (id) => {
    let compra = carrito.filter(function(item) {
        return item.id != id;
      });
      carrito = compra;
      renderizarCarrito();
}

/* CARGAR PRODUCTOS EN EL DOM */
document.addEventListener("DOMContentLoaded", () => {
    generarCatalogo(libroDisponibles)
})

const generarCatalogo = (libro) => {
  libro.forEach((libro) => {
    let div = document.createElement("div");
    div.innerHTML = `
        <div class="caja-libro">
            <img src="${libro.img}" class="img-catalogo">
            <h3 id="titulo">${libro.titulo}</h3>
            <p>${libro.autor}</p>
            <b>$${libro.precio}</b><br><br>
            <button id="boton${libro.id}" class="agregar">Agregar al carrito</button>
        </div>
    `;

    document.getElementById("catalogo").append(div);

  let btnAgregar = document.getElementById(`boton${libro.id}`);
  btnAgregar.addEventListener("click", () => agregarCarrito(libro.id));
});
}

/* FUNCION INPUT BUSCADOR */
const buscador = () => {
  const cajaBuscador = document.getElementById("buscadorTexto").value.toUpperCase();
  const catalogoLibros = document.getElementById("catalogo");
  const mensajeBusqueda = document.getElementById("mensajeBusqueda");
  const contenedorLibro = document.querySelectorAll(".caja-libro");
  const titulos = catalogoLibros.getElementsByTagName("h3");
  
  mensajeBusqueda.className = "novisible";

  let existencia = libro.find((libro) => libro.titulo.toUpperCase().includes(cajaBuscador));

  if (existencia) {
    for (let i = 0; i < titulos.length; i++) {
      let comparar = contenedorLibro[i].getElementsByTagName("h3")[0];
      let textoIngresado = comparar.textContent || comparar.innerHTML;

      if (textoIngresado.toUpperCase().indexOf(cajaBuscador) > -1) {
        contenedorLibro[i].style.display = "";
      } else {
        contenedorLibro[i].style.display = "none";
      }
    }
  } else {
    catalogoLibros.style.display = "";
    mensajeBusqueda.className = "visible";
  }
};

const cajaBuscadorContenedor = document.getElementById("buscadorTexto");
cajaBuscadorContenedor.addEventListener("input", buscador);

document.getElementById("codigo").addEventListener("input", () => envio(document.getElementById("codigo").value));

/* FUNCION CALCULO TOTAL COMPRA */
const finalizarCompra = document.getElementById("finalizar-compra");
finalizarCompra.addEventListener("click", () => {
    carrito.forEach(({precio, cantidadCompra}) => {
        sum += precio * (cantidadCompra + 1 );
        
    });
    sum += precioPostal;
    let subTotal = document.createElement("div");
    document.getElementById("precioFinal").innerHTML = "";
    subTotal.innerHTML = `
        <div>
            <b>Valor Total: $ ${sum}</b>
        </div>
    `;

    document.getElementById("precioFinal").append(subTotal);
    document.getElementById("precioFinal").className = "visible"
    document.getElementById("datosCompra").className = "visible"
});

/* FUNCION GENERAR ID OPERACION */
function idOperacion() {
    return Math.floor(Math.random() * 9999);
}

/* FUNCION DATOS DE LA COMPRA */
const generarCompra = () => {
    document.getElementById("contenedorDatosCompra").className = "visible"
    let datosCompra = document.createElement("div");
    document.getElementById("ticket-compra") && (document.getElementById("ticket-compra").innerHTML = "")
    datosCompra.innerHTML = `
        <div id="ticket-compra">
            <h2>¡GRACIAS POR SU COMPRA!</h2><br>
            <h3>Datos Compra</h3><br>
            <p>#Operación: ED${idOperacion()}</p>
            <b>Valor total $${sum}</b>
        </div>
    `;

    document.getElementById("contenedorDatosCompra").append(datosCompra);
    document.getElementById("precioFinal").className = "novisible"
    document.getElementById("envio").className = "novisible"
    document.getElementById("carrito").className = "novisible"
    document.getElementById("continuar").className = "novisible"
    document.getElementById("datosCompra").className = "novisible"
    document.getElementById("cerrar").className = "visible"
    document.getElementById("finalizar-compra").className = "novisible";
    document.getElementById("codigo").className = "novisible";
}

const datosCompra = document.getElementById("datosCompra");
datosCompra.addEventListener("click", generarCompra);

const btnCerrar = () => {
  document.getElementById("contenedorDatosCompra").className = "novisible"
  document.getElementById("cerrar").className = "novisible"
  document.getElementById("codigo").className = "novisible";
  carrito = [];
  sum = 0;
  precioPostal = 0;
}

const cerrarDatos = document.getElementById("cerrar");
cerrarDatos.addEventListener("click", btnCerrar);