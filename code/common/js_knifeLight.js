var Knife : GameObject;
var go : GameObject;
var tail : TrailRenderer;
var flag : boolean;
var cam : Camera;

var widthStart : float = 1;
var widthEnd : float = 0.3;
static var lifeTime : float = 0.15;
/*
function OnGUI(){
	if(GUI.Button(Rect(0,0, 100,100), widthStart.ToString()))
		widthStart *= 0.8;
	if(GUI.Button(Rect(0,100, 100,100), widthStart.ToString()))
		widthStart /= 0.8;
	if(GUI.Button(Rect(100,0, 100,100), widthEnd.ToString()))
		widthEnd *= 0.8;
	if(GUI.Button(Rect(100,100, 100,100), widthEnd.ToString()))
		widthEnd /= 0.8;
	if(GUI.Button(Rect(200,0, 100,100), lifeTime.ToString()))
		lifeTime *= 0.8;
	if(GUI.Button(Rect(200,100, 100,100), lifeTime.ToString()))
		lifeTime /= 0.8;

}
*/
function Update () {
	if (flag) {
		var curScreenSpace = Vector3(Input.mousePosition.x, Input.mousePosition.y, 10); 
		var curPosition = cam.ScreenToWorldPoint(curScreenSpace);
		go.transform.position= curPosition;
	}
	if (Input.GetMouseButtonDown(0)) {
		flag = true;
		go = Instantiate(Knife, cam.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, 10)),Quaternion.identity);
		tail = go.GetComponent(TrailRenderer);
		tail.startWidth = widthStart;
		tail.endWidth = widthEnd;
		tail.time = lifeTime;
	}
	if (Input.GetMouseButtonUp(0)) {
		flag = false;
		Destroy(go, lifeTime);
	}
}
