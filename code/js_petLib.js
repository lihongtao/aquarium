
var pet_prefab : GameObject;
var rcBack : Rect;

var rcPet : Rect[];
var rcSlot : Rect[];

function GetPetRect(pet : GameObject) : Rect
{
	var rc : Rect = new Rect();
	rc.width = 80;
	rc.height = 80;
	rc.xMin = pet.transform.position.x * Screen.width - rc.width / 2;
	rc.yMin = pet.transform.position.y * Screen.height - rc.height / 2;
	rc.width = 80;
	rc.height = 80;
	
	return rc;
}
function Start()
{
	var btnBack : GameObject = GameObject.Find("btnback");
	rcBack = js_common.GetTextureRect(btnBack);
	
	rcPet = new Rect[js_data.pets.length];
	for(var i : int = 0; i < js_data.pets.length; ++i)
	{
		var nX : int = i % 6;
		var nY : int = i / 6;
		var pet : GameObject = Instantiate(pet_prefab, Vector3(0.1 + nX * 0.15, 0.88 - nY * 0.15,  3), transform.rotation);
		pet.name = "pet" + i.ToString();
		rcPet[i] = GetPetRect(pet);
		Debug.Log(rcPet[i].ToString());
		if(i < js_save.petCount)
		{
			var js : js_ani = pet.AddComponent("js_ani");
			js.tga = new Texture2D[js_res.aniFrames];
			for(var f : int = 0; f < js_res.aniFrames; ++f)
			{
				js.tga[f] = js_res.petAni[i,0,f];
			}
		}
	}
	
	rcSlot = new Rect[js_save.slotMax];
	for(var slot : int = 0; slot < js_save.slotMax; ++slot)
	{
		var slotPet : GameObject = Instantiate(pet_prefab, Vector3(0.1 + 0.15 * slot, 0.12, 3), transform.rotation);
		slotPet.name = "slotPet" + slot.ToString();
		rcSlot[slot] = GetPetRect(slotPet);
		RefreshSlot(slot);
	}
}

function RefreshSlot(i : int)
{
	Debug.Log("RefreshSlot " + i);
	var slotPet : GameObject = GameObject.Find("slotPet" + i.ToString());
	if(i >= js_save.slotCount)
	{
		slotPet.guiText.text = "Buy";
	}
	else
	{
		slotPet.guiText.text = "";
		if(js_save.petInSlot[i] >= 0)
		{
			slotPet.guiTexture.enabled = true;
			var js : js_ani = slotPet.AddComponent("js_ani");
			js.tga = new Texture2D[js_res.aniFrames];
			for( var f : int = 0 ; f < js_res.aniFrames; ++f)
			{
				js.tga[f] = js_res.petAni[js_save.petInSlot[i],0,f];
			}
		}
		else
		{
			slotPet.guiTexture.enabled = false;
			if(slotPet.GetComponent("js_ani"))
				slotPet.Destroy(slotPet.GetComponent("js_ani"));
		}
	}
}

function Update () {
	if(Input.GetMouseButtonUp(0))
	{
		if(rcBack.Contains(Input.mousePosition))
		{
			Application.LoadLevel(GameScene.MainMenu);
		}
		
		for(var i : int = 0; i < js_data.pets.length; ++i)
		{
			if(rcPet[i].Contains(Input.mousePosition))
			{
				if(i < js_save.petCount)
				{
					var slotOld : int = js_save.GetPetSlot(i);
					if(slotOld >= 0)
					{
						js_tips.ShowTips("This pet already in slot");
					}
					else
					{
					var slotNew : int = js_save.SetPetInEmptySlot(i);
					if(slotNew >= 0)
					{
						RefreshSlot(slotNew);
						js_tips.ShowTips("This pet will appear in tank when you play");
					}
					else
					{
						js_tips.ShowTips("You need remove pet in slot or buy more slot");
					}
					}
				}
				else
				{
					js_tips.ShowTips("You need win more level to get this pet.");
				}
			}
		}
		
		for(i = 0; i < js_save.slotMax; ++i)
		{
			if(rcSlot[i].Contains(Input.mousePosition))
			{
				if(i < js_save.slotCount)
				{
					js_save.SetSlotPet(i, -1);
					RefreshSlot(i);
				}
				else
				{
					//buy slot;
					js_save.AddSlot();
					RefreshSlot(i);
				}
			}
		}
	}
}
