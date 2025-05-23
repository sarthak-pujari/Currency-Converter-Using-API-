const BASE_URL = "https://api.frankfurter.app/latest";

const countryList = {
    USD: "US",
    EUR: "EU",
    GBP: "GB",
    JPY: "JP",
    CAD: "CA",
    AUD: "AU",
    CHF: "CH",
    CNY: "CN",
    SEK: "SE",
    NZD: "NZ",
    MXN: "MX",
    SGD: "SG",
    HKD: "HK",
    NOK: "NO",
    KRW: "KR",
    TRY: "TR",
    RUB: "RU",
    INR: "IN",
    BRL: "BR",
    ZAR: "ZA",
    AED: "AE",
    SAR: "SA",
    PLN: "PL",
    THB: "TH",
    IDR: "ID",
    HUF: "HU",
    CZK: "CZ",
    DKK: "DK",
    ILS: "IL",
    CLP: "CL",
    PHP: "PH",
    COP: "CO",
    MYR: "MY",
    RON: "RO",
    NGN: "NG",
    PKR: "PK",
    VND: "VN",
    EGP: "EG",
    ARS: "AR",
};

const dropdowns = document.querySelectorAll("select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector("select[name='from']");
const toCurr = document.querySelector("select[name='to']");
const amountInput = document.querySelector("input[name='text1']");
const msg = document.querySelector(".msgg");

function populateDropdowns() {
    for (let select of dropdowns) {
        for (let currCode in countryList) {
            let newOption = document.createElement("option");
            newOption.innerText = currCode;
            newOption.value = currCode;
            select.append(newOption);
        }
        select.addEventListener("change", updateFlag);
    }
}

function updateFlag(evt) {
    let select = evt.target;
    let currencyCode = select.value;
    let countryCode = countryList[currencyCode];
    let imgTag = select.parentElement.querySelector("img");
    imgTag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

async function updateExchangeRate(amount = 1) { // Default amount to 1
    const fromCurrency = fromCurr.value.toUpperCase();
    const toCurrency = toCurr.value.toUpperCase();
    const url = `${BASE_URL}?from=${fromCurrency}&to=${toCurrency}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.rates[toCurrency]) {
            throw new Error(`Currency ${toCurrency} not found in rates`);
        }
        const exchangeRate = data.rates[toCurrency];
        const convertedAmount = (amount * exchangeRate).toFixed(2);
        msg.innerText = `${amount} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Error fetching exchange rate.";
    }
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    let amount = parseFloat(amountInput.value) || 1; // Use input or default to 1
    updateExchangeRate(amount);
});

populateDropdowns();
updateFlag({ target: fromCurr });
updateFlag({ target: toCurr });
updateExchangeRate(); // Initial conversion of 1 USD to INR