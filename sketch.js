var player;
var em;

function setup()
{
	createCanvas(1000, 900);
	player = new Player();
	em = new EnemyManager(player.shots);
}

function draw()
{
	background(0);
	player.draw();
	player.update();

	em.draw();
}