
static var dataLoadProcess : int = 0;

function LoadCsvFile( fileName : String, startLine : int, callbackFuncName : String, async : boolean)
{
	var ta : TextAsset = Resources.Load(fileName, TextAsset);
	if(ta)
	{
		var line : String = "";
		var lineCnt : int = 0;
		var Quotes : int = 0;
		for(var i : int = 0; i < ta.text.length; i++)
		{
			if((Quotes%2 == 0) && (ta.text[i] == '\r' || ta.text[i] == '\n'))
			{
				if(line.length == 0)continue;
				
				if(lineCnt >= startLine) // ignore lines
				{
					var arr : Array = new Array();
					//print("[" + line + "]");
					for(var field : int = 0;line.length > 0; field++)
					{
						var idx : int = line.IndexOf(",");
						var val : String = "";
						if(line[0] == '"')
						{
							val = '"';
							line = line.Substring(1, line.length - 1);
							idx = line.IndexOf('"');
						}
						if(idx > 0)
						{
							val += line.Substring(0, idx);
							line = line.Substring(idx+1, line.length - idx - 1);
						}
						else if(idx == 0)
						{
							line = line.Substring(1, line.length - 1);
						}
						else if(idx < 0)
						{
							val = line;
							line = "";
						}
						
						arr.Add(val);
					}
					arr.Add("");
					if(arr.length > 50)	++dataLoadProcess;//比较长的行解析比较慢，平衡一下进度条显示
					if(arr.length > 100)++dataLoadProcess;
					
					SendMessage(callbackFuncName, arr);
					if(async)
						yield;
				}
				
				line = "";
				lineCnt ++;
				Quotes = 0;
				++dataLoadProcess;
				
			}
			else
			{
				line += ta.text[i];
				if(ta.text[i] == '"') ++Quotes;
			}
		}
	}
	else
	{
		Debug.Log("load file " + fileName + " failed.");
	}

	++dataLoadProcess;

	if(async)
		SendMessage("CsvFileLoaded");
}

class CsvFileParam
{
	var fileName : String;
	var ignoreLines : int;
	var callbackFunc : String;
};
var csvFiles : Array;
var loadIdx : int = 0;
var delSelf : boolean = false;
var goNotify : GameObject;
function AddCsvFile( fileName : String, iL : int, callback : String)
{
	var info : CsvFileParam = new CsvFileParam();
	info.fileName = fileName;
	info.ignoreLines = iL;
	info.callbackFunc = callback;
	if(csvFiles == null)csvFiles = new Array();
	csvFiles.Add(info);
}

function StartLoad( go : GameObject)
{
	goNotify = go;
	loadIdx = 0;
	LoadCsvFile(csvFiles[loadIdx].fileName, csvFiles[loadIdx].ignoreLines, csvFiles[loadIdx].callbackFunc, true);
}

function CsvFileLoaded()
{
	++loadIdx;
	if(loadIdx < csvFiles.length)
	{
		LoadCsvFile(csvFiles[loadIdx].fileName, csvFiles[loadIdx].ignoreLines, csvFiles[loadIdx].callbackFunc, true);
	}
	else
	{
		goNotify.SendMessage("AllCsvFilesLoaded");
		if(delSelf)
		{
			Destroy(gameObject);
		}
	}
}

function LoadIndexFile( arr : Array)
{
	AddCsvFile(arr[0], js_common.atoi(arr[1]), arr[2]);
}

static function LoadCsvResourceInFile( indexFile : String, go : GameObject )
{
	var obj : GameObject = new GameObject("csvReader");
	obj.AddComponent("js_data");
	var js : js_csv = obj.AddComponent("js_csv");
	js.delSelf = true;
	js.LoadCsvFile(indexFile, 0, "LoadIndexFile", false);
	js.StartLoad(go);
}
