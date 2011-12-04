
var yInit : float;
var v : float = 400;
var a : float = -10;
var t : float = 0;

function Start(){
	yInit = transform.position.y + guiTexture.pixelInset.y;
	
}
var state : int = 0;

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	if(state == 0)
	{
	t += Time.deltaTime;
	//距离s = v0·t + a·t²/2
	var curY : float = yInit + v * t + 0.5 * a * t * t;
	if(curY < js_stage.tankBottom)
	{
		curY = js_stage.tankBottom;
		state = 1;
		Destroy(gameObject, 1.5);
	}
	if(curY > js_stage.tankTop)curY = js_stage.tankTop;
	guiTexture.pixelInset.y = curY;
	}

}