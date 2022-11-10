const navigation = document.querySelector('.navigation')

const menuToggle = document.querySelector('.menu-toggle')

menuToggle.onclick = function () {
  navigation.classList.toggle('navigation--open')
}

const menuItems = document.querySelectorAll('.menu-item')
function activeMenuItem() {
  menuItems.forEach((item) => {
    item.classList.remove('menu-item--active')
  })
  this.classList.add('menu-item--active')
}

menuItems.forEach((item) => {
  item.addEventListener('click', activeMenuItem)
})
