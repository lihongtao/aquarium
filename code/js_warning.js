var fps : float = 5;
var fTime : float = 0;


function Update () {
	fTime += Time.deltaTime;
	if(fTime > 1.0 / fps)
	{
		fTime = 0;
		if(js_alien.aliens.length <= 0)
		{
			guiText.enabled = false;
		}
		else
			guiText.enabled = !guiText.enabled;
	}
	
}
