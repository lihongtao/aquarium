var curFrame : int = 0;
var frameTime : float = 0;
var tga : Texture2D[];
var fps : float = 15;
var loopTimes : int = 0;
function Update () {
	frameTime += Time.deltaTime;
	if(frameTime * fps > 1.0)
	{
		frameTime = 0;
		curFrame++;
		if(curFrame >= tga.length)
		{
			loopTimes --;
			if(loopTimes == 0)
			{
				Destroy(gameObject);
			}
			curFrame = 0;
		}
		guiTexture.texture = tga[curFrame];
	}
}