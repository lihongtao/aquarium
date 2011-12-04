
var btnChecked : boolean = true;
var btnImage : Texture2D[];
var btnSnd : AudioClip;
private var btnRect : Rect;
var goName : String = "goBtnEventHandler";
var stateGet : String;
var stateSet : String;

function Start(){

	if(goName.length > 0 && stateGet.length)
	{
		var go : GameObject = GameObject.Find(goName);
		if(go)
			go.SendMessage(stateGet, gameObject);
	}
	
	guiTexture.texture = btnImage[btnChecked ? 0 : 1];
	btnRect = js_common.GetTextureRect(gameObject);
}
function SetChecked( bChecked : boolean )
{
	btnChecked = bChecked;
}

function CheckButton()
{
	btnChecked = !btnChecked;
	guiTexture.texture = btnImage[btnChecked ? 0 : 1];
	
	if(btnSnd)js_sndPlayer.SummonSound(btnSnd);

	if(goName.length > 0 && stateGet.length)
	{
		var go : GameObject = GameObject.Find(goName);
		if(go)
			go.SendMessage(stateSet, btnChecked);
	}
	
}

function Update(){
	if(Input.GetMouseButton(0) && btnRect.Contains(Input.mousePosition) && guiTexture.enabled)
	{
		guiTexture.texture = btnImage[btnChecked ? 1 : 0];
	}
	else
	{
		guiTexture.texture = btnImage[btnChecked ? 0 : 1];
	}
	
	if(Input.GetMouseButtonUp(0))
	{
		if(btnRect.Contains(Input.mousePosition) && guiTexture.enabled )
		{
			js_inputHandler.WantInput(gameObject, "CheckButton");
		}
	}
}