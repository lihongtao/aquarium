
var shakeTime : float = 0;
var fps : float = 20;
var frameTime : float = 0;
var shakeDelta : float = 0.005;
var cam : Camera;

function Update () {
	if(shakeTime > 0)
	{
		shakeTime -= Time.deltaTime;
		if(shakeTime <= 0)
		{
			cam.rect = Rect(0,0,1,1);
			Destroy(this);
		}
		else
		{

			frameTime += Time.deltaTime;
			if(frameTime > 1.0 / fps)
			{
				frameTime = 0;
				cam.rect = Rect(shakeDelta * ( -1.0 + 2 * Random.value), shakeDelta * ( -1.0 + 2 * Random.value), 1, 1);
			}
		}
	}
}

static function ShakeCamera( seconds : float, pixelDelta : int)
{
	var js : js_shakeCamera = Camera.main.gameObject.AddComponent("js_shakeCamera");
	if(js)
	{
		js.cam = Camera.allCameras[0];
		js.shakeTime = seconds;
		js.fps = 30;
		js.shakeDelta = pixelDelta;
		if(Screen.width > Screen.height) js.shakeDelta /= Screen.height;
		else js.shakeDelta /= Screen.height;
	}
}