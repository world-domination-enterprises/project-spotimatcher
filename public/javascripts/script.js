document.addEventListener('DOMContentLoaded', () => {
  const testa = document.querySelector('.testa'),
  modal = document.querySelector('.modal'),
  btn = document.querySelector('.button1')

  btn.addEventListener('click',() => {
    testa.style.opacity = "0"
    modal.style.opacity = "1"
  })
  console.log('IronGenerator JS imported successfully!');

}, false);
