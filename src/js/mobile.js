const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints

var init = function() {
    if (isMobile) {
        replaceVideos()
    }
}

const replaceVideos = () => {
    var $freezeVideo = document.querySelector('.freeze video')
    var $freezeImage = document.querySelector('.freeze img.mobile')
    $freezeImage.classList.remove('hidden')
    $freezeVideo.classList.add('hidden')

    var $facepauseVideo = document.querySelector('.facepause video')
    var $facepauseImage = document.querySelector('.facepause img.mobile')
    $facepauseImage.classList.remove('hidden')
    $facepauseVideo.classList.add('hidden')

    var $springsteenVideo = document.querySelector('.springsteen video')
    var $springsteenImage = document.querySelector('.springsteen img.mobile')
    $springsteenImage.classList.remove('hidden')
    $springsteenVideo.classList.add('hidden')
}

export default {
    init,
    isMobile
}