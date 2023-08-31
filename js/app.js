/*
Docta Finance es una web de finanzas donde a través de APIS se obtienen valores actualizados de monedas y criptos.
- Función de login, se utiliza API para validación con diversos usuarios y contraseñas (ej: Usuario: acharlota Contraseña: M9lbMdydMN)
- Conversor de divisas con selección de la moneda o cripto deseada.
- Gráfico de predicción SOL USDT donde se compara el valor de la cripto real vs valores generados randoms.
- Gráfico "Precio en el tiempo" a 90 días de btc, eth y bnb

También posee dashboards que actualizan la interfaz de usuario con estadísticas y gráficos relacionados al mercado de criptos,
utilizando datos simulados.

- Se define una serie de funciones que actualizan elementos del DOM con estadísticas relacionadas al mercado de criptomonedas,
 widgets y operaciones de compra/venta.
- Se crean clases para manejar el almacenamiento de valores en el almacenamiento local del navegador.
- Se proporcionan datos simulados de criptomonedas, ganancias y operaciones en formato JSON.
- Se genera una funcion básica de login que se oculta luego de clickear en el boton de ingreso.

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
import {login, logOut, sweetAlertDenied, sweetAlertSuccess} from "./modules/login.js";

function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Function main
async function main() {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("main-navbar").style.display = "none";

    document.getElementById('btn').onclick = function() {
        Converter()
    }
    document.getElementById('reverse-btn').onclick = function() {
        ReverseConverter()
    }

    let token = sessionStorage.getItem("token");
    let response = false

    if (token){
        response = parseJwt(token);
    }else{
        response = await login();
    }

    if (response !== false && response.id) {
        const controller = new StorageController();
        controller.addStorage(new Storage(generateRandomValues()));
        controller.saveAllStorages();

        document.getElementById("login-section").style.display = "none";

        document.getElementById("main-navbar").style.display = "block";
        document.getElementById("dashboard").style.display = "block";

        let loginName = document.getElementById("loginName");
        loginName.textContent = "Hola, " + response.firstName;

        if (response.token){
            sweetAlertSuccess()
            sessionStorage.setItem("token", response.token);
        }

        await arsPrices(controller);
        await cryptoPrices(controller);
        await btcPrice(controller);
        await solPrice(controller);
        await ethPrice(controller);
        await bnbPrice(controller);

        barStats(controller);
        widgetsStats(controller);
        tableStats(controller);
        operations(controller);
        chartBars(controller);
        chartLine(controller, "btc_prices");
        buttonsPriceChartLine(controller);
        activeSlideButton();
        budget(controller);
        logOut();

    }else{
        sweetAlertDenied()
    }
}

main()