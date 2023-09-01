/**
Docta Finance brinda información financiera obtenida de diversas APIs, herramientas de conversión, gráficos, características de autenticación y visualización
de datos de criptomonedas y operaciones simuladas.

- Login: se utiliza API para validación con diversos usuarios y contraseñas, se muestran alertas de éxito y error utilizando SweetAlert, también permite que los usuarios
 cierren sesión. (ej de inicio de sesión --> usuario: acharlota contraseña: M9lbMdydMN)

- Panel deslizante de divisas: se muestra informacion extraída de dos APIs sobre las tasas de cambio de monedas y criptos.
- Conversor de divisas: contiene funciones para obtener y manejar precios de moneda y criptos, actualizar valores, realizar conversiones y revertir la dirección de la misma.
- Gráfico de predicción SOL USDT: se obtiene del almacenamiento local el valor de la cripto y se la compara con valores generados aleatorios.
- Gráfico "Precio en el tiempo" btc, eth y bnb:  los datos se obtienen del almacenamiento local, se formatean y se utilizan para crear el gráfico de líneas, además, según el botón
 que se presione, se maneja la interacción del gráfico cambiando los datos del mismo.

- Panel del balance operacional: actualiza los elementos del DOM con estadísticas relacionadas con las ganancias en widgets.
- Criptomonedas: esta función se utiliza para mostrar estadísticas de criptomonedas en la tabla, utilizando datos simulados en formato JSON y almacenados localmente.
- Operaciones: permite la visualización de operaciones utilizando datos simulados y genera elementos HTML correspondientes.

 */

import {arsPrices, budget, Converter, cryptoPrices, ReverseConverter} from "./modules/converter.js";
import {
    barStats,
    btcPrice,
    chartBars,
    chartLine,
    ethPrice,
    bnbPrice,
    generateRandomValues,
    operations, solPrice,
    tableStats,
    widgetsStats, buttonsPriceChartLine, activeSlideButton
} from "./modules/widgets.js";
import {StorageController, Storage} from "./modules/storage.js";
import {login, logOut, parseJwt, sweetAlertDenied, sweetAlertSuccess} from "./modules/login.js";



/**
 * Main function for initializing the dashboard application.
 * - Initially hides the dashboard and main navigation bar.
 * - Sets click event handlers for conversion and reverse conversion buttons.
 * - Retrieves the user's token from session storage.
 * - If a valid token exists, the user is logged in, and the application initializes.
 * - If no token is found, the user is prompted to log in using the `login` function.
 */
async function main() {
    // Hide the dashboard and main navigation bar initially.
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("main-navbar").style.display = "none";

    // Set the click event handler for the "Convert" button.
    document.getElementById('btn').onclick = function() {
        Converter()
    }
    // Set the click event handler for the "Reverse" button.
    document.getElementById('reverse-btn').onclick = function() {
        ReverseConverter()
    }

    // Get the token from the session storage.
    let token = sessionStorage.getItem("token");
    let response = false

    if (token){
        response = parseJwt(token);
    }else{
        response = await login();
    }

    // Check if the 'response' is not false and has an 'id' property. With this, we are going to log in the user.
    if (response !== false && response.id) {
        // user logged in. Initialization of storage controller and random values generator
        const controller = new StorageController();
        controller.addStorage(new Storage(generateRandomValues()));
        controller.saveAllStorages();

        // Hide the login section.
        document.getElementById("login-section").style.display = "none";

        // Show the main navigation bar and dashboard.
        document.getElementById("main-navbar").style.display = "block";
        document.getElementById("dashboard").style.display = "block";

        // Update the text content of the loginName element to greet the user.
        let loginName = document.getElementById("loginName");
        loginName.textContent = "Hola, " + response.firstName;

        // Check if a token is present in the 'response'. If the token is present, the user logged in for first time, and we store the token in a session
        if (response.token){
            sweetAlertSuccess()
            sessionStorage.setItem("token", response.token);
        }

        // Getting the information from different APIs and store them in localStorage
        await arsPrices(controller);
        await cryptoPrices(controller);
        await btcPrice(controller);
        await solPrice(controller);
        await ethPrice(controller);
        await bnbPrice(controller);

        // Building the different widgets
        barStats(controller);
        widgetsStats(controller);
        tableStats(controller);
        operations(controller);
        chartBars(controller);
        chartLine(controller, "btc_prices");
        buttonsPriceChartLine(controller);
        activeSlideButton();
        budget(controller);

        // logout function
        logOut();

    }else{
        sweetAlertDenied()
    }
}

main()