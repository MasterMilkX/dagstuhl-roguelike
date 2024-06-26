// UI CODE
var message = "";

function drawUI(){
    // background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width, 64);

    // text
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "16px Arial";
    ctx.textAlign = "left";
	ctx.fillText("Level: " + LEVEL, 20, 24);
	ctx.fillText("Turn: " + TURN, 120, 24);
	ctx.fillText("Score: " + PLAYER.score, 220, 24);

    // hp
    ctx.fillStyle = "#F279F0";
    ctx.strokeStyle = "#F279F0";
    for(let i=0;i<PLAYER.max_hp;i++){

        if(i < PLAYER.hp)
            ctx.fillRect((canvas.width - 100) + (i*20), 10, 16, 16);
        else{
            ctx.beginPath();
            ctx.rect((canvas.width - 100) + (i*20), 10, 16, 16);
            ctx.stroke();
        }
    }

}

// draw the game over screen
function drawGameOver(){
    ctx.fillStyle = "#000000";
		ctx.globalAlpha = 0.75;
		ctx.fillRect(0,0,canvas.width, canvas.height);

		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "24px Arial";
		ctx.fillText("GAME OVER", canvas.width/2, 240);
		ctx.font = "18px Arial"
		ctx.fillText("Press 'R' to restart", canvas.width/2, 280);
}

function drawMsg(){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width/2, 50);
}