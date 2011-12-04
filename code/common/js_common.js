


//stretch background texture
static function StretchBgToScreen(go : GameObject)
{
	go.transform.position.x = 0;
	go.transform.position.y = 0;
	go.guiTexture.pixelInset.x = 0;
	go.guiTexture.pixelInset.y = 0;
	go.guiTexture.pixelInset.width = Screen.width;
	go.guiTexture.pixelInset.height = Screen.height;
}

static function StretchBgToScreenByName()
{
	var go : GameObject = GameObject.Find("bg");
	if(go)
		StretchBgToScreen(go);
}

static function EnableAutorotateLandscape()
{
	Screen.autorotateToLandscapeLeft = true;
	Screen.autorotateToLandscapeRight = true;
	Screen.autorotateToPortrait = false;
	Screen.autorotateToPortraitUpsideDown = false;
	iPhoneKeyboard.autorotateToPortrait = false;
	iPhoneKeyboard.autorotateToPortraitUpsideDown = false;
}

static function GetTextureRect(skill : GameObject) : Rect
{
	var rc : Rect;
	rc.x = skill.transform.position.x * Screen.width + (skill.guiTexture.pixelInset.x );
	rc.y = skill.transform.position.y * Screen.height + (skill.guiTexture.pixelInset.y);
	rc.width = skill.guiTexture.pixelInset.width;
	rc.height = skill.guiTexture.pixelInset.height;
	return rc;
}

static function AutorotateLandscape()
{
	if ((Input.deviceOrientation == DeviceOrientation.LandscapeLeft) && (Screen.orientation != ScreenOrientation.LandscapeLeft)){
        Screen.orientation = ScreenOrientation.LandscapeLeft; 
    }             
     if ((Input.deviceOrientation == DeviceOrientation.LandscapeRight) && (Screen.orientation != ScreenOrientation.LandscapeRight)){
         Screen.orientation = ScreenOrientation.LandscapeRight; 
    }
}

static function GetChildGUITexture(go : GameObject, childName : String) : GUITexture
{
	var images = go.GetComponentsInChildren(GUITexture);
	for( var im : GUITexture in images)
	{
		if(im.gameObject.name == childName)
		{
			//print("bgImage");
			return im;
		}		
	}
	return null;
}


static function atoi( str : String) : int
{
	if(str.length == 0)return 0;
	
	var sign : int = 1;
	var n : int = 0;
	var startPos : int = 1;
	if(str[0] == '-') sign = -1;
	else if(str[0] == '+') sign = 1;
	else
	{
		startPos = 0;
	}
	for(var i : int = startPos; i < str.length; i++)
	{
		if(str[i] >= 48 && str[i] < 58)
		{
			var c : int = str[i];
			n = n * 10 + c - 48;
		}
		else
		{
			break;
		}
	}
	
	return n * sign;
}

static function atof(str : String) : float
{
	//print(str);

	if(str.length == 0)return 0;

	var f : float [] = new float[2];	
	var idx : int = 0;
	var startPos : int = 1;
	var fm : float = 1;
	var sign : int = 1;
	if(str[0] == '-') sign = -1;
	else if(str[0] == '+') sign = 1;
	else
	{
		startPos = 0;
	}
	for(var i : int = startPos; i < str.length; i++)
	{
		if(str[i] >= 48 && str[i] < 58)
		{
			var c : int = str[i];
			f[idx] = f[idx] * 10 + c - 48;
			if(idx > 0)fm *= 10;
		}
		else if(str[i] == '.')
		{
			idx ++;
			if(idx > 1)break;
		}
		else
		{
			break;
		}
	}
	
	var returnValue : float = f[0] + f[1] / fm;
	return returnValue * sign;
}
