
var curX : float = 0;
var curY : float = 0; 
var jsStage : js_stage;
var index : int = 0;
var coinType : int = 0;
var curFrame : int = 0;
var frameTime : float = 0;
var fps : float = 10;
var curState : int = 0; // 0 - down  1- waitRemoving , 2 - picking, 3- up to top
var stateTime : float = 0;
var statePos : Vector2;


//up to top
var v : float = 400;
var a : float = -10;

function InitCoin(js: js_stage, idx : int, ft: int, x : int, y : int)
{
	jsStage = js;
	index = idx;
	curX = x;
	curY = y;
	yRemain = 0;
	coinType = ft;
	fps = 10;
	curFrame = 0;
	AdjustPos();
	waitRemoving = 0;
	curState = 0;
	stateTime = 0;
	guiTexture.texture = js_res.coinAni[coinType, curFrame];
}

function AdjustPos()
{
	guiTexture.pixelInset.x = curX - guiTexture.pixelInset.width/2;
	guiTexture.pixelInset.y = curY - guiTexture.pixelInset.height/2;
}

function OnFrame( t : float)
{
	stateTime += t;
	if(curState == 0)
	{
		curY -= t * jsStage.coinSpeed;
		if(curY < js_stage.tankBottom)
		{
			curY = js_stage.tankBottom;
			ChangeState(1);
		}
	}
	else if(curState == 1)
	{
		if(stateTime > 1.5)
		{
			jsStage.RemoveCoin(index);
		}
	}
	else if(curState == 2)
	{
		if(stateTime > jsStage.coinPickTime)
		{
			jsStage.curMoney += jsStage.coinPrice[coinType];
			jsStage.RemoveCoin(index);
		}
		curX = statePos.x + stateTime / jsStage.coinPickTime *(js_stage.coinPos.x - statePos.x);
		curY = statePos.y + stateTime / jsStage.coinPickTime *(js_stage.coinPos.y - statePos.y);
	}
	else if(curState == 3)
	{
		curY = statePos.y + v * stateTime + 0.5 * a * stateTime * stateTime;
		if( v + a * stateTime <= 0 )
		{
			ChangeState(0);
		}
	}
	
	jsStage.coins_pos[index].y = curY;

	AdjustPos();

}

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	frameTime += Time.deltaTime;
	if(frameTime > 1.0 / fps)
	{
			curFrame++;
			if(curFrame >= 10)
			{
				curFrame = 0;
			}
			guiTexture.texture = js_res.coinAni[coinType, curFrame];

		frameTime = 0;
	}
	
	OnFrame(Time.deltaTime);

}
function UpToTop()
{
	if(curState != 2 && curState != 3)
	{
		ChangeState(3);
		v = 2 * (js_stage.tankTop - curY - 64);
		a = - v;
	}
}

private function ChangeState( st : int)
{
	curState = st;
	stateTime = 0;
	statePos.x = curX;
	statePos.y = curY; 
}
function PickCoin()
{
	if(curState != 2)
	{
		ChangeState(2);
		if(js_opt.soundOn)audio.Play();
	}
}
