const API_KEY = 'ULFVD237WM7QID0L';
let months = ['2020-10-31', '2020-11-30', '2020-12-31', '2021-01-31', '2021-02-28', '2021-03-31', '2021-04-30', '2021-05-31', '2021-06-30', '2021-07-31', '2021-08-31', '2021-09-30', '2021-10-31', '2021-11-30', '2021-12-31', '2022-01-31', '2022-02-28', '2022-03-31', '2022-04-30', '2022-05-31', '2022-06-30', '2022-07-31', '2022-08-31', '2022-09-30', '2022-10-31', '2022-11-30', '2022-12-31', '2023-01-31', '2023-02-28', '2023-03-31', '2023-04-30', '2023-05-31', '2023-06-30', '2023-07-31', '2023-08-31', '2023-09-30', '2023-10-31', '2023-11-30', '2023-12-31'];

async function init() {
    await loadRate();
    await loadMonthlyRate();
    renderChart();
}

async function loadRate() {
    let url = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=EUR&apikey=' + API_KEY;
    let response = await fetch(url);
    let responseAsJson = await response.json();

    console.log(responseAsJson); // Log the entire response for inspection

    let currentRate = (Math.round(responseAsJson['Realtime Currency Exchange Rate']['5. Exchange Rate']));

    document.getElementById('rate').innerHTML = `<b>${currentRate} €</b>`;
    loadMonthlyRate();
}


// async function loadRate() {
//     let url = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=EUR&apikey=' + API_KEY;
//     let response = await fetch(url);
//     let responseAsJson = await response.json();

//     let currentRate = (Math.round(responseAsJson['Realtime Currency Exchange Rate']['5. Exchange Rate']));

//     document.getElementById('rate').innerHTML = `<b>${currentRate} €</b>`;
//     loadMonthlyRate();
// }


async function loadMonthlyRate() {
    url = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=EUR&apikey=' + API_KEY;
    let response = await fetch(url);
    let responseAsJson = await response.json();


    console.log(responseAsJson); // Log the entire response for inspection

    let monthlyRate = responseAsJson['Time Series (Digital Currency Monthly)'];

    for (let i = 0; i < months.length; i++) {

        const rateEachMonth = monthlyRate[months[i]][''];
    }
}



// console.log(responseAsJson);
// // console.log(responseAsJson['Time Series (Digital Currency Monthly)']['2021-05-31']['1a. open (EUR)']);

// let monthlyRate = (responseAsJson['Time Series (Digital Currency Monthly)']);

// for (let i = 0; i < months.length; i++) {
//     const month = months[i];
//     const rateEachMonth = responseAsJson['Time Series (Digital Currency Monthly)'][months[i]]['1a. open (EUR)'];

//     // console.log(rateEachMonth);
// }

// }
