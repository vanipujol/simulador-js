import {Storage, StorageController} from "./storage.js";

export async function arsPrices(controller) {
    let obj;

    const res = await fetch('https://api.bluelytics.com.ar/v2/latest')

    obj = await res.json();

    controller.addStorage(new Storage(obj));
    controller.saveAllStorages();
    return obj
}


export async function cryptoPrices(controller) {
    let obj;

    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cbinancecoin&vs_currencies=usd')

    obj = await res.json();

    controller.addStorage(new Storage(obj));
    controller.saveAllStorages();
    return obj
}

export async function Converter() {
    const controller = new StorageController();
    const getInputValue = parseFloat(document.getElementById('input-num').value);
    const selected = document.getElementById('selected').value;
    const selectedOutput = document.getElementById('selected-output').value;

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cbinancecoin&vs_currencies=usd')
        .then((resp) => resp.json())
        .then((data) => {

            function Currencies() {
                if (selected === selectedOutput) {
                    return getInputValue;
                }  else if (selected === 'usd' && selectedOutput === 'btc') {
                    return getInputValue / data.bitcoin.usd;
                } else if (selected === 'usd' && selectedOutput === 'eth') {
                    return getInputValue / data.ethereum.usd;
                } else if (selected === 'usd' && selectedOutput === 'bnb') {
                    return getInputValue / data.binancecoin.usd;
                } else if (selected === 'usd' && selectedOutput === 'ars') {
                    return getInputValue * controller.getFromLocalStorage("blue").value_avg;
                } else if (selected === 'ars' && selectedOutput === 'usd') {
                    return getInputValue / controller.getFromLocalStorage("blue").value_avg;
                } else if (selected === 'ars' && selectedOutput === 'btc') {
                    return (getInputValue / controller.getFromLocalStorage("blue").value_avg) / data.bitcoin.usd;
                } else if (selected === 'ars' && selectedOutput === 'eth') {
                    return (getInputValue / controller.getFromLocalStorage("blue").value_avg) / data.ethereum.usd;
                } else if (selected === 'ars' && selectedOutput === 'bnb') {
                    return (getInputValue / controller.getFromLocalStorage("blue").value_avg) / data.binancecoin.usd;
                } else if (selected === 'btc' && selectedOutput === 'usd') {
                    return getInputValue * data.bitcoin.usd;
                } else if (selected === 'btc' && selectedOutput === 'eth') {
                    return (getInputValue * data.bitcoin.usd) / data.ethereum.usd;
                } else if (selected === 'btc' && selectedOutput === 'bnb') {
                    return (getInputValue * data.bitcoin.usd) / data.binancecoin.usd;
                } else if (selected === 'btc' && selectedOutput === 'ars') {
                    return (getInputValue * data.bitcoin.usd) * controller.getFromLocalStorage("blue").value_avg;
                } else if (selected === 'eth' && selectedOutput === 'usd') {
                    return getInputValue * data.ethereum.usd;
                } else if (selected === 'eth' && selectedOutput === 'btc') {
                    return (getInputValue * data.ethereum.usd) / data.bitcoin.usd;
                } else if (selected === 'eth' && selectedOutput === 'bnb') {
                    return (getInputValue * data.ethereum.usd) / data.binancecoin.usd;
                } else if (selected === 'eth' && selectedOutput === 'ars') {
                    return (getInputValue * data.ethereum.usd) * controller.getFromLocalStorage("blue").value_avg;
                } else if (selected === 'bnb' && selectedOutput === 'usd') {
                    return getInputValue * data.binancecoin.usd;
                } else if (selected === 'bnb' && selectedOutput === 'btc') {
                    return (getInputValue * data.binancecoin.usd) / data.bitcoin.usd;
                } else if (selected === 'bnb' && selectedOutput === 'eth') {
                    return (getInputValue * data.binancecoin.usd) / data.ethereum.usd;
                } else if (selected === 'bnb' && selectedOutput === 'ars') {
                    return (getInputValue * data.binancecoin.usd) * controller.getFromLocalStorage("blue").value_avg;
                } else {
                    return 'Please try a valid conversion!';
                }
            }

            document.getElementById('output-num').value = Currencies(data).toFixed(2);
        })
}

export function ReverseConverter() {
    const selected = document.getElementById('selected').value;
    const selectedOutput = document.getElementById('selected-output').value;
    const inputNumValue = document.getElementById('input-num').value;
    const outputNumValue = document.getElementById('output-num').value;

    // Swap selected and selectedOutput values
    document.getElementById('selected').value = selectedOutput;
    document.getElementById('selected-output').value = selected;

    // Swap input and output values
    document.getElementById('input-num').value = outputNumValue;
    document.getElementById('output-num').value = inputNumValue;
}

//Slide budget
export function budget(controller) {

    let usdOficial = document.getElementById('usdOficial');
    usdOficial.innerText = '$' + controller.getFromLocalStorage("oficial").value_avg;

    let usdBlue = document.getElementById('usdBlue');
    usdBlue.innerText = '$' + controller.getFromLocalStorage("blue").value_avg;

    let euroOficial = document.getElementById('euroOficial');
    euroOficial.innerText = '$' + controller.getFromLocalStorage("oficial_euro").value_avg;

    let euroBlue = document.getElementById('euroBlue');
    euroBlue.innerText = '$' + controller.getFromLocalStorage("blue_euro").value_avg;

    let btc = document.getElementById('btc');
    btc.innerText = 'US$ ' + controller.getFromLocalStorage("bitcoin").usd;

    let eth = document.getElementById('eth');
    eth.innerText = 'US$ ' + controller.getFromLocalStorage("ethereum").usd;

    let bnb = document.getElementById('bnb');
    bnb.innerText = 'US$ ' + controller.getFromLocalStorage("binancecoin").usd;
}