const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies';
const FALLBACK_URL = 'https://latest.currency-api.pages.dev/v1/currencies';
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const countryList = {
  "USD": "US",
  "INR": "IN",
  "EUR": "EU",
  "AUD": "AU"
};

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const fetchExchangeRate = async (url) => {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error: ", error);
    throw error;
  }
};

const updateExchangeRate = async () => {
  let amount = document.querySelector("#amount");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const primaryURL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  const fallbackURL = `${FALLBACK_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let data = await fetchExchangeRate(primaryURL);
    let rate = data[toCurr.value.toLowerCase()];
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    try {
      let data = await fetchExchangeRate(fallbackURL);
      let rate = data[toCurr.value.toLowerCase()];
      let finalAmount = amtVal * rate;
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
      msg.innerText = "An error occurred while fetching the exchange rate.";
    }
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
