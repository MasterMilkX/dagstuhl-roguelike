// PROC-GEN CODE

var PX_SIZE = 32;

var BOARD_SIZE = 8
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
    "island2": [[1,1],[1,1]],
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
    // min and max number of walls in level
    var WALL_RANGE = {
        min : 2,
        max : 5
    }

    // board not rendered
    if(BOARD_LAYOUT.length == 0){  
        console.log("board not initialized")
        return;
    }

    // add walls to game
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

    // add enemies
    if(LEVEL == 1){
        console.log("new enemies!")
        assignMoveset();
    }

    
    ENEMY_LIST = [];
    for(let e=0; e<Math.min(7,LEVEL); e++){
        let rp = randExcPos(ENEMY_LIST);
        let enemy_name = randChoice(ENEMY_NAMES);
        let ms = ENEMY_CLASS_MOVE_SETS[enemy_name];
        let enemy = new Enemy(enemy_name, rp.x, rp.y, ENEMY_LIST.length, ms.moves, ms.move_type);
        ENEMY_LIST.push(enemy);
    }

    // make four corners and add player and stairs
    let corners = [
        {x:0, y:0},
        {x:0, y:BOARD_SIZE-1},
        {x:BOARD_SIZE-1, y:BOARD_SIZE-1},
        {x:BOARD_SIZE-1, y:0}
    ]

    // remove corner walls
    for(let c=0;c<corners.length;c++){
        BOARD_LAYOUT[corners[c].y][corners[c].x] = 0;
    }

    // add player in corner
    let pc = randInt(0,3);
    moveEnt(PLAYER, corners[pc].x,corners[pc].y);
    PLAYER.show = true;

    // add the stairs at opposite corner
    let sc = (pc+2) % 4;
    moveEnt(STAIRS, corners[sc].x, corners[sc].y);
    STAIRS.show = true;

    // add dragons at the other two corners
    for(let c=0;c<2;c++){
        let d = corners[(pc+1+c*2)%4]
        let ds = ENEMY_CLASS_MOVE_SETS["dragon"];
        let dragon = new Enemy("dragon", d.x, d.y, ENEMY_LIST.length,ds.moves, ds.move_type);
        ENEMY_LIST.push(dragon);
    }
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

// retrieves board as a ascii 2d array
function getGameState(){
    let game_arr = [];

    // add walls and floors
    for(let i=0;i<BOARD_SIZE;i++){
        game_arr.push([]);
        for(let j=0;j<BOARD_SIZE;j++){
           if(BOARD_LAYOUT[i][j] == 1)
               game_arr[i].push("#");
            else    
                game_arr[i].push(".");
        }
    }

    // add enemies
    for(let e of ENEMY_LIST){
        game_arr[e.y][e.x] = (e.name == "dragon" ? "&" : "e");
    }
    // add players
    game_arr[PLAYER.y][PLAYER.x] = "@";

    // add stairs
    game_arr[STAIRS.y][STAIRS.x] = ">";

    return game_arr;
}

// returns board as a string
function getGameStateStr(){
    let game_arr = getGameState();
    let game_str = "";
    for(let i=0;i<game_arr.length;i++){
        game_str += game_arr[i].join("") + "\n";
    }
    return game_str;
}
