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

//-------------------------------------------------------------------------------
// game init
var g_princeImg;
var g_princePosX = 256;
var g_princePosY = 256;
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
}

//-------------------------------------------------------------------------------
// game draw
function gameDraw()
{
    // draw prince
    g_context.drawImage(
        g_princeImg,
        g_princePosX-PRINCE_SIZE/2, g_princePosX-PRINCE_SIZE/2,
        PRINCE_SIZE, PRINCE_SIZE);
}
