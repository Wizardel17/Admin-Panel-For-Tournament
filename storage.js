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

    const teams = getStorage.map(item => item.team)

    if (teams.includes(object.team)) {
        throw Error(`${object.team} already have in the storage`)
    }

    getStorage.unshift(object)
    localStorage.setItem('teams', JSON.stringify(getStorage))
}

export function saveCountry(country) {
    checkEmpty(country)
    checkString(country)

    let getStorage = JSON.parse(localStorage.getItem('countries')) || []

    if (getStorage.includes(country)) {
        return false
    } else {
        getStorage.unshift(country)
        localStorage.setItem('countries', JSON.stringify(getStorage))
        return true
    }
}

export function saveUpcomingMatches(object) {
    checkObject(object)

    let getStorage = JSON.parse(localStorage.getItem('upcoming')) || []

    getStorage.unshift(object)
    localStorage.setItem('upcoming', JSON.stringify(getStorage))
}

export function getAnyStorage(string) {
    const availableStorage = ['teams', 'countries', 'upcoming']

    if (!(availableStorage.includes(string))) {
        throw Error('Storage blocked')
    }

    let getStorage = JSON.parse(localStorage.getItem(string))

    if (!(getStorage)) {
        localStorage.setItem(string, JSON.stringify([]))
    }

    return JSON.parse(localStorage.getItem(string))
}