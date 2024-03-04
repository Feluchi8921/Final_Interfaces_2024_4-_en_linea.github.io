document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  //Evita que el formulario se envíe y realice la acción predeterminada
  formPreferencias.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  //Iniciamos el juego
  const iniciarJuego = () => {
    //Aparace el juego
    juego.style.display = "block";

    //Ocultamos el formulario de preferencias
    preferencias.style.display = "none";

    //Llamo al canvas y le doy las medidas
    let canvas = document.querySelector("#myCanvas");
    canvas.width = 1000;
    canvas.height = 800;

    //Creo un objeto con las preferencias ingresadas
    let gamers = {
      g1: {
        name: document.getElementById("jugador1").value,
        personaje: document.querySelector('input[name="j1"]:checked').value,
        color: "red",
      },
      g2: {
        name: document.getElementById("jugador2").value,
        personaje: document.querySelector('input[name="j2"]:checked').value,
        color: "green",
      },
    };

    //Recupero las preferencias para crear instancias del juego
    let option = document.getElementById("n_juego").value;
    //console.log(option)
    let widthBoard = 490; //Ancho del tablero
    let heightBoard = 420; //Alto del tablero
    let game;
    if (option == 4) {
      let cols = 7;
      let rows = 6;
      game = new Game(gamers, canvas, widthBoard, heightBoard, cols, rows);
    } else if (option == 5) {
      let cols = 8;
      let rows = 7;
      game = new Game(gamers, canvas, widthBoard, heightBoard, cols, rows);
    } else if (option == 6) {
      let cols = 9;
      let rows = 7;
      game = new Game(gamers, canvas, widthBoard, heightBoard, cols, rows);
    } else if (option == 7) {
      let cols = 10;
      let rows = 8;
      game = new Game(gamers, canvas, widthBoard, heightBoard, cols, rows);
    } else {
      let cols = 7;
      let rows = 6;
      game = new Game(gamers, canvas, widthBoard, heightBoard, cols, rows);
    }

    //Popup mensaje de ganador
    let winnerWindow = document.querySelector(".popupJuego");
    
    let text = document.querySelector(".textoGanador");
    let btnJugar = document.querySelector(".jugar");
    let btnReset = document.querySelector(".reset");

    let marioPlaying = true;
    //Funcion de ganador, aparace el popup
    function showWinner(winner) {
      let winnerSound = new Audio ("audio/winner.mp3");
      winnerSound.play();
      let txt = `${winner.name}: Felicitaciones Ganaste!!!`;
      text.innerHTML = txt;
      winnerWindow.classList.add("active");
    
      // Pausa la música de Mario si está sonando
      if (marioPlaying) {
        mario.pause();
        marioPlaying = false;
      }
    }

    //Funcion que llama a resetear juego
    const reset = () => {
      winnerWindow.classList.remove("active");
      game.reset();
      canvas.addEventListener("mousedown", mDown);
      if (!marioPlaying) {
        mario.play();
        marioPlaying = true;
      }
    };

    btnJugar.addEventListener("click", () => reset());
    btnReset.addEventListener("click", () => reset());

    //Dibujo el juego
    game.draw();

    //La función mOut y mUp es para manejar eventos relacionados con la interacción del mouse en un lienzo
    function mOut() {
      game.returnChipToStart();
      game.chipDropped();
      canvas.removeEventListener("mousemove", mMove);
      canvas.removeEventListener("mouseout", mOut);
      canvas.removeEventListener("mouseup", mUp);
    }

    function mUp() {
      game.chipDropped();
      let winner = game.getWinner();
      if (winner) {
        canvas.removeEventListener("mousedown", mDown);
        game.gameComplete();
        console.log("pop-up de", winner, "ganador");
        showWinner(winner);
      }
      canvas.removeEventListener("mousemove", mMove);
      canvas.removeEventListener("mouseout", mOut);
      canvas.removeEventListener("mouseup", mUp);
    }

    const mMove = (e) => {
      game.moveChip(e.offsetX, e.offsetY);
      canvas.addEventListener("mouseout", mOut);
      canvas.addEventListener("mouseup", mUp);
    };

    const mDown = (e) => {
      if (game.chipHit(e.offsetX, e.offsetY)) {
        canvas.addEventListener("mousemove", mMove);
        canvas.addEventListener("mouseup", mUp);
      }
    };

    canvas.addEventListener("mousedown", mDown);
  };


//Compruebo que hayan seleccionado los personajes
  const button = document.getElementById("iniciar");
  let audio = document.querySelector(".audioLogo");
  let mario = new Audio("audio/mario.mp3"); //Creo un objeto de audio
  
  button.addEventListener("click", (event) => {
    //Compruebo si se seleccionó un personaje para el jugador 1
    const jugador1Seleccionado = document.querySelector(
      'input[name="j1"]:checked'
    );

    //Compruebo si se seleccionó un personaje para el jugador 2
    const jugador2Seleccionado = document.querySelector(
      'input[name="j2"]:checked'
    );

    //Si no se seleccionó ningún personaje para el jugador 1
    if (!jugador1Seleccionado) {
      alert("¡Debes seleccionar un personaje para el Jugador 1!");
      event.preventDefault(); //Evita el envío del formulario
      return;
    }

    //SLo mismo para el jugador 2
    if (!jugador2Seleccionado) {
      alert("¡Debes seleccionar un personaje para el Jugador 2!");
      event.preventDefault(); //Evita el envío del formulario
      return;
    }

    //Si ambos jugadores tienen personajes seleccionados, el formulario se envía normalmente
    else {
      //Al enviar el formulario debe empezar la musica
      audio.addEventListener("click", function () {
        // Activar-desactivar sonido
        let botonAudio = document.querySelector(".botonActive");
        botonAudio.src = botonAudio.src.endsWith("audioActive.svg")
          ? "img/audioInactive.svg"
          : "img/audioActive.svg";
        // Pausar o reproducir el audio
        if (mario.paused) {
          let pause = new Audio("audio/pause.mp3");
          pause.play();
          mario.play();
        } else {
          let pause = new Audio("audio/pause.mp3");
          pause.play();
          mario.pause();
        }
      });

      // Escucha el boton enviar para reproducir el tema
      iniciarJuego();
      mario.play();
    }
  });
});
