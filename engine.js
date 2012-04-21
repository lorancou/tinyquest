/*
 * engine.js
 * ----------
 *
 * Tiny Quest
 * Copyright (c) 2012 Laurent Couvidou
 * Contact : lorancou@free.fr
 *
 * This program is free software - see README for details.
 */

//-------------------------------------------------------------------------------
// engine constants
var CANVAS_WIDTH = 512;
var CANVAS_HEIGHT = 512;
var CANVAS_CENTER_X = CANVAS_WIDTH * 0.5;
var CANVAS_CENTER_Y = CANVAS_HEIGHT * 0.5;

//-------------------------------------------------------------------------------
// log
function log(msg)
{
    //alert(msg);

    var begin = "<ul><li>";
    var middle = "</li><li>";
    var end = "</li></ul>";

    if (window.console)
    {
        window.console.log(msg);
    }

    var output_div = document.getElementById("output");
    if ( output_div )
    {
        var lines = output_div.innerHTML;
        var lineList;
        
        if (lines.length > 0)
        {
            lineList = lines.substring(begin.length, lines.length - end.length).split(middle);
            var MAX_LOG_LINES = 20;
            while (lineList.length >= MAX_LOG_LINES)
            {
                lineList.shift();
            }
            lineList.push(msg);
        }
        else
        {
            lineList = [ msg ];
        }
        
        output_div.innerHTML = begin +lineList.join(middle) +end;
    }
}

//-------------------------------------------------------------------------------
// engine init
var g_context;
function init()
{
    log("initializing...");
    
    // get canvas element
    var canvasElement = document.getElementById("canvas");
    if (!canvasElement)
    {
        log("ERROR: missing canvas element");
        return;
    }

    // set its size
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;

    // get canvas context
    g_context = canvasElement.getContext("2d");
    if (!g_context)
    {
        log("ERROR: missing canvas context");
        return;
    }

    // clear canvas
    g_context.fillStyle = "#000000";
    g_context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // inputs init
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;

    // init the interesting stuff
    gameInit();
    
    // run
    setTimeout("update()", 0.0);

    log("done");
}

//-------------------------------------------------------------------------------
// engine update
var g_lastTime = new Date().getTime();
var g_tick = 0;
var g_exited = false;
function update()
{
    var time = new Date().getTime();
    var dt = time - g_lastTime;
    var fps = 1000.0 / dt;
   
    // update the interesting stuff
    gameUpdate(dt);
    gameDraw();
    
    // print FPS
    var fpsElement = document.getElementById("fps")
    if (fpsElement)
    {
        var fpsString = fps.toFixed(0);
        fpsElement.innerHTML = "FPS: " + fpsString;
    }
    
    // move on to next update
    g_lastTime = time;
    g_tick++;
    if (!g_exited)
    {
        var AIM_FPS = 60.0;
        var MIN_DT = 1000.0 / AIM_FPS;
        setTimeout("update()", MIN_DT);
    }
}

//-------------------------------------------------------------------------------
// exit
function exit()
{
    log("exit");
    g_exited = true;
}

//-------------------------------------------------------------------------------
// inputs
var g_ie = document.all ? true : false;	
var g_leftPressed = false;
var g_upPressed = false;
var g_rightPressed = false;
var g_downPressed = false;
function keyDown(e)
{
	var ev = null;
	if (g_ie) ev = event;
	else ev = e;
    if (ev == null) return;
    
	//log("key down: " + ev.keyCode);

    switch ( ev.keyCode )
    {
    case 37: case 81: case 65: g_leftPressed = true; break;
    case 38: case 90: case 87: g_upPressed = true; break;
    case 39: case 68: g_rightPressed = true; break;
    case 40: case 83: g_downPressed = true; break;
    }
}
function keyUp(e)
{
	var ev = null;
	if (g_ie) ev = event;
	else ev = e;
    if (ev == null) return;
    
	//log("key up: " + ev.keyCode);

    switch ( ev.keyCode )
    {
    case 37: case 81: case 65: g_leftPressed = false; break;
    case 38: case 90: case 87: g_upPressed = false; break;
    case 39: case 68: g_rightPressed = false; break;
    case 40: case 83: g_downPressed = false; break;
    }
}

//-------------------------------------------------------------------------------
// maths
function lerp(t, a, b)
{
    return a + t * (b -a);
}
function clamp(v, min, max)
{
    if (v < min) return min;
    if (v > max) return max;
    return v;
}

//-------------------------------------------------------------------------------
// animation
function drawAnimated(img, imgX, imgY, width, height, cursor, frameCount)
{
    var frame = Math.floor(cursor * frameCount);
    var frameWidth = img.width / frameCount;
    var sourceX = (frame % frameCount) * frameWidth;
    var sourceY = 0;
    // log("sourceX= " + sourceX + " sourceY= " + sourceY);
    // log("frameWidth= " + frameWidth);
    // log("imgX= " + imgX + " imgY= " + imgY);
    // log("width= " + width + " height= " + height);
    g_context.drawImage(
        img,
        sourceX, sourceY,
        frameWidth, img.height,
        imgX, imgY,
        width, height);
}
