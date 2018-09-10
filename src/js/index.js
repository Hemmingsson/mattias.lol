import '../scss/main.scss'
import LazyLoad from 'vanilla-lazyload'

import emailButton from './email-button.js'
import fetchCinemagraph from './fetch-cinemagraph.js'
import fitText from './fit-text.js'
import clock from './clock.js'
import mobile from './mobile.js'

document.addEventListener('DOMContentLoaded', () => {
  new LazyLoad({elements_selector: '.lazy'})
  fitText.init()
  mobile.init()
  fetchCinemagraph.init()
  emailButton.init()
  clock.init()
})

const fontsLoaded = () => {
  document.querySelector('body').classList.add('loaded')
}

if ('fonts' in document) {
  document.fonts.ready.then(fontsLoaded)
} else {
  window.onload = () => fontsLoaded
}
