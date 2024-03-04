"use strict";

//Me aseguro que cargó la página

window.addEventListener("DOMContentLoaded", () => {
  
  //------------Scroll hacia arriba----------------------------
  const scrollTopButton = document.querySelector(".scroll-top");
  scrollTopButton.classList.add("ocultar");

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo(0, 0);
    scrollTopButton.classList.add("scrolling");
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      //Aparece a los px
      scrollTopButton.classList.remove("ocultar");
    } else {
      scrollTopButton.classList.add("ocultar");
    }
  });

  //----------------Agrandar boton------------------------------

  const agrandar = document.querySelector(".agrandar");
  agrandar.addEventListener("click", () => {
    agrandar.style.transform = "scale(1.2)";

    setTimeout(() => {
      // Muestra el botón
      agrandar.style.opacity = 1;
      agrandar.style.transform = "scale(1)";
    }, 1000);
  });

  // ------------Desplazar botones horizontal--------------------

  const horizontal = document.querySelector(".horizontal");

  let x = 0;

  const traslHoriz = setInterval(() => {
    horizontal.style.transform = `translateX(${x}px)`;
    x = x === 0 ? 4 : 0;
  }, 600);

  const mostrar = document.querySelector(".btn-menu");

  //------------Menu responsive-----------------------------------

  mostrar.addEventListener("click", aparecer);
  function aparecer() {
    const desplegable = document.querySelector(".desplegable");
    desplegable.classList.add("mostrar");
  }


//------- Mostrar Popup-------------

boton.addEventListener("click", mostrarPopup);
});

// Selecciona todos los botones "desplegar"
const desplegarButtons = document.querySelectorAll(".desplegar");

// Agrega un evento de clic a cada botón "desplegar"
desplegarButtons.forEach((button) => {
  button.addEventListener("click", toggleMenu);
});

function toggleMenu(event) {
  // Encuentra el elemento hermano .footerDesplegable del botón clickeado
  const footerDesplegable = event.target.nextElementSibling;

  // Alterna la clase "show" en el elemento .footerDesplegable
  footerDesplegable.classList.toggle("show");
}
