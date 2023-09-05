let sum = 0;
let precioPostal = 0;
let carrito= [];
let carritoStorage = [];
let libroDisponibles = [];

/* SE VERIFICA Y SE GUARDA EL CATALOGO EN LOCAL STORAGE */
async function recuperarlibros() {
  try {
    libroDisponibles = JSON.parse(localStorage.getItem("libro"))
    if(!libroDisponibles) {
      const response = await fetch("./catalogo.json");
      const data = await response.json();
      localStorage.setItem("libro", JSON.stringify(data));
      libroDisponibles = JSON.parse(localStorage.getItem("libro"))
    }
  } catch (error) {
    document.getElementById("catalogo").innerHTML = `
      <div class="caja-libro-carrito">
          <h2>Catalogo no disponible</h2>
      </div>
  `;
  }
}

/* CUANDO SE CARGA LA PAGINA SE RECUPERA LOS LIBROS DISPONIBLES EN EL CATALOGO */
document.addEventListener("DOMContentLoaded", async function() {
    await recuperarlibros();
    generarCatalogo();
})

/* RENDERIZAR EL CATALOGO EN PANTALLA */
const generarCatalogo = async () => {
  if(libroDisponibles) {
    libroDisponibles.forEach((libro) => {
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
}

/* RENDERIZAR EL CARRITO */
const renderizarCarrito = () => {
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  sum = 0;
  precioPostal = 0;
  document.getElementById("datosCompra").className = "novisible";
  document.getElementById("precioFinal").className = "novisible";
  document.getElementById("finalizar-compra").className = "novisible";
  document.getElementById("codigo").className = "novisible";
  document.getElementById("carrito").className = "visible";
  carritoStorage =  JSON.parse(sessionStorage.getItem("carrito"));

  let contenedor =  document.getElementById("carrito")
  contenedor.innerHTML = "";
  carritoStorage.forEach((item) => {
    let divCarrito = document.createElement("div");
    divCarrito.innerHTML = `
      <div class="caja-libro-carrito">
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
  carritoStorage.length > 0 ? 
      (document.getElementById("continuar").className = "visible")
    : 
      (document.getElementById("continuar").className = "novisible",     
      document.getElementById("envio").className = "novisible",
      sessionStorage.removeItem("carrito"),
      document.getElementById("compra").className = "popup-close",
      document.getElementById("cerrar-btn").className = "novisible"
      )
}

/* AGREGAR EN CARRITO */
const agregarCarrito = (id) => {

  let catalogoDisponible = libroDisponibles.find((libro) => libro.id === id);
  if (!carrito.includes(catalogoDisponible)) { 
      carrito.push(catalogoDisponible);
      renderizarCarrito();
      } else {
      carrito.forEach((element) => {
          element === catalogoDisponible && element.cantidadCompra++; 
      });
      renderizarCarrito();
      }
  document.getElementById("compra").className = "popup";
  document.getElementById("cerrar-btn").className = "cerrar-btn"
};

/* ELIMINAR DEL CARRITO */
const eliminarCarrito = (id) => {
    let compra = carrito.filter(function(item) {
        return item.id != id;
      });
      carrito = compra;
      renderizarCarrito();
}

/* ACCION BOTON CONTINUAR Y SELECCION TIPO DE ENVIO */
let continuarEnvio = document.getElementById("continuar");
continuarEnvio.addEventListener("click", () =>  {
  document.getElementById("envio").className = "visible",
  document.getElementById("finalizar-compra").className = "visible"
  if (document.querySelector('input[name="tipo-envio"]')) {
    document.querySelectorAll('input[name="tipo-envio"]').forEach((elem) => {
        elem.checked = false;
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
})

document.getElementById("codigo").addEventListener("input", () => envio(document.getElementById("codigo").value));

/* GUARDA EL VALOR DEL DELIVERY */
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


/* FUNCION CALCULO TOTAL COMPRA */
const finalizarCompra = document.getElementById("finalizar-compra");
carritoStorage =  JSON.parse(sessionStorage.getItem("carrito"));
finalizarCompra.addEventListener("click", () => {
    carritoStorage.forEach(({precio, cantidadCompra}) => {
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
    document.getElementById("precioFinal").className = "visible";
    document.getElementById("datosCompra").className = "visible";
    document.getElementById("finalizar-compra").className = "novisible";
    document.getElementById("envio").className = "novisible";
    document.getElementById("codigo").className = "novisible";
    document.getElementById("continuar").className = "novisible";
});

/* GENERAR ID OPERACION */
function idOperacion() {
    return Math.floor(Math.random() * 9999);
}

/* DATOS DE LA COMPRA */
const generarCompra = () => {    
    Swal.fire({
      title: '¡GRACIAS POR SU COMPRA!',
      icon: 'success',
      html:
        `<h2>Datos Compra</h2><br>` + 
        `<p>#Operación: ED${idOperacion()}</p><br>` + 
        `<b>Valor total $ ${sum}</b>`,
      footer: '<span>Recibira un mail cuando su pedido esté listo.</span>',
      showCloseButton: true,
      allowOutsideClick: true,
      customClass: {
        closeButton: 'close-sweetalert',
        confirmButton: 'btn-ok-sweetalert',
      }
    })

    document.getElementById("precioFinal").className = "novisible"
//    document.getElementById("envio").className = "novisible"
    document.getElementById("carrito").className = "novisible"
    document.getElementById("carrito").innerHTML = ""
    //document.getElementById("continuar").className = "novisible"
    document.getElementById("datosCompra").className = "novisible"
    //document.getElementById("finalizar-compra").className = "novisible";
   // document.getElementById("codigo").className = "novisible";
    document.getElementById("compra").className = "popup-close";
    sessionStorage.removeItem("carrito");
    carritoStorage = [];
    carrito = [];
}

const datosCompra = document.getElementById("datosCompra");
datosCompra.addEventListener("click", generarCompra);
 
/* CERRAR CARRITO */
const btnCerrar = () => {
    document.getElementById("compra").className = "popup-close";
}

const cerrarCarrito = document.getElementById("cerrar-btn");
cerrarCarrito.addEventListener("click", btnCerrar);

/* ABRIR CARRITO */
const btnCarrito = () => {
  if (carritoStorage.length > 0) {
    document.getElementById("compra").className = "popup";
    document.getElementById("cerrar-btn").className="cerrar-btn";
  } else {
    document.getElementById("compra").className = "popup";
    document.getElementById("cerrar-btn").className="cerrar-btn";
    document.getElementById("carrito").innerHTML = `
      <div class="caja-libro-carrito">
          <h3>No hay libros en el carrito.</h3>
      </div>
  `;
  }
  
}

const abrirCarrito = document.getElementById("btn-carrito");
abrirCarrito.addEventListener("click", btnCarrito);


/* BUSCADOR */
const buscador = () => {
  const cajaBuscador = document.getElementById("buscadorTexto").value.toUpperCase();
  const catalogoLibros = document.getElementById("catalogo");
  const mensajeBusqueda = document.getElementById("mensajeBusqueda");
  const contenedorLibro = document.querySelectorAll(".caja-libro");
  const titulos = catalogoLibros.getElementsByTagName("h3");
  
  mensajeBusqueda.className = "novisible";

  let existencia = libroDisponibles.find((libro) => libro.titulo.toUpperCase().includes(cajaBuscador));

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
    for (let i = 0; i < titulos.length; i++) {
      contenedorLibro[i].style.display = "none";
    }
    mensajeBusqueda.className = "visible";
  }
};

const cajaBuscadorContenedor = document.getElementById("buscadorTexto");
cajaBuscadorContenedor.addEventListener("input", buscador);
