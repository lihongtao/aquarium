//#pragma strict 

var hungry : boolean = false;
var feed_time : float = 0;
enum FishState{Swim, Turn, Eat, Die, Summon};
var curState : int = 0; // 0 - swim,  1 - turn, 2 - eat, 3-die, 4-summon
var curFrame : int = 0;
var frameTime : float = 0;
var fps : float = 15;
var lifeTime : float = 0;

var dir : int = 0;
var curX : float;
var curY : float;
var targetX : float;
var targetY : float;
var speedX : float;
var speedY : float;
var fishType : int = 0;
var targetFood : int = -1;
var targetFish : js_fish;
var jsStage : js_stage;
var fd : FishData;

static var sndSplash : AudioClip;
static var sndSplashBig : AudioClip;
static var sndDie : AudioClip;
static var sndEat : AudioClip;
static var sndGrow : AudioClip;
static var sndEatFish : AudioClip;

enum FishType{Small, Middle, Big, King, Black, White, Max};

static var fishes : Array[];

static function InitArray()
{
	if(fishes == null)
	{
		fishes = new Array[FishType.Max];
		for(var i : int = 0; i < FishType.Max; ++i)
		{
			fishes[i] = new Array();
		}
	}
	else
	{
		ClearArray();
	}
}

static function ClearArray()
{
	if(fishes)
	{
	for( var i : int = 0; i < FishType.Max; ++i)
	{
		fishes[i].Clear();
	}
	}
}

static function AllFishesSummonCoin()
{
	for(var t : int = 0; t < FishType.Max; ++t)
	{
		for( var js : js_fish in fishes[t])
		{
			js.SummonCoinNextFrame();
		}
	}
}

function RandomTargetY() : int
{
	return Random.Range(js_stage.tankBottom + guiTexture.pixelInset.height / 2,  js_stage.tankTop - guiTexture.pixelInset.height/2);
}
function RandomTargetX() : int
{
	return Random.Range(guiTexture.pixelInset.width/2, Screen.width - guiTexture.pixelInset.width/2);
}

function InitFish(js : js_stage, ft: int, x : int, y : int)
{
	jsStage = js;
	fishType = ft;
	fd = new FishData();
	fd = js_data.fishes[fishType];
	targetFood = -1;
	hungry = false;
	feed_time = Random.Range(4, 5.0);
	curX = x;
	curY = y;
	targetX = RandomTargetX();
	targetY = RandomTargetY();
	dir = targetX > curX ? 1 : 0;
	curState = FishState.Swim;

	feed_time = Random.Range(3.0, 5.0);
	curState = FishState.Summon;
	curY = Screen.height;
	targetY = js_stage.tankTop - 80;
	targetX = curX;
	dir = (Random.value * 99) / 50;
	js_bubblesCreator.SummonBubblesNear(curX, targetY - 20, transform.position.z + 10);
	
	if(fishType == FishType.White)audio.clip = sndSplashBig;
	else 	audio.clip = sndSplash;
	if(js_opt.soundOn)audio.Play();

	curFrame = 0;
	fps = 15;
	speedX = Screen.width / fd.timeSwim;
	speedY = Screen.height / fd.timeSwim;
	
	if(fishType == FishType.White)
	{
		guiTexture.pixelInset.width = 200;
		guiTexture.pixelInset.height = 200;
	}

	if(js_pet.FindPetByType(4))//海豚
	{
		var gt : GUIText = gameObject.AddComponent(GUIText);
		gt.alignment = TextAlignment.Center;
		gt.anchor = TextAnchor.MiddleCenter;
		//gt.pixelOffset.x = 100;
		//gt.pixelOffset.y = guiTexture.pixelInset.height;
		gt.font = jsStage.fishHungrySignFont;
		gt.text = "V";
	}
		
	SetAniByState();
	//print(curY);
	AddToArray();
}

function AddToArray()
{
	fishes[fishType].Add(this);
	js_stage.jsStage.fishCnt ++;
}
function Grow(ft : int)
{
	RemoveFromArray();
	fishType = ft;
	fd = js_data.fishes[fishType];
	SetAniByState();
	AddToArray();
	if(js_opt.soundOn)
	{
		audio.clip = sndGrow;
		audio.Play();
	}
}

static function GetFishes(ft : int) : Array
{
	return fishes[ft];		
}
function RemoveFromArray()
{
		for( var xx : int = 0; xx < fishes[fishType].length; xx++ )
		{
			var js : js_fish = fishes[fishType][xx];
			if(js == this)
			{
				fishes[fishType].RemoveAt(xx);
				js_stage.jsStage.fishCnt --;
			}
		}
}

function SetAniByState()
{
	var aniState : int = 0;
	
	if(curState == FishState.Swim)
		aniState = hungry ? 3 : 0;
	else if(curState == FishState.Turn)
		aniState = hungry ? 4 : 1;
	else if(curState == FishState.Eat)
		aniState = hungry ? 5 : 2;
	else if(curState == FishState.Die)
		aniState = 6;
	
	if(fishType == FishType.White)
	{
		aniState = 0;
		switch(curState)
		{
			case FishState.Swim:
			case FishState.Summon:
			aniState = 0;
			break;
			case FishState.Turn:
			aniState = 2;
			break;
			case FishState.Eat:
			aniState = 1;
			break;
			case FishState.Die:
			aniState = 3;
			break;
		}
	}
	
//	Debug.Log("fish " + fishType + ", " + aniState + ", " + curFrame);
	guiTexture.texture = js_res.fishAni[fishType, aniState, curFrame];
	guiTexture.pixelInset.x = curX - guiTexture.pixelInset.width / 2;
	guiTexture.pixelInset.y = curY - guiTexture.pixelInset.height / 2;
	transform.localScale.x = -2.0 * dir * guiTexture.pixelInset.width / Screen.width;
	if(guiText)
	{
		guiText.pixelOffset.x = curX;
		guiText.pixelOffset.y = curY + (5 + fishType) * 8;
		//20, 30, 40, 50, 60,70
	}
}

var lastCoin : int = 0;
function OnFrame( frameTime : float)
{
	feed_time += frameTime;
	if(feed_time > fd.dieTime)
	{
		if(curState != FishState.Die)
		{
		audio.clip = sndDie;
		if(js_opt.soundOn)audio.Play();
		
		curState = FishState.Die;
		curFrame = 0;
		frameTime = 0;
		RemoveFromArray();
		Destroy(gameObject, 4.0);
		}
	}
	else if(feed_time > fd.hungryTime)
		hungry = true;
	else
		hungry = false;
	
	if(curState != FishState.Die)
	{
		lifeTime += frameTime * (hungry ? 0.5 : 1.0);
		var newCoin : int = lifeTime / fd.coinTime;
		if(newCoin > lastCoin)
		{
			lastCoin = newCoin;
			jsStage.SummonCoin( js_data.FishType2CoinType(fishType), curX, curY);
		}
		
		if(lifeTime > fd.growTime)
		{
			if(fishType < FishType.King)
			{
				Grow(fishType + 1);
			}
		}		
	}
}

function SummonCoinNextFrame()
{
	if(fishType > FishType.Small)
		--lastCoin;
}

function OnHungry()
{
	if(fishType <= FishType.King)
	{
			if(targetFood < 0)
				FindFood();
			if(targetFood >= 0)
			{
				if(jsStage.foods_pos[targetFood].z > 1)
				{
					var disX : float = jsStage.foods_pos[targetFood].x - curX;
					var disY : float = jsStage.foods_pos[targetFood].y - curY;
					if( ((dir == 0 && disX > -30 && disX < 20) || (dir == 1 && disX < 30 && disX > -20)) && disY > -20 && disY < 40)
					{
						audio.clip = sndEat;
						if(js_opt.soundOn)audio.Play();
						//print("eat");
						curState = FishState.Eat;//eat
						curFrame = 0;
						frameTime = 0;
						var jsFood : js_food = jsStage.foods[targetFood].GetComponent("js_food");
						feed_time -= jsStage.foodEnery[jsFood.foodType];
						jsStage.RemoveFood(targetFood, 0.3);
						targetFood = -1;
					}
					else
					{
						//SetTargetToFood();
					}
				}
				else
				{
					FindFood();
				}
			}
	}
	else if(fishType == FishType.Black)
	{
		CheckEatFish(FishType.Small);
	}
	else if(fishType == FishType.White)
	{
		CheckEatFish(FishType.Black);
	}

}

function CheckEatFish(ft : int)
{
		if(targetFish == null)
		{
			FindFoodFish(ft);
		}
		if(TargetFishValid())
		{
			var disBase : float = 30;
			if(ft == FishType.White)disBase = 50;
			
			var disX : float = targetFish.curX - curX;
			var disY : float = targetFish.curY - curY;
			if(targetFish.fishType == ft
			 && disY > -disBase && disY < disBase + 20 &&
			((dir == 0 && disX > -(disBase + 20) && disX < disBase) || (dir == 1 && disX < disBase+20 && disX > -disBase))
			)
			{
				if(js_opt.soundOn)
				{
					audio.clip = sndEatFish;
					audio.Play();
				}
				
				curState = FishState.Eat;
				curFrame = 0;
				frameTime = 0;
				
				targetFish.RemoveFromArray();
				Destroy(targetFish.gameObject,0.3);
				
				feed_time -= 15;
				targetFish = null;
				
			}
		}
		else
		{
			FindFoodFish(ft);
		}
}

function TargetFishValid() : boolean
{
	if(targetFish == null)return false;
	
	var ft : int = FishType.Small;
	if(fishType == FishType.White)ft = FishType.Black;
	for( var i : int = 0; i < fishes[ft].length; ++i)
	{
		if(targetFish == fishes[ft][i])
		{
			return true;
		}
	}
	return false;
}
function FindFoodFish( ft : int)
{
	targetFish = null;
	for( var i : int = 0; i < fishes[ft].length; ++i)
	{
		var js : js_fish = fishes[ft][i];
		
		if(targetFish == null)
		{
			targetFish = js;
		}
		else
		{
			if(Mathf.Abs(targetFish.curX - curX) > Mathf.Abs(js.curX - curX))
				targetFish = js;
		}
	}
	if(targetFish)
		SetTarget(targetFish.curX, targetFish.curY);
}

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;
	
	DoMove();
	
	frameTime += Time.deltaTime;
	if(frameTime >= 1.0 / fps)
	{
		FishAI(frameTime);
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
			}			
		}
		
		if(feed_time > fd.findFoodTime && curState < FishState.Eat)
		{
			OnHungry();
			if(js_pet.FindPetByType(4) && guiText)
				guiText.enabled = true;

		}
		else
		{
			if(guiText)guiText.enabled = false;
		}
	}
	

	
	SetAniByState();
}

function DoMove()
{
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
			if(targetFood >= 0 && fishType <= FishType.King)
			{
				if(jsStage.foods_pos[targetFood].z > 1)
				{
					SetTargetToFood();
				}
			}
			else if( fishType == FishType.Black || fishType == FishType.White)
			{
				if(TargetFishValid())
				{
					SetTarget(targetFish.curX, targetFish.curY);
				}
			}
		}
	}
	else if(curState == FishState.Die)
	{
		curY -= Time.deltaTime * speedY * 0.8;
		if(curY < js_stage.tankBottom)curY = js_stage.tankBottom;
	}
	else if(curState == FishState.Summon)
	{
		//curFrame = 0;
		var rateA : float = 1.0;
		if(curY > js_stage.tankTop) rateA *= (1 + (Screen.height - curY)/200);
		else rateA *= (1 - (Screen.height - curY) / 180);
		if(rateA < 0.1) rateA = 0.1;
		if(curY > targetY)
		{
			curY -= Time.deltaTime * speedY * 10 * rateA;
		}
		if(curY <= targetY)
		{
			curY = targetY;
			targetX = curX;
			ChangeToSwimState();
		}

	}
}

var idleTime : float = 0;
var nextInterval : float = 0.5;
function FishAI( dt : float)
{
		if( fishType <= FishType.King && js_alien.aliens.length > 0)
		{
			var jsPet : js_pet = js_pet.FindPetByType(5);//灯泡鱼
			if(jsPet)
			{
				if(curState == FishState.Swim && targetFood < 0)
				{
					SetTarget(jsPet.curX, jsPet.curY);
					return;
				}
			}
		}

	idleTime += dt;
	if(idleTime >= nextInterval)
	{
		idleTime = 0;
		nextInterval = Random.Range(1, 6);
		if(curState == FishState.Swim && (targetFood < 0 && targetFish == null))
		{
			SetTarget(RandomTargetX(), RandomTargetY());
		}
	}
}
function SetTarget( x : int, y : int)
{
	targetX = x;
	targetY = y;
	if(targetY < js_stage.tankBottom + guiTexture.pixelInset.height/4)targetY = js_stage.tankBottom + guiTexture.pixelInset.height/4;
	if(targetY > js_stage.tankTop) targetY = js_stage.tankTop - guiTexture.pixelInset.height/2;
	if(targetX < guiTexture.pixelInset.width / 2)targetX = guiTexture.pixelInset.width/2;
	if(targetX > Screen.width - guiTexture.pixelInset.width/2)targetX = Screen.width - guiTexture.pixelInset.width/2;
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

function ChangeToSwimState()
{
	curState = FishState.Swim;
	fps = 15;
	dir = 0;
	if(targetX > curX )dir = 1;
}

function FindFood()
{
	targetFood = -1;
	var disMin : float = 2 * Screen.width * Screen.height;
	var dis : float;
	for( var i : int = 0; i < jsStage.foods_pos.length; i++)
	{
		if(jsStage.foods_pos[i].z > 1)
		{
		dis = (jsStage.foods_pos[i].x - curX)*(jsStage.foods_pos[i].x - curX) + (jsStage.foods_pos[i].y - curY)*(jsStage.foods_pos[i].y - curY);
		if(dis < disMin)
		{
			disMin = dis;
			targetFood = i;
		}
		}
	}
	
	if(targetFood >= 0)SetTargetToFood();
}

function GetTimeY(ty : float, cy : float) : float
{
	var dY : float = Mathf.Abs(ty - cy);
	if(cy > ty)
		return dY / (speedY - jsStage.foodSpeed);
	else
		return dY / (speedY + jsStage.foodSpeed);
}

function SetTargetToFood()
{
	if(targetFood >= 0)
	{
		var swimTime : float = 0;
		var foodX : float = jsStage.foods_pos[targetFood].x;
		var foodY : float = jsStage.foods_pos[targetFood].y;
		var foodDir : int = 0;
		if(jsStage.foods_pos[targetFood].x  > curX) foodDir = 1;
		if(dir != foodDir)
		{
			var turnTime : float = 0.5;
			swimTime += turnTime;
			foodY -= turnTime * jsStage.foodSpeed;
		}

		
		//print("food found.");
		var tX : float = Mathf.Abs(jsStage.foods_pos[targetFood].x - curX) / speedX;
		var tY : float = 0;
		if( foodY - tX * jsStage.foodSpeed  >= curY)
		{
			tY = GetTimeY(foodY - tX * jsStage.foodSpeed, curY);
		}
		else
		{
			tY = GetTimeY(foodY, curY);
		}
		
		swimTime += tX > tY ? tX : tY;
		swimTime *= 1.2;
		if(foodX > curX+10)foodX -= 10;
		else if(foodX < curX-10) foodX += 10;
		//print ("swim time" + swimTime + ", Target: " + jsStage.foods_pos[targetFood].x+"," + (jsStage.foods_pos[targetFood].y - swimTime * jsStage.foodSpeed));
		SetTarget(foodX, foodY - swimTime * jsStage.foodSpeed);
	}
}