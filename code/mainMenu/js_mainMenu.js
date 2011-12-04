
var eye : GameObject;
var mouth : GameObject;
var tail : GameObject;
var rateWidth : float = 1;
var rateHeight : float = 1;


var btn0 : GameObject;
var btn1 : GameObject;
var rect0 : Rect;
var rect1 : Rect;

function ResetSize( go : GameObject )
{
	go.guiTexture.pixelInset.x *= rateWidth;
	go.guiTexture.pixelInset.y *= rateHeight;
	go.guiTexture.pixelInset.width *= rateWidth;
	go.guiTexture.pixelInset.height *= rateHeight;
}
function Start(){
	if(js_global.obj == null)Application.LoadLevel(GameScene.Loading);
	
	rateWidth = Screen.width / 640.0;
	rateHeight = Screen.height / 480.0;
	
	var bg : GameObject = GameObject.Find("bg");
	bg.transform.position.x = 0;
	bg.transform.position.y = 0;
	bg.guiTexture.texture = Resources.Load("0/selectorback", Texture2D);
	bg.guiTexture.pixelInset.x = 0;
	bg.guiTexture.pixelInset.y = 0;
	bg.guiTexture.pixelInset.width = Screen.width;
	bg.guiTexture.pixelInset.height = Screen.height;
	
	eye = GameObject.Find("eye");
	mouth = GameObject.Find("mouth");
	tail = GameObject.Find("tail");
	ResetSize(eye);
	ResetSize(mouth);
	ResetSize(tail);
	btn0 = GameObject.Find("btn0");
	ResetSize(btn0);
	rect0 = js_common.GetTextureRect(btn0);
	
	btn1 = GameObject.Find("btn1");
	ResetSize(btn1);
	rect1 = js_common.GetTextureRect(btn1);
	
}

var timeElasped : float = 0;
var delayTime : float = 0;
var targetLevel : int = -1;
function Update () {
	timeElasped += Time.deltaTime;
	if(timeElasped > 2.0)
	{
		timeElasped = 0;
		var rnd : int = Random.Range(0,30);
		if( rnd < 10 )
		{
			var jsEye : js_aniPlayer = eye.AddComponent(js_aniPlayer);
			jsEye.PlayAni("0/merylblink000", 3, 6, -1);
		}
		else if(rnd < 20)
		{
			var jsMouth : js_aniPlayer = mouth.AddComponent(js_aniPlayer);
			jsMouth.PlayAni("0/meryllipps000", 3, 6, -1);
		}
		else if(rnd < 30)
		{
			var jsTail : js_aniPlayer = tail.AddComponent(js_aniPlayer);
			jsTail.PlayAni("0/tailflop000", 8, 8, 0);
		}
	}
	
	if(targetLevel >= 0)
	{
		delayTime -= Time.deltaTime;
		if(delayTime < 0)
		{
			Application.LoadLevel(targetLevel);
			return;
		}
	}
	
	if(Input.GetMouseButtonDown(0))
	{
		if(rect0.Contains(Input.mousePosition))
		{
			var jsBtn0 : js_aniPlayer = btn0.AddComponent(js_aniPlayer);
			jsBtn0.PlayAni("0/btn0", 2, 10, -1);
			
			targetLevel = GameScene.Tank;
			delayTime = 0.21;
		}
		else if(rect1.Contains(Input.mousePosition))
		{
			var jsBtn1 : js_aniPlayer = btn1.AddComponent(js_aniPlayer);
			jsBtn1.PlayAni("0/btn1", 2, 10, -1);
			targetLevel = GameScene.PetLib;
			delayTime = 0.21;
			
		}
	}
}