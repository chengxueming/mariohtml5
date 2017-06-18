/**
	A generic template for an enemy in the game.
	Code by Rob Kleffner, 2011
*/

Mario.Enemy = function(world, x, y, dir, type, winged) {
    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;
    this.RunTime = 0;
    this.OnGround = false;
    this.MayJump = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.Width = 4;
    this.Height = 24;
    this.DeadTime = 0;
    this.FlyDeath = false;
    this.WingTime = 0;
    this.NoFireballDeath = false;
    
    this.X = x;
    this.Y = y;
    this.World = world;
    
    this.Type = type;
    this.Winged = winged;
    
    this.Image = this.getImage(type);
    this.XPicO = 8;
    this.YPicO = 1;
    this.AvoidCliffs = this.Type === Mario.Enemy.RedKoopa;
    this.NoFireballDeath = this.Type === Mario.Enemy.Spiky;
    
    this.XPic = 0;
    this.PicWidth = 32;
    this.PicHeight = 54;
    //表示除了乌龟以外，高度都是12
    if (type > 1) {
        this.Height = 12;
        this.PicHeight = 32;
    }
    this.Facing = dir;
    if (this.Facing === 0) {
        this.Facing = 1;
    }
    

};

//Static variables
Mario.Enemy.RedKoopa = 0;
Mario.Enemy.GreenKoopa = 1;
Mario.Enemy.Goomba = 2;
Mario.Enemy.Spiky = 3;
Mario.Enemy.Flower = 4;

Mario.Enemy.prototype = new Mario.NotchSprite();

Mario.Enemy.prototype.getImage = function(type) {
    var imgMap = {
        0: "npc-110",
        1: "npc-109",
        2: "npc-89",
        3: "npc-285",
        4: "npc-109"
    };
    return Enjine.Resources.Images[imgMap[type]];
}

Mario.Enemy.prototype.CollideCheck = function() {
    if (this.DeadTime !== 0) {
        return;
    }
    var status = this.SubCollideCheck(Mario.MarioCharacter);
    if(status) {
        //判断能踩死的精灵(穿山甲踩不死)
        if (this.Type !== Mario.Enemy.Spiky && Mario.MarioCharacter.Ya < 0 && (status & Mario.NotchSprite.MeDown) && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
            Mario.MarioCharacter.Stomp(this);
            if (this.Winged) {
                this.Winged = false;
                this.Ya = 0;
            } else {
                this.YPicO = 31 - (32 - 8);
                this.PicHeight = 8;
                
                if (this.SpriteTemplate !== null) {
                    this.SpriteTemplate.IsDead = true;
                }
                
                this.DeadTime = 10;
                this.Winged = false;
                
                if (this.Type === Mario.Enemy.RedKoopa) {
                    this.World.AddSprite(new Mario.Shell(this.World, this.X, this.Y, 0));
                } else if (this.Type === Mario.Enemy.GreenKoopa) {
                    this.World.AddSprite(new Mario.Shell(this.World, this.X, this.Y, 1));
                }
            }
        } else {
            Mario.MarioCharacter.GetHurt();
        }
    }
};

Mario.Enemy.prototype.Move = function() {
    var i = 0, sideWaysSpeed = 1.75, runFrame = 0;

    this.WingTime++;
    if (this.DeadTime > 0) {
        this.UpdateDeath();
        this.CalcPic();
        return;
    }
    
    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    
    this.Xa = this.Facing * sideWaysSpeed;
    
    this.MayJump = this.OnGround;
    
    this.XFlip = this.Facing === -1;
    
    this.RunTime += Math.abs(this.Xa) + 5;
    
    if (!this.SubMove(this.Xa, 0)) {
        this.Facing = -this.Facing;
    }
    this.OnGround = false;
    this.SubMove(0, this.Ya);
    
    this.Ya *= this.Winged ? 0.95 : 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }
    
    if (!this.OnGround) {
        if (this.Winged) {
            this.Ya -= 0.6;
        } else {
            this.Ya -= 2;
        }
    } else if (this.Winged) {
        this.Ya = 10;
    }
    this.CalcPic();
};

Mario.Enemy.prototype.CalcPic = function() {
    var runFrame = ((this.RunTime / 20) | 0) % 2;
    
    if (!this.OnGround) {
        runFrame = 1;
    }

    if (this.Winged) {
        runFrame = ((this.WingTime / 4) | 0) % 2;
    }

    if(1 == this.Facing && this.Type != 2) {
        runFrame += 2;
    }
    this.YPic = runFrame;
}

Mario.Enemy.prototype.EditorMove = function() {
    //this.XPic = (((this.Tick / 2) | 0) & 1) * 2 + (((this.Tick / 6) | 0) & 1);
}


Mario.Enemy.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    
    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }
    
    return this.World.TileMap.IsBlocking(x, y, xa, ya);
};

Mario.Enemy.prototype.ShellCollideCheck = function(shell) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    var xd = shell.X - this.X, yd = shell.Y - this.Y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.Height && yd < shell.Height) {
            Enjine.Resources.PlaySound("kick");
            
            this.Xa = shell.Facing * 2;
            this.Ya = -5;
            this.FlyDeath = true;
            if (this.SpriteTemplate !== null) {
                this.SpriteTemplate.IsDead = true;
            }
            this.DeadTime = 100;
            this.Winged = false;
            this.YFlip = true;
            return true;
        }
    }
    return false;
};

Mario.Enemy.prototype.FireballCollideCheck = function(fireball) {
    if (this.DeadTime !== 0) {
        return false;
    }
    
    var xd = fireball.X - this.X, yd = fireball.Y - this.Y;
    if (xd > -16 && xd < 16) {
        if (yd > -this.Height && yd < fireball.Height) {
            if (this.NoFireballDeath) {
                return true;
            }
        
            Enjine.Resources.PlaySound("kick");
            
            this.Xa = fireball.Facing * 2;
            this.Ya = -5;
            this.FlyDeath = true;
            if (this.SpriteTemplate !== null) {
                this.SpriteTemplate.IsDead = true;
            }
            this.DeadTime = 100;
            this.Winged = false;
            this.YFlip = true;
            return true;
        }
    }
};

Mario.Enemy.prototype.BumpCheck = function(xTile, yTile) {
    if (this.DeadTime !== 0) {
        return;
    }
    
    if (this.X + this.Width > xTile * 16 && this.X - this.Width < xTile * 16 + 16 && yTile === ((this.Y - 1) / 16) | 0) {
        Enjine.Resources.PlaySound("kick");
        
        this.Xa = -Mario.MarioCharacter.Facing * 2;
        this.Ya = -5;
        this.FlyDeath = true;
        if (this.SpriteTemplate !== null) {
            this.SpriteTemplate.IsDead = true;
        }
        this.DeadTime = 100;
        this.Winged = false;
        this.YFlip = true;
    }
};

Mario.Enemy.prototype.SubDraw = Mario.NotchSprite.prototype.Draw;

Mario.Enemy.prototype.Draw = function(context, camera) {
    var xPixel = 0, yPixel = 0;
    
    if (this.Winged) {
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;
        
        if (this.Type !== Mario.Enemy.RedKoopa && this.Type !== Mario.Enemy.GreenKoopa) {
            this.XFlip = !this.XFlip;
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32);
            context.restore();
            this.XFlip = !this.XFlip;
        }
    }
    
    this.SubDraw(context, camera);
    
    if (this.Winged) {
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;
        
        if (this.Type === Mario.Enemy.RedKoopa && this.Type === Mario.Enemy.GreenKoopa) {
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel) : yPixel - 8, 16, 32);
            context.restore();
        } else {
            context.save();
            context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
            context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
            context.drawImage(this.Image, (((this.WingTime / 4) | 0) % 2) * 16, 4 * 32, 16, 32,
                this.XFlip ? (320 - xPixel - 24) : xPixel - 8, this.YFlip ? (240 - yPixel - 32) : yPixel - 8, 16, 32);
            context.restore();
        }
    }
};

