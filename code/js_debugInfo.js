var timeGame : float = 0;
var lastSec : int = -1;

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	timeGame += Time.deltaTime;
	
	var minute : int = timeGame / 60;
	var second : int = timeGame;
	second = second % 60;
	if(lastSec != second)
	{
		lastSec = second;
	guiText.text = "Time  " + minute.ToString() + ":";
	if(second < 10)guiText.text += "0";
	guiText.text += second.ToString();
	guiText.text += '\n';
	guiText.text += "Fish  " + js_stage.jsStage.fishCnt.ToString();
	}
}
