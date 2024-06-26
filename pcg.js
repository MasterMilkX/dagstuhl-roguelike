var BOARD_SIZE = 8
var PX_SIZE = 32;
var BOARD_PAD = 4;

var BOARD_LAYOUT = []

var BOARD_COLORS = {
    0 : "#DFDFDF",
    1 : "#BDBDBD"
}


var BOARD_OFFSET = {
    x : 100,
    y : 120
}

var WALL_set = {
    "island": [[1,1],[1,1]],
    "hor_jut": [[1,1,1]],
    "vert_jut": [[1],[1],[1]],
    "single": [[1]]
}

// makes a blank board
function blankBoard(){
    BOARD_LAYOUT = [];
    for (var i = 0; i < BOARD_SIZE; i++){
        BOARD_LAYOUT.push([])
        for (var j = 0; j < BOARD_SIZE; j++){
            BOARD_LAYOUT[i].push(0)
        }
    }
}

// adds walls to the board
// preset walls: islands, jutting, single
function addWalls(){
    var WALL_RANGE = {
        min : 2,
        max : 5
    }


    if(BOARD_LAYOUT.length == 0){  
        console.log("board not initialized")
        return;
    }

    let num_walls = Math.floor(Math.random()*WALL_RANGE.max) + WALL_RANGE.min;
    for(let w=0;w<num_walls;w++){
        let wall_type = Object.keys(WALL_set)[Math.floor(Math.random()*Object.keys(WALL_set).length)];
        let wall = WALL_set[wall_type];
        let rp = randPos();
        for(let i=0;i<wall.length;i++){
            for(let j=0;j<wall[i].length;j++){
                if(!oob(rp.x+j, rp.y+i)){
                    BOARD_LAYOUT[rp.y+i][rp.x+j] = 1;
                }
            }
        }
    }
}

// adds enemies, items, and the player to the board
function initBoard(){

    // generate board
    blankBoard();
    addWalls();

    let pp = randExcPos();
    move(PLAYER, pp.x, pp.y);
    PLAYER.show = true;

    // add enemies
    ENEMY_LIST = [];
    for(let e=0; e<NUM_ENEMIES; e++){
        let rp = randExcPos();
        let hp = Math.floor(Math.random()*3) + 1;
        let enemy = new Enemy("enemy"+e, rp.x, rp.y, hp);
        ENEMY_LIST.push(enemy);
    }

    // add the stairs
    let sp = randExcPos(ENEMY_LIST);
    move(STAIRS, sp.x, sp.y);
    STAIRS.show = true;
}

// renders the board setup
function drawBoard(){
    if(BOARD_LAYOUT.length == 0){
        return;
    }

    // draw outside border
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = "6"
    ctx.beginPath();
    ctx.rect(BOARD_OFFSET.x - BOARD_PAD, 
        BOARD_OFFSET.y - BOARD_PAD,
        BOARD_SIZE*(PX_SIZE+BOARD_PAD) + BOARD_PAD,
        BOARD_SIZE*(PX_SIZE+BOARD_PAD) + BOARD_PAD)
    ctx.stroke();

    // draw the board background (chess - alternating)
    for (var i = 0; i < BOARD_SIZE; i++){
        for (var j = 0; j < BOARD_SIZE; j++){
            ctx.fillStyle = BOARD_COLORS[(i+j)%2]
            ctx.fillRect(i*(PX_SIZE+BOARD_PAD) + BOARD_OFFSET.x, 
            j*(PX_SIZE+BOARD_PAD) + BOARD_OFFSET.y, 
            PX_SIZE, 
            PX_SIZE)
        }
    }

    // draw the walls
    // TODO - use sprites
    for(var i = 0; i < BOARD_SIZE; i++){
        for(var j = 0; j < BOARD_SIZE; j++){
            if(BOARD_LAYOUT[j][i] == 1){
                ctx.fillStyle = "#000000"
                ctx.fillRect(i*(PX_SIZE+BOARD_PAD) + BOARD_OFFSET.x, 
                    j*(PX_SIZE+BOARD_PAD) + BOARD_OFFSET.y, 
                    PX_SIZE, 
                    PX_SIZE)
            }
        }
    }

}
