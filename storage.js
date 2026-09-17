import { generateId, checkEmpty, checkString, checkObject } from "./utils.js";

// Сохраняем

const tasks = []

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

    const getStorage = JSON.parse(localStorage.getItem('teams'))

    if (!(getStorage)) {
        getStorage = localStorage.getItem('teams', JSON.stringify(tasks))
    }

    tasks.unshift(object)
    localStorage.setItem('teams', JSON.stringify(tasks))
}