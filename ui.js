// UI CODE

function drawUI(){
    // background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width, 64);

    // text
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "16px Arial";
	ctx.fillText("Level: " + LEVEL, 20, 24);
	ctx.fillText("Turn: " + TURN, 20, 44);

    // hp
    ctx.fillStyle = "#F279F0";
    ctx.strokeStyle = "#F279F0";
    for(let i=0;i<PLAYER.max_hp;i++){

        if(i < PLAYER.hp)
            ctx.fillRect((canvas.width - 100) + (i*20), 24, 16, 16);
        else{
            ctx.beginPath();
            ctx.rect((canvas.width - 100) + (i*20), 24, 16, 16);
            ctx.stroke();
        }
    }

}