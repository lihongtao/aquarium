enum Constant{BtnMax = 9,};

class StageData
{
	var stageMode : int;
	var stageIdx : int;
	var btnPrice : int[];
	
	function StageData()
	{
		btnPrice = new int[Constant.BtnMax];
	}
}

function LoadStageData(arr: Array)
{
	var field : int = 0;
	var sd : StageData = new StageData();
	sd.stageMode = js_common.atoi(arr[field]);
	sd.stageIdx = js_common.atoi(arr[++field]);
	for( var i : int = 0; i < Constant.BtnMax; ++i)
		sd.btnPrice[i] = js_common.atoi(arr[++field]);
		
	if(stages == null)stages = new Array();
	
	stages.Add(sd);
	//Debug.Log("stage " + sd.stageIdx + ", btnPrice=" + sd.btnPrice[8]);

}

class FishData
{
	var fishType : int;
	var findFoodTime : float;
	var hungryTime : float;
	var dieTime : float;
	var coinTime : float;
	var growTime : float;
	var timeSwim : float; //time swim from left to right
}

function LoadFishData(arr : Array)
{
	var field : int = 0;
	var fd : FishData = new FishData();
	fd.fishType = js_common.atoi(arr[field]);
	fd.findFoodTime = js_common.atof(arr[++field]);
	fd.hungryTime = js_common.atof(arr[++field]);
	fd.dieTime = js_common.atof(arr[++field]);
	fd.coinTime = js_common.atof(arr[++field]);
	fd.growTime = js_common.atof(arr[++field]);
	fd.timeSwim = js_common.atof(arr[++field]);
	
	if(fishes == null)fishes = new Array();
	
	fishes.Add(fd);
	
	//Debug.Log("fish " + fd.fishType + ", dieTime=" + fd.dieTime + ", growTime=" + fd.growTime);
}

static function FishType2CoinType( ft : int) : int
{
	if(ft == FishType.Small)return 0;
	if(ft == FishType.Middle)return 0;
	if(ft == FishType.Big)return 1;
	if(ft == FishType.King)return 3;
	if(ft == FishType.Black)return 3;
	if(ft == FishType.White)return 4;
}

class PetData
{
	var petType : int;
	var petAni : String;
	var stateAni : String[];
	
	function PetData()
	{
		stateAni = new String[4];
	}
}


function LoadPetData(arr : Array)
{
	var field : int = 0;
	var pd : PetData = new PetData();
	pd.petType = js_common.atoi(arr[field]);
	pd.petAni = arr[++field];
	for(var i : int = 0; i < 4; ++i)
	{
		pd.stateAni[i] = arr[++field];
	}
	
	if(pets == null)pets = new Array();
	
	pets.Add(pd);
}

class AlienData
{
	var alienType : int;
	var alienAni : String;
}

function LoadAlienData(arr : Array)
{
	var field : int = 0;
	var pd : AlienData = new AlienData();
	pd.alienType = js_common.atoi(arr[field]);
	pd.alienAni = arr[++field];
	
	if(aliens == null)aliens = new Array();
	
	aliens.Add(pd);	
}

static var stages : Array;
static var fishes : Array;
static var pets : Array;
static var aliens : Array;


static function GetBtnPrice( m : int, idx : int, btn : int) : int
{
	if(stages)
	{
	var sd : StageData = stages[idx];
	return sd.btnPrice[btn];
	}
	
	return 99999;
}
