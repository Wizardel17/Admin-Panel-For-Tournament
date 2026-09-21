import { createObject, saveCountry, getAnyStorage, saveUpcomingMatches, deleteUpcomingMatches, saveFinishedMatches} from "./storage.js";
import { checkString, checkEmpty } from "./utils.js";

//  Что то получаем

const getDashboard = document.querySelector('.dashboard')
const getStatistics = getDashboard.querySelector('.dashboard__statistics')

const getSectionTeam = document.querySelector('.team')
const getFormTeam = getSectionTeam.querySelector('.team__createTeam')
const getSearchCountry = getSectionTeam.querySelector('.team__searchCountry')
const getSelect = getSearchCountry.querySelector('select')

const getSectionMatches = document.querySelector('.matches')
const getFormMatches = getSectionMatches.querySelector('.matches__form')
const getContainerNewMatches = getSectionMatches.querySelector('.matches__newMatches')
const getContainerOldMatches = getSectionMatches.querySelector('.matches__oldMatches')

//  Обработчики событий

getFormTeam.addEventListener('submit', (e) => {
    e.preventDefault()

    const getChildrenForm = getFormTeam.children

    const teamName = getChildrenForm[0].value.toUpperCase().trim()
    const teamCountry = getChildrenForm[1].value.trim()

    createObject(teamName, teamCountry)
    addCountryOption(teamCountry)
    calculateTeams()

    getChildrenForm[0].value = ''
    getChildrenForm[1].value = ''
})

getFormMatches.addEventListener('submit', (e) => {
    e.preventDefault()

    const getChildrenForm = getFormMatches.children

    const teamName1 = getChildrenForm[0].value.toUpperCase().trim()
    const teamName2 = getChildrenForm[1].value.toUpperCase().trim()

    createNewMatches(teamName1, teamName2)

    getChildrenForm[0].value = ''
    getChildrenForm[1].value = ''
})

getContainerNewMatches.addEventListener('click', (e) => {
    const findParent = e.target.parentElement
    const getChildren = findParent.children
    const team1 = getChildren[0].textContent
    const team2 = getChildren[2].textContent

    const matchObject = [team1, team2]

    if (e.target.classList.contains('match__button')) {
        
        findParent.innerHTML = 
            `<div class='team'>${team1}</div>
            <select>
                <option value="0 - 3">0 - 3</option>
                <option value="3 - 0">3 - 0</option>
                <option value="1 - 3">1 - 3</option>
                <option value="3 - 1">3 - 1</option>
                <option value="2 - 3">2 - 3</option>
                <option value="3 - 2">3 - 2</option>
            </select>
            <div class='team'>${team2}</div>
            <button class='match__agree'>Подтвердить</button>
            <button class='match__disagree'>Отменить</button>`
    }

    if (e.target.classList.contains('match__agree')) {
        const score = getChildren[1].value
        const finishedMatchObject = {team1, team2, score}
        findParent.innerHTML = 
            `<div class='team'>${team1}</div>
            <div class='score'>score</div>
            <div class='team'>${team2}</div>`
        getContainerOldMatches.append(findParent)
        deleteUpcomingMatches(matchObject)
        saveFinishedMatches(finishedMatchObject)
    }

    if (e.target.classList.contains('match__disagree')) {
        findParent.innerHTML = 
            `<div class='team'>${team1}</div>
            <div class='score'>0 - 0</div>
            <div class='team'>${team2}</div>
            <button class='match__button'>Выставить счет</button>`
    }
})

document.addEventListener('DOMContentLoaded', () => {
    loadCountries()
    loadUpcomingMatches()
    loadFinishedMatches()

    calculateTeams()
})

//  Функции

function addCountryOption(country) {
    checkEmpty(country)
    checkString(country)
    const checkCountry = saveCountry(country)

    if (!checkCountry) {
        return
    }

    getSelect.innerHTML += `<option value='${country}'>${country}</option>`
}

function loadCountries() {
    const arrayCountries = getAnyStorage('countries')

    if (!(arrayCountries)) {
        return
    }

    for (let country of arrayCountries) {
        getSelect.innerHTML += `<option value='${country}'>${country}</option>`
    }
}

function getStorages(string) {
    const availableStorages = ['upcoming', 'finished']

    if (!(availableStorages.includes(string))) {
        throw Error('Storage blocked')
    }
    
    const storageArray = getAnyStorage(string)

    if (!(storageArray)) {
        return
    }

    return storageArray
}

function loadUpcomingMatches() {
    const arrayUpcoming = getStorages('upcoming')

    for (let match of arrayUpcoming) {
        getContainerNewMatches.innerHTML += 
            `<div class='match'>
                <div class='team'>${match.team1}</div>
                <div class='score'>${match.score}</div>
                <div class='team'>${match.team2}</div>
                <button class='match__button'>Выставить счет</button>
            </div>`
    }
}

function loadFinishedMatches() {
    const arrayFinished = getStorages('finished')

    for (let match of arrayFinished) {
        getContainerOldMatches.innerHTML += 
            `<div class='match'>
                <div class='team'>${match.team1}</div>
                <div class='score'>${match.score}</div>
                <div class='team'>${match.team2}</div>
            </div>`
    }
}

function createNewMatches(team1, team2) {
    checkEmpty(team1)
    checkEmpty(team2)
    checkString(team1)
    checkString(team2)

    if (team1 === team2) {
        throw Error('The same team!!!')
    }

    const getStorage = getAnyStorage('teams')
    const arrayTeam = getStorage.map(item => item.team)

    if (!(arrayTeam.includes(team1))) {
        throw Error(`${team1} absents in the storage`)
    }

    if (!(arrayTeam.includes(team2))) {
        throw Error(`${team2} absents in the storage`)
    }

    const matchObject = {
        team1, team2, score: '0 - 0'
    }

    getContainerNewMatches.innerHTML += 
        `<div class='match'>
            <div class='team'>${matchObject.team1}</div>
            <div class='score'>${matchObject.score}</div>
            <div class='team'>${matchObject.team2}</div>
            <button class='match__button'>Выставить счет</button>
        </div>`

    saveUpcomingMatches(matchObject)
}


function calculateTeams() {
    const getBlock = getStatistics.querySelector('.dashboard__statistics__teams')
    const getTeams = getAnyStorage('teams')
    const getTeamsLength = getTeams.length

    getBlock.innerHTML = `Общее кол-во команд: ${getTeamsLength}`
}