let sum = 0;
let precioPostal = 0;
let carrito = [];


class libro {
    constructor(id, titulo, autor, precio) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.precio = precio;
    }
    
}

const libros = [
    new libro(1, "Cien Años de Soledad", "Gabriel Garcia Márquez", 3500),
    new libro(2, "1984", "George Orwell", 2000),
    new libro(3, "Guerra y Paz", "Leo Tolstoy", 4000),
    new libro(4, "El Conde de Montecristo", "Alexandre Dumas", 500),
    new libro(5, "Frankenstein", "Mary Shelley", 3500),
    new libro(6, "La Iliada", "Homero", 2500),
    new libro(7, "Hamlet", "William Shakespeare", 4000),
    new libro(8, "El Proceso", "Franz Kafka", 3500),
    new libro(9, "Los Hermanos Karamazov", "Fedor Dostoievski", 5500),
    new libro(10, "El Aleph", "Jorge Luis Borges", 5000),
]

function idOperacion() {
    return Math.floor(Math.random() * 9999);
}

let compra = prompt("Ingrese el nombre del libro que desea agregar a la compra o ingrese 'Finalizar' para terminar la compra.");

while (compra.toUpperCase() !== "FINALIZAR") {

    let existencia = libros.find(libro => libro.titulo.toUpperCase() === compra.toUpperCase());

    if (existencia) {

        sum += existencia.precio; 
       carrito.push(" " + existencia.titulo);
        
    } else {
        alert(`Libro fuera de stock`)
    }

    compra = prompt("Ingrese el nombre del libro que desea agregar a la compra o ingrese 'Finalizar' para terminar la compra.");

}

if (carrito.length > 0) {
    const envio = (codigopostal) => {

        switch(codigopostal){
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

    let tipoEnvio = prompt("Ingrese 'A' para retirar en tienda o ingrese 'B' para envio.");

    if(tipoEnvio.toUpperCase() === 'A') {

        alert("Su compra ha sido registrada con éxito. Recibirá un mail cuando su pedido esté listo para retirar.\n\n Datos de la compra:\n# operación:\n" + "ED" + idOperacion() + "\n\nLibros:\n" + carrito + "\n\nValor total:\n$ " + parseInt(sum));
        alert("Gracias por su compra.");

    } else {

        let codigoPostal = prompt("Ingrese la provincia de envio:").toUpperCase();
        
        envio(codigoPostal);

        alert("Su compra ha sido registrada con éxito. Recibirá un mail cuando su pedido esté en camino.\n\n Datos de la compra:\n\n# operación:\n" + "ED" + idOperacion() + "\n\nLibros:\n" + carrito + "\n\nValor total:\n$ " + parseInt(sum + precioPostal));
        alert("Gracias por su compra.")
        
    }
} else {
    alert("Su compra ha sido cancelada.")
}

