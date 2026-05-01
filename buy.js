// dropdown javascript
function toggleDropdown() {
    document.getElementById("coinDropdown").classList.toggle("active");
}

function selectCoin(name, icon) {
    document.getElementById("coinName").innerText = name;
    document.getElementById("coinIcon").src = icon;
    document.getElementById("coinDropdown").classList.remove("active");
}






// coin javascript
const pricePerCoin = 0.005;
const minAmount = 50;

// click buttons
function setAmount(amount) {
    document.getElementById("amountDisplay").value = amount;
    updateUI(amount);
}

// typing input
function updateFromInput() {
    let amount = parseFloat(document.getElementById("amountDisplay").value);

    if (isNaN(amount)) return;

    if (amount < minAmount) {
        document.getElementById("qtyDisplay").innerText = "Min $50";
        return;
    }

    updateUI(amount);
}
// calculation
function updateUI(amount) {

    // correct quantity calculation
    let qty = amount / pricePerCoin;

    // round down and format
    qty = Math.floor(qty).toLocaleString();

    document.getElementById("qtyDisplay").innerText = qty + "pcs";
}







function selectCoin(name, icon){

    // change coin icon
    document.getElementById("coinIcon").src = icon;

    // change coin name
    document.getElementById("coinName").innerText = name;

    // hide dropdown properly
    document.getElementById("coinDropdown").classList.remove("active");

    // change title image depending on coin
    let titleImage = document.getElementById("buyTitleImage");

    if(name === "USDT"){
        titleImage.src = "images/buy usdt.png";
    }

    else if(name === "BTC"){
        titleImage.src = "images/buy btc.png";
    }

    else if(name === "BNB"){
        titleImage.src = "images/buy bnb.png";
    }

    else if(name === "NGN"){
        titleImage.src = "images/buy ngn.png";
    }

    else if(name === "DOGE"){
        titleImage.src = "images/buy doge.png";
    }

}


// crypto images chnages with dropdown








// ==========================
// GLOBAL STATE (SOURCE OF TRUTH)
// ==========================
let state = {
    baseUSD: 50,
    usdToNgn: 1500, // fallback
    currency: "USD"
};



// ==========================
// CONVERTER HELPER (ADD HERE)
// ==========================
function toNGN(amountUSD) {
    return Math.round(Number(amountUSD) * Number(state.usdToNgn));
}



// ==========================
// FETCH LIVE RATE
// ==========================
async function getRate() {
    try {
        let res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        let data = await res.json();

        if (data?.rates?.NGN) {
            state.usdToNgn = data.rates.NGN;
        }
    } catch (e) {
        console.log("Using fallback rate");
    }
}

getRate();








// ==========================
// UI ELEMENTS CACHE
// ==========================
const el = {
    icon: document.getElementById("coinIcon"),
    name: document.getElementById("coinName"),
    dropdown: document.getElementById("coinDropdown"),
    input: document.getElementById("amountDisplay"),
    symbol: document.querySelector(".dollar"),
    buttons: document.querySelectorAll(".amount-buttons button"),
    priceBlock: document.querySelector(".block h3"),
    titleImage: document.getElementById("buyTitleImage")
};


// ==========================
// MAIN SELECT FUNCTION
// ==========================
function selectCoin(name, icon) {

    // UI updates
    el.icon.src = icon;
    el.name.innerText = name;
    el.dropdown.classList.remove("active");

    // default reset
    state.currency = "USD";

    // ==========================
    // NGN MODE
    // ==========================
    if (name === "NGN") {

        state.currency = "NGN";

        const value = Math.round(state.baseUSD * state.usdToNgn);

        el.symbol.innerText = "₦";
        el.input.value = value;
        el.input.min = value;

        updateButtons("NGN");

        el.priceBlock.innerHTML = "₦5 <span>per Inana</span>";
        el.titleImage.src = "images/buy ngn.png";
    }

    // ==========================
    // USD MODE (ALL CRYPTO)
    // ==========================
    else {

        el.symbol.innerText = "$";
        el.input.value = state.baseUSD;
        el.input.min = state.baseUSD;

        updateButtons("USD");

        el.priceBlock.innerHTML = "$0.005 <span>per Inana</span>";

        if (name === "USDT") el.titleImage.src = "images/buy usdt.png";
        else if (name === "BTC") el.titleImage.src = "images/buy btc.png";
        else if (name === "BNB") el.titleImage.src = "images/buy bnb.png";
        else if (name === "DOGE") el.titleImage.src = "images/buy doge.png";
    }
}


// ==========================
// BUTTON UPDATE ENGINE
// ==========================
function updateButtons(type) {

    const presetsUSD = [50, 150, 500, 2000];

    el.buttons.forEach((btn, index) => {

        let usdValue = presetsUSD[index];

        if (type === "NGN") {

            let ngnValue = Math.round(usdValue * state.usdToNgn);

            btn.innerText = "₦" + ngnValue.toLocaleString();

            btn.onclick = () => {
                setAmount(ngnValue, "₦");
            };

        } else {

            btn.innerText = "$" + usdValue.toLocaleString();

            btn.onclick = () => {
                setAmount(usdValue, "$");
            };
        }
    });
}


// ==========================
// INPUT HANDLER (LIVE UPDATE)
// ==========================
function updateFromInput() {

    let value = parseFloat(el.input.value);

    if (state.currency === "NGN") {
        // NGN mode
        el.symbol.innerText = "₦";
    } else {
        // USD mode
        el.symbol.innerText = "$";
    }
}
