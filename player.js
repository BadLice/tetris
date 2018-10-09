class Player
{
	constructor()
	{
		this.size = 50;
		this.x = width / 2 - this.size / 2;
		this.y = height - 60;
		this.speed = 5;
		this.shots = [];
		this.canShot = true;
		this.waitingShot = 0.5;
	}

	draw()
	{
		stroke(0);
		fill(0, 255, 0);
		// rect(this.x, this.y, this.size, this.size);
		push();
		translate(this.x, this.y);
		beginShape();
		vertex(0, -this.size / 2);
		vertex(-this.size / 2, this.size / 2);
		vertex(this.size / 2, this.size / 2);
		endShape();
		pop();
	}

	update()
	{
		this.movement();
		this.fire();

		for (var o of this.shots)
		{
			o.draw();
			o.update();
		}

		for (var i = this.shots.length - 1; i >= 0; i--)
		{
			this.shots[i].draw();
			this.shots[i].update();

			if (this.shots[i].outOfScreen())
				this.shots.splice(i, 1);
		}

	}

	fire()
	{
		if (this.canShot)
		{
			//why doesn't it shot if I release and press repeatly??
			// console.log("shot " + keyIsDown(32));
			if (keyIsDown(32))
			{
				this.shots.push(new Bullet(this.x, this.y - this.size / 2));
			}
			this.shotLease = millis();
			this.canShot = false;
		}
		else
		{
			if (millis() - this.shotLease > 1000 * this.waitingShot)
			{
				this.canShot = true;
			}
		}
	}

	movement()
	{
		if (keyIsDown(LEFT_ARROW))
		{
			if (this.x - this.size / 2 >= 0)
				this.x -= this.speed;
		}
		if (keyIsDown(RIGHT_ARROW))
		{
			if (this.x + this.size / 2 <= width)
				this.x += this.speed;
		}

	}
}