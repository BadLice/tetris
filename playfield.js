class Playfield
{
	constructor(nW,nH)
	{
		//size 10*20
		this.nW=nW; //number of x cells
		this.nH=nH; //number of y cells

		nW=this.nW;
		nH=this.nH;

		this.playfield = [];

		for(var i =0;i<this.nW;i++)
		{
			this.playfield[i] = [];
			for(var j =0;j<this.nH;j++)
				this.playfield[i].push(new Cell(i,j,this.nW,this.nH));

		}

	}

	draw()
	{
		this.drawCells();
	}

	drawCells()
	{

		for(var i =0;i<this.playfield.length;i++)
			for(var j =0;j<this.playfield[i].length;j++)
				this.playfield[i][j].draw();
	}

}

class Cell
{
	constructor(x,y,nW,nH,col)
	{

		this.w = width/nW/2;
		this.h = height/nH;
		if(!shift)
			shift = ((width-this.w*nW)/2);
		this.x = x*this.w+shift;
		this.y = y*this.h;

		if(!blockSize)
			blockSize = this.w;
		if(!col)
			this.col=color(80);
		else
			this.col=col;
	}

	draw()
	{
		fill(this.col);
		stroke(0);
		rect(this.x,this.y,this.w,this.h);
	}
}