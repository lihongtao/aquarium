var ani : Texture2D[];
var dir : int = 0;
var curX : float = 0;
var curY : float = 0;
var targetX : float = 0;
var targetY : float = 0;
private var spd : float = 240;

static var sndHit : AudioClip;
static var sndMissile : AudioClip;

var jsAlien : js_alien;

function CheckTarget()
{
	if(js_alien.aliens.length == 0)
	{
		targetX = Screen.width + 200;
		targetY = Screen.height/2;
		Destroy(gameObject, 2.0);
	}
	else
	{
	jsAlien = js_alien.aliens[0];
	
	targetX = jsAlien.curX;
	targetY = jsAlien.curY;
	
	if(Mathf.Abs(targetX - curX) < 40 && Mathf.Abs(targetY - curY) < 30)
	{
		js_bubblesCreator.SummonBubblesNear(curX + Random.Range(-40, 40), curY + Random.Range(-40,20), transform.position.z + 1);
		js_bubblesCreator.SummonSmokeNear(curX + Random.Range(-20, 20), curY + Random.Range(-20,20), transform.position.z + 1);
		js_bubblesCreator.SummonSmokeNear(curX + Random.Range(-20, 20), curY + Random.Range(-20,20), transform.position.z + 1);
		jsAlien.Hurt();
		
		js_sndPlayer.SummonSound(sndHit);

		Destroy(gameObject);
	}
	}
}

function Start()
{
	curX = transform.position.x * Screen.width;
	curY = transform.position.y * Screen.height;
	
	dir = 15;
	spd = Screen.width / 4 + Random.value * 50;
	
	CheckTarget();	
}
private var timeElasped : float = 0;
private var fps : float = 10;
private var dirOld : float;

function CalcNewPos()
{
	dirOld = dir * 22.5;

	curX += spd * Time.deltaTime * Mathf.Cos( 3.1415926 * dirOld / 180);
	curY += spd * Time.deltaTime * Mathf.Sin( 3.1415926 * dirOld / 180);

	transform.position.x = curX / Screen.width;
	transform.position.y = curY / Screen.height;
	
}

function CalcNewDir()
{
	var a : float = Mathf.Atan2((targetY - curY),(targetX - curX));
	var dirT : float = a / 3.1415926 * 180;
	if(dirT < 0)dirT += 360;
	//Debug.Log("a=" + a + ", dirT=" + dirT + ",dirOld=" + dirOld);
	var deltaDir : float = dirT - dirOld;
	if(deltaDir < 0)deltaDir += 360;
	
	if(Mathf.Abs(deltaDir) < 20 || Mathf.Abs(deltaDir) > 360 - 20)
	{
		//Debug.Log("hold");
	}
	else if( deltaDir < 180)
	{
		//Debug.Log("++dir=" + dir + ", a=" + a + ", dirT=" + dirT + ",dirOld=" + dirOld);
		++dir;
		if(dir > 15)dir = 0;	
	}
	else
	{
		//Debug.Log("--dir=" + dir + ", a=" + a + ", dirT=" + dirT + ",dirOld=" + dirOld);
		--dir;
		if(dir < 0)dir = 15;
	}

	guiTexture.texture = ani[dir];

}

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;
	
	CalcNewPos();
	CheckTarget();

	timeElasped += Time.deltaTime;
	if(timeElasped >= 1.0 / fps)
	{
		timeElasped = 0;
		CalcNewDir();
	}
	
}

