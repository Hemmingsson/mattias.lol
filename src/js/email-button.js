const emailAdress = 'hemmingsson.m@gmail.com'

const init = () => {
  const $emailButton = document.querySelector('.email')
  $emailButton.addEventListener('click', function () {
    this.innerHTML = `<a href="mailto:${emailAdress}">${emailAdress}</a>`
  })
}

export default {
  init
}
