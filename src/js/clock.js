
var init = function () {
  var digitsElm = document.querySelector('.clock')

  var updater = function () {
    updateClock(digitsElm)
    setTimeout(updater, 1000)
  }
  updater()
}

var updateClock = function (digitsElm) {
  var time = new Date()
  var hours = time.getHours()
  var minutes = time.getMinutes()

  if (hours > 12) {
    hours = hours - 12
  }
  if (hours === 0) {
    hours = 12
  }

  minutes = harold(minutes)
  digitsElm.innerText = hours + ':' + minutes
}

var harold = function (standIn) {
  if (standIn < 10) {
    standIn = '0' + standIn
  }
  return standIn
}

export default {
  init
}
