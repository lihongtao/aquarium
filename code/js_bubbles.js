var frameTime : float = 0;
var tga : Texture2D[];
var fps : float = 15;
var curSize : int = 0;
var sizeTime : float;

function Start(){
	curSize = 3 * Random.value;
}
function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	frameTime += Time.deltaTime;
	if(frameTime * fps > 1.0)
	{
		sizeTime += frameTime;
		if(sizeTime > 0.8)
		{
			sizeTime = 0;
			curSize ++;
			if(curSize >= tga.length)
				curSize --;
			guiTexture.texture = tga[curSize];
		}
		
		frameTime = 0;
	
		guiTexture.pixelInset.x = Random.value * 2;
		guiTexture.pixelInset.y += 1.5 * ( curSize + 3);
		if((guiTexture.pixelInset.y + transform.position.y * Screen.height) / Screen.height >=0.8)
		{
			Destroy(gameObject);
		}
	}
}