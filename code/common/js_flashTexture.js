var flashTime : float = 0;
var flashFps : float = 20;
var flashTarget : int = 0; //0 - show, 1 - hide, 2-destroy

function Flash(t : float, targetMode : int)
{
	flashTime = t;
	flashTarget = targetMode;
}

function Update () {
	flashTime -= Time.deltaTime;
	if(flashTime > 0)
	{
		var frame : int = flashTime * flashFps;
		var bVis : boolean = frame % 2 == 0;
		if(guiTexture)guiTexture.enabled = bVis;
		if(guiText)guiText.enabled = bVis;
	}
	else
	{
		if(flashTarget == 0)
		{
			if(guiTexture)guiTexture.enabled = true;
			if(guiText)guiText.enabled = true;
			Destroy(this);
		}
		else if(flashTarget == 1)
		{
			if(guiTexture)guiTexture.enabled = false;
			if(guiText)guiText.enabled = false;
			Destroy(this);
		}
		else if(flashTarget == 2)
		{
			Destroy(gameObject);
		}
	}
}

//flash texture 
static function FlashGameObject( go : GameObject, t : float, targetMode : int)
{
	var js : js_flashTexture = go.AddComponent("js_flashTexture");
	js.Flash(t, targetMode);
	
}
static function FlashGameObjectByName( goName : String, t : float, targetMode : int)
{
	var go : GameObject = GameObject.Find(goName);
	if(go)
	{
		FlashGameObject(go, t, targetMode);
	}
}

