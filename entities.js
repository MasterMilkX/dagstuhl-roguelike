var ENEMY_LIST = [];

// main player object
var PLAYER = {
    x : 0,
    y : 0,
    w : 20,
    h : 20,
    max_hp : 4,
    hp : 4,
    cur_item : "",
    show : false,
    entType : "player"
}

// stair object to proceed to next level
var STAIRS = {
    x : 0,
    y : 0,
    w : 10,
    h : 10,
    show : false,
    entType : "stairs"
}

// enemy class
class Enemy{
    constructor(name, x, y){
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.show = true;
        this.entType = "enemy";
    }

    // generates a movement pattern for the enemy
    genMovePattern(){

    }

    // remove from enemy list
    die(){
        this.show = false;
        let idx = ENEMY_LIST.indexOf(this);
        if(idx > -1){
            ENEMY_LIST.splice(idx, 1);
        }
    }

}

// moves an entity to a new location
function move(e,x,y){
    e.x = x;
    e.y = y;
}

// draw the entity on the board
// TODO: use sprites
function renderEnt(e){
    if(!e.show)
        return;

    if(e.entType == "player"){
        ctx.fillStyle = "#0000ff";
        ctx.fillRect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
            (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y + ((PX_SIZE - e.h)/2), 
            e.w, 
            e.h); 
    }
    else if(e.entType == "enemy"){
        ctx.fillStyle = e.name == "dragon" ? "#00aa00" : "#ff0000" ;
        ctx.fillRect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
            (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y + ((PX_SIZE - e.h)/2), 
            e.w, 
            e.h); 
    }
    else if(e.entType == "stairs"){
        ctx.strokeStyle = "#2B7FC0"
        ctx.lineWidth = "2"
        ctx.beginPath();
        ctx.rect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
            (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y + ((PX_SIZE - e.h)/2), 
            e.w, 
            e.h)
        ctx.stroke();
    }
}
    

// draw all entities in the game
function drawEntities(){
    for(let e of ENEMY_LIST){
        renderEnt(e);
    }
    renderEnt(PLAYER);
    renderEnt(STAIRS);
}