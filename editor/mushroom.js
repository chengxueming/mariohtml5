/**
	Represents a life-giving mushroom.
	Code by Rob Kleffner, 2011
*/

Mario.Mushroom = function(world, x, y) {
    this.RunTime = 0;
    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;
    this.OnGround = false;
    this.Width = 4;
    this.Height = 24;
    this.World = world;
    this.X = x;
    this.Y = y;
    this.Image = Enjine.Resources.Images["npc-9"];
    this.XPicO = 8;
    this.YPicO = 1;
    this.YPic = 0;
    this.Height = 12;
    this.Facing = 1;
    this.PicWidth = this.PicHeight = 32;
    this.Life = 0;
};

Mario.Mushroom.prototype = new Mario.NotchSprite();

Mario.Mushroom.prototype.CollideCheck = function() {
    if(this.SubCollideCheck(Mario.MarioCharacter)) {
        Mario.MarioCharacter.GetMushroom();
        this.World.RemoveSprite(this);
    }
};

Mario.Mushroom.prototype.Move = function() {
    //与fireflower相同 一个慢慢冒出的特效
    if (this.Life < 9) {
        this.Layer = 0;
        this.Y++;
        this.Life++;
        return;
    }
    
    var sideWaysSpeed = 1.75;
    this.Layer = 1;
    
    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    
    this.Xa = this.Facing * sideWaysSpeed;
    
    this.XFlip = this.Facing === -1;
    this.RunTime += Math.abs(this.Xa) + 5;
    
    if (!this.SubMove(this.Xa, 0)) {
        this.Facing = -this.Facing;
    }
    this.OnGround = false;
    this.SubMove(0, this.Ya);
    
    this.Ya *= 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }
    
    if (!this.OnGround) {
        this.Ya -= 2;
    }
};

Mario.Mushroom.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }
    
    return this.World.TileMap.IsBlocking(x, y, xa, ya);
};

Mario.Mushroom.prototype.BumpCheck = function(x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 - 16 && y === ((y - 1) / 16) | 0) {
        this.Facing = -Mario.MarioCharacter.Facing;
        this.Ya = -10;
    }
};