var pickTime : float = 0;
var pickPos : Vector2;
function Start(){
	pickPos.x = transform.position.x * Screen.width;
	pickPos.y = transform.position.y * Screen.height;
}

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	pickTime += Time.deltaTime;
	if(pickTime > js_stage.coinPickTime)
	{
		js_stage.jsStage.AddMoney(250);
		Destroy(gameObject);
	}
	else
	{
		var curX : float = pickPos.x + pickTime / js_stage.coinPickTime *(js_stage.coinPos.x - pickPos.x);
		var curY : float = pickPos.y + pickTime / js_stage.coinPickTime *(js_stage.coinPos.y - pickPos.y);
		transform.position.x = curX / Screen.width;
		transform.position.y = curY / Screen.height;
	}
}