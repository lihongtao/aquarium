var curHp : float = 100;
var maxHp : float = 100;
var curX : float = 0;
var curY : float = 0;
var targetX : float = 0;
var targetY : float = 0;
var dir : int = 0;
var curState : int = 0;
var stateTime : float = 0;
var curFrame : int = 0;
var frameTime : float = 0;
var fps : float = 15;
var speedX : float = 100;
var speedY : float = 50;
var alienType : int = 0;
private var alienNo : int = 0;

static var aliens : Array;
static var alienNextNo : int = 0;
static var alienDieSnd : AudioClip;

static function InitArray()
{
	if(aliens)
	{
		aliens.Clear();
	}
	else
	{
		aliens = new Array();
		alienDieSnd = Resources.Load("sound/cached_roar3", AudioClip);
	}
}

static function AddAlien( js : js_alien)
{
		
	js.alienNo = alienNextNo;
	alienNextNo++;
	aliens.Add(js);
}
static function RemoveAlien(js : js_alien)
{
	for(var i : int = 0; i < aliens.length; i++)
	{
		if(aliens[i].alienNo == js.alienNo)
		{
			aliens.RemoveAt(i);
			js_stage.jsStage.SummonCoin(CoinType.Diamond, js.curX, js.curY);
			return;
		}
	}
}

function InitAlien(idx : int, x : float, y : float)
{
	maxHp = 50 + 50 * alienType + 50 * idx + 5 * idx * idx;
	if(maxHp > 1000) maxHp = 1000;
	
	curHp = maxHp;
	curX = x;
	curY = y;
	targetX = x;
	targetY = y;
	curState = 0;
	dir = 0;
	if(targetX > curX)dir = 1;
	fps = 15;
	curFrame = 0;
	speedX = Screen.width / 40.0 + idx * Screen.width / 80.0;
	if(speedX > Screen.width / 6.0)speedX = Screen.width / 6.0;
	speedY = Screen.height / 40.0 + idx * Screen.height / 80.0;
	if(speedY > Screen.height / 5.0)speedY = Screen.height / 5.0;
	alienType = Random.Range(0, 1.8);
	guiTexture.pixelInset.width = js_res.alienAni[alienType, 0, 0].width * Screen.width / 640;
	guiTexture.pixelInset.height = js_res.alienAni[alienType, 0, 0].height * Screen.height / 480;
	
	SetAniByState();
	
	AddAlien(this);
	
	//print(Mathf.Pow(2, 3) + ", " + Mathf.Pow(3, 2));

}

function Hurt()
{
	if(curHp > 0)
	{
	curHp -= 10 * Mathf.Pow(1.4, js_stage.jsStage.gunLevel);
	if(curHp <= 0)
	{
		js_sndPlayer.SummonSound(alienDieSnd);
		curState = FishState.Die;
		stateTime = 0;
		Destroy(gameObject, 0.5);
		RemoveAlien(this);
	}
	}
}
static function AttackAlien(x : int, y : int) : boolean
{
	for(var i : int = 0; i < aliens.length; i++)
	{
		var js : js_alien = aliens[i];
		if(Mathf.Abs(js.curX - x) < js.gameObject.guiTexture.pixelInset.width /2 && Mathf.Abs(js.curY - y) < js.guiTexture.pixelInset.height / 2)
		{
			js.Hurt();
			return true;
		}
	}
	return false;
}

function Move(){
	if(curState == FishState.Swim)
	{
		if(Mathf.Abs(targetX - curX) > 0.1 || Mathf.Abs(targetY - curY) > 0.1)
		{
			if(targetX > curX)
			{
				curX += Time.deltaTime * speedX;
				if(curX > targetX)curX = targetX;
			}
			else
			{
				curX -= Time.deltaTime * speedX;
				if(curX < targetX)curX = targetX;
			}
			
			if(targetY > curY)
			{
				curY += Time.deltaTime * speedY;
				if(curY > targetY)curY = targetY;
			}
			else
			{
				curY -= Time.deltaTime * speedY;
				if(curY < targetY)curY = targetY;
			}
		}
		else
		{
			//target reached
			aiTime += 5;
		}
	}
	else if(curState == FishState.Die)
	{
		curY -= Time.deltaTime * Screen.height / 16;
		if(curY < js_stage.tankBottom)curY = js_stage.tankBottom;
	}

}

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	stateTime += Time.deltaTime;
	frameTime += Time.deltaTime;
	if(frameTime >= 1.0 / fps)
	{
		OnFrame(frameTime);
		
		frameTime = 0;
		curFrame++;
		if(curFrame >= js_res.aniFrames)
		{
			curFrame = 0;
			if(curState == FishState.Turn)
			{
				ChangeToSwimState();
			}
			else if(curState == FishState.Eat)
			{
				ChangeToSwimState();
			}
			else if(curState == FishState.Die)
			{
				curFrame = js_res.aniFrames - 1;
				if(stateTime > 0.5)
				{
					guiTexture.enabled = false;
				}
			}			
		}
	}
	
	Move();
	
	SetAniByState();
}
function SetAniByState()
{
	var aniState : int = 0;
	if(curState == FishState.Swim)
		aniState = 0;
	else if(curState == FishState.Turn)
		aniState = 1;
	else if(curState == FishState.Eat)
		aniState = 0;
	else if(curState == FishState.Die)
		aniState = 0;
	
	guiTexture.texture = js_res.alienAni[alienType, aniState, curFrame];
	guiTexture.pixelInset.x = curX - guiTexture.pixelInset.width / 2;
	guiTexture.pixelInset.y = curY - guiTexture.pixelInset.height / 2;
	transform.localScale.x = -2.0 * dir * guiTexture.pixelInset.width / Screen.width;
}

function ChangeToSwimState()
{

	curState = FishState.Swim;
	stateTime = 0;
	fps = 15;
	dir = 0;
	if(targetX > curX )dir = 1;

}

var aiTime : float = 0;
var attackTime : float = 0;
var chomp_prefab : GameObject;
function OnFrame(fTime : float)
{
	if(curState == FishState.Die && stateTime < 0.8)
	{
		if(Random.value < 1)js_bubblesCreator.SummonBubblesNear(curX + Random.Range(-40, 40), curY + Random.Range(-40,20), transform.position.z + 1);
		if(Random.value < 0.5)js_bubblesCreator.SummonSmokeNear(curX + Random.Range(-40, 40), curY + Random.Range(-20,20), transform.position.z + 1);
	}
	else
	{
	aiTime += fTime;
	if(aiTime > 5)
	{
		aiTime = 0;
		SetTarget(Random.Range(js_stage.tankBottom + guiTexture.pixelInset.height / 2,  js_stage.tankTop - guiTexture.pixelInset.height/2), Random.Range(guiTexture.pixelInset.width/2, Screen.width - guiTexture.pixelInset.width/2));
	}
	
	if(curHp > 0)attackTime += fTime;
	if(attackTime > 0.5 )
	{
		attackTime = 0;
		if(DamageFishes(1) > 0)
		{
			Instantiate(chomp_prefab, Vector3((curX -80*(0.5 - dir)) / Screen.width, (curY + 40) / Screen.height, 10009), transform.rotation);
		}
	}
	}
}

function DamageFishes(maxCnt : int) : int
{
	var cnt : int = 0;
	for(var ft : int = FishType.Small; ft < FishType.Max; ft ++)
	{
		var fishes : Array = js_fish.GetFishes(ft);
		for(var i : int = 0; i < fishes.length; i++)
		{
			var jsFish : js_fish = fishes[i];
			if(jsFish)
			{
				if(jsFish.curState != FishState.Die)
				{
					if( Mathf.Abs(jsFish.curX - curX) < guiTexture.pixelInset.width * 0.4 && Mathf.Abs(jsFish.curY - curY) < guiTexture.pixelInset.height * 0.4)
					{
						jsFish.RemoveFromArray();
						Destroy(jsFish.gameObject);
						cnt ++;
						if(cnt >= maxCnt)return cnt;
					}
				}
			}
		}
	}
	
	return cnt;
}

function SetTarget( x : int, y : int)
{
	targetX = x;
	targetY = y;
	if(targetY < js_stage.tankBottom)targetY = js_stage.tankBottom;
	if(targetY > js_stage.tankTop) targetY = js_stage.tankTop;
	var newDir : int = 0;
	if(targetX > curX) newDir = 1;
	if(newDir != dir)
	{
		curState = FishState.Turn;//turn
		fps *= 2;
		curFrame = 0;
		frameTime = 0;
	}
}
