
static var btnSeek : int[];
static var btnEnableTime : float[];
static var btnMenuRect : Rect;
static var btnL : float = -320;
static var jsMenuBar : js_menuBar;
var btnArray : GameObject[];
function Start(){
	jsMenuBar = this;
	btnSeek = new int[Constant.BtnMax];
	btnSeek[0] = 47;
	btnSeek[1] = 116;
	btnSeek[2] = 173;
	btnSeek[3] = 246;
	btnSeek[4] = 319;
	btnSeek[5] = 390;// 0.574 = (-392 + x)/960; x = 0.574 * 960 + 392
	btnSeek[6] = 463;
	btnSeek[7] = 536;
	btnSeek[8] = 609;
	btnEnableTime  = new float[Constant.BtnMax];
	btnEnableTime[0] = 3.0;
	btnEnableTime[1] = 3.0;
	btnEnableTime[2] = 3.0;
	btnEnableTime[3] = 3.0;
	btnEnableTime[4] = 3.0;
	btnEnableTime[5] = 15;
	btnEnableTime[6] = 5;
	btnEnableTime[7] = 5.0;
	btnEnableTime[8] = 60;
	if(Application.isEditor)btnEnableTime[8] = 5;
	
	btnL = guiTexture.pixelInset.x + Screen.width * transform.position.x;
	btnArray = new GameObject[Constant.BtnMax];
	for( var i : int = 0; i < Constant.BtnMax; i++)
	{
		var btn : GameObject = GameObject.Find("menuBtn" + i.ToString());
		if(btn)
		{
			//Debug.Log("i=" + i);
			btn.transform.position.x = (btnL + btnSeek[i]) / Screen.width;
			var str : String = js_stage.jsStage.btnPrice[i].ToString();
			//print(str);
			btn.guiText.text = str;//js_stage.btnPrice[btnIdx].ToString();
			btnArray[i] = btn;
			btn.SetActiveRecursively(false);
			
			RefreshBtnImage(i);
		}
	}
	btnMenuRect = Rect(Screen.width * transform.position.x + guiTexture.pixelInset.x + guiTexture.pixelInset.width - 120, Screen.height - 72, 120, 72);
	Debug.Log(btnMenuRect.ToString());
	
	//InvokeRepeating("UpdateFishCount", 0.5, 0.5);
}

function UpdateFishCount()
{
	guiText.text = js_stage.jsStage.fishCnt.ToString();
	
}

var timeElasped : float = 0;
function Update(){
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	var timeLast : float = timeElasped;
	timeElasped += Time.deltaTime;
	for(var i : int = 0; i < Constant.BtnMax; i++)
	{
		if(timeLast < btnEnableTime[i] && timeElasped >= btnEnableTime[i])
		{
			PlayBtnClick(0, i);
		}
	}
}


static function PtInMenuBtn(ptMouse : Vector2) : int
{
	for( var i : int = 0; i < Constant.BtnMax; i++)
	{
		var pt : Vector2 = Vector2(btnL + btnSeek[i], Screen.height - 26);
		if( Mathf.Abs( pt.x - ptMouse.x) <= 28 && Mathf.Abs(Screen.height - ptMouse.y) <= 70)
		{
			return i;
		}
	}
	
	if(btnMenuRect.Contains(ptMouse))
		return Constant.BtnMax;
		
	return -1;
}

var menuBtnClick_prefab : GameObject;
function PlayBtnClick(effectType : int, btnIdx : int)
{
	var btn : GameObject = btnArray[btnIdx];//GameObject.Find("menuBtn" + btnIdx.ToString());
	if(btn)
	{
		if(effectType == 0)
		{
			btn.SetActiveRecursively(true);
			
			//if(btnIdx == 3)js_autoFeeder.js.ShowFeeder();
		}
		//print("btnfound");
		var ef : GameObject = Instantiate(menuBtnClick_prefab, btn.transform.position, btn.transform.rotation);
		var js : js_menuBtnClick = ef.GetComponent("js_menuBtnClick");
		js.PlayAni(effectType, btn);

		if(effectType == 1)
		{
			btn.SetActiveRecursively(false);
		}

	}
}

function RefreshBtnImage(btnIdx : int)
{
	switch(btnIdx)
	{
		case 0:
		break;
		case 1:
			btnArray[btnIdx].guiTexture.texture = Resources.Load("ui/food/food" + js_stage.jsStage.foodType.ToString(), Texture2D);
			if(js_stage.jsStage.foodType >= 2)
			{
				btnArray[btnIdx].guiText.text = "Max";
			}
		break;
		case 2:
			btnArray[btnIdx].guiTexture.texture = Resources.Load("ui/foodMax/num00" + js_stage.jsStage.foodMax.ToString(), Texture2D);
			if(js_stage.jsStage.foodMax >= 9)btnArray[btnIdx].guiText.text = "Max";
		break;
		case 3: //audo feeder
			btnArray[btnIdx].transform.Find("btnLv").gameObject.guiText.text = js_stage.jsStage.autoFeederSpeed.ToString();
			if(js_stage.jsStage.autoFeederSpeed >= 3)btnArray[btnIdx].guiText.text = "Max";
		break;
		case 4: //black fish
		break;
		case 5: //white fish
		break;
		case 6: //upgrade gun
			btnArray[btnIdx].guiTexture.texture = Resources.Load("ui/gun/lazergunz000" + js_stage.jsStage.gunLevel.ToString(), Texture2D);
			if(js_stage.jsStage.gunLevel >= 9)btnArray[btnIdx].guiText.text = "Max";
		break;
		case 7: //auto gun
			btnArray[btnIdx].transform.Find("btnLv").gameObject.guiText.text = js_stage.jsStage.autoGunLevel.ToString();
			if(js_stage.jsStage.autoGunLevel >= 3)btnArray[btnIdx].guiText.text = "Max";
		break;
		case 8:
			btnArray[btnIdx].guiTexture.texture = Resources.Load("ui/eggpieces/eggpieces000" + js_stage.jsStage.eggPieces.ToString(), Texture2D);
			if(js_stage.jsStage.eggPieces > 2)btnArray[btnIdx].guiText.text = "Win";
		break;
	}

	Resources.UnloadUnusedAssets();

}

static function PlayBtnClickEffect(btnIdx : int)
{
	jsMenuBar.PlayBtnClick(2, btnIdx);
	jsMenuBar.RefreshBtnImage(btnIdx);
}