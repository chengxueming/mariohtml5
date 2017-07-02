/**
	Global representation of the mario character.
	Code by Rob Kleffner, 2011
*/

Mario.Character = function() {
    //these are static in Notch's code... here it doesn't seem necessary
    this.Large = false;
    this.Fire = false;
    this.Coins = 0;
    this.Lives = 3;
    this.TileMapString = "none";
    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;
    
    //non static variables in Notch's code
    this.RunTime = 0;
    this.WasOnGround = false;
    this.OnGround = false;
    this.MayJump = false;
    this.Ducking = false;
    this.Sliding = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.CanShoot = false;
    
    this.Width = 4;
    this.Height = 15;
    
    //TileMap scene
    this.World = null;
    this.Facing = 0;
    this.PowerUpTime = 0;
    
    this.XDeathPos = 0; this.YDeathPos = 0;
    this.DeathTime = 0;
    this.WinTime = 0;
    this.InvulnerableTime = 0;
    
    //Sprite
    this.Carried = null;
    
    this.LastLarge = false;
    this.LastFire = false;
    this.NewLarge = false;
    this.NewFire = false;
    this.XPic = 5;
    //在图片上的偏移 mario 是100 敌人是紧凑
    this.UnitHeight = 100;
    this.UnitWidth = 100;
};

Mario.Character.prototype = new Mario.NotchSprite(null);

Mario.Character.prototype.Initialize = function(world) {
    this.World = world;
    this.X = 32;
    this.Y = 96;
	this.PowerUpTime = 0;
    
    //non static variables in Notch's code
    this.RunTime = 0;
    this.WasOnGround = false;
    this.OnGround = false;
    this.MayJump = false;
    this.Ducking = false;
    this.Sliding = false;
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.CanShoot = false;
    
    
    //TileMap scene
    this.World = world;
    this.Facing = 0;
    this.PowerUpTime = 0;
    
    this.XDeathPos = 0; this.YDeathPos = 0;
    this.DeathTime = 0;
    this.WinTime = 0;
    this.InvulnerableTime = 0;
    
    //Sprite
    this.Carried = null;
    
    this.SetLarge(false, this.Fire);
};

Mario.Character.prototype.Draw = function(context, camera) {
    var xPixel = 0, yPixel = 0;
    if (!this.Visible) {
        return;
    }
    
    xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
    yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;

    var myContext = new Editor.Context(context,320,240);
    context.save();
    // context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
    // context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
    //myContext.DrawClipImage(this.Image,this.XFlip ? (320 - xPixel - this.PicWidth) : xPixel,this.YFlip ? (240 - yPixel - this.PicHeight) : yPixel
    //    ,this.PicWidth, this.PicHeight,this.XPic * this.PicWidth, this.YPic * this.PicHeight, this.PicWidth, this.PicHeight);
myContext.DrawClipImage(this.Image,xPixel,yPixel
        ,this.PicWidth / 2, this.PicHeight / 2,this.XPic * this.UnitWidth, this.YPic * this.UnitHeight, this.PicWidth, this.PicHeight);
    context.restore();

    //用于调试的矩形
    var Debug = true;
    if(Debug){
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.Width;
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;
        //myContext.DrawPoint(xPixel + this.Width,yPixel + this.YPicO);
        myContext.StrokeRect(xPixel,yPixel,this.Width*2,this.Height + this.YPicO)
    }
};


Mario.Character.prototype.SetPosition = function(X,Y) {
    // body...
    this.X = X;
    this.Y = Y;
}

Mario.Character.prototype.SetLarge = function(large, fire) {
    if (fire) {
        large = true;
    }
    if (!large) {
        fire = false;
    }
    
    this.LastLarge = this.Large;
    this.LastFire = this.Fire;
    this.Large = large;
    this.Fire = fire;
    this.NewLarge = this.Large;
    this.NewFire = this.Fire;
    
    this.Blink(true);
};

Mario.Character.prototype.Blink = function(on) {
    this.Large = on ? this.NewLarge : this.LastLarge;
    this.Fire = on ? this.NewFire : this.LastFire;
    
    if (this.Large) {
        if (this.Fire) {
            //this.Image = Enjine.Resources.Images["fireMario"];
            this.Image = Enjine.Resources.Images["mario-3"];
        } else {
            this.Image = Enjine.Resources.Images["mario-2"];
        }
        
        this.XPicO = 8;
        this.YPicO = 1;
        this.PicWidth = 32;
        this.PicHeight = 55;
    } else {
        this.Image = Enjine.Resources.Images["mario-1"];
        this.XPicO = 8;
        this.YPicO = 1;
        this.PicWidth = 32
        this.PicHeight = 32;
    }
};

Mario.Character.prototype.Move = function() {
    if (this.WinTime > 0) {
        this.WinTime++;
        this.Xa = 0;
        this.Ya = 0;
        return;
    }
    
    if (this.DeathTime > 0) {
        this.DeathTime++;
        if (this.DeathTime < 11) {
            this.Xa = 0;
            this.Ya = 0;
        } else if (this.DeathTime === 11) {
            this.Ya = +15;
        } else {
            this.Ya -= 2;
        }
        this.X += this.Xa;
        this.Y += this.Ya;
        return;
    }
    
    if (this.PowerUpTime !== 0) {
        if (this.PowerUpTime > 0) {
            this.PowerUpTime--;
            this.Blink((((this.PowerUpTime / 3) | 0) & 1) === 0);
        } else {
            this.PowerUpTime++;
            this.Blink((((-this.PowerUpTime / 3) | 0) & 1) === 0);
        }
        
        if (this.PowerUpTime === 0) {
            this.World.Paused = false;
        }
        
        this.CalcPic();
        return;
    }
    
    if (this.InvulnerableTime > 0) {
        this.InvulnerableTime--;
    }
    
    this.Visible = (((this.InvulerableTime / 2) | 0) & 1) === 0;
    
    this.WasOnGround = this.OnGround;
    var sideWaysSpeed = Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) ? 1.2 : 0.6;
    
    if (this.OnGround) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down) && this.Large) {
            this.Ducking = true;
        } else {
            this.Ducking = false;
        }
    }
        
    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) || (this.JumpTime < 0 && !this.OnGround && !this.Sliding)) {
        if (this.JumpTime < 0) {
            this.Xa = this.XJumpSpeed;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.JumpTime++;
        } else if (this.OnGround && this.MayJump) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = 0;
            this.YJumpSpeed = 1.9;
            this.JumpTime = 7;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.OnGround = false;
            this.Sliding = false;
        } else if (this.Sliding && this.MayJump) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = -this.Facing * 6;
            this.YJumpSpeed = 2;
            this.JumpTime = -6;
            this.Xa = this.XJumpSpeed;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.OnGround = false;
            this.Sliding = false;
            this.Facing = -this.Facing;
        } else if (this.JumpTime > 0) {
            this.Xa += this.XJumpSpeed;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.JumpTime--;
        }
    } else {
        this.JumpTime = 0;
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !this.Ducking) {
        if (this.Facing === 1) {
            this.Sliding = false;
        }
        this.Xa -= sideWaysSpeed;
        if (this.JumpTime >= 0) {
            this.Facing = -1;
        }
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right) && !this.Ducking) {
        if (this.Facing === -1) {
            this.Sliding = false;
        }
        this.Xa += sideWaysSpeed;
        if (this.JumpTime >= 0) {
            this.Facing = 1;
        }
    }
    
    if ((!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) || this.Ducking || this.Ya < 0 || this.OnGround) {
        this.Sliding = false;  
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && this.CanShoot && this.Fire && this.World.FireballsOnScreen < 2) {
        Enjine.Resources.PlaySound("fireball");
        var setting = {
            name: "axe",
            typename: "weapon",
            draw: {
                img: "npc-171",
                xpic0: 4,
                ypic0: 4,
                picwidth: 16,
                picheight: 28,
            },
            body: {
                width: 4,
                height: 4,
            },
            speed: {
                sky: 1.5,
            },
            signal: {
                ground: "Reverse",
                wall: "Die"
            },
            style: {
                run: "0,1,2,3"
            }
        }
        this.World.AddSprite(new Mario.Thing(this.World, this.X + this.Facing * 6, this.Y + 20, this.Facing, setting));
    }
    
    this.CanShoot = !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A);
    this.MayJump = (this.OnGround || this.Sliding) && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S);
    this.XFlip = (this.Facing === -1);
    this.CalcPic();
    this.RunTime += Math.abs(this.Xa) + 5;
    
    if (Math.abs(this.Xa) < 0.5) {
        this.RunTime = 0;
        this.Xa = 0;
    }
    
    this.CalcPic();
    
    if (this.Sliding) {
        this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 4 - 2) | 0) + this.Facing * 8,
            ((this.Y + Math.random() * 4) | 0) - 24, Math.random() * 2 - 1, Math.random(), 0, 1, 5));
        this.Ya *= 0.5;
    }
    
    this.OnGround = false;
    this.SubMove(this.Xa, 0);
    this.SubMove(0, this.Ya);
    if (this.Y < 0) {
        this.Die();
    }
    
    if (this.X < 0) {
        this.X = 0;
        this.Xa = 0;
    }
    
    if (this.X > this.World.TileMap.ExitX * 16) {
        this.Win();
    }
    
    if (this.X > this.World.TileMap.Width * 16) {
        this.X = this.World.TileMap.Width * 16;
        this.Xa = 0;
    }
    
    this.Ya *= 0.85;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }
    
    if (!this.OnGround) {
        this.Ya -= 3;
    }
    
    if (this.Carried !== null) {
        this.Carried.X *= this.X + this.Facing * 8;
        this.Carried.Y *= this.Y - 2;
        if (!Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A)) {
            this.Carried.Release(this);
            this.Carried = null;
        }
    }
};

/**
tick update incr
freq how much times begin to change
limit max return (0~limit)
*/
Mario.Character.prototype.TickFrame = function(tick,freq,limit) {
    return ((tick / freq) | 0) % limit;
}

Mario.Character.prototype.CalcPic = function() {
    var runFrame = 0, i = 0, jumpFrame = 0;
    var xPos = 0,yPos = 0;
    
    if (this.Large) {
        runFrame = ((this.RunTime / 20) | 0) % 4;
        if (runFrame === 3) {
            runFrame = 1;
        }
        if (this.Carried === null && Math.abs(this.Xa) > 10) {
            runFrame += 3;
        }
        if (this.Carried !== null) {
            runFrame += 10;
        }
        if (!this.OnGround) {
            if (this.Carried !== null) {
                runFrame = 12;
            } else if (Math.abs(this.Xa) > 10) {
                runFrame = 7;
            } else {
                runFrame = 3;
            }
        }
    } else {
        runFrame = ((this.RunTime / 20) | 0) % 2;
        if (this.Carried === null && Math.abs(this.Xa) > 10) {
            runFrame += 2;
        }
        if (this.Carried !== null) {
            runFrame += 8;
        }
        if (!this.OnGround) {
            if (this.Carried !== null) {
                runFrame = 9;
            } else if (Math.abs(this.Xa) > 10) {
                runFrame = 5;
            } else {
                runFrame = 2;
            }
        }
    }
    
    if (this.OnGround && ((this.Facing === -1 && this.Xa > 0) || (this.Facing === 1 && this.Xa < 0))) {
        if (this.Xa > 1 || this.Xa < -1) {
            runFrame = this.Large ? 9 : 7;
        }
        
        if (this.Xa > 3 || this.Xa < -3) {
            for (i = 0; i < 3; i++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + Math.random() * 8 - 4) | 0, (this.Y + Math.random() * 4) | 0, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
        }
    }
    
    if (this.Large) {
        if (this.Ducking) {
            runFrame = 6;
        }
        this.Height = this.Ducking ? 12 : 24;
        this.PicHeight = this.Ducking ? 36:55; 
    } else {
        this.Height = 12;
    }
    if(this.XFlip == false){
        this.XPic = 5;
        this.YPic = runFrame;
    }else{
        this.XPic = 4;
        this.YPic = 8 - runFrame;
    }
    
};

/**
type -1 down or left return bigger 1 than border
type 1 up or right return less 1 than border
*/

Mario.Character.prototype.IsBlocking = function(x, y, xa, ya) {
    var blocking = false, block = 0, xx = 0, yy = 0;
    
    x = (x / 16) | 0;
    y = (y / 16) | 0;
    if (x === ((this.X / 16) | 0) && y === ((this.Y / 16) | 0)) {
        return false;
    }
    
    block = this.World.TileMap.GetBlock(x, y);
    
    //对于金币 一接触就获得
    if (((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.PickUpable) > 0) {
        this.GetCoin();
        Enjine.Resources.PlaySound("coin");
        this.World.TileMap.SetBlock(x, y, 0);
        for (xx = 0; xx < 2; xx++) {
            for (yy = 0; yy < 2; yy++) {
                this.World.AddSprite(new Mario.Sparkle(this.World, x * 16 + xx * 8 + ((Math.random() * 8) | 0), y * 16 + yy * 8 + ((Math.random() * 8) | 0), 0, 0, 0, 2, 5));
            }
        }
    }
    
    blocking = this.World.TileMap.IsBlocking(x, y, xa, ya);

    if (blocking && ya < 0) {
        
    }

    if (blocking && ya > 0) {
        Mario.MessageHandler.Fire("HIT_BLOCK","{}");
        this.World.Bump(x, y, this.Large);
    }
    return blocking;
};

//被mario踩头上后，mario的处理，在blutte和enmy和shell的CollideCheck处理
Mario.Character.prototype.Stomp = function(object) {
    var targetY = 0;

    if (this.DeathTime > 0 || this.World.Paused) {
        return;
    }
    
    targetY = object.Y - object.Height / 2;
    this.SubMove(0, targetY - this.Y);
    
    if (object instanceof Mario.Enemy || object instanceof Mario.BulletBill) {
        
        Enjine.Resources.PlaySound("kick");
        this.XJumpSpeed = 0;
        this.YJumpSpeed = -1.9;
        this.JumpTime = 8;
        this.Ya = this.JumpTime * this.YJumpSpeed;
        this.OnGround = false;
        this.Sliding = false;
        this.InvulnerableTime = 1;
    } else if (object instanceof Mario.Shell) {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A) && object.Facing === 0) {
            this.Carried = object;
            object.Carried = true;
        } else {
            Enjine.Resources.PlaySound("kick");
            this.XJumpSpeed = 0;
            this.YJumpSpeed = -1.9;
            this.JumpTime = 8;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.OnGround = false;
            this.Sliding = false;
            this.InvulnerableTime = 1;
        }
    }
};

Mario.Character.prototype.GetHurt = function() {
    if (this.DeathTime > 0 || this.World.Paused) {
        return;
    }
    if (this.InvulnerableTime > 0) {
        return;
    }
    
    if (this.Large) {
        this.World.Paused = true;
        this.PowerUpTime = -18;
        Enjine.Resources.PlaySound("powerdown");
        if (this.Fire) {
            this.SetLarge(true, false);
        } else {
            this.SetLarge(false, false);
        }
        this.InvulnerableTime = 32;
    } else {
        this.Die();
    }
};

Mario.Character.prototype.Win = function() {
    this.XDeathPos = this.X | 0;
    this.YDeathPos = this.Y | 0;
    this.World.Paused = true;
    this.WinTime = 1;
    Enjine.Resources.PlaySound("exit");
};

Mario.Character.prototype.Die = function() {
    this.XDeathPos = this.X | 0;
    this.YDeathPos = this.Y | 0;
    this.World.Paused = true;
    this.DeathTime = 1;
    Enjine.Resources.PlaySound("death");
    this.SetLarge(false, false);
};

Mario.Character.prototype.GetFlower = function() {
    if (this.DeathTime > 0 && this.World.Paused) {
        return;
    }
    
    if (!this.Fire) {
        this.World.Paused = true;
        this.PowerUpTime = 18;
        Enjine.Resources.PlaySound("powerup");
        this.SetLarge(true, true);
    } else {
        this.GetCoin();
        Enjine.Resources.PlaySound("coin");
    }
};

Mario.Character.prototype.GetMushroom = function() {
    if (this.DeathTime > 0 && this.World.Paused) {
        return;
    }
    
    if (!this.Large) {
        this.World.Paused = true;
        this.PowerUpTime = 18;
        Enjine.Resources.PlaySound("powerup");
        this.SetLarge(true, false);
    } else {
        this.GetCoin();
        Enjine.Resources.PlaySound("coin");
    }
};

Mario.Character.prototype.Kick = function(shell) {
    if (this.DeathTime > 0 && this.World.Paused) {
        return;
    }
    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.A)) {
        this.Carried = shell;
        shell.Carried = true;
    } else {
        Enjine.Resources.PlaySound("kick");
        this.InvulnerableTime = 1;
    }
};

Mario.Character.prototype.Get1Up = function() {
    Enjine.Resources.PlaySound("1up");
    this.Lives++;
    if (this.Lives === 99) {
        this.Lives = 99;
    }
};

Mario.Character.prototype.GetCoin = function() {
    this.Coins++;
    if (this.Coins === 100) {
        this.Coins = 0;
        this.Get1Up();
    }
};


Mario.Character.prototype.EditorMove = function() {
    //this.XPic = (((this.Tick / 2) | 0) & 1) * 2 + (((this.Tick / 6) | 0) & 1);
}