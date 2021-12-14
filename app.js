const str1 = document.getElementById("str1")
const str2 = document.getElementById("str2")

const data = document.getElementById("data")

let errorBool

function onInit() {
    str1.value = "/:version/api/:collection/:id"
    str2.value = "/6/api/listings/3?sort=desc&limit=10"
    errorBool = false
}

function parseUrl(str1, str2) {
    let obj = {}
    const keys = str1
        .split("/")
        .map((key, index) => [key.startsWith(":"), index, key.replace(":", "")])
        .filter(([still, ,]) => still)

    const values = str2
        .split("?")[0]
        .split("/")
        .map((value, index) => [value, index])

    keys.forEach(k => {
        values.forEach((v, idx) => {
            if (k[1] === v[1]) {
                obj[k[2].toString()] = v[0]
            }
        })
    })

    // If we have parameters then:
    if (str2.includes("?")) {
        let toBeZipped = []
        str2.split("?")[1]
            .split("&")
            .forEach(param => {
                toBeZipped.push(param.split("="))
            })

        return { ...obj, ..._.fromPairs(toBeZipped) }
    } else {
        return obj
    }
}

// Event submit
document.getElementById("submit").addEventListener("click", function () {
    if (isValid(str1.value, str2.value)) {
        if (errorBool) {
            hideError()
        }
        displayData()
        setDataToDiv()
    } else {
        displayError()
        hideData()
    }
})

function isValid(string1, string2) {
    // Verifying that strings matches.
    if (string1.split("/").length === string2.split("/").length) {
        if (string2.includes("?")) {
            let lengthStr2 = string2.split("/").length

            return (
                string2.split("/")[lengthStr2 - 1].includes("?") &&
                string2.split("/")[lengthStr2 - 1].includes("=")
            )
        } else {
            return true
        }
    } else {
        return false
    }
}

function setDataToDiv() {
    data.innerHTML = `<pre>
    ${JSON.stringify(parseUrl(str1.value, str2.value), null, 4)}
    </pre>`
}

function displayData() {
    document.getElementById("data").style.display = "inline-block"
}

function hideData() {
    document.getElementById("data").style.display = "none"
}

function hideError() {
    errorBool = false
    document.getElementById("error").style.display = "none"

    for (let i = 0; i < 2; i++) {
        document
            .getElementsByClassName("input-string")
            [i].classList.remove("invalid")
    }
}

function displayError() {
    errorBool = true
    document.getElementById("error").style.display = "inline-block"

    for (let i = 0; i < 2; i++) {
        document
            .getElementsByClassName("input-string")
            [i].classList.add("invalid")
    }
}

onInit()
