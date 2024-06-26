//set up the canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 480;

var size = 16;

//camera
var camera = {
	x : 0,
	y : 0
};


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



var LEVEL = 0;
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

function gameStep(dir){

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
	
	if(!oob(p_pos.x, p_pos.y) && BOARD_LAYOUT[p_pos.y][p_pos.x] == 0)
		move(PLAYER, p_pos.x, p_pos.y);

	if(samePos(PLAYER, STAIRS)){
		console.log("WINNER!");
		reset();
		LEVEL++;
	}

	// CHECK IF ENEMY AT POSITION - IF SO, LOSE HEART

	// TODO: move the enemies

}


////////////////   CAMERA FUNCTIONS   /////////////////

/*  OPTIONAL IF LARGE GAME MAP
//if within the game bounds
function withinBounds(x,y){
	var xBound = (x >= Math.floor(camera.x / size) - 1) && (x <= Math.floor(camera.x / size) + (canvas.width / size));
	return xBound;
}

//have the camera follow the player
function panCamera(){
	camera.x = 0;
	camera.y = 0;

	if(map.length != 0 && player.x > ((map[0].length) - ((canvas.width/size)/2)))
		camera.x = (map[0].length * size) - canvas.width;
	else if(player.x < ((canvas.width/size)/2))
		camera.y = 0;
	else
		camera.x = player.x *size - (canvas.width / 2);

	if(map.length != 0 && player.y > ((map.length) - ((canvas.height/size) / 2)))
		camera.y = (map.length * size) - canvas.height;
	else if(player.y < ((canvas.height/size)/2))
		camera.y = 0;
	else
		camera.y = player.y *size - (canvas.height / 2) + (size/2);

	camera.x += cam_offset.x;
	camera.y += cam_offset.y;
}
*/


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

	drawBoard();
	drawEntities();
	
	ctx.restore();
}



//////////////   GAME LOOP FUNCTIONS   //////////////////

//game initialization function
function init(){
	reset();
	main();
	LEVEL = 0;
	console.log("game initialized!");
	// setTimeout(function(){
		
	// 	console.log("game start!");
	// },500);
}

function reset(){
	TURN = 0;
	TOOK_TURN = false;
	initBoard();
	render();
}

//main game loop
function main(){
	// requestAnimationFrame(main);
	canvas.focus();

	if(TOOK_TURN)
		return;

	gameStep();
	render();
	TURN++;

	//debug
	var settings = "debug here";
	TOOK_TURN = true;

	//document.getElementById('debug').innerHTML = settings;
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

	if(e.code == "KeyR"){
		TOOK_TURN = false;
		reset();
		console.log("RESET!");
	}  
});

//check for key released
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.code)){
		keys[e.code] = false;
		TOOK_TURN = false;
	}else if(inArr(actionKeySet, e.code)){
		keys[e.code] = false;
		TOOK_TURN = false;
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
