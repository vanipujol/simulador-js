let resultado = "";

// Función para calcular el precio especial aplicando un descuento del 10%
function specialPrice(price) {
    return price * 0.9;
}

// Función para validar que se ingrese un número válido
function validateNumber(number){

    if(!isNaN(number))
        return number;

    do {
        number = Number(prompt("El valor ingresado tiene que ser un número"));
    }while (isNaN(number));

    return number;
}

// Función principal
function main() {

    let productQuantity = Number(prompt("Ingrese la cantidad de productos que desea añadir al catálogo"));
    for (let i = 0; i < productQuantity; i++) {
        let productIndex = i + 1;
        let productCode = validateNumber(Number(prompt("Ingrese el código del producto " + productIndex)));

        let productName = prompt("Ingrese el nombre del producto");
        let productPrice = validateNumber(Number(prompt("Ingrese el precio del producto")));

        resultado = resultado +  "\n Nombre del producto: " +  productName + "\n Código del producto: " +  productCode + "\n Precio especial: $"  + specialPrice(productPrice) + "\n";
    }

    alert("Productos cargados: \n" + resultado);

    let continueAdd = prompt("Desea hacer otro catálogo Si/No").toLowerCase();
    if (continueAdd === "si") {
        resultado = ""; // Reinicia la variable de resultado
        main(); // Llama a la función principal nuevamente para crear otro catálogo
    }else {
        alert ("Muchas gracias por usar nuestros servicios");
    }

    return resultado;
}

main();