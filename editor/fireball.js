/**
	Represents a fireball.
	Code by Rob Kleffner, 2011
*/

Mario.Fireball = function(world, x, y, facing) {
	this.GroundInertia = 0.89;
	this.AirInertia = 0.89;
	
	this.Image = Enjine.Resources.Images["particles"];
	
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Facing = facing;
	
	this.XPicO = 4;
	this.YPicO = 4;
	this.YPic = 3;
	this.XPic = 4;
	this.Height = 8;
	this.Width = 4;
	this.PicWidth = this.PicHeight = 8;
	this.Ya = 4;
	this.Dead = false;
	this.DeadTime = 0;
	this.Anim = 0;
	this.OnGround = false;
    this.UnitHeight = this.PicWidth;
    this.UnitWidth = this.PicHeight;
};

Mario.Fireball.prototype = new Mario.NotchSprite();

Mario.Fireball.prototype.Move = function() {
	var i = 0, sideWaysSpeed = 8;
	
	if (this.DeadTime > 0) {
		for (i = 0; i < 8; i++) {
			this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 8 - 4) | 0) + 4, ((this.Y + Math.random() * 8 - 4) | 0) + 2, Math.random() * 2 - 1 * this.Facing, Math.random() * 2 - 1, 0, 1, 5));
		}
		this.World.RemoveSprite(this);
		return;
	}
	
	if (this.Facing != 0) {
		this.Anim++;
	}
	
	if (this.Xa > 2) {
		this.Facing = 1;
	}
	if (this.Xa < -2) {
		this.Facing = -1;
	}
	
	this.Xa = this.Facing * sideWaysSpeed;
	
	this.World.CheckFireballCollide(this);
	
	this.FlipX = this.Facing === -1;
	
	this.XPic = this.Anim % 4;
	
	if (!this.SubMove(this.Xa, 0)) {
		this.Die();
	}
	
	this.OnGround = false;
	this.SubMove(0, this.Ya);
	if (this.OnGround) {
		this.Ya = 10;
	}
	
	this.Ya *= 0.95;
	if (this.OnGround) {
		this.Xa *= this.GroundInertia;
	} else {
		this.Xa *= this.AirInertia;
	}
	
	if (!this.OnGround) {
		this.Ya -= 1.5;
	}
};


Mario.Fireball.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }
    
    return this.World.TileMap.IsBlocking(x, y, xa, ya);
};

Mario.Fireball.prototype.Die = function() {
	this.Dead = true;
	this.Xa = -this.Facing * 2;
	this.Ya = 5;
	this.DeadTime = 100;
};