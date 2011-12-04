static var alienAni : Texture2D[,,];
static var alienTypeMax : int = 3;
static var alienStateMax : int = 3;

static var fishAni : Texture2D[,,];
static var fishTypeMax : int = 6;
static var fishStateMax : int = 7;

static var petAni : Texture2D[,,];
static var petTypeMax : int = 6;
static var petStateMax : int = 4;

static var coinAni : Texture2D[,];
static var coinTypeMax : int = 6;

static var aniFrames : int = 10;

static var aniLoadProcess : int = 0;

static var js : js_res;
function Start()
{
	js = this;
	
}


function StartLoadAni()
{
	alienTypeMax = js_data.aliens.length;
	
	alienAni = new Texture2D[alienTypeMax, alienStateMax, aniFrames];
	alienName = new String[alienTypeMax];
	
	fishTypeMax = js_data.fishes.length;
	fishAni = new Texture2D[fishTypeMax, fishStateMax, aniFrames];
	
	petTypeMax = js_data.pets.length;
	petAni = new Texture2D[petTypeMax, petStateMax, aniFrames];
	petName = new String[petTypeMax];
	
	coinAni = new Texture2D[coinTypeMax, aniFrames];
	
	LoadAni();
}

static function LoadPetImages(t : int)
{
	var pd : PetData = js_data.pets[t];
	for(s = 0; s < petStateMax; ++s)
	{
		if(pd.stateAni[s].length > 0)
		{
		for( i = 0; i < aniFrames; ++i)
		{
			if(petAni[t,s,i] == null)
			{
				petAni[t,s,i] = Resources.Load("pet/" + t.ToString() + "/" + pd.petAni + "0" + s.ToString() + "0" + i.ToString(), Texture2D);
			}
		}
		}
	}
	
}
var yieldStep : int = 4;
function LoadAni()
{
	for( var t : int = 0; t < fishTypeMax; ++t)
	{
		for( var s : int = 0; s < fishStateMax; ++s)
		{
			for( var i : int = 0; i < aniFrames; ++i)
			{
				if(t != 5)
				{
					//Debug.Log("fish/" + t.ToString() + "0" + (1+s).ToString() + "0" + i.ToString());
					fishAni[t,s,i] = Resources.Load("fish/" + t.ToString() + "0" + (1+s).ToString() + "0" + i.ToString(), Texture2D);
					//Debug.Log("fishAni " + t +"," + s +"," + i + " size=" + fishAni[t,s,i].width + "," + fishAni[t,s,i].height);
				}
				else
					fishAni[t,s,i] = Resources.Load("fish/5/ultravore" + "0" + s.ToString() + "0" + i.ToString(), Texture2D);
					
				++aniLoadProcess;
				if(i % yieldStep == 0)yield;
			}
		}
	}
	
	for( t = 0; t < alienTypeMax; ++t)
	{
		var d : AlienData = js_data.aliens[t];
		for( s = 0; s < alienStateMax; ++s)
		{
			for( i = 0; i < aniFrames; ++i)
			{
				alienAni[t,s,i] = Resources.Load("alien/" + t.ToString() + "/" + d.alienAni + "0" + s.ToString() + "0" + i.ToString(), Texture2D);
				++aniLoadProcess;
				if(i % yieldStep == 0)yield;
			}
		}
	}
	
	for( t = 0; t < petTypeMax && t < 10; ++t)
	{
		var pd : PetData = js_data.pets[t];
		for(s = 0; s < petStateMax; ++s)
		{
			if(pd.stateAni[s].length == 0)continue;
			for( i = 0; i < aniFrames; ++i)
			{
				petAni[t,s,i] = Resources.Load("pet/" + t.ToString() + "/" + pd.petAni + "0" + s.ToString() + "0" + i.ToString(), Texture2D);
				++aniLoadProcess;
				if(i % yieldStep == 0)yield;
			}
		}
	}
	for( t = 0; t < coinTypeMax; ++t)
	{
		for( i = 0; i < aniFrames; ++i)
		{
			coinAni[t,i] = Resources.Load("coin/coin0" + t.ToString() + "0" + i.ToString(), Texture2D);
			++aniLoadProcess;
			if(i % yieldStep == 0)yield;
		}
	}
	
	js_fish.sndDie = Resources.Load("sound/cached_die", AudioClip);
	++aniLoadProcess;
	yield;
	js_fish.sndEatFish = Resources.Load("sound/cached_chomp2", AudioClip);
	++aniLoadProcess;
	yield;
	js_fish.sndEat = Resources.Load("sound/cached_slurp", AudioClip);
	++aniLoadProcess;
	yield;
	js_fish.sndSplash = Resources.Load("sound/cached_splash3", AudioClip);
	++aniLoadProcess;
	yield;
	js_fish.sndSplashBig = Resources.Load("sound/cached_splashbig", AudioClip);
	++aniLoadProcess;
	yield;
	js_fish.sndGrow = Resources.Load("sound/cached_grow", AudioClip);
	++aniLoadProcess;
	yield;
	js_missile.sndMissile = Resources.Load("sound/cached_missile", AudioClip);
	++aniLoadProcess;
	yield;
	js_missile.sndHit = Resources.Load("sound/cached_hit", AudioClip);
	++aniLoadProcess;
	yield;
	
	Debug.Log("total aniLoadProcess " + aniLoadProcess + ",dataLoadProcess=" + js_csv.dataLoadProcess);
	SendMessage("AniLoadFinished");
}

