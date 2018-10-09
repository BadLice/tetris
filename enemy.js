class Enemy
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
		this.size = 50;
		this.alive = true;
	}

	draw()
	{
		if (this.alive)
		{
			stroke(0);
			// if (this.alive)
			fill(255, 0, 0);
			// else
			// fill(0, 0, 255);

			rect(this.x, this.y, this.size, this.size);
		}
	}

	moveLeft(speed)
	{
		this.x -= speed;
	}

	moveRight(speed)
	{
		this.x += speed;
	}

	collision(x, y)
	{
		if (x >= this.x && x <= this.x + this.size && y >= this.y && y <= this.y + this.size)
			this.alive = false;
		return !this.alive;
	}
}

class EnemyManager
{
	constructor(shots)
	{
		this.population = [];
		this.cols = 11;
		this.rows = 5;
		this.gap = 22;
		this.speed = 5;
		this.dir = false; //true = left, false = right
		this.waitMoveMax = 0.1;
		this.waitMove = this.waitMoveMax;
		this.moveLease = millis();
		this.shots = shots; //refernced from player.shots

		//init matrix of enemies
		for (var x = 0; x < this.cols; x++)
		{
			this.population.push([]);
			for (var y = 0; y < this.rows; y++)
			{
				this.population[x].push(new Enemy((50 + this.gap) * (x + 1), (50 + this.gap) * (y + 1)));
			}
		}
	}

	getAlives()
	{
		var num = 0;
		for (var k of this.population)
		{
			for (var o of k)
			{
				if (o.alive)
					num++;
			}
		}
		return num;
	}

	draw()
	{
		// this.waitMove = map(this.getAlives(), 0, this.rows * this.cols, 0.1, 0.8);

		var mustMove = false;
		if (millis() - this.moveLease > this.waitMove * 1000)
		{
			mustMove = true;
			this.moveLease = millis();
		}

		if (this.reachedEdge())
			this.dir = !this.dir;

		for (var k of this.population)
		{
			for (var o of k)
			{
				if (o.alive)
				{
					for (var i = this.shots.length - 1; i >= 0; i--)
					{
						if (o.collision(this.shots[i].x, this.shots[i].y))
							this.shots.splice(i, 1);
					}

				}

				o.draw();
				if (mustMove)
				{
					if (this.dir)
						o.moveLeft(this.speed);
					else
						o.moveRight(this.speed);
				}

			}
		}
	}

	reachedEdge()
	{
		var leftIndex = -1;
		var rightIndex = -1;
		var max = 0;
		var min = width;

		//init matrix of enemies
		for (var x = 0; x < this.cols; x++)
		{
			for (var y = 0; y < this.rows; y++)
			{
				if (this.population[x][y].x < min)
				{
					min = this.population[x][y].x;
					leftIndex = {
						x: x,
						y: y
					};
				}

				if (this.population[x][y].x > max)
				{
					max = this.population[x][y].x;
					rightIndex = {
						x: x,
						y: y
					};
				}
			}
		}

		return !(this.population[leftIndex.x][leftIndex.y].x >= 0 && this.population[rightIndex.x][rightIndex.y].x + (this.population[rightIndex.x][rightIndex.y].size) <= width)
	}

}