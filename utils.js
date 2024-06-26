// random position on the board
function randPos(){
    return {
        x : Math.floor(Math.random()*BOARD_SIZE),
        y : Math.floor(Math.random()*BOARD_SIZE)
    }
}

// random choice from array
function randChoice(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

// random integer in range
function randInt(min,max){
    return Math.floor(Math.random()*(max-min+1)) + min;
}

// random position on the board not a wall and not from array positions
// NOTE: arr is an array of objects with x and y properties
function randExcPos(arr=null){
    let all_spots = [];
    for(let i=0;i<BOARD_SIZE;i++){
        for(let j=0;j<BOARD_SIZE;j++){
            if(BOARD_LAYOUT[j][i] == 0){
                all_spots.push({x:i, y:j});
            }
        }
    }

    //remove wall positions
    let valid_spots = [];
    for(let i=0;i<all_spots.length;i++){
       for(let j=0;j<all_spots.length;j++){
           if(BOARD_LAYOUT[all_spots[j].y][all_spots[j].x] == 0){
               valid_spots.push(all_spots[j]);
           }
       }
    }

    // if arr, remove their positions
    let vs_2 = [];
    if(arr != null && arr.length > 0){
        for(let i=0;i<arr.length;i++){
            for(let j=0;j<valid_spots.length;j++){
                if(valid_spots[j].x != arr[i].x && valid_spots[j].y != arr[i].y){
                    vs_2.push(valid_spots[j]);
                }
            }
        }
        return randChoice(vs_2);
    }else{
        return randChoice(valid_spots);
    }
    
}

// check if position is out of bounds
function oob(x,y){
    return (x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE)
}

// check if two entities are in the same position
function samePos(a,b){
    return (a.x == b.x && a.y == b.y);
}

// check if a position is valid with respect to walls as well
function validPos(x,y){
    return (!oob(x,y) && BOARD_LAYOUT[y][x] == 0);
}

// get the enemy at a specific position
function enemyAtPos(x,y){
    for(let i=0;i<ENEMY_LIST.length;i++){
        if(ENEMY_LIST[i].x == x && ENEMY_LIST[i].y == y)
            return ENEMY_LIST[i];
    }
    return null;
}

// make a deep copy of an object
function deepCopy(obj){
    return JSON.parse(JSON.stringify(obj));
}

// checks if an element is in an array
function inArr(e,arr){
    if(arr.length == 0)
        return false;
    return arr.indexOf(e) !== -1
}

function inArrDeep(e,arr){
    // convert all elements to string
    let arr_str = arr.map(x => JSON.stringify(x));
    return arr_str.indexOf(JSON.stringify(e)) !== -1;
}