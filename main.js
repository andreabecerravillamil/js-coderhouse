let sum = 0;
let precioPostal = 0;

let valorLibro = prompt("Ingrese el valor del libro o 'Finalizar' para terminar la compra");

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

while (valorLibro.toUpperCase() !== 'FINALIZAR') {
   sum += parseInt(valorLibro);
   valorLibro = prompt("Ingrese el valor del libro o 'Finalizar' para terminar la compra");
}

let tipoEnvio = prompt("Ingrese 'A' para retirar en tienda o ingrese 'B' para envio.");

if(tipoEnvio.toUpperCase() === 'A') {

    alert("Su compra ha sido registrada con éxito. El total es de $ " + parseInt(sum) + " pesos. Recibirá un mail cuando su pedido esté listo para retirar.");

} else {

    let codigoPostal = prompt("Ingrese la provincia de envio:").toUpperCase();
    
    envio(codigoPostal);

    alert("El total de la compra es de $ " + parseInt(sum + precioPostal) + " pesos.");

    alert("Su compra ha sido registrada con éxito. Recibirá un mail cuando su pedido esté en camino.")
}





