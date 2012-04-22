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
var KONAMI_CODE = ["a","b","right","left","right","left","down","down","up","up"];
var APPLE_TREE_X = 68;
var APPLE_TREE_Y = 84;
var BRIDGE_X = 204;
var BRIDGE_Y = 148;
var TRIGGER_DIST = 32;
var TRIGGER_SQDIST = TRIGGER_DIST*TRIGGER_DIST;
var BUBBLE_WIDTH = 64;
var BUBBLE_HEIGHT = 32;
var BUBBLE_OFFSET_X = -32;
var BUBBLE_OFFSET_Y = -52;
var BUBBLE_TICKS = 120;

//-------------------------------------------------------------------------------
// game init
var g_princeImg;
var g_worldImg;
var g_bubbleImgs = new Array();
var g_bubbleMissImg;
var g_princeX = CANVAS_CENTER_X;
var g_princeY = CANVAS_CENTER_Y;
var g_konamiProgress = 0;
var g_progressTick = -1000;
var g_missTick = -1000;
function gameInit()
{
	// init prince image
    g_princeImg = new Image();
    g_princeImg.src = "prince.png";
    g_princeImg.onload = function() { /* game should wait for this to start, but meh. */ };
	
	// init world image
    g_worldImg = new Image();
    g_worldImg.src = "world.png";
    g_worldImg.onload = function() { /* game should wait for this to start, but meh. */ };

	// init bubble miss image
    g_bubbleMissImg = new Image();
    g_bubbleMissImg.src = "bubble_miss.png";
	
	// init bubble images
	for (var i=0; i<KONAMI_CODE.length; ++i)
	{
		g_bubbleImgs.push(new Image());
		g_bubbleImgs[i].src = "bubble_"+i+".png";
	}
	
	// init progress
	g_konamiProgress = 0;
}

//-------------------------------------------------------------------------------
// game update
function gameUpdate()
{
	// move prince
	if (g_leftPressed) g_princeX -= PRINCE_SPEED;
	if (g_rightPressed) g_princeX += PRINCE_SPEED;
	if (g_upPressed) g_princeY -= PRINCE_SPEED;
	if (g_downPressed) g_princeY += PRINCE_SPEED;
	
	// wrap around tiny world
	var trigger = false;
	var progress = false;
	if (g_princeX<0)
	{
		// wrap left
		g_princeX = CANVAS_WIDTH-1;
		trigger = true;
		if (KONAMI_CODE[g_konamiProgress] == "left")
		{
			progress = true;
		}
	}
	else if (g_princeX>=CANVAS_WIDTH)
	{
		// wrap right
		g_princeX = 0;
		trigger = true;
		if (KONAMI_CODE[g_konamiProgress] == "right")
		{
			progress = true;
		}
	}
	else if (g_princeY<0)
	{
		// wrap up
		g_princeY = CANVAS_HEIGHT-1;
		trigger = true;
		if (KONAMI_CODE[g_konamiProgress] == "up")
		{
			progress = true;
		}
	}
	else if (g_princeY>=CANVAS_HEIGHT)
	{
		// wrap down
		g_princeY = 0;
		trigger = true;
		if (KONAMI_CODE[g_konamiProgress] == "down")
		{
			progress = true;
		}
	}
	
	// check if touched apple tree
	var dx = APPLE_TREE_X - g_princeX;
	var dy = APPLE_TREE_Y - g_princeY;
	if (TRIGGER_SQDIST > (dx*dx + dy*dy))
	{
		if (KONAMI_CODE[g_konamiProgress] == "a")
		{
			trigger = true;
			progress = true;
		}
	}
	
	// check if touched bridge
	var dx = BRIDGE_X - g_princeX;
	var dy = BRIDGE_Y - g_princeY;
	if (TRIGGER_SQDIST > (dx*dx + dy*dy))
	{
		if (KONAMI_CODE[g_konamiProgress] == "b")
		{
			trigger = true;
			progress = true;
		}
	}

	// check progress in Konami code
	if (trigger)
	{
		if (progress)
		{
			g_progressTick = g_tick;
			if ((++g_konamiProgress) >= KONAMI_CODE.length)
			{
				exit();
				return;
			}
			log("Progress: " + g_konamiProgress);
		}
		else
		{
			g_missTick = g_tick;
			g_konamiProgress = 0;
			log("Progress reset");
		}
	}
	
	//log(g_princeX + "," + g_princeY);
}

//-------------------------------------------------------------------------------
// game draw
function gameDraw()
{
    // draw world
    g_context.drawImage(
        g_worldImg,
        0, 0,
        CANVAS_WIDTH, CANVAS_HEIGHT);
	
	// a bit of movement feedback
	var yOffset = 0;
	if (g_leftPressed || g_rightPressed || g_upPressed || g_downPressed)
	{
		yOffset = 4 * Math.abs(Math.sin(g_lastTime));
	}

    // draw prince
    g_context.drawImage(
        g_princeImg,
        g_princeX - PRINCE_SIZE/2, g_princeY - PRINCE_SIZE/2 - yOffset,
        PRINCE_SIZE, PRINCE_SIZE);
	
	// draw bubble
	if ((g_tick - g_missTick) < BUBBLE_TICKS)
	{
		g_context.drawImage(
			g_bubbleMissImg,
			g_princeX + BUBBLE_OFFSET_X, g_princeY + BUBBLE_OFFSET_Y,
			BUBBLE_WIDTH, BUBBLE_HEIGHT);
	}
	else if (g_konamiProgress>0 && ((g_tick - g_progressTick) < BUBBLE_TICKS))
	{
		g_context.drawImage(
			g_bubbleImgs[g_konamiProgress-1],
			g_princeX + BUBBLE_OFFSET_X, g_princeY + BUBBLE_OFFSET_Y,
			BUBBLE_WIDTH, BUBBLE_HEIGHT);
	}
}
