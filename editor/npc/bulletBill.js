/**
	Represents a bullet bill enemy.
	Code by Rob Kleffner, 2011
*/

Mario.BulletBill = function(world, x, y, dir) {
	this.Image = Enjine.Resources.Images["enemies"];
	this.World = world;
	this.X = x;
	this.Y = y;
	this.Facing = dir;
	
	this.XPicO = 8;
	this.YPicO = 31;
	this.Height = 12;
	this.Width = 4;
	this.PicWidth = 16;
	this.YPic = 5;
	this.XPic = 0;
	this.Ya = -5;
	this.DeadTime = 0;
	this.Dead = false;
	this.Anim = 0;
};

Mario.BulletBill.prototype = new Mario.NotchSprite();

Mario.BulletBill.prototype.CollideCheck = function() {
    if (this.Dead) {
        return;
    }
    
    if(this.SubCollideCheck()) {
        if (Mario.MarioCharacter.Y > 0 && yMarioD <= 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
            Mario.MarioCharacter.Stomp(this);
            this.Dead = true;
            
            this.Xa = 0;
            this.Ya = 1;
            this.DeadTime = 100;
            } else {
                Mario.MarioCharacter.GetHurt();
            }
        }
};  

Mario.BulletBill.prototype.Move = function() {
    var i = 0, sideWaysSpeed = 4;
    if (this.DeadTime > 0) {
        this.UpdateDeath();
        return;
    }
    
    this.Xa = this.Facing * sideWaysSpeed;
    this.XFlip = this.Facing === -1;
    this.Move(this.Xa, 0);
};

Mario.BulletBill.prototype.SubMove = function(xa, ya) {
	this.X += xa;
	return true;
};

Mario.BulletBill.prototype.FireballCollideCheck = function(fireball) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    return this.SubCollideCheck(fireball);
};

Mario.BulletBill.prototype.ShellCollideCheck = function(shell) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    if(this.SubCollideCheck(shell)) {
        Enjine.Resources.PlaySound("kick");
        this.Dead = true;
        this.Xa = 0;
        this.Ya = 1;
        this.DeadTime = 100;
        return true;
    }
    return false;
};