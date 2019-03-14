var playfield;
var bm;
var blockSize = undefined; //size of every cell or block
var shift = undefined; //amout of pixel to shift blocks and playfield from the left of de screen
var nW=10;//number of x blocks
var nH=20;//number of y blocks
function setup()
{
	createCanvas(800, 800);

	// levelEditorSetup();

	playfield = new Playfield(nW,nH);
	bm = new blockManager();
	// console.log(JSON.stringify(bm))
}

function draw()
{
	background(255,255,0);

	// levelEditorDraw();

	playfield.draw();
	bm.draw();
	bm.update();
}

function levelEditorSetup()
{

	playfield = new Playfield(4,4);
}


function delay(t)//in seconds
{
	var timex = millis();

	while(millis()-timex < t*1000);
}