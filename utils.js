function randPos(){
    return {
        x : Math.floor(Math.random()*BOARD_SIZE),
        y : Math.floor(Math.random()*BOARD_SIZE)
    }
}

function randChoice(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

// TODO: Exclude wall positions
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
    if(arr){
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

function oob(x,y){
    return (x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE)
}

function samePos(a,b){
    return (a.x == b.x && a.y == b.y);
}