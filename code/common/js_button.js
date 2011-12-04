enum ButtonState{ Normal, Down, Disabled};

var btnFrame : Texture2D[];
var btnSnd : AudioClip;
private var rc : Rect;
var curState : ButtonState = ButtonState.Normal;
var goName : String = "goBtnEventHandler";
var msg : String = "";

function SetBtnImage( i : int, img : String)
{
	if(btnFrame == null || btnFrame.length == 0)btnFrame = new Texture2D[3];
	
	btnFrame[i] = Resources.Load(img, Texture2D);
}
function Start()
{
	rc = js_common.GetTextureRect(gameObject);
	if(btnFrame.length > 0)guiTexture.texture = btnFrame[curState];
}

function ChangeState( newFrame : int)
{
	if(curState != newFrame)
	{
		curState = newFrame;
		guiTexture.texture = btnFrame[curState];
	}
}
function Update () {
	if(curState != ButtonState.Disabled)
	{
		if(Input.GetMouseButton(0) && rc.Contains(Input.mousePosition))
		{
			ChangeState(ButtonState.Down);
		}
		else
		{
			ChangeState(ButtonState.Normal);
		}
		
		if(Input.GetMouseButtonUp(0) && rc.Contains(Input.mousePosition))
		{
			js_inputHandler.WantInput(gameObject, "OnButtonClick");
		}
	}
}

function OnButtonClick()
{
	if(btnSnd)js_sndPlayer.SummonSound(btnSnd);
	
	if(goName.length > 0 && msg.length > 0)
	{
		var go : GameObject = GameObject.Find(goName);
		if(go)go.SendMessage(msg);
	}	
}