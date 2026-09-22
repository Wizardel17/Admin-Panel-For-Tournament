import { createObject, saveCountry, getAnyStorage, saveUpcomingMatches, deleteUpcomingMatches, saveFinishedMatches, saveTeamStorages} from "./storage.js";
import { checkString, checkEmpty } from "./utils.js";

//  Что то получаем

const getDashboard = document.querySelector('.dashboard')
const getStatistics = getDashboard.querySelector('.dashboard__statistics')
const getFutureMatches = getDashboard.querySelector('.dashboard__futureMatches')

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
    calculateUpcomingMatches()
    calculateMatches()

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
            <div class='score'>${score}</div>
            <div class='team'>${team2}</div>`

        getContainerOldMatches.append(findParent)
        deleteUpcomingMatches(matchObject)
        saveFinishedMatches(finishedMatchObject)
        calculateFinishedMatches()
        addInHistory(team1, team2, score)
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
    loadUpcomingInDashboard()

    calculateTeams()
    calculateMatches()
    calculateFinishedMatches()
    calculateUpcomingMatches()
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

function loadCountries() {
    const arrayCountries = getAnyStorage('countries')

    if (!(arrayCountries)) {
        return
    }

    for (let country of arrayCountries) {
        getSelect.innerHTML += `<option value='${country}'>${country}</option>`
    }
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

function loadUpcomingInDashboard() {
    const getUpcomingMatches = getAnyStorage('upcoming')

    for (let match of getUpcomingMatches) {
        getFutureMatches.innerHTML += 
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

function addInHistory(team1, team2, score) {
    checkString(team1)
    checkString(team2)
    checkString(score)

    const getStorage = getAnyStorage('teams')
    const getTeam1 = getStorage.find(({ team }) => team1 === team)
    const getTeam2 = getStorage.find(({ team }) => team2 === team)
     console.log(getTeam1, getTeam2)

    const findTeam1 = getStorage.findIndex(({ team }) => team1 === team)
    const findTeam2 = getStorage.findIndex(({ team }) => team2 === team)

    const splitScore = score.split(' ')

    if (splitScore[0] > splitScore[2]) {
        const forTeam1 = [{match: `${team1} vs ${team2}`, result: 'win', score}]
        const forTeam2 = [{match: `${team1} vs ${team2}`, result: 'lose', score}]
        getTeam1.points += 3
        getTeam1.matches.push(forTeam1)
        getTeam2.matches.push(forTeam2)
    } else {
        const forTeam1 = [{match: `${team1} vs ${team2}`, result: 'lose', score}]
        const forTeam2 = [{match: `${team1} vs ${team2}`, result: 'win', score}]
        getTeam2.points += 3
        getTeam1.matches.push(forTeam1)
        getTeam2.matches.push(forTeam2)
    }

    saveTeamStorages(getStorage)

}

//  Функции: Dashboard (калькуляция)

function calculateTeams() {
    const getBlock = getStatistics.querySelector('.dashboard__statistics__teams')
    const getTeams = getAnyStorage('teams')
    const getTeamsLength = getTeams.length

    getBlock.innerHTML = `Общее кол-во команд: ${getTeamsLength}`
}

function calculateMatches() {
    const getBlock = getStatistics.querySelector('.dashboard__statistics__allMatches')
    const getUpcoming = getAnyStorage('upcoming')
    const getFinished = getAnyStorage('finished')
    const getMatchesLength = getUpcoming.length + getFinished.length

    getBlock.innerHTML = `Общее кол-во матчей: ${getMatchesLength}`
}

function calculateFinishedMatches() {
    const getBlock = getStatistics.querySelector('.dashboard__statistics__finishedMatches')
    const getFinished = getAnyStorage('finished')
    const getFinishedLength = getFinished.length

    getBlock.innerHTML = `Кол-во законченных матчей: ${getFinishedLength}`
}

function calculateUpcomingMatches() {
    const getBlock = getStatistics.querySelector('.dashboard__statistics__futureMatches')
    const getUpcoming = getAnyStorage('upcoming')
    const getUpcomingLength = getUpcoming.length

    getBlock.innerHTML = `Кол-во будущих матчей: ${getUpcomingLength}`
}