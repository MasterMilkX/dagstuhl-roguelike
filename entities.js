// ENTITY DEFINITIONS AND BEHAVIOR

// images

var playerIMG = new Image();
playerIMG.src = "assets/player.png";

var stairsIMG = new Image();
stairsIMG.src = "assets/stairs.png";

// -- enemies 

var ghostIMG = new Image();
ghostIMG.src = "assets/ghost.png";

var dragonIMG = new Image();
dragonIMG.src = "assets/dragon.png";

var goblinIMG = new Image();
goblinIMG.src = "assets/goblin.png";

var skeletonIMG = new Image();
skeletonIMG.src = "assets/skeleton.png";

var wolfIMG = new Image();
wolfIMG.src = "assets/wolf.png";

var scientistIMG = new Image();
scientistIMG.src = "assets/enemy.png";

var ENEMY_IMGS = {
    "ghost": ghostIMG,
    "dragon": dragonIMG,
    "goblin": goblinIMG,
    "skeleton": skeletonIMG,
    "wolf": wolfIMG,
    "scientist": scientistIMG
}

// -- items
var beerIMG = new Image();
beerIMG.src = "assets/beer.png";   

var eurosIMG = new Image();
eurosIMG.src = "assets/euros.png";

var coffeeIMG = new Image();
coffeeIMG.src = "assets/coffee.png";

var cakeIMG = new Image();
cakeIMG.src = "assets/cake.png";

var ITEM_IMGS = {
    "beer": beerIMG,
    "euros": eurosIMG,
    "coffee": coffeeIMG,
    "cake": cakeIMG
}



var ENEMY_LIST = [];
var ITEM_LIST = [];

// main player object
var PLAYER = {
    x : 0,
    y : 0,
    w : 20,
    h : 20,
    max_hp : 4,
    hp : 4,
    score : 0,
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

// item class

var ITEM_NAMES = ["beer", "euros", "coffee", "cake"]
var ITEM_VALUES = [1, 2, 5, 10]

var ITEM_ASSIGNMENT = {};
var ITEM_RANGE = {min:1, max:4};

class Item{
    constructor(x, y, name, value){
        this.x = x;
        this.y = y;
        this.w = 8;
        this.h = 8;
        this.show = true;

        this.entType = "item";
        this.value = value;
        this.name = name;
    }

    // remove from item list
    collect(){
        this.show = false;
        PLAYER.score += this.value;
        message = "Collected " + this.name + "! Worth [" + this.value +"]!";
        let idx = ITEM_LIST.indexOf(this);
        if(idx > -1){
            ITEM_LIST.splice(idx, 1);
        }
    
    }

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
        this.description = "LLAMA is Loading"
        let thisRef = this
        generate_text(WLLAMA_INSTANCE ,"Short description for enemy type " + name + ":").then(
            (desc) => {
                console.log("DEsc is", desc)
                thisRef.description = desc
            }
        )
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
        message = "[" + this.name + "] died! -1 HP!"
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

// gives random values to the items
function assignItems(){
    ITEM_ASSIGNMENT = {};
    let copy_names = [...ITEM_NAMES]
    for(let n=0;n<ITEM_NAMES.length;n++){
        ITEM_ASSIGNMENT[copy_names[n]] = ITEM_VALUES[n];
    }
}


// draw the entity on the board
// TODO: use sprites
function renderEnt(e){
    if(!e.show)
        return;

    
    if(e.entType == "player"){
        if(GRAPHIC_MODE == "ai" && playerIMG.width > 0){
            ctx.drawImage(playerIMG, 
                (e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x, 
                (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y, 
                PX_SIZE, 
                PX_SIZE);
        }else{
            ctx.fillStyle = "#0000ff";
            ctx.fillRect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
                (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y + ((PX_SIZE - e.h)/2), 
                e.w, 
                e.h);
        } 
    }
    else if(e.entType == "enemy"){
        let enIMG = ENEMY_IMGS[e.name];

        if(GRAPHIC_MODE == "ai" && enIMG.width > 0){
            ctx.drawImage(enIMG, 
                (e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x, 
                (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y, 
                PX_SIZE, 
                PX_SIZE);
        }else{
            ctx.fillStyle = e.name == "dragon" ? "#00aa00" : "#ff0000" ;
            ctx.fillRect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
                (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y + ((PX_SIZE - e.h)/2), 
                e.w, 
                e.h); 
        }
    }
    else if(e.entType == "stairs"){
        if(GRAPHIC_MODE == "ai" && stairsIMG.width > 0){
            ctx.drawImage(stairsIMG, 
                (e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x, 
                (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y, 
                PX_SIZE, 
                PX_SIZE);
        }else{
            ctx.strokeStyle = "#2B7FC0"
            ctx.lineWidth = "2"
            ctx.beginPath();
            ctx.rect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
                (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y + ((PX_SIZE - e.h)/2), 
                e.w, 
                e.h)
            ctx.stroke();
        }
    }else if(e.entType == "item"){
        let itemIMG = ITEM_IMGS[e.name];
        if(GRAPHIC_MODE == "ai" && itemIMG.width > 0){
            ctx.drawImage(itemIMG, 
                (e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x, 
                (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y, 
                PX_SIZE, 
                PX_SIZE);
        }else{
            ctx.fillStyle = "#E6AD07";
            ctx.fillRect((e.x)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.x + ((PX_SIZE - e.w)/2), 
                (e.y)*(PX_SIZE + BOARD_PAD) + BOARD_OFFSET.y + ((PX_SIZE - e.h)/2), 
                e.w, 
                e.h);
        }
    }
}
    

// draw all entities in the game
function drawEntities(){
    for(let e of ENEMY_LIST){
        renderEnt(e);
        e.drawMoves();
    }
    for(let i of ITEM_LIST){
        renderEnt(i);
    }
    renderEnt(PLAYER);
    renderEnt(STAIRS);
}

// moves a general entity
function moveEnt(e,x,y){
    e.x = x;
    e.y = y;
}