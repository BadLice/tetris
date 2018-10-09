class Bullet
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
		this.w = 5;
		this.h = 15;
		this.speed = 7;
		this.col = color(random(0.1, 1) * 255, random(0.1, 1) * 255, random(0.1, 1) * 255);
	}

	draw()
	{
		noStroke();
		fill(this.col);
		rect(this.x - this.w / 2, this.y, this.w, this.h);
	}

	update()
	{
		this.y -= this.speed;
	}

	outOfScreen()
	{
		return this.y + this.h < 0;
	}
}