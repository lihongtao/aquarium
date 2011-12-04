var ani : Texture2D[];
private var curFrame : int = 0;
private var fps : float = 5;
private var frameTime : float = 0;
static var js : js_autoFeeder;

private var x : float = 0;
private var y : float = 0;
private var rc : Rect;
private var curState : int = 0;

function Start()
{
	js = this;
	yield;
	//guiTexture.enabled = false;	
	transform.position.x = js_menuBar.jsMenuBar.btnArray[3].transform.position.x;
	x = Screen.width * transform.position.x;
	y = transform.position.y * Screen.height + guiTexture.pixelInset.y;
	frameTime = 0;
	LoadFeederAni();

	rc = Rect(transform.position.x * Screen.width + guiTexture.pixelInset.x, transform.position.y * Screen.height + guiTexture.pixelInset.y, guiTexture.pixelInset.width, guiTexture.pixelInset.height);

}

function LoadFeederAni()
{
	ani = new Texture2D[20];
	for(var i : int = 0; i < ani.length; ++i)
	{
		var idx : int = 19 - i;
		var str : String = "feeder/feeder_down";
//		if(feederType > 0)str = "feeder/feeder_right00";
		if(idx < 10) str += "0";
		str += idx.ToString();
		//if(feederType == 0)
		str += "00";
		ani[i] = Resources.Load( str, Texture2D);
		//Debug.Log("loaded frame " + i);
		//if(feederType == 0)	
		yield;
	}
}

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	if(js_stage.jsStage.autoFeederSpeed > 0)curState = 1;
	
	if(curState == 1)
	{
		frameTime += Time.deltaTime;
		if(frameTime >= 1.0 / fps)
		{			
			frameTime = 0;
			++curFrame;
			if(curFrame >= ani.length)
			{
				curFrame = 0;
				curState = 0;
				fps = 2 + 5 * Mathf.Pow(2, js_stage.jsStage.autoFeederSpeed - 1);
			}
			//Debug.Log("curFrame " + curFrame);
			guiTexture.texture = ani[curFrame];
			
			if(curFrame == ani.length/2)
			{
				var vX : float = 0;
//				if(feederType == 1)vX = Random.Range(Screen.width/8, Screen.width/4);
				js_stage.jsStage.SummonFood(x,y, vX);
			}
		}
	}
	
	if(Input.GetMouseButton(0) && rc.Contains(Input.mousePosition))
	{
		curState = 1;
		fps = 40;
	}
}
