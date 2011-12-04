
var frameImage : int[];
var tga : Texture2D[];
var frontImage : GUITexture;
var backImage : GUITexture;
var timePreFrame : float = 0.66;

function Start(){
	var images = gameObject.GetComponentsInChildren(GUITexture);
	for( var im : GUITexture in images)
	{
		//print("find children");
		if(im.gameObject.name == "btnFront")
		{
			//print("frontImage");
			frontImage = im;
		}
		else if(im.gameObject.name == "btnBg")
		{
			//print("bgImage");
			backImage = im;
		}
	}
}

function PlayAni( aniMode : int,  btn : GameObject )
{
	switch(aniMode)
	{
	case 0: //open
	frameImage = new int[4];
	frameImage[0] = 0;
	frameImage[1] = 1;
	frameImage[2] = 2;
	frameImage[3] = 3;
	break;
	case 1: //close 
	frameImage = new int[4];
	frameImage[0] = 3;
	frameImage[1] = 2;
	frameImage[2] = 1;
	frameImage[3] = 0;
	break;
	case 2: //close -> open 
		frameImage = new int[7];
	frameImage[0] = 3;
	frameImage[1] = 2;
	frameImage[2] = 1;
	frameImage[3] = 0;
	frameImage[4] = 1;
	frameImage[5] = 2;
	frameImage[6] = 3;
		
	break;
	}
	js_common.GetChildGUITexture(gameObject, "btnBg").texture = js_common.GetChildGUITexture(btn, "btnBg").texture;
	guiTexture.texture = btn.guiTexture.texture;
	js_common.GetChildGUITexture(gameObject, "btnFront").texture = tga[frameImage[0]];
	timePreFrame = 0.3 / frameImage.length;
}


var frameTime : float = 0;
var curFrame : int = 0;
function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	frameTime += Time.deltaTime;
	if(frameTime > timePreFrame)
	{
		frameTime = 0;
		curFrame++;
		if(curFrame >= frameImage.length)
		{
			Destroy(gameObject);
		}
		else
		{
			frontImage.texture = tga[frameImage[curFrame]];
		}
	}
}
