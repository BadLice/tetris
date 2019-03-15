class blockManager
{
	constructor()
	{
		this.fallen = []; //Texture (Empty/Filled) type array
		this.blocks = []; //Block type array

		this.canPress=true;
		this.gameOver = false;

		this.timeLease; //in seconds
		this.timex = millis();
		this.spawnTime=millis();
		this.timeLieaseTotal = 0.6;
		this.startTime=millis();

		this.nextBlock;

		this.precTime = 0;
	}

	update()
	{

		if(Math.floor((millis() - this.startTime)/1000) % 5 == 0 && Math.floor((millis() - this.startTime)/1000)!=this.precTime)
		{
			console.log(this.timeLieaseTotal)

			this.timeLieaseTotal-=0.01;
			this.precTime = Math.floor((millis() - this.startTime)/1000);
		}
		this.gameOverf();

		this.move();

		if(this.allFallen())
		{
			if(this.blocks.length!==0)
			{
				for(var i=0;i<this.blocks[this.blocks.length-1].texture.length;i++)
				{
					for(var j=0;j<this.blocks[this.blocks.length-1].texture.length;j++)
					{
						var bx = this.blocks[this.blocks.length-1].x;
						var by = this.blocks[this.blocks.length-1].y
						var tmp = this.blocks[this.blocks.length-1].texture[i][j];
						
						if(tmp instanceof Filled)
							this.fallen.push(new Filled(tmp.x+bx,tmp.y+by,tmp.s,tmp.col));
					}
				}

				this.blocks.splice(this.blocks.length-1,1);
			}

			this.rowWin();
			this.spawnNext();
		}

		if(millis()-this.timex > this.timeLease*1000)
		{

			for(var i=0;i<this.blocks.length;i++)//needs optimization
				this.blocks[i].fall();

			this.timex = millis();
		}
	}

	rowWin()
	{
		var totWin = false;
		for (var i = nH - 1; i >= 0; i--) //y
		{
			var win = true;
			for (var j = nW - 1; j >= 0 && win; j--) //x
			{
				if(this.getFallenAt(j,i) === null)
					win = false;
			}

			if(win)
			{
				totWin = true;
				
				//delete winning row
				for (var j = nW - 1; j >= 0; j--) //x
				{
					this.fallen.splice(this.fallen.indexOf(this.getFallenAt(j,i)),1);
				}

				for (var j = i; j >= 0; j--) //y
				{
					for(var k=0;k<nW;k++) //x
					{
						var tmp = this.getFallenAt(k,j);
						if(tmp !== null)
							tmp.y++;
					}
				}

				i++;
			}
			
		}

		if(totWin)
			delay(0.5);
	}

	gameOverf()
	{
		if(this.gameOver)
		{
			textSize(72);
			fill(255,0,0);
			stroke(255);
			text("GAME OVER",180,400);
			noLoop();
		}

	}

	getFallenAt(x,y)
	{
		for (var i = this.fallen.length - 1; i >= 0; i--)
		{
			if(this.fallen[i].x==x && this.fallen[i].y==y)
				return this.fallen[i];
		}

		return null;
	}

	spawnNext()
	{
		var repeat = 1;
		delay(0.2);

		if(this.nextBlock !== undefined)
		{
			this.blocks.push(this.nextBlock);
		}
		else
			repeat = 2;	

		for(var i=0;i<repeat;i++)
		{
			var x=4,y=0;
			switch(Math.floor(Math.random()*7))
			{
				case 0:
					this.blocks.push(new IBlock(x,y,color(255,0,0),true))
				break;

				case 1:
					this.blocks.push(new LBlock(x,y,color(255,0,0),true))
				break;

				case 2:
					this.blocks.push(new JBlock(x,y,color(255,0,0),true))
				break;

				case 3:
					this.blocks.push(new OBlock(x,y,color(255,0,0),true))
				break;

				case 4:
					this.blocks.push(new SBlock(x,y,color(255,0,0),true))
				break;

				case 5:
					this.blocks.push(new ZBlock(x,y,color(255,0,0),true))
				break;

				case 6:
					this.blocks.push(new TBlock(x,y,color(255,0,0),true))
				break;
			}
		}
		

		this.nextBlock = this.blocks.pop();

		if(this.blocks[this.blocks.length-1].collision() || this.blocks[this.blocks.length-1].edge())
			this.gameOver=true;
	}

	allFallen()
	{
		if(this.blocks.length==0)
			return true;
		for (var i = this.blocks.length - 1; i >= 0; i--)
			if(!this.blocks[i].fallen)
				return false;
		this.spawnTime=millis();
		return true;
	}

	move()
	{
		
		if(keyIsPressed)
		{
			if(this.canPress)
			{
				if(keyIsDown(LEFT_ARROW))
					this.blocks[this.blocks.length-1].left();

				if(keyIsDown(RIGHT_ARROW))
					this.blocks[this.blocks.length-1].right();
				
				if(keyIsDown(UP_ARROW))
					this.blocks[this.blocks.length-1].rotate();

			}

			this.canPress=false;
		}	
		else
			this.canPress=true

		if(keyIsDown(DOWN_ARROW))
			this.timeLease=0.03;
		else
			this.timeLease = this.timeLieaseTotal;

	}

	draw()
	{
		for(var i=0;i<this.blocks.length;i++)
				this.blocks[i].draw();
		
		for(var i=0;i<this.fallen.length;i++)
			this.fallen[i].draw();

		this.drawNext();
	}

	drawNext()
	{
		textSize(40);
		fill(255);
		text("NEXT",630,50);

		if(this.nextBlock !== undefined)
			this.nextBlock.draw(6.5,2);
	}

	isOccupied(x,y)
	{
		if(x<0 || x>=nW || y<0 || y>=nH)
			return true;
		for(var i=0;i<this.blocks.length;i++)
		{
			for(var j=0;j<this.blocks[i].texture.length;j++)
			{
				for(var k=0;k<this.blocks[i].texture[j].length;k++)
				{
					if(this.blocks[i].texture[j][k] instanceof Filled 
						& this.blocks[i].texture[j][k].x+this.blocks[i].x===x 
						& this.blocks[i].texture[j][k].y+this.blocks[i].y===y)
						return true;

				
				// console.log(x,y)
				// var temp = new Cell(x,y,nW,nH,color(0,255,0));
				// temp.draw();

				// 	if(this.blocks[i].texture[j][k] instanceof Filled ) console.log("filled")
				// 	if(this.blocks[i].texture[j][k].x+this.blocks[i].x===x ) console.log("x ok")
				// 	if(this.blocks[i].texture[j][k].y+this.blocks[i].y===y) console.log("y ok")
				}
			}
		}

		for (var i = this.fallen.length - 1; i >= 0; i--)
		{
			if(this.fallen[i].x==x && this.fallen[i].y==y)
				return true;
		}

		return false;

	}
}