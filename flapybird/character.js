/**
	Global representation of the Bird character.
	Code by Rob Kleffner, 2011
*/

Bird.Character = function() {
    //these are static in Notch's code... here it doesn't seem necessary
    this.JumpTime = 0;
    this.XJumpSpeed = 0;
    this.YJumpSpeed = 0;
    this.Xa = 0;
    this.OnGround = false;
    this.Ya = 0;
    this.YPic = 2;
    this.PicHeight = 48;
};

Bird.Character.prototype = new Bird.NotchSprite(null);

Bird.Character.prototype.Initialize = function(world) {
    this.World = world;
    this.X = 32;
    this.Y = 128;
    this.Image = Enjine.Resources.Images["bird"];
};

Bird.Character.prototype.Move = function() {
    this.Xa = 4;
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S) || this.JumpTime < 0) {
        if (this.JumpTime < 2) {
            Enjine.Resources.PlaySound("jump");
            this.XJumpSpeed = 2;
            this.YJumpSpeed = -1.9;
            this.JumpTime = 7;
            this.Ya = this.JumpTime * this.YJumpSpeed;
        } else if (this.JumpTime > 0) {
            this.Xa += this.XJumpSpeed;
            this.Ya = this.JumpTime * this.YJumpSpeed;
            this.JumpTime--;
        }
    }else{
        this.JumpTime = 0;
    }

    this.Ya *= 0.85;

    if (!this.OnGround) {
        this.Ya += 3;
    }

    this.SubMove(this.Xa, 0);
    this.SubMove(0, this.Ya);


    
    this.CalcPic();
};

Bird.Character.prototype.CalcPic = function() {
    
    if(this.YPic == 3){
        this.YPic = 2;
    }else{
        this.YPic = 3;
    }
};

Bird.Character.prototype.SubMove = function(xa, ya) {
    var collide = false;
    
    while (xa > 8) {
        if (!this.SubMove(8, 0)) {
            return false;
        }
        xa -= 8;
    }
    while (xa < -8) {
        if (!this.SubMove(-8, 0)) {
            return false;
        }
        xa += 8;
    }
    while (ya > 8) {
        if (!this.SubMove(0, 8)) {
            return false;
        }
        ya -= 8;
    }
    while (ya < -8) {
        if (!this.SubMove(0, -8)) {
            return false;
        }
        ya += 8;
    }
    
    if (ya > 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + 1, xa, ya)) {
            collide = true;
        }
    }
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        }
    }
    
    if (xa > 0) {
        this.Sliding = true;
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
    }
    if (xa < 0) {
        this.Sliding = true;
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.Height, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya - ((this.Height / 2) | 0), xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
    }
    
    if (collide) {
        width = 32;
        if (xa < 0) {
            this.X = (((this.X - this.Width) / width) | 0) * width + this.Width;
            this.Xa = 0;
        }
        if (xa > 0) {
            this.X = (((this.X + this.Width) / width + 1) | 0) * width - this.Width - 1;
            this.Xa = 0;
        }
        if (ya < 0) {
            this.Y = (((this.Y - this.Height) / width) | 0) * width + this.Height;
            this.JumpTime = 0;
            this.Ya = 0;
        }
        if (ya > 0) {
            this.Y = (((this.Y - 1) / width + 1) | 0) * width - 1;
            this.OnGround = true;
        }
        
        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }
};

Bird.Character.prototype.IsBlocking = function(x, y, xa, ya) {
    var blocking = false, block = 0, xx = 0, yy = 0;
    var blockwidth = 32;
    x = (x / blockwidth) | 0;
    y = (y / blockwidth) | 0;
    if (x === ((this.X / blockwidth) | 0) && y === ((this.Y / blockwidth) | 0)) {
        return false;
    }
    block = this.World.Level.GetBlock(x, y);
    blocking = this.World.Level.IsBlocking(x, y, xa, ya);
    return blocking;
};


