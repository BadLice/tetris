class Block
{
	constructor(x,y,col,size,def=false)
	{
		this.size=size;
		this.texture = [];		

		//relative to indexes of playfield table
		this.y = y;
		this.x = x;
		this.col = col;
		this.fallen = false;

		if(def)
		{
			for(var i=0;i<this.size;i++)
			{
				this.texture[i] = [];
				for(var j=0;j<this.size;j++)
				{
					this.texture[i][j] = new Empty(i,j,this.size,this.col);
				}

			}
		}
	}

	left()
	{
		if(!this.leftCollision())
			if(this.getLeftX()>0)
				this.x--;

	}

	right()
	{
		if(!this.rightCollision())
			if(this.getRightX()<nW-1)
				this.x++;
	}

	rotate()
	{
		if(!(this instanceof OBlock))
		{
			var nextTxt=[]
			for(var i=0;i<this.size;i++)
			{
				nextTxt[i] = [];
				for(var j=0;j<this.size;j++)
				{
					if(this.texture[i][j] instanceof Filled)
						nextTxt[i][j] = new Filled(this.texture[i][j].x,this.texture[i][j].y,this.size,this.col);
					else
						nextTxt[i][j] = new Empty(this.texture[i][j].x,this.texture[i][j].y,this.size,this.col);
				}

			}
		
			nextTxt = nextTxt.reverse();

			for (var i = nextTxt.length - 1; i >= 0; i--)
			{
				for (var j = nextTxt.length - 1; j >= 0; j--)
				{	
					nextTxt[i][j].x=i;
					nextTxt[i][j].y=j;
				}
			}
	  
			for (var i = 0; i < nextTxt.length; i++)
			{
				for (var j = 0; j < i; j++)
				{
					var temp = nextTxt[i][j];
					nextTxt[i][j] = nextTxt[j][i];
					nextTxt[j][i] = temp;

					var tmp = nextTxt[j][i].x;
					nextTxt[j][i].x=nextTxt[j][i].y;
					nextTxt[j][i].y=tmp;

					var tmp = nextTxt[i][j].x;
					nextTxt[i][j].x=nextTxt[i][j].y;
					nextTxt[i][j].y=tmp;
				}
			}


			var valid = true;

			for (var i = this.size - 1 ; i >= 0 && valid; i--)
			{
				for (var j = this.size - 1 ; j >= 0 && valid; j--)
				{	
					if(!(this.texture[i][j] instanceof Filled) && nextTxt[i][j] instanceof Filled)
					{
						valid = !(bm.isOccupied(this.x+nextTxt[i][j].x,this.y+nextTxt[i][j].y))
					}
				}
			}
			
			if(valid)
				this.texture = nextTxt;
		}
	}	

	getLowerY()
	{
		var maz = -Infinity
		for (var i = this.texture.length - 1; i >= 0; i--)
		{
			for (var j = this.texture[i].length - 1; j >= 0; j--)
			{
				// console.log(this.texture[i][j].y,maz)
				if(this.texture[i][j].y>maz && this.texture[i][j] instanceof Filled)
					maz = this.texture[i][j].y;
			}
		}

		return maz;
	}

	getLeftX()
	{
		var maz = Infinity
		for (var i = this.texture.length - 1; i >= 0; i--)
		{
			for (var j = this.texture[i].length - 1; j >= 0; j--)
			{
				// console.log(this.texture[i][j].y,maz)
				if(this.texture[i][j].x+this.x<maz && this.texture[i][j] instanceof Filled)
					maz = this.texture[i][j].x+this.x;
			}
		}

		return maz;
	}

	getRightX()
	{
		var maz = -Infinity
		for (var i = this.texture.length - 1; i >= 0; i--)
		{
			for (var j = this.texture[i].length - 1; j >= 0; j--)
			{
				// console.log(this.texture[i][j].y,maz)
				if(this.texture[i][j].x+this.x>maz && this.texture[i][j] instanceof Filled)
					maz = this.texture[i][j].x+this.x;
			}
		}

		return maz;
	}

	edge()
	{
		return this.y+this.getLowerY()>=nH-1;
	}

	fall()
	{
		if(!this.fallen)
		{
			if(!this.collision() && !this.edge())
				this.y++;
			else
				this.fallen = true;
		}
	}

	draw(x=0,y=0)
	{
		for(var i=0;i<this.texture.length;i++)
			for(var j=0;j<this.texture.length;j++)
				this.texture[i][j].draw(this.x+x,this.y+y);
	}

	leftCollision()
	{
		// frameRate(10)
		//var lowest = this.y+this.getLowerY();

		for (var j = 0; j<this.texture.length; j++)
		{
			for (var i = 0; i<this.texture.length; i++)
			{
				//if(this.y+this.texture[i][j].y==lowest && this.texture[i][j] instanceof Filled)//it's the lowest
				if(i != 0)
				{
					// console.log("checking "+i+" "+j)
					if(!(this.texture[i-1][j] instanceof Filled) && this.texture[i][j] instanceof Filled)
					{
						if(this.isOccupied(this.x+this.texture[i-1][j].x,this.y+this.texture[i-1][j].y))
							return true;
						break;
					}
				}
				else
				{
					if(this.texture[i][j] instanceof Filled)
						if(this.isOccupied(this.x+this.texture[i][j].x-1,this.y+this.texture[i][j].y))
							return true;
					
				}
			}
		}

		return false;
	}

	rightCollision()
	{

		for (var j = 0; j<this.texture.length; j++)
		{
			for (var i = 0; i<this.texture.length; i++)
			{
				//if(this.y+this.texture[i][j].y==lowest && this.texture[i][j] instanceof Filled)//it's the lowest
				if(i != this.texture.length-1)
				{
					// console.log("checking "+i+" "+j)
					if(!(this.texture[i+1][j] instanceof Filled) && this.texture[i][j] instanceof Filled)
					{
						if(this.isOccupied(this.x+this.texture[i+1][j].x,this.y+this.texture[i+1][j].y))
							return true;
						break;
					}
				}
				else
				{
					if(this.texture[i][j] instanceof Filled)
						if(this.isOccupied(this.x+this.texture[i][j].x+1,this.y+this.texture[i][j].y))
							return true;		
				}
			}
		}
				
		return false
	}

	collision()
	{
		// frameRate(10)
		//var lowest = this.y+this.getLowerY();

		for (var i = 0; i<this.texture.length; i++)
		{
			for (var j = 0; j<this.texture[i].length; j++)
			{
				//if(this.y+this.texture[i][j].y==lowest && this.texture[i][j] instanceof Filled)//it's the lowest
				if(j != this.texture[i].length-1)
				{
					// console.log("checking "+i+" "+j)
					if(!(this.texture[i][j+1] instanceof Filled) && this.texture[i][j] instanceof Filled)
					{
						if(this.isOccupied(this.x+this.texture[i][j+1].x,this.y+this.texture[i][j+1].y))
							return true;
						break;
					}	
				}
				else
				{
					if(this.texture[i][j] instanceof Filled)
						if(this.isOccupied(this.x+this.texture[i][j].x,this.y+this.texture[i][j].y+1))
							return true;
					
				}
			}
		}
				
		return false;
	}

	isOccupied(x,y)
	{
		return bm.isOccupied(x,y);
	}
}

class Empty
{
	constructor(x,y,s)
	{
		//relative to indexes of Block object position
		this.x=x;
		this.y=y;
		this.size = s;
		this.solid=false;
	}

	draw()
	{
		return false;
	}
}

class Filled extends Empty
{
	constructor(x,y,s,col)
	{
		super(x,y,s);
		this.col = col;
		this.solid=true;
	}

	draw(xBlock,yBlock)
	{
		if(xBlock===undefined && yBlock ===undefined)
		{
			xBlock = 0;
			yBlock = 0;
		}	

		stroke(150);
		fill(this.col);
		rect((this.x+xBlock)*blockSize+shift,(this.y+yBlock)*blockSize,blockSize,blockSize);
	}
}

class IBlock extends Block
{
	constructor(x,y,col)
	{
		col = color(0, 96, 252);

		super(x,y,col,4,true);

		for(var i=0;i<this.size;i++)
			this.texture[i][0] = new Filled(i,0,this.size,this.col);

	}

}

class LBlock extends Block
{
	constructor(x,y,col)
	{
		col = color(67, 255, 0);
		super(x,y,col,4,true);

		for(var i=0;i<this.size-1;i++)
			this.texture[i][0] = new Filled(i,0,this.size,this.col);
		this.texture[0][1] = new Filled(0,1,this.size,this.col);

	}
}

class JBlock extends Block
{
	constructor(x,y,col)
	{
		col = color(252, 0, 0);
		super(x,y,col,4,true);

		for(var i=0;i<this.size-1;i++)
			this.texture[i][this.size-1] = new Filled(i,this.size-1,this.size,this.col);
		this.texture[this.size-2][this.size-2] = new Filled(this.size-2,this.size-2,this.size,this.col);

	}
}

class OBlock extends Block
{
	constructor(x,y,col)
	{
		col = color(250, 255, 0);
		super(x,y,col,2,true);

		for(var i=0;i<this.size;i++)
			for(var j=0;j<this.size;j++)
			this.texture[i][j] = new Filled(i,j,this.size,this.col);

	}
}

class SBlock extends Block
{
	constructor(x,y,col)
	{
		col = color(203, 0, 255);
		super(x,y,col,3,true);

		this.texture[1][0] = new Filled(1,0,this.size,this.col);
		this.texture[2][0] = new Filled(2,0,this.size,this.col);
		this.texture[0][1] = new Filled(0,1,this.size,this.col);
		this.texture[1][1] = new Filled(1,1,this.size,this.col);


	}
}


class ZBlock extends Block
{
	constructor(x,y,col)
	{
		col = color(255, 127, 0);
		super(x,y,col,3,true);
		
		this.texture[0][0] = new Filled(0,0,this.size,this.col);
		this.texture[1][0] = new Filled(1,0,this.size,this.col);
		this.texture[1][1] = new Filled(1,1,this.size,this.col);
		this.texture[2][1] = new Filled(2,1,this.size,this.col);


	}
}


class TBlock extends Block
{
	constructor(x,y,col)
	{
		col = color(0, 255, 255);
		super(x,y,col,4,true);
		
		this.texture[2][0] = new Filled(2,0,this.size,this.col);
		this.texture[1][1] = new Filled(1,1,this.size,this.col);
		this.texture[2][1] = new Filled(2,1,this.size,this.col);
		this.texture[3][1] = new Filled(3,1,this.size,this.col);


	}
}