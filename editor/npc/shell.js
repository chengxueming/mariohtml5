/**
	Represents a shell that once belonged to a now expired koopa.
	Code by Rob Kleffner, 2011
*/

Mario.Shell = function(world, x, y, type) {
	this.World = world;
	this.X = x;
	this.Y = y;
	
	this.YPic = type;
	this.Image = Enjine.Resources.Images["npc-172"];
	
	this.XPicO = 8;
	this.YPicO = 1;
	this.Width = 4;
	this.Height = 12;
	this.Facing = 0;
	this.PicWidth = 32;
	this.PicHeight = 28;
	this.XPic = 0;
	this.Ya = -5;
	
	this.Dead = false;
	this.DeadTime = 0;
	this.Carried = false;
	
	this.GroundInertia = 0.89;
	this.AirInertia = 0.89;
	this.OnGround = false;
	this.Anim = 0;
};

Mario.Shell.prototype = new Mario.NotchSprite();

Mario.Shell.prototype.FireballCollideCheck = function(fireball) {
	if (this.DeadTime !== 0) {
        return false;
    }
    
    var xD = fireball.X - this.X, yD = fireball.Y - this.Y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.Height && yD < fireball.Height) {
			if (this.Facing !== 0) {
				return true;
			}
			
			Enjine.Resources.PlaySound("kick");
			
			this.Xa = fireball.Facing * 2;
			this.Ya = -5;
			if (this.SpriteTemplate !== null) {
				this.SpriteTemplate.IsDead = true;
			}
			this.DeadTime = 100;
			this.YFlip = true;
			
            return true;
        }
    }
    return false;
};

Mario.Shell.prototype.CollideCheck = function() {
	if (this.Carried || this.Dead || this.DeadTime > 0) {
		return;
	}
	
	if(this.SubCollideCheck(Mario.MarioCharacter)) {
		if (Mario.MarioCharacter.Ya < 0 && yMarioD <= 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
			Mario.MarioCharacter.Stomp(this);
			if (this.Facing !== 0) {
				this.Xa = 0;
				this.Facing = 0;
			} else {
				this.Facing = Mario.MarioCharacter.Facing;
			}
		} else {
			if (this.Facing !== 0) {
				Mario.MarioCharacter.GetHurt();
			} else {
				Mario.MarioCharacter.Kick(this);
				this.Facing = Mario.MarioCharacter.Facing;
			}
		}
	}
};

Mario.Shell.prototype.Move = function() {
	var sideWaysSpeed = 11, i = 0;
	if (this.Carried) {
		this.World.CheckShellCollide(this);
		return;
	}
	
	if (this.DeadTime > 0) {
		this.UpdateDeath();
		this.CalcPic();
	}
	
	if (this.Facing !== 0) {
		this.Anim++;
	}
	
	if (this.Xa > 2) {
		this.Facing = 1;
	}
	if (this.Xa < -2) {
		this.Facing = -1;
	}
	
	this.Xa = this.Facing * sideWaysSpeed;
	
	if (this.Facing !== 0) {
		this.World.CheckShellCollide(this);
	}
	
	this.XFlip = this.Facing === -1;
	
	//this.XPic = ((this.Anim / 2) | 0) % 4 + 3;
    
    if (!this.SubMove(this.Xa, 0)) {
        Enjine.Resources.PlaySound("bump");
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
    this.CalcPic();
};

Mario.Shell.prototype.CalcPic = function() {
    this.YPic = ((this.Anim / 2) | 0) % 4;
}



Mario.Shell.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === ((this.X / 16) | 0) && y === ((this.Y / 16) | 0)) {
        return false;
    }
    
    var blocking = this.World.TileMap.IsBlocking(x, y, xa, ya);
    
    //撞到砖块上
    if (blocking && ya === 0 && xa !== 0) {
        this.World.Bump(x, y, true);
    }
    return blocking;
};

Mario.Shell.prototype.BumpCheck = function(x, y) {
    if (this.X + this.Width > x * 16 && this.X - this.Width < x * 16 + 16 && y === (((this.Y - 1) / 16) | 0)) {
        this.Facing = -Mario.MarioCharacter.Facing;
        this.Ya = -10;
    }
};

Mario.Shell.prototype.Die = function() {
    this.Dead = true;
    this.Carried = false;
    this.Xa = -this.Facing * 2;
    this.Ya = -5;
    this.DeadTime = 100;
};

Mario.Shell.prototype.ShellCollideCheck = function(shell) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    if(this.SubCollideCheck(shell))	{
            Enjine.Resources.PlaySound("kick");
            if (Mario.MarioCharacter.Carried === shell || Mario.MarioCharacter.Carried === this) {
                Mario.MarioCharacter.Carried = null;
            }
            this.Die();
            shell.Die();
            return true;
        }
    }
    return false;
};

Mario.Shell.prototype.Release = function(mario) {
    this.Carried = false;
    this.Facing = Mario.MarioCharacter.Facing;
    this.X += this.Facing * 8;
};