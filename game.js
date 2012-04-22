/*
 * game.js
 * ----------
 *
 * Tiny Quest
 * Copyright (c) 2012 Laurent Couvidou
 * Contact : lorancou@free.fr
 *
 * This program is free software - see README for details.
 */

//-------------------------------------------------------------------------------
// game constants
var PRINCE_SPEED = 1.0;
var PRINCE_SIZE = 32;
var PRINCE_SPEED = 2;
var KONAMI_CODE = ["up","up","down","down","left","right","left","right"];//,"b","a"];

//-------------------------------------------------------------------------------
// game init
var g_princeImg;
var g_princePosX = CANVAS_CENTER_X;
var g_princePosY = CANVAS_CENTER_Y;
var g_konamiProgress = 0;
function gameInit()
{
	// init prince
    g_princeImg = new Image();
    g_princeImg.src = "prince.png";
    g_princeImg.onload = function() { /* game should wait for this to start, but meh. */ };
	
	// init progress
	g_konamiProgress = 0;
}

//-------------------------------------------------------------------------------
// game update
function gameUpdate()
{
	// move prince
	if (g_leftPressed) g_princePosX -= PRINCE_SPEED;
	if (g_rightPressed) g_princePosX += PRINCE_SPEED;
	if (g_upPressed) g_princePosY -= PRINCE_SPEED;
	if (g_downPressed) g_princePosY += PRINCE_SPEED;
	
	// wrap around tiny world
	var trigger = false;
	var progress = false;
	if (g_princePosX<0)
	{
		// wrap left
		g_princePosX = CANVAS_WIDTH-1;
		trigger = true;
		if (KONAMI_CODE[g_konamiProgress] == "left")
		{
			progress = true;
		}
	}
	else if (g_princePosX>=CANVAS_WIDTH)
	{
		// wrap right
		g_princePosX = 0;
		trigger = true;
		if (KONAMI_CODE[g_konamiProgress] == "right")
		{
			progress = true;
		}
	}
	else if (g_princePosY<0)
	{
		// wrap up
		g_princePosY = CANVAS_HEIGHT-1;
		trigger = true;
		if (KONAMI_CODE[g_konamiProgress] == "up")
		{
			progress = true;
		}
	}
	else if (g_princePosY>=CANVAS_HEIGHT)
	{
		// wrap down
		g_princePosY = 0;
		trigger = true;
		if (KONAMI_CODE[g_konamiProgress] == "down")
		{
			progress = true;
		}
	}
	
	// check progress in Konami code
	if (trigger)
	{
		if (progress)
		{
			if ((++g_konamiProgress) >= KONAMI_CODE.length)
			{
				exit();
			}
			log("Progress: " + g_konamiProgress);
		}
		else
		{
			g_konamiProgress = 0;
			log("Progress reset");
		}
	}
}

//-------------------------------------------------------------------------------
// game draw
function gameDraw()
{
    // clear canvas
    g_context.fillStyle = "#FF00FF";
    g_context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // draw prince
    g_context.drawImage(
        g_princeImg,
        g_princePosX - PRINCE_SIZE/2, g_princePosY - PRINCE_SIZE/2,
        PRINCE_SIZE, PRINCE_SIZE);
}
