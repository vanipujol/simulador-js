/*
    Este archivo JavaScript incluye funciones para obtener y almacenar precios de criptomonedas,
    generar gráficos de barras y líneas, actualizar estadísticas en widgets y tablas,
    y simular datos para un panel de control.
*/

import {Storage} from "./storage.js";

/**
 * Fetches price data for a specified cryptocurrency from an external API and stores it in the controller's storage.
 *
 * @param {object} controller - The controller object to store the price data.
 * @param {string} coinName - The name or identifier of the cryptocurrency.
 * @param {string} storageProperty - The property name under which the price data will be stored.
 * @returns {Promise<object>} - A promise that resolves to the fetched and stored price data.
 */
async function fetchAndStorePrice(controller, coinName, storageProperty) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=usd&days=90&interval=daily&precision=1`);
    const obj = await res.json();

    obj[storageProperty] = obj.prices;
    delete obj.prices;

    controller.addStorage(new Storage(obj));
    controller.saveAllStorages();

    return obj;
}

export async function btcPrice(controller) {
    return await fetchAndStorePrice(controller, 'bitcoin', 'btc_prices');
}

export async function ethPrice(controller) {
    return await fetchAndStorePrice(controller, 'ethereum', 'eth_prices');
}

export async function bnbPrice(controller) {
    return await fetchAndStorePrice(controller, 'binancecoin', 'bnb_prices');
}

export async function solPrice(controller) {
    return await fetchAndStorePrice(controller, 'solana', 'sol_prices');
}


/**
 * CHART BAR
 * Generates random values for simulating prediction wins and losses in a chart.
 * The structure of the data generated is similar to the JSON data format used.
 *
 * @returns {object} - An object containing randomly generated data.
 */
export function generateRandomValues() {
    // Generate a random timestamp.
    const randomTimestamp = Math.floor(Math.random() * 10000000000000);

    // Generate random values for open, low, high, and close prices.
    const randomOpen = Math.random() * 100;
    const randomLow = randomOpen - Math.random();
    const randomHigh = randomOpen + Math.random();
    const randomClose = randomLow + Math.random() * (randomHigh - randomLow);

    // Generate random values for widget statistics.
    const randomWinsToday = Math.floor(Math.random() * 1000);
    const randomWinsWeekly = Math.floor(Math.random() * 1000);
    const randomWinsMonthly = Math.floor(Math.random() * 1000);
    const randomWinsLastDays = Math.floor(Math.random() * 1000);

    // Generate random values for cryptocurrencies.
    const randomCryptocurrencies = values.cryptocurrencies.map(crypto => ({
        ...crypto,
        wins: Math.floor(Math.random() * 1000),
        percentage_weekly: (Math.random() * 10).toFixed(2)
    }));

    // Generate random values for operations/orders.
    const randomLastOrders = values.lastOrders.map(order => ({
        ...order,
        quantity: Math.floor(Math.random() * 20),
        price: Math.floor(Math.random() * 100000),
        date: randomDate(new Date(2012, 0, 1), new Date()).toLocaleString() // Generate a random date.
    }));

    // Return an object containing the generated data.
    return {
        ts: randomTimestamp,
        values: {
            cryptocurrency: "SOLUSDT",
            prediction: Math.random() < 0.5 ? 0 : 1, // Generate a random prediction (0 or 1).
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


/**
 * Generates a chart displaying currency prices and predicted prices over time.
 *
 * @param {object} controller - The controller object providing data and functionality.
 */
export function chartBars(controller) {
    // Get the 2D rendering context for the chart canvas.
    let ctx = document.getElementById("chart-bars").getContext("2d");

    // Retrieve stored Solana (SOL) currency prices from local storage.
    let solPricesStored = controller.getFromLocalStorage("sol_prices");

    // Initialize arrays to store data points for actual and predicted prices.
    const data = [];
    const data2 = [];

    // Iterate through stored SOL price data to format it for the chart.
    for (let i = 0; i < solPricesStored.length; i++) {
        data.push({x: new Date(solPricesStored[i][0]).toLocaleDateString(), y: solPricesStored[i][1]});

        // Simulate price prediction for the chart by adding random fluctuations.
        data2.push({
            x: new Date(solPricesStored[i][0]).toLocaleDateString(),
            y: solPricesStored[i][1] + Math.random() * (0 - 2)
        });
    }

    // Configure animation properties for the chart.
    const totalDuration = 10000;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    // Create a new chart using Chart.js, displaying actual and predicted price data.
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: "Precio",
                    borderColor: "#cb0c9f",
                    borderWidth: 1,
                    radius: 0,
                    data: data,
                },
                {
                    label: "Precio predicho",
                    borderColor: "white",
                    borderWidth: 1,
                    radius: 0,
                    data: data2,
                }
            ]
        },
        options: {
            animation,
            interaction: {
                intersect: false
            },
            plugins: {
                legend: false
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: true,
                        borderDash: [5, 5],
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
                }
            }
        }
    });
}


/**
 * Updates the bar chart statistics on the page based on data from the controller.
 *
 * @param {object} controller - The controller object providing the data to update the statistics.
 */
export function barStats(controller) {
    // Get references to HTML elements where statistics will be displayed.
    let prediction = document.getElementById("prediction");
    let cryptocurrency = document.getElementById("cryptocurrency");
    let open = document.getElementById("open");
    let low = document.getElementById("low");
    let high = document.getElementById("high");
    let close = document.getElementById("close");

    // Retrieve data from the controller.
    let value = controller.getFromLocalStorage("values");
    let predictionText = "";

    // Determine the prediction text based on the value.prediction.
    if (value.prediction === 1) {
        predictionText = "El mercado se encuentra en estado alcista";
    } else {
        predictionText = "El mercado se encuentra en estado bajista";
    }

    // Update the prediction element with the determined prediction text.
    prediction.innerText = predictionText;

    // Update other statistics elements with data from the controller.
    cryptocurrency.innerText = value.cryptocurrency;
    open.innerText = value.open;
    low.innerText = value.low;
    high.innerText = value.high;
    close.innerText = value.close;
}


/**
 * CHART LINE BTC, ETH, BNB
 * Generates a line chart using the provided controller and storage key.
 *
 * @param {object} controller - The controller object providing data.
 * @param {string} storageKey - The key to retrieve data from local storage.
 */
export function chartLine(controller, storageKey) {
    // Get the 2D rendering context for the chart canvas.
    let ctx2 = document.getElementById("chart-line").getContext("2d");

    // Define gradient styles for the chart's lines.
    let gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
    gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)');

    let gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
    gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
    gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)');

    // Retrieve data from local storage based on the provided storage key.
    const btcPriceStored = controller.getFromLocalStorage(storageKey);

    // Extract readable date labels from the stored data.
    const readableDatesArray = btcPriceStored.map(([timestamp]) => [new Date(timestamp).toLocaleDateString()]);

    // Extract different prices for the chart.
    const differentPricesArray = btcPriceStored.map(([, price]) => price);

    // Create a new line chart using Chart.js.
    new Chart(ctx2, {
        type: "line",
        data: {
            labels: readableDatesArray,
            datasets: [{
                label: "Precio",
                tension: 0.4,
                pointRadius: 0,
                borderColor: "#cb0c9f",
                borderWidth: 3,
                backgroundColor: gradientStroke1,
                fill: true,
                data: differentPricesArray,
                maxBarThickness: 6
            }],
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


/**
 * Function for button's price in chart line
 *
 * @param {object} controller - The controller object providing data.
 */
export function buttonsPriceChartLine(controller) {
    document.getElementById("eth-btn").addEventListener("click", async function () {
        document.getElementById("chart-line").remove();
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'chart-line');
        canvas.setAttribute('height', '526');
        canvas.className = "chart-canvas";
        document.getElementById('chart').appendChild(canvas);
        chartLine(controller, "eth_prices");
    })

    document.getElementById("btc-btn").addEventListener("click", async function () {
        document.getElementById("chart-line").remove();
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'chart-line');
        canvas.setAttribute('height', '526');
        canvas.className = "chart-canvas";
        document.getElementById('chart').appendChild(canvas);
        chartLine(controller, "btc_prices");
    })

    document.getElementById("bnb-btn").addEventListener("click", async function () {
        document.getElementById("chart-line").remove();
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'chart-line');
        canvas.setAttribute('height', '526');
        canvas.className = "chart-canvas";
        document.getElementById('chart').appendChild(canvas);
        chartLine(controller, "bnb_prices");
    })
}

/**
 * Function to activate the slide button in chart line
 */
export function activeSlideButton() {
    const elements = Array.from(document.querySelectorAll('.button-cr'));
    let activeIndex = 0;

    const updateIndex = (newIndex) => {
        elements[activeIndex].classList.remove('active');
        document.body.style.setProperty('--active-index', newIndex);
        elements[newIndex].classList.add('active');
        activeIndex = newIndex;
    };

    const registerEvent = (button, index) => {
        button.addEventListener('click', () => updateIndex(index))
    };

    elements.forEach(registerEvent);
}

/**
 *  WIDGET BALANCE
 * This function updates the DOM elements with widget statistics related to wins
 *
 * @param {object} controller - The controller object providing data.
 */
export function widgetsStats(controller) {
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


/**
 * CRYPTOCURRENCY
 * JSON data designed to populate dashboard data.
 */
export const values = {
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

/**
 * Populates a table with cryptocurrency statistics based on data from the controller.
 *
 * @param {object} controller - The controller object providing cryptocurrency data.
 */
export function tableStats(controller) {
    // Retrieve cryptocurrency data from local storage.
    let cryptocurrencies = controller.getFromLocalStorage("cryptocurrencies");

    // Get a reference to the table body where the statistics will be displayed.
    let tableBody = document.getElementById("tableBody");

    // Iterate through cryptocurrency data and populate the table.
    cryptocurrencies.forEach((element) => {
        tableBody.innerHTML += `
            <tr>
                <td>
                    <div class="d-flex px-2 py-1">
                        <div>
                            <img src="./img/small-logos/${element.name}.png" class="avatar avatar-sm me-3" alt="img">
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${element.name}</h6>
                        </div>
                    </div>
                </td>
                <td class="align-middle text-sm">
                    <span class="text-xs font-weight-bold">${element.wins}</span>
                </td>
                <td class="align-middle">
                    <div class="progress-wrapper w-75 mx-auto">
                        <div class="progress-info">
                            <div class="progress-percentage">
                                <span class="text-xs font-weight-bold">${element.percentage_weekly}</span>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });
}

/**
 * OPERATIONS
 * Populates a timeline with last order operations based on data from the controller.
 *
 * @param {object} controller - The controller object providing last order data.
 */
export function operations(controller) {
    // Retrieve last order data from local storage.
    let lastOrders = controller.getFromLocalStorage("lastOrders");

    // Get a reference to the HTML element where operations will be displayed.
    let orders = document.getElementById("orders");

    // Iterate through last order data and populate the timeline.
    lastOrders.forEach((element) => {
        orders.innerHTML += `
            <div class="timeline-block mb-3">
                <div class="timeline-content">
                    <h6 class="text-dark text-sm font-weight-bold mb-0">Tipo de operación: ${element.type} - ${element.currency}</h6>
                    <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">💵 Precio de operación: ${element.price}</p>
                    <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">${element.date}</p>
                </div>
            </div>
        `;
    });
}

/**
 * Generates a random date within a specified range for simulating operation dates.
 *
 * @param {Date} start - The start date of the range.
 * @param {Date} end - The end date of the range.
 * @returns {Date} - A randomly generated date within the specified range.
 */
export function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

