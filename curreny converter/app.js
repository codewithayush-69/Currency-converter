const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies/";
const dropDowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#convert-btn");
const from = document.querySelector(".from select");
const to = document.querySelector(".to select");
const msg = document.querySelector(".msg p");

for (let select of dropDowns) {
    for (currcode in countryList) {
        const newoption = document.createElement("option");
        newoption.innerText = currcode;
        newoption.value = currcode;
        if(select.name === "from" && currcode === "USD") {
            newoption.selected = "selected";
        }else if(select.name === "to" && currcode === "INR") {
            newoption.selected = "selected";
        }
        select.append(newoption);  

        select.addEventListener("change", (event)=>{
            updateFlag(event.target);
        })
    }
}

const updateFlag = (element) => {
    let currcode = element.value;
    let countryCode = countryList[currcode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let flag = element.parentElement.querySelector("img");
    flag.src = newSrc;
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector("#amount");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal <= 0) {
        amtVal = 1;
        amount.value = "1";
    }

    let fromCurrency = from.value.toLowerCase();
    let toCurrency = to.value.toLowerCase(); 

    const URL = `${BASE_URL}${fromCurrency}.json`;

    try {
        let response = await fetch(URL);
        let data = await response.json();
        
        if (data[fromCurrency] && data[fromCurrency][toCurrency]) {
            let conversionRate = data[fromCurrency][toCurrency];
            let convertedAmount = (amtVal * conversionRate).toFixed(2);
            let upperFrom = fromCurrency.toUpperCase();
            let upperTo = toCurrency.toUpperCase();
            msg.innerText = `${amtVal} ${upperFrom} = ${convertedAmount} ${upperTo}`;
        } else {
            console.error("Conversion rate not found!");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});