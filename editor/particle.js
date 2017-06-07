/**
	Represents a piece of a broken block.
	Code by Rob Kleffner, 2011
*/

Mario.Particle = function(world, x, y, xa, ya, xPic, yPic) {
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Xa = xa;
	this.Ya = ya;
	this.XPic = 0;
	this.YPic = (Math.random() * 2) | 0;
	this.XPicO = 4;
	this.YPicO = 4;
	
	this.PicWidth = 16;
	this.PicHeight = 16;
	this.Life = 10;
	
	this.Image = Enjine.Resources.Images["effect-1"];
};

Mario.Particle.prototype = new Mario.NotchSprite();

Mario.Particle.prototype.Move = function() {
	if (this.Life - this.Delta < 0) {
		this.World.RemoveSprite(this);
	}
	this.Life -= this.Delta;
	
	this.X += this.Xa;
	this.Y += this.Ya;
	this.Ya *= 0.95;
	this.Ya -= 3;
};