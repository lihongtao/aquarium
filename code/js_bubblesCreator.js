var lastBubblesTime : float = 0;
var nextInterval : float = 1.0;

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	lastBubblesTime += Time.deltaTime;
	if(lastBubblesTime > nextInterval)
	{
		lastBubblesTime = 0;
		nextInterval = Random.Range(6, 12);
		SummonBubbles();
	}
}


var bubble_prefab : GameObject;
static var jsBubblesCreator : js_bubblesCreator;
function Awake()
{
	jsBubblesCreator = this;
}

static function SummonBubblesNear(x : int, y : int, z : int)
{
	jsBubblesCreator.SummonBubblesAt( (1.0 * x / Screen.width), (1.0 * y / Screen.height),  z, Random.Range(4,6), false);
}

function SummonBubbles()
{
	var cnt : int = Random.Range(1,5);
	var x : float = Random.Range(0.1 , 0.9);
	var y : float = Random.Range(0.1, 0.4);
	var z : float = 10 + 0.1 * Random.value;
	SummonBubblesAt(x,y,z,cnt, true);
}

function SummonBubblesAt(x : float, y : float, z : float, cnt : int, sndOn : boolean)
{
	for(var i : int = 0; i < cnt; i++)
		Instantiate(bubble_prefab, Vector3( x + 0.02 * Random.value, y + 0.02 * Random.value,  z), transform.rotation);
	
	if(sndOn)
		audio.Play();
}

static function SummonSmokeNear(x : int, y : int, z : int)
{
	jsBubblesCreator.SummonSmokeAt( (1.0 * x / Screen.width), (1.0 * y / Screen.height),  z, 1, false);
}

var smoke_prefab : GameObject; 
function SummonSmokeAt(x : float, y : float, z : float, cnt : int, sndOn : boolean)
{
	for(var i : int = 0; i < cnt; i++)
	{
		var smoke : GameObject = Instantiate(smoke_prefab, Vector3( x + 0.02 * Random.value, y + 0.02 * Random.value,  z), transform.rotation);
		/*
		var js : js_aniPlayer = smoke.AddComponent(js_aniPlayer);
		js.PlayAni("se/smoke/smokemissile00", 20, 20, -1);
		Destroy(smoke, 1.0);
		*/
	}
	
	if(sndOn)
		audio.Play();
}
