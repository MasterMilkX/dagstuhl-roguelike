// ENTITY DEFINITIONS AND BEHAVIOR

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
    entType : "player",

    move : function(x,y){
        if(validPos(x,y)){
            this.x = x;
            this.y = y;
        }
    }
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

var ENEMY_NAMES = ["ghost", "goblin", "skeleton", "wolf", "scientist"]
var ENEMY_CLASS_MOVE_SETS = {};
var BASIC_MOVESET = [{x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0}];

class Enemy{
    constructor(name, x, y, id, move_set=null, move_type="random"){
        this.name = name;
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
        this.show = true;
        this.entType = "enemy";
        this.move_set = move_set == null ? BASIC_MOVESET : move_set;
        this.move_type = move_type;      // random or optimal
    }

    // picks a random move from the move set
    randNextPos(){
        let val_moves = deepCopy(this.move_set);
        let tot_moves = val_moves.length;
        for(let i=0;i<tot_moves;i++){
            let p = randChoice(val_moves);
            let np = {x: this.x + p.x, y: this.y + p.y};
            let ep = enemyAtPos(np.x, np.y);
            if(validPos(np.x, np.y) && (ep == null || ep.id != this.id))
                return np;
            else
                val_moves.splice(val_moves.indexOf(np), 1);
            
        }
        return {x: this.x, y: this.y};
    }

    // picks the best move from the move set that gets closest to the player
    bestNextPos(){
        let tot_moves = this.move_set.length;
        let best_move = null;
        let best_dist = 999;
        for(let i=0;i<tot_moves;i++){
            let p = this.move_set[i];
            let np = {x: this.x + p.x, y: this.y + p.y};
            let dist = Math.abs(PLAYER.x - np.x) + Math.abs(PLAYER.y - np.y);
            if(dist < best_dist && validPos(np.x, np.y)){
                let ep = enemyAtPos(np.x, np.y);
                if(ep == null || ep.id != this.id){
                    best_dist = dist;
                    best_move = np;
                }
                
            }
        }
        return best_move != null ? best_move : {x: this.x, y: this.y};
    }

    // moves the enemy
    move(){
        let np = this.move_type == "random" ? this.randNextPos() : this.bestNextPos();
        this.x = np.x;
        this.y = np.y;
    }

    // remove from enemy list
    die(){
        this.show = false;
        PLAYER.hp -= 1;
        console.log(this.id + " [" + this.name + "] died!")
        let idx = ENEMY_LIST.indexOf(this);
        if(idx > -1){
            ENEMY_LIST.splice(idx, 1);
        }
    }

    // draws the valid move positions for the enemy
    drawMoves(){
        for(let i=0;i<this.move_set.length;i++){
            let p = this.move_set[i];
            let np = {x: this.x + p.x, y: this.y + p.y};
            if(validPos(np.x, np.y)){
                // ctx.strokeStyle = "#ff0000";
                // ctx.lineWidth = "2";
                // ctx.beginPath();
                // ctx.rect((np.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x, 
                //     (np.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y, 
                //     PX_SIZE, 
                //     PX_SIZE); 
                // ctx.stroke();

                ctx.fillStyle = "#ff0000";
                ctx.globalAlpha = 0.5;
                ctx.fillRect((np.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x, 
                    (np.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y, 
                    PX_SIZE, 
                    PX_SIZE);
                ctx.globalAlpha = 1;

            }
        }
    }
}


// makes a set of move patterns for an enemy
function genEnemyMoveSet(){
    let move_area = [];
    let max_area = randInt(1,4);
    let max_pos = randInt(1,4);

    // populate area (assume working in first quadrant for now then flip)
    for(let i=0;i<=max_area;i++){
        for(let j=0;j<=max_area;j++){
            move_area.push({x:i, y:j});
        }
    }
    move_area.splice(0,1);  // remove origin
    // console.log(move_area);

    // generate fucked up knight chess moves and make them symmetrical in four directions
    let fq_pos = [];
    for(let i=0;i<max_pos;i++){
        let rp = randChoice(move_area);
        // console.log(rp);
        fq_pos.push(rp);
        move_area.splice(move_area.indexOf(rp),1);

        if(move_area.length == 0)
            break;
    }
    // console.log(fq_pos);

    // make symmetrical in all quadrants and add as possible move positions
    let move_set = [];
    for(let a=0;a<fq_pos.length;a++){
        let xi = fq_pos[a].x
        let yi = fq_pos[a].y;
        move_set.push({x:xi,y:yi});       // first quadrant
        move_set.push({x:-xi, y:yi});     // second quadrant
        move_set.push({x:-xi, y:-yi});    // third quadrant
        move_set.push({x:xi, y:yi});     // fourth quadrant
    }

    return move_set;
}

// assigns a class moveset to each enemy
function assignMoveset(){
    ENEMY_CLASS_MOVE_SETS = {};
    for(let n=0;n<ENEMY_NAMES.length;n++){
        ENEMY_CLASS_MOVE_SETS[ENEMY_NAMES[n]] = {
            "moves":genEnemyMoveSet(), 
            "move_type":randChoice(["random", "optimal"])
        };
    }
    // dragon always moves slowly towards the player
    ENEMY_CLASS_MOVE_SETS["dragon"] = {"moves":BASIC_MOVESET, "move_type":"optimal"};
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
        e.drawMoves();
    }
    renderEnt(PLAYER);
    renderEnt(STAIRS);
}

// moves a general entity
function moveEnt(e,x,y){
    e.x = x;
    e.y = y;
}