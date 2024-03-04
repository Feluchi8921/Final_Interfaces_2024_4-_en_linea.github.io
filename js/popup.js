"use strict";

//------- Mostrar Popup-------------
const boton = document.querySelector("#boton");

function mostrarPopup() {
  const popup = document.querySelector(".popup");
  popup.classList.remove("ocultar");
  popup.classList.add("visible");

  const doc = document.querySelector(".doc");
  doc.classList.add("visible");
  doc.classList.add("ocultar");
  
    // Actualiza el porcentaje de carga cada segundo
    let progress = 0;
    const interval = setInterval(function () {
        progress += 20;
        document.getElementById("loader").style.borderBottomColor = "var(--estado)";
        document.getElementById("loaderText").innerText = `Cargando... ${progress}%`;
  
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 1000);

  setTimeout(() => {
    window.location.href = "home.html";
    clearInterval(giro);
  }, 5000);


}

boton.addEventListener("click", mostrarPopup);