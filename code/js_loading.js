
function Start()
{
	js_common.StretchBgToScreenByName();
	js_global.CreateGlobal();
}
private var total : int = 56 + 1148;
function Update () {
	var percent : int = (js_csv.dataLoadProcess + js_res.aniLoadProcess) * 100 / (39 + 786);
	if(percent > 100)percent = 100;
	guiText.text = percent.ToString() + " %";
	
}