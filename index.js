
let CryptoState = {}


let listNum = 1

function init() {
    DOM_DIVS.content .html(divLoader);
    let listChanger = (listNum - 1) * 20
    CRYPTO_API.getCrypto().then(response => GetCryptoState(response.slice(listChanger, listChanger + 20)))
    DOM_NAVBAR.searchBtn.on("click", function () {
        closeCanvas()
        DOM_DIVS.homeMain.css({ display: "block" })
        DOM_DIVS.reports.css({ display: "none" })
        DOM_DIVS.aboutDiv.css({ display: "none" })
        switcher()
    })
    DOM_NAVBAR.homeBtn.on("click", function () {
        closeCanvas()
        DOM_NAVBAR.inputSearch.val("")
        DOM_DIVS.homeMain.css({ display: "block" })
        DOM_DIVS.reports.css({ display: "none" })
        DOM_DIVS.aboutDiv.css({ display: "none" })
        listNum = 1
        switcher()
    })
    DOM_NAVBAR.reportsBtn.on("click", function () {
        DOM_DIVS.homeMain.css({ display: "none" })
        DOM_DIVS.reports.css({ display: "block" })
        DOM_DIVS.aboutDiv.css({ display: "none" })
        canvasInit()
    })
    DOM_NAVBAR.aboutBtn.on("click", function () {
        closeCanvas()
        DOM_DIVS.homeMain.css({ display: "none" })
        DOM_DIVS.reports.css({ display: "none" })
        DOM_DIVS.aboutDiv.css({ display: "block" })
    })
    DOM_NAVBAR.nextBtn.on("click", function () {
        DOM_DIVS.content.html(divLoader);
        listNum++
        listChanger = (listNum - 1) * 20
        $(".toggle-one").bootstrapToggle("destroy");
        CRYPTO_API.getCrypto().then(response => GetCryptoState(response.slice(listChanger, listChanger + 20)))
    })
    DOM_NAVBAR.backBtn.on("click", function () {
        if (listNum < 1) return
        listNum--
        $(".toggle-one").bootstrapToggle("destroy");
        draw(CryptoState)
    })
}


function GetCryptoState(apiCoinsArray) {
    const state = apiCoinsArray.reduce((elem, crypto) => {
        const { symbol } = crypto;
        if (!CryptoState[symbol]) return { ...elem, [symbol]: new Crypto(crypto, false, listNum) }
        CryptoState[symbol].page = listNum
        return elem
    }, {})
    CryptoState = { ...CryptoState, ...state }
    $(".listChanger").css({ display: "flex" })
    draw(CryptoState)
}


function draw(CryptoStateObject) {
    DOM_DIVS.content .html("");
    const pageCards = Object.keys(CryptoStateObject).reduce((array, key) => {
        if (CryptoState[key].page === listNum || key === DOM_NAVBAR.inputSearch.val()) return [...array, CryptoState[key]]
        else return array
    }, [])
    pageCards.map((crypto) => {
        const { symbol, name, id } = crypto
        const clonedCard = DOM_DIVS.cryptoForm.clone();
        clonedCard.find(".card-body").attr({ "id": symbol });
        clonedCard.find(".card-title").html(symbol)
        clonedCard.find(".card-text").html(name)
        clonedCard.css({ display: "inline-block" });
        clonedCard.find(".more-info").on("click", async () => {
            if (CryptoState[symbol].showRate) { closingInfo(symbol); return }
            await CRYPTO_API.getRate(id).then(response => aplyCryptInf(response))
            switcher()
        })
        clonedCard.find(".toggle-one").on("change", () => {
            chosenCrypto(symbol)
        })
        if (CryptoState[symbol].showRate) { showRateCard(clonedCard) }
        DOM_DIVS.content .append(clonedCard);
        if (CryptoState[symbol].isSelected) { clonedCard.last().find(".toggle-one").prop('checked', true) }
        else { clonedCard.last().find(".toggle-one").prop('checked', false) }
    })
    listSwitch()
    $(".toggle-one").bootstrapToggle();
}



init()