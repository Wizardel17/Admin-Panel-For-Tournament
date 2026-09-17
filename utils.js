//  Функции

function generateId() {
    return `#${Math.floor(Math.random() * 100)-Math.floor(Math.random() * 100)}`
}

function checkString(string) {
    if (typeof string !== 'string') {
        throw Error('It is not a string')
    }
}

function checkEmpty(string) {
    if (string === '') {
        throw Error('String is empty')
    }
}

function checkObject(object) {
    if (typeof object !== 'object') {
        throw Error('It is not an object')
    }
}