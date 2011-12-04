var petType : int = 0;
var petNo : int = 0;
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
var tga0 : Texture2D[];
var tga1 : Texture2D[];
var tga2 : Texture2D[];
var tga : Texture2D[];
var pearl_prefab : GameObject;
static var pets : Array;
static var petNextNo : int = 0;
static var petDieSnd : AudioClip;

var intervalDoJob : float = 15;
var movable : boolean = true;
var turnable : boolean = true;
static function InitArray()
{
	if(pets)
	{
		pets.Clear();
	}
	else
	{
		pets = new Array();
	}
}
static function AddPet( js : js_pet)
{
	js.petNo = petNextNo;
	petNextNo++;
	pets.Add(js);
}
static function RemovePet(js : js_pet)
{
	for(var i : int = 0; i < pets.length; i++)
	{
		if(pets[i].petNo == js.petNo)
		{
			pets.RemoveAt(i);
			return;
		}
	}
}
static function FindPetByType( t : int) : js_pet
{
	for( var js : js_pet in pets)
	{
		if(js.petType == t)
		{
			//Debug.Log("found pet " + t.ToString());
			return js;
		}
	}
	return null;
}

function LoadPetImages()
{	
	//Debug.Log("LoadPetImages " + petType);
	js_res.LoadPetImages(petType);
	tga1 = new Texture2D[js_res.aniFrames];
	tga0 = new Texture2D[js_res.aniFrames];
	tga2 = new Texture2D[js_res.aniFrames];
	for(var i : int = 0; i < js_res.aniFrames; ++i)
	{
		tga0[i] = js_res.petAni[petType,0,i];
		tga1[i] = js_res.petAni[petType,1,i];
		tga2[i] = js_res.petAni[petType,2,i];
	}
}

function SetTarget( x : int, y : int)
{
	targetX = x;
	targetY = y;
	if(targetY < js_stage.tankBottom)targetY = js_stage.tankBottom;
	if(targetY > js_stage.tankTop) targetY = js_stage.tankTop;
	//if(ySpeed <= 0)targetY = curY;
	
	var newDir : int = 0;
	if(targetX > curX) newDir = 1;
	if(newDir != dir)
	{
		if(turnable)//鱿鱼没有转身
		{
			curState = FishState.Turn;//turn
			fps = 20;
			curFrame = 0;
			frameTime = 0;
		}
	}
}

function InitPet(idx : int)
{
	petType = idx;
	maxHp = 50;// + 50 * petType + 50 * Mathf.Pow( 1.5, idx);
	curHp = maxHp;
	curX = Random.Range(128, Screen.width-128);
	curY = Random.Range(128 + js_stage.tankBottom, js_stage.tankTop - 128);
	targetX = Random.Range(128, Screen.width-128);
	targetY = Random.Range(128 + js_stage.tankBottom, js_stage.tankTop - 128);
	curState = 0;
	dir = 0;
	if(targetX > curX)dir = 1;
	fps = 10;
	curFrame = 0;
	speedX = Screen.width / 40.0 + idx * Screen.width / 80.0;
	if(speedX > Screen.width / 5.0)speedX = Screen.width / 5.0;
	speedY = Screen.height / 40.0 + idx * Screen.height / 80.0;
	if(speedY > Screen.height / 5.0)speedY = Screen.height / 5.0;
	
	LoadPetImages();
	
	guiTexture.pixelInset.width = tga0[0].width * Screen.width / 640;
	guiTexture.pixelInset.height = tga0[0].height * Screen.height / 480;
	
	SetAniByState();

	AddPet(this);
	
	//print(Mathf.Pow(2, 3) + ", " + Mathf.Pow(3, 2));
	OnInit();

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
			TargetReached();
		}
	}
	else if(curState == FishState.Die)
	{
		curY -= Time.deltaTime * Screen.height / 16;
		if(curY < js_stage.tankBottom)curY = js_stage.tankBottom;
	}

}

var timeSinceDoJob : float = 0;
function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	//print("pet update");
	timeSinceDoJob += Time.deltaTime;
	if(timeSinceDoJob >= intervalDoJob)
	{
		timeSinceDoJob = 0;
		DoJob();
	}
	
	stateTime += Time.deltaTime;
	frameTime += Time.deltaTime;
	if(frameTime >= 1.0 / fps)
	{
		frameTime = 0;
		curFrame++;
		if(curFrame >= tga.length || tga[curFrame] == null)
		{
			curFrame = 0;
			if(curState == FishState.Swim)
			{
				OnAniSwimFinished();
			}
			else if(curState == FishState.Turn)
			{
				OnAniTurnFinished();
			}
			else if(curState == FishState.Eat)
			{
				ChangeToSwimState();
			}
			else if(curState == FishState.Die)
			{
				curFrame = tga.length - 1;
			}			
		}
	}
	
	if(movable)Move();
	
	SetAniByState();
}

static function ClickAtPet(x : int, y : int) : boolean
{
	if(pets)
	{
		for( var js : js_pet in pets)
		{
			if(js.ClickAt(Vector2(x,y)))return true;
		}
	}
	return false;
}

function SetAniByState()
{
	if(curState == FishState.Swim)
		tga = tga0;
	else if(curState == FishState.Turn)
		tga = tga1;
	else if(curState == FishState.Eat)
		tga = tga2;
	else if(curState == FishState.Die)
		tga = tga0;
	else
		tga = tga0;
	Debug.Log("Pet " + petType + ", state=" + curState);
	guiTexture.texture = tga[curFrame];
	guiTexture.pixelInset.x = curX - guiTexture.pixelInset.width / 2;
	guiTexture.pixelInset.y = curY - guiTexture.pixelInset.height / 2;
	transform.localScale.x = -2.0 * dir * guiTexture.pixelInset.width / Screen.width;
}

function ChangeToSwimState()
{
	curState = FishState.Swim;
	stateTime = 0;
	fps = 10;
	dir = 0;
	if(targetX > curX )dir = 1;

}

////存在个性化的部分////////////////////////////////////

function DoJob()
{
	if(petType == 0 || petType == 1)
		js_stage.PickCoin(curX, curY, 100);
	else if(petType == 3)
	{//大象吐星星
		var rnd : float = Random.value;
		var coinType : int = CoinType.Star;
		if(rnd < 0.3)
			coinType = CoinType.Diamond;

		var jsCoin : js_coin = js_stage.jsStage.SummonCoin(coinType, curX, curY);
		if(jsCoin)jsCoin.UpToTop();
	}
	else if(petType == 5)
	{//灯泡鱼避难
		if(js_alien.aliens.length > 0)
		{
			var jsAlien : js_alien = js_alien.aliens[0];
			var x : float = guiTexture.pixelInset.width / 2;
			var y : float = js_stage.tankBottom + guiTexture.pixelInset.height/2;
			if(jsAlien.curY < (js_stage.tankTop + js_stage.tankBottom) /2)y = js_stage.tankTop - guiTexture.pixelInset.height/2;
			
			SetTarget(x, y);
		}
	}
	else if(petType == 6)
	{
		curState = FishState.Eat;
		curFrame = 0;
		fps = 10;
		
		var seek : int = tga0[0].width/2;
		if(dir == 0) seek *= -1;
		js_trigger.js.MerlySing(curX + seek, curY + seek/2 );
	}
}

var pet0Distance : int = 50;
function OnInit()
{
	if(petType == 0)
	{
		curX = guiTexture.pixelInset.width / 2 + pet0Distance;
		targetX = Screen.width - guiTexture.pixelInset.width / 2 - pet0Distance;
		curY = js_stage.tankBottom + 20;
		targetY = curY;
		dir = 1;
		speedY = 0;
		speedX = Screen.width / 12;
		//fps = 10;
		intervalDoJob = 0.3;
	}
	else if(petType == 1)
	{
		intervalDoJob = 0.3;
		turnable = false;
	}
	else if(petType == 2)
	{//贝壳
		transform.position.x = 0.21;
		transform.position.y = 0.38;
		transform.position.z = 9;
		curX = 0;//Screen.width * 0.31;
		curY = 0;//Screen.height * 0.423;
		dir = 0;
		speedX = 0;
		speedY = 0;
		fps = 8;
		intervalDoJob = 99999;
		movable = false;
		turnable = false;
	}
	else if(petType == 3)
	{
		intervalDoJob = 10;
		//if(Application.isEditor)intervalDoJob = 3;
	}
	else if(petType == 4)
	{//海豚
	}
	else if(petType == 5)
	{//灯泡鱼
		curX = Random.Range(guiTexture.pixelInset.width / 2, Screen.width/2);
		targetX = Random.Range(guiTexture.pixelInset.width / 2, Screen.width/2);
		intervalDoJob = 1;
	}
	else if(petType == 6)
	{//美人鱼
		intervalDoJob = 40;
	}
	else if(petType == 9)
	{//尖海螺
		turnable = false;
		speedY = 0;
		curX = Random.Range(200, Screen.width-200);//guiTexture.pixelInset.width / 2 + pet0Distance;
		curY = js_stage.tankBottom + 20;

	}
}
function TargetReached()
{
	if(petType == 0)
	{//蜗牛转向
		if(curX < Screen.width / 2)
		{
			SetTarget(Screen.width - guiTexture.pixelInset.width / 2 - pet0Distance,  js_stage.tankBottom + 20);
		}
		else
		{
			SetTarget(guiTexture.pixelInset.width / 2 + pet0Distance,  js_stage.tankBottom + 20);
		}
	}
	else if(petType == 2)
	{//贝壳不动
	}
	else if(petType == 5)
	{//灯泡鱼，不动
		if(js_alien.aliens.length <= 0)
		{
			SetTarget(Random.Range( guiTexture.pixelInset.width / 2, Screen.width / 2), Random.Range(js_stage.tankBottom + guiTexture.pixelInset.height / 2, js_stage.tankTop - guiTexture.pixelInset.height/2));
		}
	}
	else
	{
		SetTarget(Random.Range( guiTexture.pixelInset.width / 2, Screen.width - guiTexture.pixelInset.width / 2), Random.Range(js_stage.tankBottom + guiTexture.pixelInset.height / 2, js_stage.tankTop - guiTexture.pixelInset.height/2));
	}
}

function OnAniSwimFinished()
{
	if(petType == 2 && stateTime > 35)
	{
		curState = FishState.Turn;
		stateTime = 0;
		curFrame = 0;
	}
	else if(petType == 3)//大象吃东西
	{
		//Debug.Log("elephant eat.");
		curFrame = 0;
		for( var i : int = 0; i < js_stage.jsStage.foods_pos.length; i++)
		{
			if(js_stage.jsStage.foods_pos[i].z > 1)
			{
				if( Mathf.Abs(js_stage.jsStage.foods_pos[i].x - curX) < 60 && Mathf.Abs(js_stage.jsStage.foods_pos[i].y - curY) < 40)
				{
					if(js_opt.soundOn)
					{
						audio.clip = js_fish.sndEat;
						audio.Play();
					}
					var jsFood : js_food = js_stage.jsStage.foods[i].GetComponent("js_food");
					js_stage.jsStage.RemoveFood(i, 0.3);
					break;
				}
			}
		}
	}
	else
	{
		curFrame = 0;
	}
}

function OnAniTurnFinished()
{
	if(petType != 2)ChangeToSwimState();
	else
	{
		curFrame = tga.length - 1;
		if(stateTime > 7)
		{
			curState = FishState.Eat;
			stateTime = 0;
			curFrame = 0;
		}
	}
}

function ClickAt(ptMouse : Vector2) : boolean
{
	if(petType == 2)
	{
		if(curState == FishState.Turn && js_common.GetTextureRect(gameObject).Contains(ptMouse))
		{
			curState = FishState.Eat;
			stateTime = 0;
			curFrame = 0;
			Instantiate( pearl_prefab, Vector3(transform.position.x, transform.position.y, 999), transform.rotation);
			
			return true;
		}
	}
	
	return false;
}
