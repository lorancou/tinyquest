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

//-------------------------------------------------------------------------------
// game init
var g_princeImg;
var g_princePosX = CANVAS_CENTER_X;
var g_princePosY = CANVAS_CENTER_Y;
function gameInit()
{
	// init prince
    g_princeImg = new Image();
    g_princeImg.src = "prince.png";
    g_princeImg.onload = function() { /* game should wait for this to start, but meh. */ };
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
	if (g_princePosX<0) g_princePosX = CANVAS_WIDTH-1;
	if (g_princePosX>=CANVAS_WIDTH) g_princePosX = 0;
	if (g_princePosY<0) g_princePosY = CANVAS_HEIGHT-1;
	if (g_princePosY>=CANVAS_HEIGHT) g_princePosY = 0;
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
