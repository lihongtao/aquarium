
var curX : int = 0;
var curY : int = 0; 
var jsStage : js_stage;
var index : int = 0;
var foodType : int = 0;
var tga0 : Texture2D[];
var tga1 : Texture2D[];
var tga2 : Texture2D[];
var tga : Texture2D[];
var curFrame : int = 0;
var frameTime : float = 0;
var fps : float = 10;
var waitRemoving : float = 0;
var vX : float = 0;

function InitFood(js: js_stage, idx : int, ft: int, x : int, y : int)
{
	jsStage = js;
	index = idx;
	curX = x;
	curY = y;
	yRemain = 0;
	foodType = ft;
	if(foodType == 0)
		tga = tga0;
	else if(foodType == 1)
		tga = tga1;
	else
		tga = tga2;
	fps = 10;
	curFrame = 0;
	AdjustPos();
	waitRemoving = 0;
}

function AdjustPos()
{
	guiTexture.texture = tga[curFrame];
	guiTexture.pixelInset.x = curX - guiTexture.pixelInset.width/2;
	guiTexture.pixelInset.y = curY - guiTexture.pixelInset.height/2;
}
function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	frameTime += Time.deltaTime;
	if(frameTime > 1.0 / fps)
	{
		if(waitRemoving > 0)
		{
			waitRemoving += frameTime;
			if(waitRemoving > 1.1)
			{//
				jsStage.RemoveFood(index, 0);
			}
		}
		else
		{
			if(vX > 1)vX *= 0.9;
			else vX = 0;
			
			curFrame++;
			if(curFrame >= tga.length)
			{
				curFrame = 0;
			}
		}
		frameTime = 0;
	}
	
	if(waitRemoving <= 0)
	{
		curX += Time.deltaTime * vX;
		curY -= Time.deltaTime * jsStage.foodSpeed;
		if(curY < js_stage.tankBottom + guiTexture.pixelInset.height/4)
		{
			curY = js_stage.tankBottom + guiTexture.pixelInset.height/4;
			waitRemoving = 0.1;
		}
		jsStage.foods_pos[index].y = curY;
		jsStage.foods_pos[index].x = curX;
	}
	AdjustPos();
}