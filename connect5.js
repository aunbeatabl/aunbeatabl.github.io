//This code creates the game of connect 4

//This code defines and sets the canvas
var canvasWidth = 456;
var canvasHeight = 400;
var double = 0;
setSize(canvasWidth, canvasHeight);
setBackgroundColor(Color.blue);

//This code sets the number of columns and rows in the game board, as well as sets the chip's radius
var numRows = 8;
var numCols = 8;
var circleRadius = canvasWidth/(numCols*2);

//This code initializes the game board, and sets the starting player as red
var tokenGrid = new Grid(numRows, numCols);
var turnRed = true;
//Matrix Gameboard
function createZeroMatrix(m, n) {
  const zeroMatrix = Array.from({ length: m }, () =>
    Array(n).fill(0)
  );
  return zeroMatrix;
}
const whitematrix = createZeroMatrix(8, 8);

const blackmatrix = createZeroMatrix(8, 8);

//determining winner two functions
function iswinnerpt(x, list) {
    if (list.length === 0) {
        return false;
    }
    if (list[0] === 0) {
        return false;
    }
    if (list[0] >= x) {
        return true;
    }
    return iswinnerpt(x - list[0], list.slice(1));
}
function iswinner(list) {
    for (let i = 0; i < list.length - 1; i++) {
        if (iswinnerpt(5, list.slice(i))) {
            return true;
        }
    }
    return false;
}


//This code initializes the game by drawing the board and waiting for user input of a click
var redpts = 2;
var yellowpts = 2;
function start(){
    drawBoard();
    keyDownMethod(doublydub);
    mouseClickMethod(placeToken);
    double = 0
}

function doublydub(e){
    if(e.keyCode == Keyboard.letter(' ')){
        double = 1;
    }
    }

//This function draws the game board and fills the grid with white circles, so they can be accessed and edited later
function drawBoard(){
    var circleX = canvasWidth/(numCols*2);
    var circleY = canvasHeight/(numRows*2);
    var curRow = 0;
    var curCol = 0;
    for(var row = 0; row < numRows; row++){
        for(var col = 0; col < numCols; col++){
            var circle = new Circle(circleRadius);
            circle.setColor(Color.white);
            circle.setPosition(circleX,circleY);
            add(circle);
            tokenGrid.set(curRow, curCol, circle);
            circleX += canvasWidth/numCols;
            curCol++;
        }
        circleX = canvasWidth/(numCols*2);
        circleY += canvasHeight/numRows;
        curRow++;
        curCol = 0;
    }
}

//This function takes user input of a mouse click, and drops a token in the chosen column
function placeToken(e){
    var curRow = numRows - 1;
    var curCol = Math.floor(e.getX()/(canvasWidth/numCols));
    for(var i = numRows - 1; i > -1; i--){
        if(tokenGrid.get(i, curCol).getColor() == "#FFFFFF"){
            if(turnRed == true){
                if(double == 0 || redpts == 0)
                    {(tokenGrid.get(i, curCol)).setColor(Color.red);
                    whitematrix[i][curCol] = 1;} 
                else
                    {(tokenGrid.get(i, curCol)).setColor("#B22222");
                    whitematrix[i][curCol] = 2;
                    redpts -= 1}
            }else{
                if(double == 0 || yellowpts == 0)
                    {(tokenGrid.get(i, curCol)).setColor(Color.yellow);
                    blackmatrix[i][curCol] = 1;}
                else
                    {(tokenGrid.get(i, curCol)).setColor("#FFD700");
                    blackmatrix[i][curCol] = 2;
                    yellowpts -= 1}
                    }double = 0;
            break;
        }
    }
    turnRed = !turnRed;
    if(checkWinner(whitematrix) == true){var winCircle = new Circle(circleRadius*4);
            winCircle.setColor(Color.red);
            winCircle.setPosition(getWidth()/2,getHeight()/2);
            add(winCircle);
            setBackgroundColor(Color.black);
            var winTxt = new Text("Red wins!", "20pt Arial");
            winTxt.setPosition(getWidth()/2 - winTxt.getWidth()/2,getHeight()/2);
            add(winTxt);}
    if(checkWinner(blackmatrix) == true){var winCircle = new Circle(circleRadius*4);
            winCircle.setColor(Color.yellow);
            winCircle.setPosition(getWidth()/2,getHeight()/2);
            add(winCircle);
            setBackgroundColor(Color.black);
            var winTxt = new Text("Yellow wins!", "20pt Arial");
            winTxt.setPosition(getWidth()/2 - winTxt.getWidth()/2,getHeight()/2);
            add(winTxt);}
    
}

function checkWinner(whitematrix){
        var whitewon = false;
        var i = 0;
        while (whitewon != true && i < 8){
            whitewon = iswinner(whitematrix[i]);
            i+=1;}
        i = 0;
        while (whitewon != true && i < 8){
            whitewon = iswinner(whitematrix.map(function(value,index) { return value[i]; }));
            i += 1}
            
        var whitediags = [[whitematrix[2][0], whitematrix[1][1], whitematrix[0][2]],
        [whitematrix[3][0], whitematrix[2][ 1], whitematrix[1][ 2], whitematrix[0][ 3]],
        [whitematrix[4][0], whitematrix[3][ 1], whitematrix[2][ 2], whitematrix[1][ 3], whitematrix[0][ 4]],
        [whitematrix[5][0], whitematrix[4][ 1], whitematrix[3][ 2], whitematrix[2][ 3], whitematrix[1][ 4], whitematrix[0][ 5]],
        [whitematrix[6][0], whitematrix[5][ 1], whitematrix[4][ 2], whitematrix[3][ 3], whitematrix[2][ 4], whitematrix[1][ 5], whitematrix[0][ 6]],
        [whitematrix[7][0], whitematrix[6][ 1], whitematrix[5][ 2], whitematrix[4][ 3], whitematrix[3][ 4], whitematrix[2][ 5], whitematrix[1][ 6], whitematrix[0][7]],
        [whitematrix[7][1], whitematrix[6][ 2], whitematrix[5][ 3], whitematrix[4][ 4], whitematrix[3][ 5], whitematrix[2][ 6], whitematrix[1][ 7]],
        [whitematrix[7][2], whitematrix[6][ 3], whitematrix[5][ 4], whitematrix[4][ 5], whitematrix[3][ 6], whitematrix[2][ 7]],
        [whitematrix[7][3], whitematrix[6][ 4], whitematrix[5][ 5], whitematrix[4][ 6], whitematrix[3][ 7]],
        [whitematrix[7][4], whitematrix[6][ 5], whitematrix[5][ 6], whitematrix[4][ 7]],
        [whitematrix[7][5], whitematrix[6][ 6], whitematrix[5][ 7]],
        [whitematrix[0][5], whitematrix[1][ 6], whitematrix[2][ 7]],
        [whitematrix[0][4], whitematrix[1][ 5], whitematrix[2][ 6], whitematrix[3][ 7]],
        [whitematrix[0][3], whitematrix[1][ 4], whitematrix[2][ 5], whitematrix[3][ 6], whitematrix[4][ 7]],
        [whitematrix[0][2], whitematrix[1][ 3], whitematrix[2][ 4], whitematrix[3][ 5], whitematrix[4][ 6], whitematrix[5][ 7]],
        [whitematrix[0][1], whitematrix[1][ 2], whitematrix[2][ 3], whitematrix[3][ 4], whitematrix[4][ 5], whitematrix[5][ 6], whitematrix[6][ 7]],
        [whitematrix[0][0], whitematrix[1][ 1], whitematrix[2][ 2], whitematrix[3][ 3], whitematrix[4][ 4], whitematrix[5][ 5], whitematrix[6][ 6], whitematrix[7][7]],
        [whitematrix[1][0], whitematrix[2][ 1], whitematrix[3][ 2], whitematrix[4][ 3], whitematrix[5][ 4], whitematrix[6][ 5], whitematrix[7][ 6]],
        [whitematrix[2][0], whitematrix[3][ 1], whitematrix[4][ 2], whitematrix[5][ 3], whitematrix[6][ 4], whitematrix[7][ 5]],
        [whitematrix[3][0], whitematrix[4][ 1], whitematrix[5][ 2], whitematrix[6][ 3], whitematrix[7][ 4]],
        [whitematrix[4][0], whitematrix[5][ 1], whitematrix[6][ 2], whitematrix[7][ 3]],
        [whitematrix[5][0], whitematrix[6][ 1], whitematrix[7][ 2]]];
        i = 0;
        while (whitewon != true && i < whitediags.length){
            whitewon = iswinner(whitediags[i]);
            i+=1;}
    return whitewon;
}



