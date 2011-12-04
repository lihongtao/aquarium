static var js : js_autoGun;

private var x : float = 0;
private var y : float = 0;
private var rc : Rect;
function Awake()
{
	js = this;
	//guiTexture.enabled = false;	
}

function Start()
{
	yield;
	ShowMissile();
}

function ShowMissile()
{
	transform.position.x = js_menuBar.jsMenuBar.btnArray[7].transform.position.x;
	x = Screen.width * transform.position.x + guiTexture.pixelInset.width / 2;
	y = transform.position.y * Screen.height + guiTexture.pixelInset.y + guiTexture.pixelInset.height * 0.6;
	guiTexture.enabled = true;
	
	rc = Rect(transform.position.x * Screen.width + guiTexture.pixelInset.x, transform.position.y * Screen.height + guiTexture.pixelInset.y, guiTexture.pixelInset.width, guiTexture.pixelInset.height);
}

private var frameTime : float = 0;
private var curState : int = 0;
function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	if(Input.GetMouseButtonDown(0) && rc.Contains(Input.mousePosition))
	{
		frameTime = 1;
		curState = 1;
	}
	if(js_stage.jsStage.autoGunLevel > 0 && js_alien.aliens.length > 0)curState = 1;
	
	if(guiTexture.enabled)
	{
		frameTime += Time.deltaTime;
		if(frameTime >= 0.90)
		{
			frameTime = 0;
			//if(Application.isEditor)frameTime = -99999;
			if(curState == 1)
			{
				curState = 0;
				SummonMissile(js_stage.jsStage.autoGunLevel);
			}
		}
	}
}

var missile_prefab : GameObject;
function SummonMissile( cnt : int)
{
	if(cnt < 1)cnt = 1;
	
	var posX : float = x;
	var posY : float = y;
	for(var i : int = 0; i < cnt; ++i)
	{
		posX -= i * 5;
		posY -= i * 8;
		var mis : GameObject = Instantiate(missile_prefab, Vector3(posX/Screen.width, posY/Screen.height, 1000+i), transform.rotation);
		//yield WaitForSeconds(0.1);
	}
	
}