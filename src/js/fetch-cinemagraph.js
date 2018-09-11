
import mobile from './mobile.js'
const dataBaseUrl = 'https://rawgit.com/Hemmingsson/Freeze/master/cinemagraphs.json'
let db = null

const init = () => {
  const $fetchButton = document.querySelector('.fetch')
  const $player = document.querySelector('.freeze video')

  $fetchButton.addEventListener('click', fetchNewCinemgraph)
  $player.addEventListener('error', fetchNewCinemgraph)
}

const fetchNewCinemgraph = () => {
  if (db) { // Set new cg if db is already fetched
    setNewCinemagraph()
    return
  }
  getDataBase().then((data) => {
    db = data
    setNewCinemagraph()
  })
}

const setNewCinemagraph = () => {
  const imageId = db[Math.floor(Math.random() * db.length)]
  if (mobile.isMobile) {
    const $image = document.querySelector('.freeze img.mobile')
    $image.src = 'https://i.imgur.com/' + imageId + '.gif'
  } else {
    const $player = document.querySelector('.freeze video')
    $player.src = 'https://i.imgur.com/' + imageId + '.mp4'
  }
}

const getDataBase = () => {
  return new Promise((resolve) => {
    fetch(dataBaseUrl, {
      method: 'get'
    }).then(function (response) {
      return response.json()
    }).then(function (j) {
      resolve(j.items)
    })
  })
}

export default {
  init
}
