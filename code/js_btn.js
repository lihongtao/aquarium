var curState : int = 0;
var tgaAni : Texture2D[];
var tgaBg : Texture2D[];
var tgaFront : Texture2D[];

var stateTime : float = 0;
enum BtnState{Disabled, Enableing, Enabled, ClickEffect, Disableing};

var frontImage : GUITexture;
var backImage : GUITexture;

var btnIdx : int = 0;
var btnSeek : int[];


function Start(){
	curState = BtnState.Disabled;
	var images = gameObject.GetComponentsInChildren(GUITexture);
	for( var im : GUITexture in images)
	{
		//print("find children");
		if(im.gameObject.name == "btnFront")
		{
			//print("frontImage");
			frontImage = im;
		}
		else if(im.gameObject.name == "btnBg")
		{
			//print("bgImage");
			backImage = im;
		}
	}
	
	frontImage.texture = tgaFront[0];
	backImage.texture = tgaBg[0];
	
	var btnL : float = Screen.width * 0.5 - 320;
	
	transform.position.x = (btnL + btnSeek[btnIdx]) / Screen.width;
	var str : String = js_stage.jsStage.btnPrice[btnIdx].ToString();
	//print(str);
	gameObject.guiText.text = str;//js_stage.btnPrice[btnIdx].ToString();
}

function ClickBtn()
{
	if(curState == BtnState.Enabled)
	{
		curState = BtnState.ClickEffect;
		stateTime = 0;
	}
}
function EnableBtn( bEnabled : boolean)
{
	if(bEnabled)
	{
		if(curState == BtnState.Disabled)
		{
			curState = BtnState.Enableing;
			stateTime = 0;
		}
	}
	else
	{
		if(curState != BtnState.Disabled)
		{
			curState = BtnState.Disableing;
			stateTime = 0;
		}
	}
}
var xxx : int = 0;
var btnEnableTime : float[];
var btnTime : float = 0;
var frameTime : float = 0.1;
function Update () {
	if(btnTime < btnEnableTime[btnIdx])
	{
		btnTime += Time.deltaTime;
		if(btnTime > btnEnableTime[btnIdx])
			EnableBtn(true);
	}
	
	stateTime += Time.deltaTime;

	switch(curState)
	{
	case BtnState.Disabled:
		frontImage.enabled = true;
		frontImage.texture = tgaFront[0];
	break;
	
	case BtnState.Enableing:
	if(stateTime > 4 * frameTime)
	{
		frontImage.enabled = false;
		curState = BtnState.Enabled;
		stateTime = 0;
	}
	else if(stateTime > 3 * frameTime)
	{
		frontImage.enabled = true;
		frontImage.texture = tgaFront[3];
	}
	else if(stateTime > 2 * frameTime)
	{
		frontImage.enabled = true;
		frontImage.texture = tgaFront[2];
	}
	else if(stateTime > 1 * frameTime)
	{
		frontImage.enabled = true;
		frontImage.texture = tgaFront[1];
	}
	break;

	case BtnState.Disableing:
	if(stateTime > 4 * frameTime)
	{
		frontImage.enabled = true;
		frontImage.texture = tgaFront[0];
		curState = BtnState.Disabled;
		stateTime = 0;
	}
	else if(stateTime > 3 * frameTime)
	{
		frontImage.enabled = true;
		frontImage.texture = tgaFront[1];
	}
	else if(stateTime > 2 * frameTime)
	{
		frontImage.enabled = true;
		frontImage.texture = tgaFront[2];
	}
	else if(stateTime > 1 * frameTime)
	{
		frontImage.enabled = true;
		frontImage.texture = tgaFront[3];
	}
	break;

	case BtnState.Enabled:
	if(btnIdx == 0)
	{
		guiTexture.texture = tgaAni[(stateTime / frameTime) % tgaAni.length];
	}
	else if(btnIdx == 1 )
	{
		guiTexture.texture = tgaAni[js_stage.jsStage.foodType];
	}
	else if(btnIdx == 2)
	{
		guiTexture.texture = tgaAni[js_stage.jsStage.foodMax];
	}
	break;
	
	case BtnState.ClickEffect:
	if(stateTime > 3 * frameTime)
	{
		curState = BtnState.Enabled;
		stateTime = 0;
		backImage.texture = tgaBg[0];
	}
	else if(stateTime > 1.5 * frameTime)
	{
		backImage.texture = tgaBg[2];
	}
	else
		backImage.texture = tgaBg[1];
	break;
	}
	
	if(Input.GetMouseButtonUp(0))
	{
		if(Mathf.Abs(transform.position.x * Screen.width - Input.mousePosition.x) < 30 && Input.mousePosition.y > Screen.height - 30)
			ClickBtn();
	}
}
