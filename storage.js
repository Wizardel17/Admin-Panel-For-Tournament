import { generateId, checkEmpty, checkString, checkObject } from "./utils.js";

//  Функции

export function createObject(team, country) {
    checkEmpty(team)
    checkEmpty(country)
    checkString(team)
    checkString(country)

    const teamObject = {
        id: generateId(),
        team,
        players: 3,
        country,
        points: 0,
    }

    saveStorage(teamObject)
}

function saveStorage(object) {
    checkObject(object)

    let getStorage = JSON.parse(localStorage.getItem('teams')) || []

    getStorage.unshift(object)
    localStorage.setItem('teams', JSON.stringify(getStorage))
}

export function saveCountry(country) {
    checkEmpty(country)
    checkString(country)

    let getStorage = JSON.parse(localStorage.getItem('countries'))

    if (getStorage.includes(country)) {
        return false
    } else {
        getStorage.unshift(country)
        localStorage.setItem('countries', JSON.stringify(getStorage))
        return true
    }
}

export function getStorageCountry() {
    let getStorage = JSON.parse(localStorage.getItem('countries')) || []

    if (!(getStorage)) {
        localStorage.setItem('countries', JSON.stringify([]))
    }

    return JSON.parse(localStorage.getItem('countries'))
}