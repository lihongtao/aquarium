class InputHandler
{
	var go : GameObject;
	var msg : String;
}

static var ih : InputHandler;

static function WantInput(go : GameObject, msg : String)
{
	if(ih.go == null || ih.go.transform.position.z < go.transform.position.z)
	{
		ih.go = go;
		ih.msg = msg;
		//ih.pos = pos;
	}
}

function Start()
{
	if(ih == null)ih = new InputHandler();
}

function LateUpdate () {
	if(ih.go)
	{
		if(ih.msg.length > 0 && ih.msg != "DoNothing")
			ih.go.SendMessage(ih.msg);
			
		ih.go = null;
	}
}
