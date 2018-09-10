import textFit from 'textfit'
import debounce from 'lodash/debounce'
const textFitConf = { widthOnly: true, maxFontSize: 300 }
let fittedTexts

const init = () => {
  fittedTexts = document.querySelectorAll('.project h2')
  fitText() // Initial fit
  'fonts' in document ? document.fonts.ready.then(fitText) : window.onload = () => fitText
  window.addEventListener('resize', debounce(fitText, 100))
}

const fitText = () => textFit(fittedTexts, textFitConf)

export default {
  init
}
