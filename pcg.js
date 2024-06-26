var BOARD_SIZE = 8
var PX_SIZE = 32;
var BOARD_PAD = 4;

var BOARD_COLORS = {
    0 : "#DFDFDF",
    1 : "#BDBDBD"
}


var BOARD_OFFSET = {
    x : 100,
    y : 100
}

// makes a blank board
function blankBoard(){
    ENT_BOARD = [];
    for (var i = 0; i < BOARD_SIZE; i++){
        ENT_BOARD.push([])
        for (var j = 0; j < BOARD_SIZE; j++){
            ENT_BOARD[i].push(0)
        }
    }
}

// adds enemies, items, and the player to the board
function initBoard(){
    blankBoard();
    ENT_BOARD[0][0] = PLAYER;

    // add enemies
    for(let e=0; e<NUM_ENEMIES; e++){
        let x = Math.floor(Math.random()*BOARD_SIZE);
        let y = Math.floor(Math.random()*BOARD_SIZE);
        let hp = Math.floor(Math.random()*3) + 1;
        let enemy = new Enemy("enemy"+e, x, y, hp);
        ENT_BOARD[x][y] = enemy;
        ENEMY_LIST.push(enemy);
    }
}

// renders the board setup
function drawBoard(){

    // draw outside border
    ctx.fillStyle = "#000000"
    ctx.lineWidth = "6"
    ctx.beginPath();
    ctx.rect(BOARD_OFFSET.x - BOARD_PAD, 
        BOARD_OFFSET.y - BOARD_PAD,
        BOARD_SIZE*(PX_SIZE+BOARD_PAD) + BOARD_PAD,
        BOARD_SIZE*(PX_SIZE+BOARD_PAD) + BOARD_PAD)
    ctx.stroke();

    // draw the board (chess - alternating)
    for (var i = 0; i < BOARD_SIZE; i++){
        for (var j = 0; j < BOARD_SIZE; j++){
            ctx.fillStyle = BOARD_COLORS[(i+j)%2]
            ctx.fillRect(i*(PX_SIZE+BOARD_PAD) + BOARD_OFFSET.x, 
            j*(PX_SIZE+BOARD_PAD) + BOARD_OFFSET.y, 
            PX_SIZE, 
            PX_SIZE)
        }
    }
}
