const canvas = document.querySelector("canvas");
const brush = canvas.getContext("2d")
canvas.width = 1000
canvas.height = 700

let canvasSelect = false

let canvasArr = []


let interval

let radius = 10

let canvasSpinner = false


const canvasColor = []
for (let i = 0; i < 5; i++) {
    canvasColor.push("#" + ((1 << 24) * Math.random() | 0).toString(16))
}

async function canvasInit() {
    if (!reportsState[0]) {
        brush.font = "50px Arial";
        brush.fillStyle = "rgb(29, 40, 47)"
        brush.fillText("Please select the coins", 700, 800)
        return
    }
    canvasArrPre = [
        { ...reportsState[0], color: "blue" },
        { ...reportsState[1], color: "pink" },
        { ...reportsState[2], color: "black" },
        { ...reportsState[3], color: "red" },
        { ...reportsState[4], color: "green" }
    ]
    canvasArr = canvasArrPre.filter(item => item.symbol)
    const infoReports = canvasArr.map(item => item.symbol.toUpperCase()).join(",")
    const info = await getInfo(infoReports)
    canvasArr.forEach((item) => {
        const { symbol } = item
        if (info[symbol.toUpperCase()]) {
            item.usd = []
            for (let i = 0; i < 5; i++) {
                item.usd.push(info[symbol.toUpperCase()].USD)
            }
            item.data = true
            canvasSpinner = true
        } else item.data = false
    })
    $(".coinInGraph").each((i, sqr) => {
        if (canvasArr[i]) {
            if (!canvasArr[i].data) {
                $(sqr).css({ backgroundColor: "white" })
                $(sqr).html(`${canvasArr[i].symbol} (No Data)` || "...")
            }
            else {
                $(sqr).css({ backgroundColor: canvasArr[i].color })
                $(sqr).html(canvasArr[i].symbol)
            }
        }
    });
    radius = 5
    if (canvasSpinner) {
        spinnerCanvs()
        const arrFiltered = canvasArr.filter((item) => { if (item.data) return item })
            .map(item => { return { "symbol": item.symbol, "usd": item.usd, "color": item.color } })
       
        interval = setInterval(async function () {
            canvasSelect = true
            brush.clearRect(0, 0, 800, 400)
            drawLines(1000)
            drawLines(2000)
            drawLines(3000)
            drawVerticalLine()
            const bigNum = arrFiltered.reduce((reasult, item) => {
                for (let i = 0; i < item.usd.length; i++) {
                    if (item.usd[i] > reasult) reasult = item.usd[i]
                }
                return reasult
            }, 0)
            const arrDraw = drawHeight(bigNum, arrFiltered)
            points(arrDraw, arrFiltered)
            const NewInfo = await getInfo(infoReports)
            arrFiltered.forEach(item => {
                const { usd, symbol } = item
                usd.splice(0, 1)
                usd.push(NewInfo[symbol.toUpperCase()].USD)
            })
            let count = 0
            $(".coinInGraph").each((i, sqr) => {
                if (canvasArr[i]) {
                    if (!canvasArr[i].data) return
                    $(sqr).html(`${canvasArr[i].symbol} (${arrFiltered[count].usd[3]} $ )`)
                    count++
                }
            })
        }, 3000);
    }
}

function drawLines(i) {
    brush.beginPath()
    brush.moveTo(0, i);
    brush.lineTo(0, i)
    brush.lineWidth = 2;
    brush.strokeStyle = "rgb(29, 40, 47)"
    brush.stroke()
}
function drawVerticalLine() {
    brush.beginPath()
    brush.moveTo(10, 10);
    brush.lineTo(10, 20)
    brush.lineWidth = 1;
    brush.strokeStyle = "rgb(29, 40, 47)"
    brush.stroke()
}

function drawlinesvals(content, value) {
    brush.font = "15px Arial";
    brush.fillStyle = "rgb(29, 40, 47)"
    brush.fillText(content, 5, value)
}

async function getInfo(infoReports) {
    let ans = {}
    await CRYPTO_API.getGraph(infoReports).then(response => ans = { ...response })
    return ans
}

function drawHeight(bigNum, array) {
    let multiple = 1
    let x = bigNum
    if (x < 400 && x > 200) {
        const result = drawPoints(array, multiple, true)
        linesGraph(multiple, true)
        return result
    }
    else if (x > 400) {
        while (x > 400) {
            multiple *= 2
            x /= 2
        }
        const result = drawPoints(array, multiple, false)
        linesGraph(multiple, true)
        return result
    }
    else while (x < 200) {
        multiple *= 2
        x *= 2
    }
    const result = drawPoints(array, multiple, true)
    linesGraph(multiple, false)
    return result
}

function drawPoints(array, multiple, sm) {
    if (!sm) {
        const ret = array.reduce((element, item) => {
            let cell = []
            for (let i = 0; i < item.usd.length; i++) {
                const num = item.usd[i] / multiple
                cell = [...cell, num]
            }
            return [...element, cell]
        }, [])
        return ret
    }
    else {
        const ret = array.reduce((element, item) => {
            let cell = []
            for (let i = 0; i < item.usd.length; i++) {
                const num = item.usd[i] * multiple
                cell = [...cell, num]
            }
            return [...element, cell]
        }, [])
        return ret
    }
}
function linesGraph(multiple, sm) {
    if (sm) {
        drawlinesvals(`${20 * multiple}`, 195)
        drawlinesvals(`${30 * multiple}`, 95)
        drawlinesvals(`${10 * multiple}`, 295)
    }
    else {
        drawlinesvals(`${20 / multiple}`, 195)
        drawlinesvals(`${30 / multiple}`, 95)
        drawlinesvals(`${10 / multiple}`, 295)
    }

}

function points(arrDraw, arrFiltered) {
    const barWidth = 30
    arrDraw.forEach((item, i) => {
        let barX = 30
        item.forEach((point) => {
            brush.beginPath()
            brush.fillStyle = arrFiltered[i].color
            point += 5
            brush.fillRect(barX, canvas.height - point, barWidth, 10)
            barX += barWidth + 50
        })
        cryptoLines(item, arrFiltered[i].color)
    })
}
function cryptoLines(item, color) {
    let x = 100
    brush.beginPath()
    brush.strokeStyle = color
    brush.lineWidth = 1;
    brush.moveTo(x, canvas.height - item[0]);
    for (let i = 1; i < item.length; i++) {
        x += 200
        brush.lineTo(x, canvas.height - item[i])
    }
    brush.stroke()
}

function closeCanvas() {
    if (canvasSelect) clearInterval(interval)
    brush.clearRect(100, 400, 800, 400)
    canvasSelect = false
    $(".coinInGraph").each((i, sqr) => {
        $(sqr).css({ backgroundColor: "grey" })
        $(sqr).html("")
    })
}

function spinnerCanvs() {
    if (!canvasSpinner) return
    brush.clearRect(100, 200, 800, 400)
    let circleX = 200
    for (let i = 0; i < 5; i++) {
        brush.beginPath();
        brush.arc(circleX, 300, radius, 0, Math.PI * 2, false);
        brush.fillStyle = canvasColor[i]
        brush.fill();
        circleX += 150
    }
    radius += 0.5
    requestAnimationFrame(spinnerCanvs)
    setTimeout(() => {
        canvasSpinner = false
    }, 1000);
}
