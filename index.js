import { createObject } from "./storage.js";

//  Что то получаем

const getSectionTeam = document.querySelector('.team')
const getForm = getSectionTeam.querySelector('.team__createTeam')

//  Обработчики событий

getForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const getChildrenForm = getForm.children

    const teamName = getChildrenForm[0].value
    const teamCountry = getChildrenForm[1].value

    createObject(teamName, teamCountry)

    getChildrenForm[0].value = ''
    getChildrenForm[1].value = ''
})
