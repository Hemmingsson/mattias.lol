import emailButton from './email-button.js'
import fetchCinemagraph from './fetch-cinemagraph.js'
import fitText from './fit-text.js'
import clock from './clock.js'
import mobile from './mobile.js'
import lazy from './lazy.js'

document.addEventListener('DOMContentLoaded', () => {
    mobile.init()
    fitText.init()
    fetchCinemagraph.init()
    emailButton.init()
    clock.init()
    lazy.init()
})