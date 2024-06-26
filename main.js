// MAIN GAME LOOP CODE

//set up the canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 480;


//KEYS

// directionals
var upKey = "ArrowUp";     //[Up]
var leftKey = "ArrowLeft";   //[Left]
var rightKey = "ArrowRight";  //[Rigt]
var downKey = "ArrowDown";   //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

// A and b
var a_key = "KeyA";   //[Z]
var b_key = "KeyB";   //[X]
var shift_key = "ShiftLeft";  //[Shift]
var actionKeySet = [shift_key,a_key, b_key];

var keys = [];


/// GAME VARIABLES
var GAME_OVER = true;
var LEVEL = 1;
var TURN = 0;
var TOOK_TURN = false;



//////////////////    GENERIC FUNCTIONS   ///////////////


//checks if an element is in an array
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}


////////////////   KEYBOARD FUNCTIONS  //////////////////


// key events
var keyTick = 0;
var kt = null; 

function anyKey(){
	return anyMoveKey() || anyActionKey();
}

//check if any directional key is held down
function anyMoveKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

function anyActionKey(){
	return (keys[a_key] || keys[b_key]);
}



////////////////   GAME FUNCTIONS   /////////////////

// check if the game is ready to be played
function gameReady(){return BOARD_LAYOUT.length > 0;}

// game loop / turn function
function gameStep(dir){
	if(!gameReady())
		return;

	let double_move = keys[shift_key] ? 2 : 1;

	// move the player
	let p_pos = {x: PLAYER.x, y: PLAYER.y};
	if(keys[upKey])
		p_pos.y -= 1*double_move;
	if(keys[downKey])
		p_pos.y += 1*double_move;
	if(keys[leftKey])
		p_pos.x -= 1*double_move;
	if(keys[rightKey])
		p_pos.x += 1*double_move;
	
	// check if the player can move to the new position
	if(validPos(p_pos.x, p_pos.y))
		PLAYER.move(p_pos.x, p_pos.y);

	// if player reaches the stairs, increase the level
	if(samePos(PLAYER, STAIRS)){
		newLevel();
		LEVEL++;
	}

	// move the enemies based on their moveset
	for(let e of ENEMY_LIST){
		e.move();
	}

	// pickup item
	for(let i of ITEM_LIST){
		if(samePos(PLAYER, i)){
			i.collect();
		}
	}

	// CHECK IF ENEMY AT POSITION - IF SO, LOSE HEART
	for(let e of ENEMY_LIST){
		if(samePos(PLAYER, e)){
			e.die();
		}
	}

	if(PLAYER.hp <= 0)
		end_game();


}


//////////////////  RENDER FUNCTIONS  ////////////////////


// main render function
function render(){
	ctx.save();
	//ctx.translate(-camera.x, -camera.y);		//camera
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//background
	ctx.fillStyle = "#B2B2B2";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	
	/*   add draw functions here  */

	drawBoard();			//draw the board
	drawEntities();			//draw the entities [player, enemies, stairs]
	drawUI();				//draw the UI
	drawMsg();

	// if game over, draw the screen
	if(GAME_OVER){
		drawGameOver();
	}

	ctx.restore();
}



//////////////   GAME LOOP FUNCTIONS   //////////////////

//game initialization function
function init(){
	reset();
	console.log("game initialized!");
}

// make a new level
function newLevel(){
	TURN = 0;
	initBoard();
	render();
}

// reset the game
function reset(){
	PLAYER.hp = PLAYER.max_hp;
	console.log(PLAYER.hp);
	PLAYER.score = 0;
	PLAYER.show = true;
	LEVEL = 1;
	TURN = 0;
	TOOK_TURN = false;
	GAME_OVER = false;
	newLevel();
	main();
	console.log("Game reset!");
}

//main game loop
function main(){
	// requestAnimationFrame(main);
	canvas.focus();

	//if key still held down, return
	if(TOOK_TURN)
		return;
	else
		message = "";

	if(GAME_OVER){
		render();
		return;
	}

	gameStep();
	render();
	TURN++;

	//debug
	var settings = "debug here";
	TOOK_TURN = true;

	//document.getElementById('debug').innerHTML = settings;
}


function end_game(){
	GAME_OVER = true;
	PLAYER.show = false;
	render();

}


/////////////////   HTML5 FUNCTIONS  //////////////////

//determine if valud key to press
document.body.addEventListener("keydown", function (e) {
	if(inArr(moveKeySet, e.code)){
		keys[e.code] = true;
		main();
	}else if(inArr(actionKeySet, e.code)){
		keys[e.code] = true;
	} 

	// reset the game
	if(e.code == "KeyR"){
		reset();
	}  
});

//check for key released
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.code)){
		keys[e.code] = false;
		TOOK_TURN = false;
	}else if(inArr(actionKeySet, e.code)){
		keys[e.code] = false;
	}
});

//prevent scrolling with the game
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.code) > -1)){
        e.preventDefault();
    }
}, false);


main();
