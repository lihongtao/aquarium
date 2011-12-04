
var timeElasped : float = 0;
var nextInterval : float = 90;
var alienIdx : int = 0;
static var js : js_trigger;

function Update () {
	if(js_stage.jsStage.gameState != GameState.Playing)return;

	timeElasped += Time.deltaTime;
	if(timeElasped > nextInterval)
	{
		timeElasped = 0;
		nextInterval = 10;
		nextInterval = 90 - alienIdx * 5;
		if(nextInterval < 30)nextInterval = 30;
		SummonAlien(alienIdx);
		alienIdx++;
	}
	
}


var alien_prefab : GameObject;
var summonAlien_prefab : GameObject;
function SummonAlien( idx : int)
{
	var x : float = Random.Range(Screen.width/2, Screen.width-128);;
	var y : float = Random.Range(128 + js_stage.tankBottom, js_stage.tankTop - 128);
	Instantiate(summonAlien_prefab, Vector3( x / Screen.width, y / Screen.height, 99), transform.rotation);
	yield WaitForSeconds(0.6);
	var alien : GameObject = Instantiate(alien_prefab, Vector3(0,0,100), transform.rotation);
	var jsAlien : js_alien = alien.GetComponent("js_alien");
	jsAlien.InitAlien(idx, x, y);
	
}


var pet_prefab : GameObject;
function Start(){
	if(Application.isEditor)nextInterval = 5;
	
	js = this;
	
	js_pet.InitArray();
	js_alien.InitArray();

	for(var i : int = 0; i < js_save.slotCount; i++)
	{
		if(js_save.petInSlot[i] >= 0)
		{
			var pet : GameObject = Instantiate(pet_prefab, Vector3(0,0,90 + i), transform.rotation);
			var jsPet : js_pet = pet.GetComponent("js_pet");
			jsPet.InitPet(js_save.petInSlot[i]);
		}
	}
	
	js_fish.InitArray();
	js_input.js.SummonFish( FishType.Small);
	js_input.js.SummonFish( FishType.Small);

}

var merlySong_prefab : GameObject;
function MerlySing(x : float, y : float)
{
	var sing : GameObject  = Instantiate(merlySong_prefab, Vector3(x/Screen.width, y / Screen.height, 199), transform.rotation);
	Destroy(sing, 1.3);
	yield WaitForSeconds(0.5);
	
	js_fish.AllFishesSummonCoin();
}