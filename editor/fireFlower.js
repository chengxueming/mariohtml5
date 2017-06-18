/**
	Represents a fire powerup.
	Code by Rob Kleffner, 2011
*/

Mario.FireFlower = function(world, x, y) {
	this.Width = 4;
	this.Height = 24;
	
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Image = Enjine.Resources.Images["npc-14"];
	
	this.XPicO = 8;
	this.YPicO = 1;
	this.XPic = 0;
	this.YPic = 0;
	this.Height = 12;
	this.Facing = 1;
	this.PicWidth = this.PicHeight = 32;
	
	this.Life = 0;
};

Mario.FireFlower.prototype = new Mario.NotchSprite();

Mario.FireFlower.prototype.CollideCheck = function() {
	if(this.SubCollideCheck(Mario.MarioCharacter)) {
		Mario.MarioCharacter.GetFlower();
		this.World.RemoveSprite(this);
	}
};

Mario.FireFlower.prototype.Move = function() {
	if (this.Life < 9) {
		this.Layer = 1;
		this.Y++;
		this.Life++;
		return;
	}
};