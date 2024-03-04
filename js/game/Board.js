class Board {
  constructor(ctx, posX, posY, width, height, cols, rows, value) {
    this.ctx = ctx; //Contexto canvas
    this.posX = posX; //Posicion inicial "x" del tablero
    this.posY = posY; //Posicion inicial "y" del tablero
    this.width = width; //Ancho del tablero
    this.height = height; //Alto del tablero
    this.cols = cols; //Cantidad de columnas
    this.rows = rows; //Cantidad de filas
    this.value = value; //Valor de preferencias elegido: 4 en linea, 5, 6...
    this.radius = this.width / this.cols / 2 - 5; //Calculo el centro de la celda y le resto 5 unidades para que no se peguen los circulos
    this.boardPositions = this.generatePositions(); //Generador de posiciones del tablero
    this.dropZones = this.generateDropZones(); //Zona de caida en degrade, arriba del tablero
    this.chips = []; //Arreglo vacio de fichas
    this.aWinner = null; //Comienza sin ningun ganador
    this.board = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(null)); //Inicializo el tablero vacío
    this.widhtX = this.width / this.cols; //Ancho de la celda
    this.heightY = this.height / this.rows; //Alto de la celda
  }

  // Funciones para dibujar
  draw() {
    //Borro el lienzo antes de dibujar
    this.ctx.clearRect(0, 0, this.width, this.height);

    //Dibuja el tablero primero. Lo tenía abajo y me dibujaba las fichas por detras
    this.drawBoard();

    //Dibuja las zonas superiores de cada columna
    this.drawDropZones();

    //Dibuja las fichas
    this.drawChips();
  }

  // Funcion para dibujar el tablero
  drawBoard() {
    this.ctx.fillStyle = "#0b0b9a"; // Selecciono el color del lapiz
    this.ctx.fillRect(
      this.posX - 10,
      this.posY + 5,
      this.width + 20,
      this.height + 20
    ); // Esto seria el marco del tablero, para dar sensacion de superficie
    this.ctx.fillStyle = "blue"; // Cambio el color
    this.ctx.lineWidth = 5; // Cambio el grosor de la linea
    this.ctx.fillRect(this.posX, this.posY, this.width, this.height); // Dibujo el tablero

    this.ctx.fill();
    for (let i = 0; i < this.rows; i++) {
      //Dibujo las celdas con los circulos
      for (let j = 0; j < this.cols; j++) {
        const posX = this.posX + (j * this.widhtX + this.widhtX / 2);
        const posY = this.posY + (i * this.heightY + this.heightY / 2);
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.arc(posX, posY, this.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fillStyle = "#0b0b9a";
        this.ctx.fill();
      }
    }
  }

  //Funcion para agregar fichas
  addChip(chip, col, row) {
    this.chips.push(chip);
    chip.setDraggable(false);
    let x = this.boardPositions[col][row].x;
    let y = this.boardPositions[col][row].y;

    chip.updateXY(x, y);
    chip.startX = x;
    chip.startY = y;
    this.boardPositions[col][row].taked = true;
    this.boardPositions[col][row].color = chip.color;
  }

  //Esta función se utiliza para generar un conjunto de posiciones para el tablero
  generatePositions() {
    // Arreglo vacio de posiciones
    const positions = [];

    for (let i = 0; i < this.cols; i++) {
      positions.push([]);
    }
    const centrarFicha = this.width / this.cols / 2 - 5;
    const initialPos = [this.posX + centrarFicha, this.posY + centrarFicha]; // Posicion inicial, le agregue una constante que centra la ficha
    const cellWidth = this.width / this.cols; //Ancho de la celda
    const cellHeight = this.height / this.rows; //Alto de la celda
    const radius = this.width / this.cols / 2 - 5; //Le resto 5 para que no se peguen entre sí

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        //Calculo la posición centrada (x, y) dentro de la celda
        const posX = initialPos[0] + x * cellWidth + cellWidth / 2 - radius;
        const posY = initialPos[1] + y * cellHeight + cellHeight / 2 - radius;

        // Create an object with position information
        positions[x][y] = {
          x: posX, //Inicio en x
          y: posY, //Inicio en y
          color: "", //Inicialmente sin color
          taked: false, //Inicialmente no tomada
        };
      }
    }

    return positions;
  }

  //Esta función se utiliza para generar y retornar un conjunto de zonas de caída (drop zones)
  generateDropZones() {
    const zoneWidth = this.width / this.cols; //Ancho de cada zona
    const zoneHeight = this.height / this.rows; //Alto de la zona (igual al alto del tablero)

    let positions = []; //Arreglo vacio de posociones

    for (let i = 0; i < this.cols; i++) {
      const x = this.posX + i * zoneWidth; //Inicio del tablero + ancho de la celda x cant.
      positions.push({
        x1: x, //Inicia en el inicio del tablero
        y1: 30, // Zonas comienzan en la parte superior del tablero
        x2: x + zoneWidth, //Sigo sumando ancho de celda
        y2: zoneHeight, //Alto de celda
        col: i, //Columnas
        width: zoneWidth, //Ancho de celda
        height: zoneHeight, //Alto de celda
      });
    }
    return positions;
  }

  //Esta función se utiliza para dibujar zonas de caída en un lienzo (canvas)
  drawDropZones() {
    this.ctx.beginPath();
    let degrade = this.ctx.createLinearGradient(157, 10, 157, 161); // Creo un color en degrade
    degrade.addColorStop(0, "rgba(188,61,194,255)");
    degrade.addColorStop(0.6, "rgba(245,210,33,0)");
    this.ctx.fillStyle = degrade;
    let widthDropZone = this.width / this.cols; // Ancho de cada celda
    const heightDropZone = 70; //Alto de la zona de caida
    for (let i = 0; i < this.dropZones.length; i++) {
      this.ctx.fillRect(
        this.dropZones[i].x1,
        this.dropZones[i].y1,
        widthDropZone - 2,
        heightDropZone
      ); //Le resto dos de margen a widthDropZone
    }

    this.ctx.closePath();
  }

  //Funcion que dibuja las fichas
  drawChips() {
    this.chips.forEach((c) => {
      c.draw();
    });
  }

  //chequeo de ficha dentro de una dropZone
  checkChip(chip) {
    let x = chip.getX();
    let y = chip.getY();
    let dropColumn = this.getDropColumn(x, y); //Columna de la ficha que tiré

    if (dropColumn !== false) {
      let dropRow = this.getDropRow(dropColumn); //Fila de la ficha que tiré
      if (dropRow !== false) {
        this.addChip(chip, dropColumn, dropRow); //Agrego la ficha
        //Chequear ganador
        if (this.InConditionOfWin()) {
          if (this.checkWinner(chip, dropColumn, dropRow))
            this.aWinner = chip.color;
        }
        return true; //Retorna true si hay algun ganador
      } else {
        //console.log('columna llena');
        return false;
      }
    }
    return false;
  }

  // Verifico si un punto con coordenadas (x, y) se encuentra dentro de una zona de caída
  checkInDropZone(zone, x, y) {
    if (x - zone.x1 > 0 && x - zone.x1 < zone.width) {
      if (y - zone.y1 > 0 && y - zone.y1 < zone.height) {
        return true;
      }
    }
    return false;
  }

  //Determino en qué columna de zonas de caída se encuentra un punto con coordenadas (x, y)
  getDropColumn(x, y) {
    for (let i = 0; i < this.dropZones.length; i++) {
      if (this.checkInDropZone(this.dropZones[i], x, y)) {
        return this.dropZones[i].col; //Devuelve la columna en la que tiro la ficha
      }
    }
    return false;
  }

  //Esta función es para encontrar la fila libre más alta en una columna específica del tablero
  getDropRow(col) {
    for (let r = this.rows - 1; r >= 0; r--) {
      if (!this.boardPositions[col][r].taked) {
        return r; //Devuelve la fila en la que quedó la ficha
      }
    }
    return false;
  }

  //Verifico si está en condiciones de ganar
  InConditionOfWin() {
    return this.chips.length >= this.cols ? true : false;
  }

  //Verifico si ganó
  checkWinner(chip, col, row) {
    return (
      this.checkHor(chip.color, col, row) ||
      this.checkVer(chip.color, col, row) ||
      this.checkDiagR(chip.color, col, row) ||
      this.checkDiagL(chip.color, col, row)
    );
  }

  //Chequeo horizontal
  checkHor(color, col, row) {
    let count = 1; // 1 ficha, sobre la que se arranca a chequear
    for (let i = 1; i < this.value; i++) {
      let c = col + i; //Columna hacia la derecha
      if (c < this.cols) {
        if (this.boardPositions[c][row].color == color) {
          //Si hay una ficha de igual color, sumo
          count++;
        } //si no, corto for
        else break;
      } else break;
    }

    if (count >= this.value) {
      console.log("Hay ganador horizontal hacia la derecha");
      return true; //Si la cantidad es mayor, devuelvo verdadero, hay ganador
    }

    for (let i = 1; i < this.value; i++) {
      let c = col - i; //Columna hacia la izquierda
      if (c > -1) {
        if (this.boardPositions[c][row].color == color) {
          //Si hay una ficha de igual color, sumo
          count++;
        } //Si no, corto for
        else break;
      } else break;
    }
    if (count < this.value) return false;
    else {
      console.log("Hay ganador horizontal hacia la izquierda");
      return true;
    }
  }

  //Chequeo vertical
  checkVer(color, col, row) {
    let count = 1; //Se arranca a chequear con 1 la primer ficha consecutiva del mismo color
    for (let i = 1; i < this.value; i++) {
      let r = row + i; //Fila hacia abajo
      if (r < this.rows) {
        if (this.boardPositions[col][r].color == color) {
          //Si hay una ficha de igual color, sumo
          count++;
        } //si no, corto for
        else break;
      } else break;
    }

    if (count >= this.value) {
      console.log("gana vertical");
      return true;
    }

    for (let i = 1; i < this.value; i++) {
      let r = row - i; //Fila hacia la arriba
      if (r > -1) {
        if (this.boardPositions[col][r].color == color) {
          //Si hay una ficha de igual color, sumo
          count++;
        } //Si no, corto for
        else break;
      } else break;
    }
    if (count < this.value) return false;
    else return true;
  }

  //Chequeo diagonal derecha
  checkDiagR(color, col, row) {
    console.log("Entra a chequeo diagonal derecha R");

    let count = 1; // 1 ficha, sobre la que se arranca a chequear
    for (let i = 1; i < this.value; i++) {
      let c = col + i; // columna hacia derecha
      let r = row + i; // fila hacia abajo

      //Compruebo si las coordenadas están dentro de los límites del tablero antes de acceder a ellas
      if (c < this.cols && r < this.rows) {
        if (this.boardPositions[c][r].color == color) {
          //Si hay una ficha de igual color, sumo
          count++;
        } else {
          break; //Detengo el bucle si no se encuentra ninguna coincidencia
        }
      } else {
        break; //Detengo el bucle si se alcanza el borde de la tabla
      }
    }

    if (count >= this.value) {
      console.log("Gana diagonal derecha, hacia derecha hacia abajo");
      return true;
    }

    for (let i = 1; i < this.value; i++) {
      let c = col - i; //Columna hacia izquierda
      let r = row - i; //Fila hacia la arriba

      //Compruebo si las coordenadas están dentro de los límites del tablero antes de acceder a ellas
      if (c > -1 && r > -1) {
        if (this.boardPositions[c][r].color == color) {
          //Si hay una ficha de igual color, sumo
          count++;
        } else {
          break; //Detengo el bucle si no se encuentra ninguna coincidencia
        }
      } else {
        break; //Detengo el bucle si se alcanza el borde de la tabla
      }
    }

    if (count < this.value) {
      return false;
    } else {
      console.log("Gana diagonal izquierda, hacia izquierda hacia abajo");
      return true;
    }
  }

  checkDiagL(color, col, row) {
    let count = 1; // 1 ficha, sobre la que se arranca a chequear
    for (let i = 1; i < this.value; i++) {
      let c = col - i; //Columna hacia izquierda
      let r = row + i; //Fila hacia abajo

      //Compruebo si las coordenadas están dentro de los límites del tablero antes de acceder a ellas
      if (c > -1 && r < this.rows) {
        if (this.boardPositions[c][r].color == color) {
          //Si hay una ficha de igual color, sumo
          count++;
        } else {
          break; //Detengo el bucle si no se encuentra ninguna coincidencia
        }
      } else {
        break; //Detengo el bucle si se alcanza el borde de la tabla
      }
    }

    if (count >= this.value) {
      console.log("Gana diagonal izquierda hacia arriba");
      return true;
    }

    for (let i = 1; i < this.value; i++) {
      let c = col + i; //Columna hacia derecha
      let r = row - i; //Fila hacia la arriba

      //Compruebo si las coordenadas están dentro de los límites del tablero antes de acceder a ellas
      if (c < this.cols && r > -1) {
        if (this.boardPositions[c][r].color == color) {
          //Si hay una ficha de igual color, sumo
          count++;
        } else {
          break; //Detengo el bucle si no se encuentra ninguna coincidencia
        }
      } else {
        break; //Detengo el bucle si se alcanza el borde de la tabla
      }
    }

    if (count < this.value) {
      return false;
    } else {
      console.log("Gana diagonal izquierda hacia arriba");
      return true;
    }
  }

  //Ganador
  getWinner() {
    console.log("Gano: " + this.aWinner);
    return this.aWinner;
  }

  //Reincio el juego
  reset() {
    this.chips = [];
    this.aWinner = null;
  }
}
