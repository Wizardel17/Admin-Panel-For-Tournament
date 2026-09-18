import { createObject, saveCountry, getAnyStorage, saveUpcomingMatches} from "./storage.js";
import { checkString, checkEmpty } from "./utils.js";

//  Что то получаем

const getSectionTeam = document.querySelector('.team')
const getFormTeam = getSectionTeam.querySelector('.team__createTeam')
const getSearchCountry = getSectionTeam.querySelector('.team__searchCountry')
const getSelect = getSearchCountry.querySelector('select')

const getSectionMatches = document.querySelector('.matches')
const getFormMatches = getSectionMatches.querySelector('.matches__form')
const getContainerNewMacthes = getSectionMatches.querySelector('.matches__newMatches')

//  Обработчики событий

getFormTeam.addEventListener('submit', (e) => {
    e.preventDefault()

    const getChildrenForm = getFormTeam.children

    const teamName = getChildrenForm[0].value.toUpperCase().trim()
    const teamCountry = getChildrenForm[1].value.trim()

    createObject(teamName, teamCountry)
    addCountryOption(teamCountry)

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

document.addEventListener('DOMContentLoaded', () => {
    loadCountries()
    loadUpcomingMatches()
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

function loadUpcomingMatches() {
    const arrayUpcoming = getAnyStorage('upcoming')

    if (!(arrayUpcoming)) {
        return
    }

    for (let match of arrayUpcoming) {
        getContainerNewMacthes.innerHTML += 
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

    getContainerNewMacthes.innerHTML += 
        `<div class='match'>
            <div class='team'>${matchObject.team1}</div>
            <div class='score'>${matchObject.score}</div>
            <div class='team'>${matchObject.team2}</div>
        </div>`

    saveUpcomingMatches(matchObject)
}
