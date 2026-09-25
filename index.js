import { createObject, saveCountry, getAnyStorage, saveMatches, deleteUpcomingMatches, saveTeamStorage} from "./storage.js";
import { checkString, checkEmpty, checkArray } from "./utils.js";

//  Что то получаем

//  Dashboard

const getDashboard = document.querySelector('.dashboard')
const getFutureMatches = getDashboard.querySelector('.dashboard__futureMatches')

//  Team

const getSectionTeam = document.querySelector('.team')
const getFormTeam = getSectionTeam.querySelector('.team__createTeam')
const getSearchCountry = getSectionTeam.querySelector('.team__searchCountry')
const getSelect = getSearchCountry.querySelector('select')

//  Matches

const getSectionMatches = document.querySelector('.matches')
const getFormMatches = getSectionMatches.querySelector('.matches__form')
const getContainerNewMatches = getSectionMatches.querySelector('.matches__newMatches')
const getContainerOldMatches = getSectionMatches.querySelector('.matches__oldMatches')

//  Statistics

const getStatistics = document.querySelector('.statistics')
const getTable = getStatistics.querySelector('.statistics__table')
const getTbody = getTable.querySelector('.statistics__table--tbody')
const getStat = getStatistics.querySelector('.statistics__stat')

//  Filters

const getFilter = document.querySelector('.team__searchDifferent')
const getCountryFilter = document.querySelector('.team__searchCountry')
const getSelectCountryFilter = getCountryFilter.querySelector('select')
const getSelectFilter = getFilter.querySelector('select')

//  Function/storage/Variables

function checkSection(section) {
    if (!(arrayAvailableSection.includes(section))) {
        throw Error('Bad parameter')
    }

    return section
}

const getStorage = getAnyStorage('teams')
const arrayAvailableSection = ['dashboard', 'statistics']

//  Обработчики событий

getFormTeam.addEventListener('submit', (e) => {
    e.preventDefault()

    const getChildrenForm = getFormTeam.children

    const teamName = getChildrenForm[0].value.toUpperCase().trim()
    const teamCountry = getChildrenForm[1].value.trim()

    createObject(teamName, teamCountry)
    addCountryOption(teamCountry)
    calculateTeams('statistics')
    loadForAdd()

    getChildrenForm[0].value = ''
    getChildrenForm[1].value = ''
})

getFormMatches.addEventListener('submit', (e) => {
    e.preventDefault()

    const getChildrenForm = getFormMatches.children

    const teamName1 = getChildrenForm[0].value.toUpperCase().trim()
    const teamName2 = getChildrenForm[1].value.toUpperCase().trim()

    createNewMatches(teamName1, teamName2)
    calculateUpcomingMatches('statistics')
    calculateMatches('statistics')

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
        saveMatches(finishedMatchObject, 'finished')
        updateCalculateUpcomingMatches()
        calculateFinishedMatches('statistics')
        addInHistory(team1, team2, score)
        loadHighPointsTable()
        calculateMoreMatches()
        calculateWinMatches()
        calculateLoseMatches()
    }

    if (e.target.classList.contains('match__disagree')) {
        findParent.innerHTML = 
            `<div class='team'>${team1}</div>
            <div class='score'>0 - 0</div>
            <div class='team'>${team2}</div>
            <button class='match__button'>Выставить счет</button>`
    }
})

getFilter.addEventListener('click', (e) => {
    const choseFilter = getSelectFilter.value

    if (e.target.tagName === 'BUTTON') {
       if (choseFilter === 'a-z') {
            loadABCHigh()
       } else if (choseFilter === 'z-a') {
            loadABCLittle()
       } else if (choseFilter === 'pointsful') {
            loadHighPointsTable()
       } else {
            loadLittlePointsTable()
       }
    }
})

getCountryFilter.addEventListener('click', (e) => {
    const choseCountry = getSelectCountryFilter.value
    if (e.target.tagName === 'BUTTON') {
        loadCountry(choseCountry)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    loadCountries()
    loadUpcomingMatches()
    loadFinishedMatches()
    loadUpcomingInDashboard()
    loadHighPointsTable()

    calculateTeams('dashboard')
    calculateMatches('dashboard')
    calculateFinishedMatches('dashboard')
    calculateUpcomingMatches('dashboard')

    calculateTeams('statistics')
    calculateMatches('statistics')
    calculateFinishedMatches('statistics')
    calculateUpcomingMatches('statistics')

    if (getStorage.length !== 0) {
        calculateMoreMatches()
        calculateWinMatches()
        calculateLoseMatches()
    }
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

//  Функции: Загрузки

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
    const arrayUpcoming = getAnyStorage('upcoming')

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
    const arrayFinished = getAnyStorage('finished')

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

function loadTable(array) {
    checkArray(array)

    getTbody.innerHTML = ''

    for (let team of array) {
        getTbody.insertAdjacentHTML('beforeend', 
            `<tr>
                <td>${team.team}</td>
                <td>${team.players}</td>
                <td>${team.country}</td>
                <td>${team.win}</td>
                <td>${team.lose}</td>
                <td>${team.points}</td>
            </tr>`)
    }
}

function loadHighPointsTable() {
    const getStorageTeams = getAnyStorage('teams')

    const array = getStorageTeams.sort((a, b) => b.points - a.points)

    loadTable(array)
}

function loadLittlePointsTable() {
    const getStorageTeams = getAnyStorage('teams')

    const array = getStorageTeams.sort((a, b) => a.points - b.points)

    loadTable(array)
}

function loadABCHigh() {
    const getStorageTeams = getAnyStorage('teams')

    const array = getStorageTeams.sort((a, b) => a.team.localeCompare(b.team))

    loadTable(array)
}

function loadABCLittle() {
    const getStorageTeams = getAnyStorage('teams')

    const array = getStorageTeams.sort((a, b) => b.team.localeCompare(a.team))

    loadTable(array)
}

function loadCountry(string) {
    checkEmpty(string)
    checkString(string)

    const getStorageTeams = getAnyStorage('teams')
    const array = getStorageTeams.filter(({ country }) => country === string)

    loadTable(array)
}

function loadForAdd() {
    const array = getAnyStorage('teams')

    loadTable(array)
}

//  Функции: Связанное с локалстораж и остальным

function createNewMatches(team1, team2) {
    checkEmpty(team1)
    checkEmpty(team2)
    checkString(team1)
    checkString(team2)

    if (team1 === team2) {
        throw Error('The same team!!!')
    }

    const getStorageTeams = getAnyStorage('teams')
    const arrayTeam = getStorageTeams.map(item => item.team)

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

    saveMatches(matchObject, 'upcoming')
}

function addInHistory(team1, team2, score) {
    checkString(team1)
    checkString(team2)
    checkString(score)
    checkEmpty(team1)
    checkEmpty(team2)
    checkEmpty(score)

    const getStorageTeams = getAnyStorage('teams')
    const getTeam1 = getStorageTeams.find(({ team }) => team1 === team)
    const getTeam2 = getStorageTeams.find(({ team }) => team2 === team)

    const splitScore = score.split(' ')

    if (splitScore[0] > splitScore[2]) {
        const forTeam1 = [{match: `${team1} vs ${team2}`, result: 'win', score}]
        const forTeam2 = [{match: `${team1} vs ${team2}`, result: 'lose', score}]
        getTeam1.points += 3
        getTeam1.win += 1
        getTeam2.lose += 1
        getTeam1.matches.push(forTeam1)
        getTeam2.matches.push(forTeam2)
    } else {
        const forTeam1 = [{match: `${team1} vs ${team2}`, result: 'lose', score}]
        const forTeam2 = [{match: `${team1} vs ${team2}`, result: 'win', score}]
        getTeam2.points += 3
        getTeam2.win += 1
        getTeam1.lose += 1
        getTeam1.matches.push(forTeam1)
        getTeam2.matches.push(forTeam2)
    }

    saveTeamStorage(getStorageTeams)

}

//  Функции: Dashboard + Statistics (калькуляция)

function calculateTeams(section) {
    const getSection = checkSection(section)
    const getBlock = document.querySelector(`.${getSection}__stat__teams`)
    const getTeams = getAnyStorage('teams')
    const getTeamsLength = getTeams.length

    getBlock.innerHTML = `Общее кол-во команд: ${getTeamsLength}`
}

function calculateMatches(section) {
    const getSection = checkSection(section)
    const getBlock = document.querySelector(`.${getSection}__stat__allMatches`)
    const getUpcoming = getAnyStorage('upcoming')
    const getFinished = getAnyStorage('finished')
    const getMatchesLength = getUpcoming.length + getFinished.length

    getBlock.innerHTML = `Общее кол-во матчей: ${getMatchesLength}`
}

function calculateFinishedMatches(section) {
    const getSection = checkSection(section)
    const getBlock = document.querySelector(`.${getSection}__stat__finishedMatches`)
    const getFinished = getAnyStorage('finished')
    const getFinishedLength = getFinished.length

    getBlock.innerHTML = `Кол-во законченных матчей: ${getFinishedLength}`
}

function calculateUpcomingMatches(section) {
    const getSection = checkSection(section)
    const getBlock = document.querySelector(`.${getSection}__stat__futureMatches`)
    const getUpcoming = getAnyStorage('upcoming')
    const getUpcomingLength = getUpcoming.length

    getBlock.innerHTML = `Кол-во будущих матчей: ${getUpcomingLength}`
}

function updateCalculateUpcomingMatches() {
    const getBlock = document.querySelector(`.statistics__stat__futureMatches`)
    const getUpcoming = getAnyStorage('upcoming')
    const getUpcomingLength = getUpcoming.length

    getBlock.innerHTML = `Кол-во будущих матчей: ${getUpcomingLength}`
}

//  Функции: Statistics (калькуляция)

function calculateMoreMatches() {
    const getBlock = getStat.querySelector('.statistics__stat__moreMatches')
    const getStorageTeams = getAnyStorage('teams')
    let moreMatches = -1
    let findTeam = null

    for (let i = 0; i < getStorageTeams.length; i++) {
        if (getStorageTeams[i].matches.length > moreMatches) {
            moreMatches = getStorageTeams[i].matches.length
            findTeam = getStorageTeams[i]
        }
    }

    getBlock.innerHTML = `Сыгранно больше всего матчей: ${findTeam.team}`
}

function calculateWinMatches() {
    const getBlock = getStat.querySelector('.statistics__stat__moreWin')
    const getStorageTeams = getAnyStorage('teams')
    let winMatches = -1
    let findTeam = null

    for (let i = 0; i < getStorageTeams.length; i++) {
        if (getStorageTeams[i].win > winMatches) {
            winMatches = getStorageTeams[i].win
            findTeam = getStorageTeams[i]
        }
    }

    getBlock.innerHTML = `Выиграно больше всего матчей: ${findTeam.team}`
}

function calculateLoseMatches() {
    const getBlock = getStat.querySelector('.statistics__stat__moreLose')
    const getStorageTeams = getAnyStorage('teams')
    let loseMatches = -1
    let findTeam = null

    for (let i = 0; i < getStorageTeams.length; i++) {
        if (getStorageTeams[i].lose > loseMatches) {
            loseMatches = getStorageTeams[i].lose
            findTeam = getStorageTeams[i]
        }
    }

    getBlock.innerHTML = `Проиграно больше всего матчей: ${findTeam.team}`
}
