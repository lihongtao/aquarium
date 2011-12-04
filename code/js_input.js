
var jsStage : js_stage;
static var js : js_input;
function Awake()
{
	js = this;
	jsStage = GetComponent("js_stage");
}
function Start(){
	
}

function Update () {
	if(js_stage.jsStage.gameState == GameState.Playing)
	{
		if(Application.platform == RuntimePlatform.IPhonePlayer)
		{
			for(var i : int = 0; i < Input.touchCount; ++i)
			{
				if(Input.GetTouch(i).phase == TouchPhase.Began)
				{
					TapAt(Input.GetTouch(i).position);
				}
			}
		}
		else if(Input.GetMouseButtonUp(0))
		{
			TapAt(Input.mousePosition);
		}
	}
}

function TapAt(pos : Vector2)
{
	var btnIdx : int = js_menuBar.PtInMenuBtn(pos);
	if(btnIdx >= 0)
	{
		MenuBarClick(btnIdx);
	}
		
	//if(pos.y < jsStage.tankTop)
	if(pos.y < Screen.height - 80)
	{
		TankClick(pos.x, pos.y);
	}

	//jsStage.SummonCoin(Random.Range(0, 5.99), pos.x, pos.y);
}

var sndSummon : AudioClip;
var fishA : GameObject;
var fishPosZ : int = 10;
function SummonFish(ft : int)
{
	var x : int = Random.Range(0.1,0.9) * Screen.width;
	var y : int = js_stage.tankBottom + Random.Range(0.1, 0.5) * Screen.height;
	
	fishPosZ += 0.01;
	var fish : GameObject = Instantiate(fishA, Vector3(0,0, fishPosZ), transform.rotation);
	var jsFish : js_fish = fish.GetComponent("js_fish");
	jsFish.InitFish(jsStage, ft, x, y);
}

function MenuBarClick( btn : int)
{
	switch(btn)
	{
	case 0:
	if(js_stage.jsStage.ClickBtn(btn))
	{
		SummonFish(FishType.Small);
		js_menuBar.PlayBtnClickEffect(btn);
	}
	break;
	case 1:
		if(jsStage.FoodTypeUp())
		{
			js_menuBar.PlayBtnClickEffect(btn);
		}
	break;
	case 2:
		if(jsStage.FoodMaxUp())
		{
			js_menuBar.PlayBtnClickEffect(btn);
		}
	break;
	case 3:
		if(jsStage.UpgradeAutoFeeder())
		{
			js_menuBar.PlayBtnClickEffect(btn);
		}
	break;
	case 4:
		if(jsStage.ClickBtn(btn))
		{
			SummonFish(FishType.Black);
			js_menuBar.PlayBtnClickEffect(btn);
		}
	break;
	case 5:
		if(jsStage.ClickBtn(btn))
		{
			SummonFish(FishType.White);
			js_menuBar.PlayBtnClickEffect(btn);
		}
	break;
	case 6: //gun
		if(Application.isEditor)js_autoGun.js.SummonMissile(1);
		if(jsStage.GunLevelUp())
		{
			js_menuBar.PlayBtnClickEffect(btn);
		}
	break;
	case 7: //auto gun
		if(jsStage.UpgradeAutoGun())
		{
			js_menuBar.PlayBtnClickEffect(btn);
		}
	break;
	case 8:
		if(jsStage.AddEggPieces())
		{
			js_menuBar.PlayBtnClickEffect(btn);
		}
	break;
	case 9: //mainMenu
		if(jsStage.gameState == GameState.Playing)
		{
			jsStage.gameState = GameState.Paused;
		}
	break;
	}
}


var seAttack_prefab : GameObject;
function TankClick( x : int, y : int)
{
	if(js_stage.PickCoin(x,y, 64))
	{
		
	}
	else if(js_pet.ClickAtPet(x,y))
	{
	}
	else if(y > jsStage.tankBottom)
	{
/*		if(js_alien.aliens.length > 0)
		{
			if(js_alien.AttackAlien(x,y))
			{
				Instantiate(seAttack_prefab, Vector3( 1.0 * x / Screen.width, 1.0 * y /Screen.height, 10009), transform.rotation);
				//play effect
			}
		}
		else
		{
			//jsStage.SummonFood(x,y);
		}
*/
	}
}

function OnGUI()
{
	if(jsStage.gameState == GameState.Paused)
	{
		GUI.Box(Rect(0,0,Screen.width, Screen.height), "\n\n\n\n\n\n\n tap to continue ......");
		if(GUI.Button(Rect(Screen.width / 2 - 100, Screen.height /2 - 50, 200, 100), "continue" ))
		{
			jsStage.gameState = GameState.Playing;
		}
	}
}
