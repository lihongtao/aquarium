
static var js : js_sndPlayer;
function Start()
{
	js = this;
	gameObject.AddComponent(AudioSource);
	
}

function PlaySound( sndFile : String, bLoop : boolean)
{
	audio.loop = bLoop;
	audio.clip = Resources.Load(sndFile, AudioClip);
	audio.Play();
}
function StopSound()
{
	audio.Stop();
}

static function PlaySnd( sndFile : String)
{
	js.PlaySound(sndFile, false);
}

static function PlaySnd( sndFile : String, bLoop : boolean)
{
	js.PlaySound(sndFile, bLoop);
}

static function StopSnd()
{
	js.StopSound();
}

static function SummonSound( sndClip : AudioClip)
{
	var snd : GameObject = new GameObject();
	var a : AudioSource = snd.AddComponent(AudioSource);
	a.clip = sndClip;
	a.Play();
	DontDestroyOnLoad(snd);
	Destroy(snd, a.clip.length);	
}

static function SummonSound( sndFile : String )
{
	var snd : GameObject = new GameObject();
	var a : AudioSource = snd.AddComponent(AudioSource);
	a.clip = Resources.Load(sndFile, AudioClip);
	a.Play();
	DontDestroyOnLoad(snd);
	Destroy(snd, a.clip.length);
}
