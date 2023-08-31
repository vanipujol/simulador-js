// This function updates the DOM elements with statistics related to a cryptocurrency market
import {Storage} from "./storage.js";

export function barStats(controller) {

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

// This function populates a table with cryptocurrency statistics
export function tableStats(controller) {
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

// This function populates a timeline with last order operations
export function operations(controller) {
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

//Function to storage fetch prices
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

// Function to create a bar chart
export function chartBars(controller) {
    let ctx = document.getElementById("chart-bars").getContext("2d");

    let solPricesStored = controller.getFromLocalStorage("sol_prices");

    const data = [];
    const data2 = [];

    for (let i = 0; i < solPricesStored.length; i++) {
        data.push({x: new Date(solPricesStored[i][0]).toLocaleDateString(), y: solPricesStored[i][1]});
        // simulation of price prediction for chart
        data2.push({x: new Date(solPricesStored[i][0]).toLocaleDateString(), y: solPricesStored[i][1] + Math.random() * (0 - 2)});
    }

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


    new Chart(ctx,  {
        type: 'line',
        data: {
            datasets: [{
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
                }]
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

// Function to create a line chart with bitcoin price
export function chartLine(controller, storageKey) {
    let ctx2 = document.getElementById("chart-line").getContext("2d");

    let gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);

    gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
    gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)');

    let gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);

    gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
    gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)');

    // Getting the data from localstorage
    const btcPriceStored = controller.getFromLocalStorage(storageKey);

    const readableDatesArray = btcPriceStored.map(([timestamp]) => [new Date(timestamp).toLocaleDateString()]);

    const differentPricesArray = btcPriceStored.map(([, price]) => price);

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

export function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// JSON designed to populate dashboard data
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

// Function generate random values for prediction in chart bars
export function generateRandomValues() {
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

// Function for button's price in chart line
export function buttonsPriceChartLine(controller){
    document.getElementById("eth-btn").addEventListener("click", async function () {
        document.getElementById("chart-line").remove();
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id','chart-line');
        canvas.setAttribute('height','526');
        canvas.className = "chart-canvas";
        document.getElementById('chart').appendChild(canvas);
        chartLine(controller, "eth_prices");
    })

    document.getElementById("btc-btn").addEventListener("click", async function () {
        document.getElementById("chart-line").remove();
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id','chart-line');
        canvas.setAttribute('height','526');
        canvas.className = "chart-canvas";
        document.getElementById('chart').appendChild(canvas);
        chartLine(controller, "btc_prices");
    })

    document.getElementById("bnb-btn").addEventListener("click", async function () {
        document.getElementById("chart-line").remove();
        let canvas = document.createElement('canvas');
        canvas.setAttribute('id','chart-line');
        canvas.setAttribute('height','526');
        canvas.className = "chart-canvas";
        document.getElementById('chart').appendChild(canvas);
        chartLine(controller, "bnb_prices");
    })
}

// Function to activate the slide button in chart line
export function activeSlideButton(){
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

