
static var musicOn : boolean = true;
static var soundOn : boolean = true;
static var js : js_opt;

function Start()
{
	js = this;
	musicOn = 0 != PlayerPrefs.GetInt("musicOn", 1);
	soundOn = 0 != PlayerPrefs.GetInt("soundOn", 1);
}

function TurnMusic( on : boolean )
{
	musicOn = on;
	PlayerPrefs.SetInt("musicOn", (musicOn ? 1 : 0));
}

function TurnSound( on : boolean )
{
	soundOn = on;
	PlayerPrefs.SetInt("soundOn", (soundOn ? 1 : 0));
}
