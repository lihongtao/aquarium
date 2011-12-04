
var timePreFrame : float = 0.1;
var fileName : String;
var frameCnt : int = 0;
var curFrame : int = 0;
var frameStay : int = -1;
function PlayAni( fileNamePrefix : String, frames : int, fps : float, frameStayAt : int)
{
	timePreFrame = 1.0 / fps;
	fileName = fileNamePrefix;
	curFrame = 0;
	frameCnt = frames;
	frameStay = frameStayAt;
	guiTexture.texture = Resources.Load(GetFrameFileName(curFrame), Texture2D);
	guiTexture.enabled = true;
}
function GetFrameFileName( frame : int ) : String
{
	if(frameCnt > 10)
	{
		if(frame < 10)
			return fileName + "0" + frame.ToString();
	}
	return fileName + frame.ToString();
}

var frameTime : float = 0;
function Update () {
	frameTime += Time.deltaTime;
	if(frameTime > timePreFrame){
		frameTime -= timePreFrame;
		curFrame ++;
		if(curFrame >= frameCnt)
		{
			if(frameStay < 0 || frameStay >= frameCnt)
			{
				guiTexture.enabled = false;
			}
			else
			{
				guiTexture.texture = Resources.Load(GetFrameFileName(frameStay), Texture2D);
			}
			Destroy(this);
			Resources.UnloadUnusedAssets();
		}
		else
			guiTexture.texture = Resources.Load(GetFrameFileName(curFrame), Texture2D);
	}
}