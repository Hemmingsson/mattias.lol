
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints

var init = function () {
  if (isMobile) {
    replaceVideos()
  }
}

const replaceVideos = () => {
  var $freezeVideo = document.querySelector('.freeze video')
  var $freezeImage = document.querySelector('.freeze img.mobile')
  $freezeImage.classList.add('lazy')
  $freezeVideo.classList.remove('lazy')

  var $facepauseVideo = document.querySelector('.facepause video')
  var $facepauseImage = document.querySelector('.facepause img.mobile')
  $facepauseImage.classList.add('lazy')
  $facepauseVideo.classList.remove('lazy')
}

export default {
  init,
  isMobile
}
