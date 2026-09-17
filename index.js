import { createObject, saveCountry, getStorageCountry } from "./storage.js";
import { checkString, checkEmpty } from "./utils.js";

//  Что то получаем

const getSectionTeam = document.querySelector('.team')
const getForm = getSectionTeam.querySelector('.team__createTeam')
const getSearchCountry = getSectionTeam.querySelector('.team__searchCountry')
const getSelect = getSearchCountry.querySelector('select')

//  Обработчики событий

getForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const getChildrenForm = getForm.children

    const teamName = getChildrenForm[0].value
    const teamCountry = getChildrenForm[1].value

    createObject(teamName, teamCountry)
    addCountryOption(teamCountry)

    getChildrenForm[0].value = ''
    getChildrenForm[1].value = ''
})

document.addEventListener('DOMContentLoaded', () => {
    loadCountries()
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
    const arrayCountries = getStorageCountry()

    for (let country of arrayCountries) {
        getSelect.innerHTML += `<option value='${country}'>${country}</option>`
    }
}
