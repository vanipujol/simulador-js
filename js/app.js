/*

El siguiente dashboard actualiza la interfaz de usuario con estadísticas y gráficos relacionados al mercado de criptos, utilizando datos simulados.

- Se define una serie de funciones que actualizan elementos del DOM con estadísticas relacionadas al mercado de criptomonedas, widgets y operaciones de compra/venta.
- Se crean clases para manejar el almacenamiento de valores en el almacenamiento local del navegador.
- Se proporcionan datos simulados de criptomonedas, ganancias y operaciones en formato JSON.
- Se definen funciones con el fin de generar valores para gráficos de barras y líneas.
- Se genera una funcion básica de login que se oculta luego de clickear en el boton de ingreso.

*/

// This function updates the DOM elements with statistics related to a cryptocurrency market
function barStats(controller) {

    let prediction = document.getElementById("prediction");
    let value = controller.getFromLocalStorage("values");
    let predictionText = ""

    if (value.prediction === 1) {
        predictionText = "El mercado se encuentra en estado alcista"
    } else {
        predictionText = "El mercado se encuentra en estado bajista"
    }

    prediction.innerText = predictionText;

    let cryptocurrency = document.getElementById("cryptocurrency");
    cryptocurrency.innerText = value.cryptocurrency;

    let open = document.getElementById("open");
    open.innerText = value.open;

    let low = document.getElementById("low");
    low.innerText = value.low;

    let high = document.getElementById("high");
    high.innerText = value.high;

    let close = document.getElementById("close");
    close.innerText = value.close;
}

// This function updates the DOM elements with widget statistics related to wins
function widgetsStats(controller) {
    let today = document.getElementById("today");
    let wins = controller.getFromLocalStorage("wins");

    let percentageToday = 100 + ((wins.today - wins.weekly) / wins.weekly) * 100;
    let percentageWeek = 100 + ((wins.weekly - wins.monthly) / wins.monthly) * 100;

    today.innerHTML = wins.today +
        '<span class="text-' + (percentageToday >= 0 ? 'success' : 'danger') + ' text-sm font-weight-bolder">' +
        (percentageToday >= 0 ? '+' : '') + percentageToday.toFixed(1) + '%' +
        '</span>';

    let week = document.getElementById("week");

    week.innerHTML = wins.weekly +
        '<span class="text-' + (percentageWeek >= 0 ? 'success' : 'danger') + ' text-sm font-weight-bolder">' +
        (percentageWeek >= 0 ? '+' : '') + percentageWeek.toFixed(1) + '%' +
        '</span>';

    let monthly = document.getElementById("monthly");
    monthly.innerHTML = wins.monthly

    let lastdays = document.getElementById("lastdays");
    lastdays.innerHTML = wins.lastdays
}

// This function populates a table with cryptocurrency statistics
function tableStats(controller) {
    let cryptocurrencies = controller.getFromLocalStorage("cryptocurrencies")

    let tableBody = document.getElementById("tableBody");
    cryptocurrencies.forEach((element) => {

            tableBody.innerHTML += ' <tr>\n' +
                '                      <td>\n' +
                '                        <div class="d-flex px-2 py-1 ">\n' +
                '                          <div>\n' +
                '                            <img src="./img/small-logos/' + element.name + '.png" class="avatar avatar-sm me-3" alt="img">\n' +
                '                          </div>\n' +
                '                          <div class="d-flex flex-column justify-content-center">\n' +
                '                            <h6 class="mb-0 text-sm">' + element.name + '</h6>\n' +
                '                          </div>\n' +
                '                        </div>\n' +
                '                      </td>\n' +
                '                      <td class="align-middle text-sm">\n' +
                '                        <span class="text-xs font-weight-bold"> ' + element.wins + ' </span>\n' +
                '                      </td>\n' +
                '                      <td class="align-middle">\n' +
                '                        <div class="progress-wrapper w-75 mx-auto">\n' +
                '                          <div class="progress-info ">\n' +
                '                            <div class="progress-percentage">\n' +
                '                              <span class="text-xs font-weight-bold">' + element.percentage_weekly + '</span>\n' +
                '                            </div>\n' +
                '                          </div>\n' +
                '                        </div>\n' +
                '                      </td>\n' +
                '                    </tr>'
        }
    )
}

//This function populates a timeline with last order operations
function operations(controller) {
    let lastOrders = controller.getFromLocalStorage("lastOrders");

    let orders = document.getElementById("orders");
    lastOrders.forEach((element) => {

        orders.innerHTML += '<div class="timeline-block mb-3">\n' +
            '        <div class="timeline-content">\n' +
            '            <h6 class="text-dark text-sm font-weight-bold mb-0">Tipo de operación: ' + element.type + ' - ' + element.currency + ' </h6>\n' +
            '            <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">💵 Precio de operación: ' + element.price + '</p>\n' +
            '            <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">' + element.date + '</p>\n' +
            '        </div>\n' +
            '    </div>'
    })
}

// Class for handling saving values to local storage
class Storage {
    constructor(values) {
        this.values = values;
    }

    saveToLocalStorage() {
        const saveLocal = (key, value) => {
            localStorage.setItem(key, value)
        };

        for (const key in this.values) {
            saveLocal(key, JSON.stringify(this.values[key]));
        }
    }
}

// Class for managing multiple storage instances
class StorageController {
    constructor() {
        this.storages = [];
    }

    addStorage(storage) {
        this.storages.push(storage);
    }

    saveAllStorages() {
        for (const storage of this.storages) {
            storage.saveToLocalStorage();
        }
    }

    getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}

// JSON designed to populate dashboard data
const values = {
    "ts": 1692019801760,
    "values": {
        "cryptocurrency": "SOLUSDT",
        "prediction": 1,
        "open": 24.311,
        "low": 24.3,
        "high": 24.414,
        "close": 24.373,
    },
    "wins": {
        "today": 100,
        "weekly": 200,
        "monthly": 300,
        "lastdays": 400,
    },
    "cryptocurrencies": [
        {
            "name": "BTC",
            "wins": 0,
            "percentage_weekly": 0.0
        },
        {
            "name": "ETH",
            "wins": 0,
            "percentage_weekly": 0.0
        },
        {
            "name": "USDT",
            "wins": 1220,
            "percentage_weekly": 0.0
        },
        {
            "name": "BNB",
            "wins": 100,
            "percentage_weekly": 0.0
        },
        {
            "name": "USDC",
            "wins": 0,
            "percentage_weekly": 0.0
        },
        {
            "name": "BUSD",
            "wins": 0,
            "percentage_weekly": 0.0
        }
    ],
    "lastOrders": [
        {
            "type": "BUY",
            "quantity": 10,
            "price": 24000,
            "currency": "BTCUSDT",
            "date": "22 DEC 7:20 PM"
        },
        {
            "type": "SELL",
            "quantity": 10,
            "price": 24000,
            "currency": "BTCUSDT",
            "date": "22 DEC 5:20 PM"
        },
        {
            "type": "SELL",
            "quantity": 10,
            "price": 24000,
            "currency": "BTCUSDT",
            "date": "22 DEC 5:20 PM"
        },
        {
            "type": "SELL",
            "quantity": 10,
            "price": 24000,
            "currency": "BTCUSDT",
            "date": "22 DEC 5:20 PM"
        },
        {
            "type": "SELL",
            "quantity": 10,
            "price": 24000,
            "currency": "BTCUSDT",
            "date": "22 DEC 5:20 PM"
        },
    ]
};

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function generate random values for chart bars
function generateRandomValues() {
    const randomTimestamp = Math.floor(Math.random() * 10000000000000);
    const randomOpen = Math.random() * 100;
    const randomLow = randomOpen - Math.random();
    const randomHigh = randomOpen + Math.random();
    const randomClose = randomLow + Math.random() * (randomHigh - randomLow);

    // Generate random values for widgets
    const randomWinsToday = Math.floor(Math.random() * 1000);
    const randomWinsWeekly = Math.floor(Math.random() * 1000);
    const randomWinsMonthly = Math.floor(Math.random() * 1000);
    const randomWinsLastDays = Math.floor(Math.random() * 1000);

    // Generate random values for cryptocurrencies
    const randomCryptocurrencies = values.cryptocurrencies.map(crypto => ({
        ...crypto,
        wins: Math.floor(Math.random() * 1000),
        percentage_weekly: (Math.random() * 10).toFixed(2)
    }));

    // Generate random values for operations
    const randomLastOrders = values.lastOrders.map(order => ({
        ...order,
        quantity: Math.floor(Math.random() * 20),
        price: Math.floor(Math.random() * 100000),
        date: randomDate(new Date(2012, 0, 1), new Date()).toLocaleString()
    }));

    return {
        ts: randomTimestamp,
        values: {
            cryptocurrency: "SOLUSDT",
            prediction: Math.random() < 0.5 ? 0 : 1, // Generate random prediction (0 or 1)
            open: randomOpen.toFixed(1),
            low: randomLow.toFixed(1),
            high: randomHigh.toFixed(1),
            close: randomClose.toFixed(1),
        },
        wins: {
            today: randomWinsToday,
            weekly: randomWinsWeekly,
            monthly: randomWinsMonthly,
            lastdays: randomWinsLastDays,
        },
        cryptocurrencies: randomCryptocurrencies,
        lastOrders: randomLastOrders
    };
}


// Function to create a bar chart
function chartBars() {
    let ctx = document.getElementById("chart-bars").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Sales",
                tension: 0.4,
                borderWidth: 0,
                borderRadius: 4,
                borderSkipped: false,
                backgroundColor: "#fff",
                data: [450, 200, 100, 220, 500, 100, 400, 230, 500],
                maxBarThickness: 6
            },],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 500,
                        beginAtZero: true,
                        padding: 15,
                        font: {
                            size: 14,
                            family: "Open Sans",
                            style: 'normal',
                            lineHeight: 2
                        },
                        color: "#fff"
                    },
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false
                    },
                    ticks: {
                        display: false
                    },
                },
            },
        },
    });
}

// Function to create a line chart
function chartLine() {
    let ctx2 = document.getElementById("chart-line").getContext("2d");

    let gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);

    gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); //purple colors

    let gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);

    gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
    gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)'); //purple colors

    new Chart(ctx2, {
        type: "line",
        data: {
            labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Price today",
                tension: 0.4,
                pointRadius: 0,
                borderColor: "#cb0c9f",
                borderWidth: 3,
                backgroundColor: gradientStroke1,
                fill: true,
                data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
                maxBarThickness: 6

            },
                {
                    label: "Predicted",
                    tension: 0.4,
                    pointRadius: 0,
                    borderColor: "#3A416F",
                    borderWidth: 3,
                    backgroundColor: gradientStroke2,
                    fill: true,
                    data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
                    maxBarThickness: 6
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        display: true,
                        padding: 10,
                        color: '#b2b9bf',
                        font: {
                            size: 11,
                            family: "Open Sans",
                            style: 'normal',
                            lineHeight: 2
                        },
                    }
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        display: true,
                        color: '#b2b9bf',
                        padding: 20,
                        font: {
                            size: 11,
                            family: "Open Sans",
                            style: 'normal',
                            lineHeight: 2
                        },
                    }
                },
            },
        },
    });
}

// Function to handle the login process
function login() {

    document.getElementById("dashboard").style.display = "none";

    document.getElementById("loginButton").addEventListener("click", function () {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        let name = document.getElementById('name').value;
        let loginName = document.getElementById("loginName");

        loginName.textContent = "¡Hola " + name + "!";
    });

}

// Function main
function main() {

    login();
    const controller = new StorageController();
    controller.addStorage(new Storage(generateRandomValues()));
    controller.saveAllStorages();
    barStats(controller);
    widgetsStats(controller);
    tableStats(controller);
    operations(controller);
    chartBars();
    chartLine();
}

main();
