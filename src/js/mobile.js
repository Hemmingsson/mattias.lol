
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints

var init = function () {
  if (isMobile) {
    // replaceFreezyVideo()
  }
}

const replaceFreezyVideo = (elm, newUrl) => {
  var preview = document.querySelector('.freeze .preview')
  var video = preview.querySelector('video')
  const url = video.dataset.src
  const gifUrl = url.replace('.mp4', '.gif')
  let $gif = document.createElement('img')
  $gif.setAttribute('src', gifUrl)
  video.remove()
  preview.querySelector('.window').appendChild($gif)
}

export default {
  init,
  isMobile
}
