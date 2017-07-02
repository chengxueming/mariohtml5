/**
	Represents a fireball.
	Code by Rob Kleffner, 2011
*/

Mario.Fireball = function(world, x, y, facing, setting) {
	this.GroundInertia = 0.89;
	this.AirInertia = 0.89;
	
	this.Image = Enjine.Resources.Images[setting.img];
	
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Facing = facing;

	this.Style = setting.style;
	this.Status = "run";
	this.StyleIndex = 0;
	
	this.XPicO = 4;
	this.YPicO = 4;
	this.YPic = 0;
	this.XPic = 0;
	this.Height = 8;
	this.Width = 4;
	this.PicWidth = 16;
	this.PicHeight = 28;
	this.Ya = 4;
	this.Dead = false;
	this.DeadTime = 0;
	this.Anim = 0;
	this.OnGround = false;
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
	
	//this.YPic = this.Anim % 4;
	
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

	this.CallPic();
};

Mario.Fireball.prototype.CallPic = function(){
	// body... 
	var status = this.Style[this.Status].split(",");
	if(this.StyleIndex >= status.length) {
		this.StyleIndex = 0;
	} else {
		this.StyleIndex ++;
	}
	this.YPic = status[this.StyleIndex];
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