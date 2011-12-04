
static var js : js_global;
static var obj : GameObject;

static function CreateGlobal()
{
	if(obj == null)
	{
		obj = new GameObject("global");
		obj.AddComponent("js_global");
		obj.AddComponent("js_opt");
		obj.AddComponent("js_res");
		obj.AddComponent("js_save");
		DontDestroyOnLoad(obj);
	}	
}

enum GameScene{Loading, MainMenu, Tank, PetLib};

function Awake()
{
	js = this;
	js_common.EnableAutorotateLandscape();
	
	js_csv.LoadCsvResourceInFile("data/index", gameObject);
}

function Update () {
	js_common.AutorotateLandscape();
}

function AniLoadFinished()
{
	Application.LoadLevel(GameScene.MainMenu);
}

function AllCsvFilesLoaded()
{
	Debug.Log("all csv files loaded. " + js_csv.dataLoadProcess);
	js_res.js.StartLoadAni();
}
