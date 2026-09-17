import { generateId, checkEmpty, checkString, checkObject } from "./utils";

// Сохраняем

const tasks = []

//  Функции

function createObject(team, country) {
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

    tasks.unshift(object)
    localStorage.setItem('teams', JSON.stringify(object))
}