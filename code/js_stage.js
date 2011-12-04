var foodType : int = 0;
var foodMax : int = 9;
var btnPrice : int[];

static var tankBottom : int = 70;
static var tankTop : int = 400;
static var foodEnery : float[]; //Ã¿ÖÖÊ³ÎïÄÜÎ¬³ÖµÄÊ±¼ä
static var foodSpeed : float = 30;
static var coinSpeed : float = 30;
static var coinPickTime : float = 0.5;
static var coinPos : Vector2;
static var coinPrice : int[];
enum CoinType { Silver, Gold, Star, Diamond, Box, Bug};

var curMoney : int = 0;
var gunLevel : int = 0;
var fishCnt : int = 0;
var eggPieces : int = 0;
var stageLevel : int = 0;
var autoFeederSpeed : int = 0;
var autoGunLevel : int = 0;

var gameState : int = 0;
enum GameState{ Playing, Paused, Win, Lose };

var fishHungrySignFont : Font;

static var jsStage : js_stage;
function Awake()
{
	if(js_global.obj == null)
	{
		Application.LoadLevel(GameScene.Loading);
		//return;
	}
	
	jsStage = this;
	
	fishCnt = 0;
	eggPieces = 0;
	
	js_common.StretchBgToScreenByName();
	
	autoFeederSpeed = 0;
	autoGunLevel = 0;
	gunLevel = 0;
	alienCnt = 0;
	foodType = 0;
	foodMax = 9;
	foods_cnt = 0;
	tankBottom = 40 * Screen.height / 480;
	tankTop =  Screen.height * 0.8; 
	
	//tankTop = (480 - 80) * Screen.height / 480;

	foodSpeed = Screen.height / 16.0;
	
	coinSpeed = Screen.height / 12.0;
	coinPos = Vector2(Screen.width * 0.5 + 250, Screen.height - 70);
	coinPickTime = 0.5;
	coinPrice = new int[6];
	coinPrice[0] = 15;
	coinPrice[1] = 35;
	coinPrice[2] = 40;
	coinPrice[3] = 200;
	coinPrice[4] = 2000;
	coinPrice[5] = 100;
	
	curMoney = 100;
	if(Application.isEditor)curMoney = 99999;
	btnPrice = new int[Constant.BtnMax];
	for(var i : int = 0; i < Constant.BtnMax; ++i)
	{
		btnPrice[i] = js_data.GetBtnPrice(js_save.curMode, js_save.curIdx, i);
	}
	

	foodEnery = new float[3];
	foodEnery[0] = 15;
	foodEnery[1] = 20;
	foodEnery[2] = 30;

	coins = new GameObject[50];
	coins_pos = new Vector3[50];
	
	InvokeRepeating("CheckOver", 0.5, 0.5);
}

function FoodTypeUp()
{
	if(curMoney >= btnPrice[1] && foodType < 2)
	{
		foodType ++;
		curMoney -= btnPrice[1];
		return true;
	}
	return false;
}
function FoodMaxUp() : boolean
{
	if(curMoney >= btnPrice[2] && foodMax < 9)
	{
		foodMax ++;
		curMoney -= btnPrice[2];
		return true;
	}
	return false;
}
function GunLevelUp() : boolean 
{
	if(curMoney >= btnPrice[6] && gunLevel < 9)
	{
		gunLevel++;
		curMoney -= btnPrice[6];
		return true;
	}
	return false;
}

function UpgradeAutoFeeder() : boolean
{
	if(curMoney >= btnPrice[3] && autoFeederSpeed < 3)
	{
		autoFeederSpeed++;
		curMoney -= btnPrice[3];
		if(autoFeederSpeed == 1)
		{
			//js_autoFeeder.js.ShowFeeder();
		}
		return true;
	}
	return false;
}

function UpgradeAutoGun()
{
	if(curMoney >= btnPrice[7] && autoGunLevel < 3)
	{
		autoGunLevel++;
		curMoney -= btnPrice[7];
		if(autoGunLevel == 1)
		{
			js_autoGun.js.ShowMissile();
		}
		return true;
	}
	return false;
}

function AddEggPieces() : boolean
{
	if(curMoney >= btnPrice[8] && eggPieces < 3)
	{
		eggPieces++;
		curMoney -= btnPrice[8];
		if(eggPieces >= 3)
		{
			gameState = GameState.Win;
		}
		return true;
	}
	return false;
}

function AddMoney(v : int) : int
{
	curMoney += v;
	if(curMoney < 0)curMoney = 0;
	return curMoney;
}

function ClickBtn( btn : int) : boolean
{
	if(curMoney >= btnPrice[btn])
	{
		AddMoney(-btnPrice[btn]);
		return true;
	}
	
	return false;
}

var foods_prefab : GameObject;
var foods_pos : Vector3[];
var foods_cnt : int = 0;
var foods : GameObject[];
function SummonFood(x : int, y : int) : boolean
{
	return SummonFood(x,y,0);
}
function SummonFood(x : int, y : int, vX : float) : boolean
{
	if(foods_cnt < foodMax && curMoney >= 5)
	{
		curMoney -= 5;
		for(var i : int = 0; i < foods_pos.length; i++)
		{
			if(foods_pos[i].z  < 1)
			{
				var food : GameObject = Instantiate(foods_prefab, Vector3(0,0, 10), transform.rotation);
				foods[i] = food;
				foods_pos[i].x = x;
				foods_pos[i].y = y;
				foods_pos[i].z = 10;
				var jsFood : js_food = food.GetComponent("js_food");
				jsFood.InitFood(this, i, foodType, x,y);
				jsFood.vX = vX;
				foods_cnt ++;
				return true;
			}
		}
	}
	
	return false;
}
function RemoveFood(idx : int, delayTime : float )
{
	if(foods_pos[idx].z > 1)
	{
	foods_pos[idx].z = 0;
	Destroy(foods[idx], delayTime);
	foods_cnt --;
	}
}

var coin_prefab : GameObject;
static var coins : GameObject[];
static var coins_pos : Vector3[];
var coins_cnt : int = 0;
function SummonCoin(coinType : int, x : int, y : int ) : js_coin
{
	if(coins_cnt >= coins_pos.length)return null;
	for( var i : int = 0; i < coins_pos.length; i++)
	if( coins_pos[i].z < 1)
	{
		var coin : GameObject = Instantiate(coin_prefab, Vector3(0,0,1000), transform.rotation);
		coins[i] = coin;
		coins_pos[i].x = x;
		coins_pos[i].y = y;
		coins_pos[i].z = 1000;
		var jsCoin : js_coin = coin.GetComponent("js_coin");
		jsCoin.InitCoin(this, i, coinType, x, y);
		coins_cnt ++;
		return jsCoin;
	}
	return null;
}
function RemoveCoin(idx : int)
{
	if(coins_pos[idx].z > 1)
	{
	coins_pos[idx].z = 0;
	Destroy(coins[idx]);
	coins_cnt -= 1;
	}
}

static function PickCoin(x : int, y : int, pickRange : int) : boolean
{
	if(jsStage.coins_cnt > 0)
	{
		for( var i : int = 0; i < jsStage.coins_pos.length; i++)
		{
			if(jsStage.coins_pos[i].z > 1)
			{
				if(Mathf.Abs(x - jsStage.coins_pos[i].x) < pickRange && Mathf.Abs(y - jsStage.coins_pos[i].y) < pickRange)
				{
					var jsCoin : js_coin = jsStage.coins[i].GetComponent("js_coin");
					jsCoin.PickCoin();
					return true;
				}
			}
		}
	}
	return false;
}

function OnGUI(){
	
	if(gameState == GameState.Win)
	{
		GUI.Box(Rect(0,0,Screen.width, Screen.height), "\n\n\n\n\n\n\nYou win a pet egg !   :)");
		if(GUI.Button(Rect(Screen.width / 2 - 100, Screen.height / 2 - 100, 200, 100), "You Win !"))
		{
			js_save.StageClear();
			Application.LoadLevel(GameScene.MainMenu);
		}
		
	}
	else if(gameState == GameState.Lose)
	{
		GUI.Box(Rect(0,0,Screen.width, Screen.height), "\n\n\n\n\n\n\nAll your fishes are gone!   :(");
		if(GUI.Button(Rect(Screen.width / 2 - 100, Screen.height / 2 - 100, 200, 100), "Back"))
		{
			Application.LoadLevel(GameScene.MainMenu);
		}
	}
}
function CheckOver()
{
	if(gameState == GameState.Playing && fishCnt <= 0 && curMoney < btnPrice[0])
	{
		gameState = GameState.Lose;
	}
}
