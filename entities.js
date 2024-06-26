var ENEMY_LIST = [];
var NUM_ENEMIES = 5;



var PLAYER = {
    x : 0,
    y : 0,
    w : 20,
    h : 20,
    hp : 3,
    cur_item : "",
    show : false,
    entType : "player"
}

var STAIRS = {
    x : 0,
    y : 0,
    w : 10,
    h : 10,
    show : false,
    entType : "stairs"
}

class Enemy{
    constructor(name, x, y, hp){
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.hp = hp;
        this.show = true;
        this.entType = "enemy";
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
        ctx.fillStyle = "#ff0000";
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
    


function drawEntities(){
    for(let e of ENEMY_LIST){
        renderEnt(e);
    }
    renderEnt(PLAYER);
    renderEnt(STAIRS);
}