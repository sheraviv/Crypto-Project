const DOM_NAVBAR = {
    inputSearch: null,
    searchBtn: null,
    homeBtn: null,
    reportsBtn: null,
    aboutBtn: null,
    nextBtn: null,
    backBtn: null,
}


const DOM_DIVS = {
    homeMain: null,
    content: null,
    reports: null,
    aboutDiv: null,
    cryptoForm: null,
    

}


DOM_NAVBAR.inputSearch = $("#searchInput")
DOM_NAVBAR.searchBtn = $("#searchBtn")
DOM_NAVBAR.homeBtn = $("#home")
DOM_NAVBAR.reportsBtn = $("#reportsBtn")
DOM_NAVBAR.aboutBtn = $("#aboutBtn")
DOM_NAVBAR.nextBtn = $("#nextBtn")
DOM_NAVBAR.backBtn =$("#backBtn")





DOM_DIVS.homeMain = $("#homeMain")
DOM_DIVS.content = $("#content")
DOM_DIVS.reports = $("#reports")
DOM_DIVS.aboutDiv = $("#aboutDiv")
DOM_DIVS.cryptoForm = $("#cryptoForm")

const divLoader = '<div class="loader"></div>'

class Crypto {
    constructor(cryptoList, isSelected, page) {
        const { id, symbol, name } = cryptoList
        this.name = name
        this.symbol = symbol;
        this.id = id
        this.isSelected = isSelected
        this.showRate = false
        this.page = page || 0
    }

}



class CryptoModal extends Crypto {
    constructor(modalList, isSelected, page) {
        const { image, market_data } = modalList
        super(modalList, isSelected, page)
        this.pic = image.thumb
        this.usdRate = market_data.current_price.usd
        this.eurRate = market_data.current_price.eur
        this.ilsRate = market_data.current_price.ils
    }
}

const CRYPTO_API = {
    getCrypto: () => {
        return $.ajax({
            url: "https://api.coingecko.com/api/v3/coins/list ",
            method: "get"
        })
    },
    getRate: (data) => {
        return $.ajax({
            url: `https://api.coingecko.com/api/v3/coins/${data}`,
            method: "get"
        })
    },
    getGraph: (data) => {
        return $.ajax({
            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${data}&tsyms=USD`,
            method: "get"
        })
    },
}
