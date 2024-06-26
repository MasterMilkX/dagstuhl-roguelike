var ENEMY_LIST = [];
var NUM_ENEMIES = 5;



var PLAYER = {
    x : 0,
    y : 0,
    w : 20,
    h : 20,
    hp : 3,
    cur_item : "",
    entType : "player"
}

class Enemy{
    constructor(name, x, y, hp){
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.hp = hp;
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
    if(e.entType == "player"){
        ctx.fillStyle = "#0000ff";
        ctx.fillRect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
            (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.h)/2), 
            e.w, 
            e.h); 
    }
    else if(e.entType == "enemy"){
        ctx.fillStyle = "#ff0000";
        ctx.fillRect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
            (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.h)/2), 
            e.w, 
            e.h); 
    }

}
    


function drawEntities(){
    for(let e of ENEMY_LIST){
        renderEnt(e);
    }
    renderEnt(PLAYER);
}