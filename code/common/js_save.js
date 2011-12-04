static var curMode : int = 0;
static var curIdx : int = 0;
static var petCount : int = 0;
static var achivStageCount : int = 0;
static var slotCount : int = 2;
static var slotMax : int = 6;
static var petInSlot : int[];
function Start()
{
	curMode = PlayerPrefs.GetInt("curMode", 0);
	curIdx = PlayerPrefs.GetInt("curIdx", 0);
	petCount = PlayerPrefs.GetInt("petCount", 0);
	if(Application.isEditor)petCount = 24;
	achivStageCount = PlayerPrefs.GetInt("achivStageCount", 0);	
	slotCount = PlayerPrefs.GetInt("slotCount", 2);
	petInSlot = new int[slotMax];
	for(var i : int = 0; i < slotMax; ++i)
	{
		petInSlot[i] = PlayerPrefs.GetInt("petInSlot" + i.ToString(), -1);
	}	
}

static function SetSlotPet(slot : int, pet : int)
{
	petInSlot[slot] = pet;
	PlayerPrefs.SetInt("petInSlot" + slot.ToString(), pet);
}

static function GetPetSlot( pet : int ) : int
{
	for(var i : int = 0; i < slotCount; ++i)
	{
		if(petInSlot[i] == pet)
			return i;
	}
	return -1;
}

static function SetPetInEmptySlot( pet : int) : int
{
	for(var i : int = 0; i < slotCount; ++i)
	{
		if(petInSlot[i] < 0)
		{
			SetSlotPet(i, pet);
			
			return i;
		}
	}
	
	return -1;
}

static function AddSlot()
{
	++slotCount;
	if(slotCount > slotMax)slotCount = slotMax;
	PlayerPrefs.SetInt("slotCount", slotCount);
}

static function StageClear()
{
	++achivStageCount;
	PlayerPrefs.SetInt("achivStageCount", achivStageCount);
	
	++curIdx;
	if(curIdx >= js_data.stages.length)
	{
		curIdx = js_data.stages.length -1;
	}
	PlayerPrefs.SetInt("curIdx", curIdx);
	
	++petCount;
	if(petCount > 7)petCount = 7;
	if(petCount >= js_data.pets.length)
	{
		petCount = js_data.pets.length; 
	}
	PlayerPrefs.SetInt("petCount", petCount);
	
}
