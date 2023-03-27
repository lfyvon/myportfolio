document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const width = 8;
  const squares = [];
  let score = 0;
  
  const candyColors = ['red', 'yellow', 'orange', 'purple', 'green', 'blue'];
  
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('draggable', true);
      square.setAttribute('id', i);
      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = "url(images/N_block_" + candyColors[randomColor] + ".png)";
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();
  
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;
  let curItem;
  
  squares.forEach(square => square.addEventListener('dragstart', dragStart));
  squares.forEach(square => square.addEventListener('dragend', dragEnd));
  squares.forEach(square => square.addEventListener('dragover', dragOver));
  squares.forEach(square => square.addEventListener('dragenter', dragEnter));
  squares.forEach(square => square.addEventListener('drageleave', dragLeave));
  squares.forEach(square => square.addEventListener('drop', dragDrop));

  squares.forEach(el => {
    el.onclick = (e) => {
      const nodes = [...e.target.parentElement.children];  
      const index = nodes.indexOf(e.target);
      if(squares[index].style.backgroundImage.includes('Special_A')){
        if(squares[index].style.backgroundImage.includes('row')){
          let rowNum = Math.floor(index / width) * width;
          for(let i = rowNum; i < rowNum + width; i++){
            if(!squares[i].style.backgroundImage.includes('Special') || i === index){
              squares[i].style.backgroundImage = "";
              score += 1;
            }
          }
        }
  
        if(squares[index].style.backgroundImage.includes('col')){
          let colNum = index % width;
          for(let i = colNum; i < width * width; i+=width){
            if(!squares[i].style.backgroundImage.includes('Special') || i === index){
              squares[i].style.backgroundImage = "";
              score += 1;
            }
          }
        }
      }
      if(squares[index].style.backgroundImage.includes('Special_B')){
        for(let i = 0; i < width * width; i++){
          if(!squares[i].style.backgroundImage.includes('Special') || i === index){
            squares[i].style.backgroundImage = "";
            score += 1;
          }
        }
      }
      scoreDisplay.innerHTML = score;

    }
  });
  
  function dragStart(){
      colorBeingDragged = this.style.backgroundImage;
      squareIdBeingDragged = parseInt(this.id);
  }
  
  function dragOver(e) {
      e.preventDefault();
  }
  
  function dragEnter(e) {
      e.preventDefault();
  }
  
  function dragLeave() {
      this.style.backgroundImage = '';
  }
  
  function dragDrop() {
      colorBeingReplaced = this.style.backgroundImage;
      squareIdBeingReplaced = parseInt(this.id);
      this.style.backgroundImage = colorBeingDragged;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
      curItem = squareIdBeingReplaced;
  }
  
  function dragEnd() {
      let validMoves = [squareIdBeingDragged - 1 , squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width];
      let validMove = validMoves.includes(squareIdBeingReplaced);
  
      if (squareIdBeingReplaced && validMove) {
          squareIdBeingReplaced = null;
      }  else if (squareIdBeingReplaced && !validMove) {
         squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
         squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
      } else  squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  }
  

  function moveIntoSquareBelow() {
      for (i = 0; i < width * (width - 1) ; i ++) {
          if(squares[i + width].style.backgroundImage === '') {
              squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
              squares[i].style.backgroundImage = '';
              const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
              const isFirstRow = firstRow.includes(i);
              if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = "url(images/N_block_" + candyColors[randomColor] + ".png)";
              }
          }
      }
  }
  
  function generateCandy(){
    for(let i = 0; i < width; i++){
        if(squares[i].style.backgroundImage === ''){
          let randomColor = Math.floor(Math.random() * candyColors.length);
          squares[i].style.backgroundImage = "url(images/N_block_" + candyColors[randomColor] + ".png)";
        }
    }
  }


  function checkRow(n) {
    let range = width * width - n;
    for(let i = 0; i <= range; i++){
      let row = [];
      for(let j = 0; j < n; j++){
        row.push(i + j);
      }
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if(i % width >= width - (n - 1)) continue;

      if(row.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += n;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
        squares[index].style.backgroundImage = '';
        });
        if(n === 4){
          squares[!curItem ? i : curItem].style.backgroundImage = "url(images/Special_A_red_row.png)";
        }
        if(n === 5){
          squares[!curItem ? i : curItem].style.backgroundImage = "url(images/Special_B1.png)";
        }

      }
    }
  }

  function checkColumn(n){
    let range = width * (width - (n - 1));
    for(let i = 0; i < range; i++){
      let column = [];
      for(let j = 0; j < n; j++){
        column.push(i + j * width);
      }

      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if(column.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += n;
        scoreDisplay.innerHTML = score;
        column.forEach(index => {
        squares[index].style.backgroundImage = '';
        });
        if(n === 4){
          squares[!curItem ? i : curItem].style.backgroundImage = "url(images/Special_A_red_col.png)";
        }
        if(n === 5){
          squares[!curItem ? i : curItem].style.backgroundImage = "url(images/Special_B1.png)";
        }
      }
    }
  }


  window.setInterval(function(){
      checkRow(5);
      checkColumn(5);
      checkRow(4);
      checkColumn(4);
      checkRow(3);
      checkColumn(3);
      moveIntoSquareBelow();
      generateCandy();
    }, 100);
  })