
static function ShowTips( str : String, showSeconds : float)
{
	Debug.Log("showtips " + str);
	js.showTime = showSeconds;
	js.tips = str;
}

static function ShowTips(str : String)
{
	ShowTips(str, 2);
}

static function HideTips(delaySeconds : float)
{
	js.showTime = delaySeconds;
}

static var js : js_tips;
var showTime : float = 0;
var tips : String;
var gt : GUITexture;

function Start()
{
	DontDestroyOnLoad(gameObject);
	js = this;
	gt = GetComponentInChildren(GUITexture);
}
function Update () {
	showTime -= Time.deltaTime;
	if(showTime > 0)
	{
		gt.enabled = true;
		guiText.enabled = true;
		guiText.text = tips;
	}
	else
	{
		gt.enabled = false;
		guiText.enabled = false;
	}
}