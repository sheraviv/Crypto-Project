const reportsState = []

async function getCryptos(value) {
    $(".toggle-one").bootstrapToggle("destroy");
    if (!value) {
        $(".listChanger").css({ display: "flex" })
        return draw(CryptoState)
    }
    $(".listChanger").css({ display: "none" });
    let searchThe = {}
    if (!CryptoState[value]) {
        DOM_DIVS.content .html(divLoader);
        await CRYPTO_API.getCrypto().then(response => getCryptoAPI(response, value))
            .then((crypto) => {
                if (!crypto) { return DOM_DIVS.content .html('<div align="center"><h1>No Results</h1></div>') }
                CryptoState[value] = new Crypto(crypto, false, 0)
            })
        if (!CryptoState[value]) return
    }
    searchThe[value] = { ...CryptoState[value] }
    DOM_DIVS.content .html("")
    draw(searchThe)
    DOM_NAVBAR.homeBtn.css({ display: "block" })
}
function getCryptoAPI(response, value) {
    const curren = response.find((crypto) => {
        return value === crypto.symbol
    })
    if (curren) return curren
}

function listSwitch() {
    listNum === 1 ? $("#backButton").addClass('disabled') : $("#backButton").removeClass("disabled")
    $("#listNumber").html(`${listNum}`)
}

function aplyCryptInf(crypto) {
    const InitialSelected = CryptoState[crypto.symbol].isSelected
    const InitialPage = CryptoState[crypto.symbol].page
    CryptoState[crypto.symbol] = new CryptoModal(crypto, InitialSelected, InitialPage)
    CryptoState[crypto.symbol].showRate = !CryptoState[crypto.symbol].showRate
}

function showRateCard(card) {
    const id = card.find(".card-title").html()
    const { pic, usdRate, eurRate, ilsRate } = CryptoState[id]
    const infoDiv = card.find(".rateCard")
    infoDiv.css({ display: "flex" });
    infoDiv.find("img").attr({ "src": pic })
    infoDiv.find("#usd").html(`usd: ${usdRate}`)
    infoDiv.find("#eur").html(`eur: ${eurRate}`)
    infoDiv.find("#ils").html(`ils: ${ilsRate}`)
    card.find(".more-info").html("Close")
}

function closingInfo(key) {
    CryptoState[key].showRate = false;
    switcher()
}

function chosenCrypto(symbol) {
    if (CryptoState[symbol].isSelected) {
        CryptoState[symbol].isSelected = !CryptoState[symbol]
        const index = reportsState.findIndex(item => { return item === CryptoState[symbol] })
        reportsState.splice(index, 1)
        return
    }
    if (reportsState.length < 5) {
        CryptoState[symbol].isSelected = !CryptoState[symbol].isSelected
        reportsState.push(CryptoState[symbol])
        return
    }
    const chosenList = CryptoState[symbol]
    $(".chooseCard").css({ display: "block" })
    $(".toggle-one").prop('disabled', true);
    $(".parallax").css({opacity: "0.2"})
    $("#coins-list").html("")
    const coinsList = reportsState.map(crypto => { return getSelectedCoins(crypto, chosenList) });
    $("#coins-list").append(coinsList)
    $(".chooseCard").find(".cancel-btn").on("click", () => {
        $(".chooseCard").css({ display: "none" })
        $(".toggle-one").prop('disabled', false);
        $(".parallax").css({opacity: "1"})
        switcher()
    })
    switcher()
}

function getSelectedCoins(crypto, chosenList) {
    const { name, symbol } = crypto
    const cryptoChosenDiv = $("#chosenDiv").clone()
    cryptoChosenDiv.removeClass("d-none")
    cryptoChosenDiv.attr({ "id": name });
    cryptoChosenDiv.find(".cryptoSymb").html(symbol)
    cryptoChosenDiv.find(".delete-coin").on("click", () => {
        CryptoState[symbol].isSelected = false
        $(".chooseCard").css({ display: "none" })
        const index = reportsState.findIndex(item => { return item === CryptoState[symbol] })
        reportsState.splice(index, 1)
        reportsState.push(chosenList)
        chosenList.isSelected = true
        $(".toggle-one").prop('disabled', false);
        $(".parallax").css({opacity: "1"})
        switcher()
    })
    return cryptoChosenDiv
}

function switcher() {
    if (DOM_NAVBAR.inputSearch.val()) { return getCryptos(DOM_NAVBAR.inputSearch.val()) }
    $(".toggle-one").bootstrapToggle("destroy");
    $(".listChanger").css({ display: "flex" })
    draw(CryptoState)
}




