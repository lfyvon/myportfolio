var blocks = [
  {
    name: "s",  // 블럭모양
    color: 1,   // 색상번호
    shape: 
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ]
     
  },
  {
    name: "z",
    color: 2,
    shape: 
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ]
  },
  {
    name: "t",
    color: 3,
    shape: 
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ]
  },
  {
    name: "l",
    color: 4,
    shape: 
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ]
  },
  {
    name: "lr",
    color: 5,
    shape: 
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ]
  },
  {
    name: "o",
    color: 6,
    shape: [   
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
    ]
  },
  {
    name: "b",
    color: 7,
    shape: 
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
  },
]
var curBlock;  // 현재블록의 위치를 저장할 배열 
var cury = 1;  // 현재y
var curx = 4;  // 현재x
var colors = ["w", "r", "o", "y", "g", "b", "n", "v", "" , "" ,  "dg" , "black"]; // 0~7 은 이동 색상 // 10은외각 , 11은 이동불가 
var tetris = document.querySelector("#tetris");  //  [20,10] 사이즈의 그림을 표현한다. // 테두리를 위해 [22, 12] 만든다. 
var data = [];                                    // [20,10] 사이즈의 데이터를 표현한다. // 테두리를 위해 [22,12] 만든다. 
var BLACK = 11;
var BOX = 10;
var WHITE = 0;
// 초기화 함수 
function init() {
  // tetris 에는 테이블로 그림을 그리고, data에는 숫자 WHITE으로 가득채운다. 

  for (var y = 0; y < 22; y++) {
    var tr = document.createElement("tr");
    tetris.append(tr);
    var temp = []
    for (var x = 0; x < 12; x++) {
      var td = document.createElement("td");
      tr.append(td);
      temp.push(WHITE);
    }
    data.push(temp);
  }

  // 테두리는 외곽선을 표시하기위해서  10 숫자로 채워넣는다.    
  for(var i = 0; i < 12; i++){ // 가로두줄
      data[0][i] = BOX;
      data[21][i] = BOX;
      tetris.children[0].children[i].className = colors[BOX];
      tetris.children[21].children[i].className = colors[BOX];
  }

  for(var i = 0; i < 22; i++){ // 세로두줄
      data[i][0] = BOX;
      data[i][11] = BOX;
      tetris.children[i].children[0].className = colors[BOX];
      tetris.children[i].children[11].className = colors[BOX];
  }
  //console.log(data);


}


function gameOver(shape){
  var realBlock = getRealBlock(shape)
  if(getCanMove(realBlock , 0 , 0) == false){  
      alert("game over");
      window.location.reload() ;
  }

}

function makeBlock() {

    var r = Math.floor(Math.random() * blocks.length);
    curBlock = blocks[r];

    var shape = curBlock.shape;
    

    cury = 1;  
    curx = 4; 

    gameOver(shape);
   
   
    for (var y = 0; y < shape.length; y++) {
        for (var x = 0; x < shape.length; x++) {
              if (shape[y][x] == 1) {
              data[y + cury][x + curx] = curBlock.color;
            }
        }
    }

  


}


function draw() {

    for (var y = 0; y < 22; y++) {
        for (var x = 0; x < 12; x++) {
            index = data[y][x];
            tetris.children[y].children[x].className = colors[index];
        }
    }
}

function getRealBlock(shape){
   
    var realBlock = []; //현재 블럭에서 진짜블록의 위치만 저장  
    for(var i = 0; i < shape.length; i++){
        for(var j = 0; j < shape.length; j++){
          if(shape[i][j] == 1){
            realBlock.push([ i + cury , j + curx]); // 현재 위치 를 더해줘야 한다. 
          }
        }
    }

    return realBlock;
}

function getCanMove(realBlock, ny , nx){

    for(var i = 0; i < realBlock.length; i++){
      y = realBlock[i][0];
      x = realBlock[i][1];
      if(data[y + ny][x + nx] >= BOX){
        return false;
      }
    }
    
    return true;
}

function setData(realBlock , ny , nx , color){
    for(var i = 0; i < realBlock.length; i++){
        y = realBlock[i][0];
        x = realBlock[i][1];
        data[y + ny][x + nx] = color;
    }
}

function down() {
  var shape = curBlock.shape;
  var realBlock = getRealBlock(shape); // 현재블록의 실제 위치를 찾는다. 
  var canMove = getCanMove(realBlock, 1 , 0); // 한칸아래를 검사한다.

  if(canMove == false){ // 움직일수없으면 현재위치 BLACK 

      //(현재위치 BLACK)
      setData(realBlock , 0, 0, BLACK);

  }else if (canMove == true){ // 움직일수있으면 현재위치는 WHILE 다음위치는 COLOR
      // (현재위치 WHILE ) 
      setData(realBlock , 0, 0, WHITE);

      // (한칸아래 색칠) 
      setData(realBlock , 1, 0, curBlock.color);
      cury += 1; // 현재y증가 
  }
  return canMove // 결과 반환
}

function left() {
  // 왼쪽 검사 
  var shape = curBlock.shape;
  var realBlock = getRealBlock(shape);
  var canMove = getCanMove(realBlock , 0, -1);
  if (canMove == true){
      // (현재위치 WHILE ) 
      setData(realBlock , 0, 0, WHITE);

      // (왼쪽 색칠) 
      setData(realBlock , 0, -1, curBlock.color);
      curx -= 1; // 현재x감소 
  }
}


function right() {
    //오른쪽 검사 
    var shape = curBlock.shape;
    var realBlock = getRealBlock(shape);
    var canMove = getCanMove(realBlock , 0 , 1);
    if (canMove == true){
        // (현재위치 WHILE ) 
        setData(realBlock , 0, 0, WHITE);

        // (오른쪽 색칠) 
        setData(realBlock , 0, 1, curBlock.color);
        curx += 1; // 현재x증가 
    }
}

function tempBlock(curShape){
    var temp = [];
    for(var y in curShape){
      temp.push([])
      for (var x in curShape){
          temp[y].push(0);
      } 
    }

    var lastIndex = curShape.length - 1;
    for(var y in curShape){
      for (var x in curShape){
          temp[x][lastIndex] = curShape[y][x];
      }
      lastIndex -= 1; 
    }
    console.log(curShape);
    console.log(temp);
    return temp;

}

function rotate(){
    var curShape = curBlock.shape;  
    var nextShape = tempBlock(curShape);

    var curRealBlock = getRealBlock(curShape);
    var nextRealBlock = getRealBlock(nextShape);
    var canMove = getCanMove(nextRealBlock , 0 , 0);
    if (canMove == true){
        // (현재위치 WHILE ) 
        setData(curRealBlock , 0, 0, WHITE);
        // (오른쪽 색칠) 
        setData(nextRealBlock , 0, 0, curBlock.color);
        curBlock.shape = nextShape;
    }
}

function lineClear(){
     
  var del = [];
  for(var y = 1; y  < 22 - 1 ; y ++){
        var count = 0;
        for(var x = 1; x < 12 - 1; x ++){
        if(data[y][x] == BLACK){
            count += 1;
        }
        if(count === 10){
          del.push(y);       
        }
    }
}
  //console.log(del);
  for(var i = 0; i < del.length; i++){
      data.splice(del[i] , 1);
      data.splice(0 , 1);
      data.unshift([BOX,0,0,0,0,0,0,0,0,0,0,BOX]);
      data.unshift([BOX,BOX,BOX,BOX,BOX,BOX,BOX,BOX,BOX,BOX,BOX,BOX]);
  }
}



document.addEventListener("keydown", function (e) {
   // alert(e.code);
    if (e.code == "KeyS") {
        if(down() == false){
            lineClear();
            makeBlock();
        }
        draw();
    }
    else if (e.code == "KeyA") {
        left();
        draw();
    }
    else if (e.code == "KeyD") {
        right();
        draw();
    }
    else if (e.code == "KeyW") {
        rotate();
        draw();
    }
    else if (e.code == "Space") {
      while (down()) {}

      lineClear();
      makeBlock();
      draw();
        
    }
});


