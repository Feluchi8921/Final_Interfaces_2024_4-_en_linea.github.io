"use strict";
class Game {

    //Construyo el juego
    constructor(gamers, canvas, width, height, cols, rows) {
        this.gamers = gamers;
        this.canvas = canvas;
        this.width = width; //Agregado ancho del tablero
        this.height = height; //Agregado alto del tablero
        this.cols = cols; //Agregado
        this.rows = rows; //Agregado
        this.ctx = canvas.getContext('2d');
        this.radius = ((this.width/this.cols)/2)-5; //Modificado
        this.quantityChips = 42; //Tengo que acomodar
        this.board;
        //this.reproducirTema();
        this.imgChip1;
        this.imgChip2;
        this.chips = [];
        this.loadChips();
        this.dragging;
        this.chipInMovement;
        this.turn = this.gamers['g1'];
        this.changedchipsG1 = false;
        this.changedchipsG2 = false;
        this.radiusChange = 4;
        this.radiusChanged = false;
        this.shiftTime = 30;
        this.timer = this.shiftTime;
        this.shiftControl = setInterval(() => {
                                if(this.timer < 0) {
                                    this.changeTurn();
                                    this.timer = this.shiftTime;
                                }
                                this.infoTimer("Tiempo restante: ", this.timer, this.turn);
                                this.draw();
                                this.timer--;
                            }, 1000);
    }
    
    //Funcion dibujar
    draw() {
        //borro canvas
        this.canvas.width = this.canvas.width;
        //dibujo el tablero
        this.drawBoard();
        this.drawChips();
        // debugger;
        this.drawTurn(this.turn); //turno
        this.infoTimer("Tiempo restante: ", this.timer, this.turn); //Temporizador
    }

    //Cargo el tablero con la imagen que le paso, no pudimos hacer imagenes para 5 en linea, ect, solo funciona 4 en linea
    loadBoard() {
                //De acuerdo a la seleccion del usuario se arma el tablero
                let opcion = document.getElementById('n_juego').value;
                if(opcion==4){
                    this.board = new Board(this.ctx, 215, 100, 490, 420, 7, 6, 4); //contexto, inicio en x, inicio en y, ancho, alto, cols, rows, value
                }
                else if(opcion==5){
                    this.board = new Board(this.ctx, 215, 100, 490, 420, 8, 7, 5);
                }
                else if(opcion==6){
                    this.board = new Board(this.ctx, 215, 100, 490, 420, 9, 8, 6);
                }
                else if(opcion==7){
                    this.board = new Board(this.ctx, 215, 100, 490, 420, 10, 9, 7);
                }
                else{
                    this.board = new Board(this.ctx, 215, 100, 490, 420, 7, 6, 8);
                }
                
                this.board.draw();
    }

  //Dibujto el tablero
  drawBoard() {
    if (this.board) {
      this.board.draw();
    } else {
      this.loadBoard();
    }
  }

  //Cargo las fichas del juego
  loadChips() {
    if (!this.imgChip1) {
      //Creo una nueva imagen para agregarle la correspondiente a la seleccionada
      this.imgChip1 = new Image();
      //La imagen se compone el nombre del jugador
      this.imgChip1.src = `./img/chips/${this.gamers.g1.personaje}.svg`;
      this.imgChip1.onload = () => {
        this.changedchipsG1 = true;
        this.loadChipsG1(this.imgChip1);
      };
    } else {
      this.changedchipsG1 = false;
      this.loadChipsG1(this.imgChip1);
    }

    if (!this.imgChip2) {
      this.imgChip2 = new Image();
      this.imgChip2.src = `./img/chips/${this.gamers.g2.personaje}.svg`;
      this.imgChip2.onload = () => {
        this.changedchipsG2 = true;
        this.loadChipsG2(this.imgChip2);
      };
    } else {
      this.changedchipsG2 = false;
      this.loadChipsG2(this.imgChip2);
    }
  }



  //Cargamos todas las fichas en una sola columna del lado que le corresponde al jugador
  loadChipsG1(img) {
      //Cambio los valores de cantidad de fichas
      let extra=0;
if(this.cols==7){
  this.quantityChips=42;
  extra=0;
}

  if(this.cols==8){
    this.quantityChips=50;
    extra=1;
  
  }
  else if(this.cols==9){
    this.quantityChips=62;
    extra=1;
  
  }
  else if(this.cols==10){
    this.quantityChips=72;
    extra=0;
  }

  if (!this.changedchips) {
    const firstColumnX= 130 - this.radius*2;
    this.y = 113; //Coordenada en Y
    for (
      this.i = 0;
      this.i < this.quantityChips / 4;
      this.i += 1
    ) {
      this.chips.push(
        new Chip(
          firstColumnX,
          this.y,
          this.radius,
          this.gamers.g1.color,
          img,
          this.ctx
        )
      );
      this.y += 22;
    }
    const secondColumnX = 180- this.radius; 
    this.y = 113;
    for (
      this.i = this.quantityChips / 4;
      this.i < this.quantityChips / 2+ extra;
      this.i += 1
    ) {
      this.chips.push(
        new Chip(
          secondColumnX,
          this.y,
          this.radius,
          this.gamers.g1.color,
          img,
          this.ctx
        )
      );
      this.y += 22;
    }
  }
    this.drawChips();
  }
  loadChipsG2(img) {
    let extra=0;
    if(this.cols==7){
      this.quantityChips=42;
      extra=0;
    }
    
      if(this.cols==8){
        this.quantityChips=50;
        extra=1;
      
      }
      else if(this.cols==9){
        this.quantityChips=62;
        extra=1;
      
      }
      else if(this.cols==10){
        this.quantityChips=72;
        extra=0;
      }
    
      //Agregar las dos columnas...........
      if (!this.changedchips) {
        const firstColumnX= 740 - this.radius*2;
        this.y = 113; //Coordenada en Y
        for (
          this.i = 0;
          this.i < this.quantityChips / 4 + extra;
          this.i += 1
        ) {
          this.chips.push(
            new Chip(
              775,
              this.y,
              this.radius,
              this.gamers.g2.color,
              img,
              this.ctx
            )
          );
          this.y += 22;
        }
        const secondColumnX = 790 + this.radius * 2; 
        this.y = 113;
        for (
          this.i = this.quantityChips / 4;
          this.i < this.quantityChips / 2;
          this.i += 1
        ) {
          this.chips.push(
            new Chip(
              secondColumnX,
              this.y,
              this.radius,
              this.gamers.g2.color,
              img,
              this.ctx
            )
          );
          this.y += 22;
        }
      }
    this.drawChips();
  }

  //Dibujo las fichas
  drawChips() {
    if (this.board) {
      this.board.draw();
    } else {
      this.loadBoard();
    }
    this.chips.forEach((c) => 
    c.draw());
  }

  //Determino si se ha hecho clic en una ficha en una posición específica (x, y)
  // y si la ficha es del mismo color que el turno actual en un juego o aplicación.
  chipHit(x, y) {
    for (let i = 0; i < this.chips.length; i++) {
      if (this.chips[i].isHit(x, y) && this.chips[i].color == this.turn.color) {
        //si estoy clickeando alguna ficha y es del color del turno
        this.chipInMovement = this.chips[i];
        return true;
      }
    }
    return false;
  }

  //Esta función se utiliza para obtener la ficha que actualmente está en movimiento
  getChipInMovement() {
    return this.chipInMovement;
  }

  //Funcion para mover una ficha
  moveChip(x, y) {
    if (!this.chipInMovement) return;
    if (!this.radiusChanged) {
      this.chipInMovement.setRadius(
        this.chipInMovement.getRadius() + this.radiusChange
      );
      this.radiusChanged = true;
    }
    this.chipInMovement.updateXY(x, y);
    this.draw();
  }

  //Funcion para decidir que pasa después  que suelto la ficha
  chipDropped() {
    if (this.radiusChanged) {
      this.chipInMovement.setRadius(
        this.chipInMovement.getRadius() - this.radiusChange
      );
      this.radiusChanged = false;
    }
    //chequeo si esta en una dropZone y si tiene lugar para posicionarse
    if (this.board.checkChip(this.chipInMovement)) {
      let chip = new Audio("audio/chip.mp3");
      chip.play();
      //devuelve verdadero si encontro un lugar para la ficha
      //borrar ficha del conjunto en juego
      this.timer = this.shiftTime;
      this.changeTurn();
      // console.log(this.turn);
      if (this.delete(this.chipInMovement)) {
        this.draw();
      }
    } else {
      this.chipInMovement.returnToStart();
      this.chipInMovement = null;
    }
    this.draw();
  }

  //Devuelve la ficha a la posicion original
  returnChipToStart() {
    if (this.chipInMovement) {
      this.chipInMovement.returnToStart();
      this.draw();
    }
  }

  //Elimina la ficha
  delete(chip) {
    let i = this.chips.indexOf(chip);
    if (i !== -1) {
      this.chips.splice(i, 1);
      return true;
    }
    return false;
  }

  //Cambia de turno de jugador
  changeTurn() {
    if (this.gamers["g1"] == this.turn) this.turn = this.gamers["g2"];
    else this.turn = this.gamers["g1"];
  }

  //Indica de que jugador es el turno
  drawTurn(gamer) {
    this.ctx.beginPath();
    this.ctx.fillStyle = gamer.color;
    this.ctx.font = "bold 18px Open Sans";
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "center";
    let text = `Juega  ${gamer.name}`;
    if (gamer.color == this.gamers["g1"].color) this.ctx.fillText(text, 30, 20);
    else this.ctx.fillText(text, 730, 20);

    this.ctx.closePath();
  }

  //Muestra el tiempo en pantalla
  infoTimer(txt, timer, gamer) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "var(--negro)";
    this.ctx.font = "bold 16px Open Sans";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "center";

    let text = `${txt} ${timer}`;
    if(gamer.color=='red'){
    this.ctx.fillText(text, 100, 40);
    }
    else{
      this.ctx.fillText(text, 800, 40);
    }
  }

  //Determino el ganador del juego
  getWinner() {
    let winnerColor = this.board.getWinner();
    if (winnerColor) {
      if (this.gamers["g1"].color == winnerColor) return this.gamers["g1"];
      else return this.gamers["g2"];
    }
    return null;
  }

  //Detengo el intervalo de tiempo
  gameComplete() {
    clearInterval(this.shiftControl);
  }

  //Reseteo el juego
  reset() {
    this.board = null;
    this.chips = [];
    this.loadChips();
    this.chipInMovement = null;
    this.turn = this.gamers["g1"];
    this.changedchipsG1 = false;
    this.changedchipsG2 = false;
    this.radiusChanged = false;
    this.timer = this.shiftTime;

    clearInterval(this.shiftControl);
    this.shiftControl = setInterval(() => {
      if (this.timer < 0) {
        this.changeTurn();
        this.timer = this.shiftTime;
      }
      this.infoTimer("tiempo restante: ", this.timer, this.turn);
      this.draw();
      this.timer--;
    }, 1000);

    this.draw();
  }
}