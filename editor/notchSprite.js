/**
	Notch made his own sprite class for this game. Rather than hack around my own,
    I directly ported his to JavaScript and used that where needed.
	Code by Rob Kleffner, 2011
*/

Mario.NotchSprite = function(image) {
    this.XOld = 0; this.YOld = 0;
    this.X = 0; this.Y = 0;
    //碰撞检测中估计偏移
    this.Xa = 0; this.Ya = 0;
    //图片资源索引
    this.XPic = 0; this.YPic = 0;
    //单元资源内部原点;,用于X,Y偏移
    this.XPicO = 0; this.YPicO = 0;
    //在资源中一个单元的大小
    this.PicWidth = 32; this.PicHeight = 32;
    this.XFlip = false; this.YFlip = false;
    this.Visible = true;
    this.Image = image;
    this.Delta = 0;
    this.Tick = 0;
    this.SpriteTemplate = null;
    this.Layer = 1;
};

Mario.NotchSprite.prototype = new Enjine.Drawable();

Mario.NotchSprite.prototype.Draw = function(context, camera) {
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
        ,this.PicWidth / 2, this.PicHeight / 2,this.XPic * this.PicWidth, this.YPic * this.PicHeight, this.PicWidth, this.PicHeight);
    context.restore();

    //用于调试的矩形
    var Debug = false;
    if(Debug){
        xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.Width;
        yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;
        //myContext.DrawPoint(xPixel + this.Width,yPixel + this.YPicO);
        myContext.StrokeRect(xPixel,yPixel,this.Width*2,this.Height + this.YPicO)
    }
};

Mario.NotchSprite.prototype.Update = function(delta) {
    this.XOld = this.X;
    this.YOld = this.Y;
    this.Tick ++;
    this.Move();
    this.Delta = delta;
};

Mario.NotchSprite.prototype.UpdateNoMove = function(delta) {
    this.XOld = this.X;
    this.YOld = this.Y;
    this.Delta = 0;
};

Mario.NotchSprite.prototype.UpdateEditor = function(delta) {
    this.XOld = this.X;
    this.YOld = this.Y;
    this.Tick ++;
    this.EditorMove();
    this.Delta = 0;
};

Mario.NotchSprite.prototype.EditorMove = function() {
};


Mario.NotchSprite.prototype.Move = function() {
    this.X += this.Xa;
    this.Y += this.Ya;
};

Mario.NotchSprite.prototype.GetX = function(delta) {
    return ((this.XOld + (this.X - this.XOld) * delta) | 0) - this.XPicO;
};

Mario.NotchSprite.prototype.GetY = function(delta) {
    return ((this.YOld + (this.Y - this.YOld) * delta) | 0) - this.YPicO;
};

Mario.NotchSprite.prototype.CollideCheck = function() { };

Mario.NotchSprite.prototype.BumpCheck = function(xTile, yTile) { };

Mario.NotchSprite.prototype.Release = function(mario) { };

Mario.NotchSprite.prototype.ShellCollideCheck = function(shell) {
    return false;
};

Mario.NotchSprite.prototype.FireballCollideCheck = function(fireball) {
    return false;
};

Mario.NotchSprite.prototype.SubMove = function(xa, ya) {
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

    //go up
    if (ya > 0) {
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + this.Height, xa, ya)) {
            collide = true;
        } else if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + this.Height, xa, ya)) {
            collide = true;
        }
    }
    //go down
    if (ya < 0) {
        if (this.IsBlocking(this.X + xa, this.Y + ya, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya, xa, 0)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa - this.Width, this.Y + ya - this.YPicO, xa, ya)) {
            collide = true;
        } else if (collide || this.IsBlocking(this.X + xa + this.Width, this.Y + ya - this.YPicO, xa, ya)) {
            collide = true;
        }
    }
    
    if (xa > 0) {
        this.Sliding = true;
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + this.Height, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa + this.Width, this.Y + ya + ((this.Height / 2) | 0), xa, ya)) {
            collide = true
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
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + this.Height, xa, ya)) {
            collide = true;
        } else {
            this.Sliding = false;
        }
        
        if (this.IsBlocking(this.X + xa - this.Width, this.Y + ya + ((this.Height / 2) | 0), xa, ya)) {
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
        //go left
        if (xa < 0) {
            this.X = this.BackBorder(this.X - this.Width,16,-1) + this.Width;
            //this.X = (((this.X - this.Width) / 16) | 0) * 16 + this.Width;
            this.Xa = 0;
        }
        //go right
        if (xa > 0) {
            this.X = this.BackBorder(this.X + this.Width,16,1) - this.Width - 1;
            //this.X = (((this.X + this.Width) / 16 + 1) | 0) * 16 - this.Width - 1;
            this.Xa = 0;
        }
        //go up
        if (ya > 0) {
            this.Y = this.BackBorder(this.Y + this.Height,16,1) - this.Height;
            //this.Y = (((this.Y + this.Height) / 16) | 0) * 16 + this.Height;
            this.JumpTime = 0;
            this.Ya = 0;
        }
        //go down
        if (ya < 0) {
            this.Y = this.BackBorder(this.Y - this.YPicO,16,-1) + this.YPicO;
            //this.Y = (((this.Y + 1) / 16 ) | 0) * 16 + 1;
            this.OnGround = true;
        }
        
        return false;
    } else {
        this.X += xa;
        this.Y += ya;
        return true;
    }

};

Mario.NotchSprite.prototype.BackBorder = function (pos,width,type) {
    // body...
    var res;
    if(type == 1)
    {
        res = (((pos - 1) / width) | 0) * width + width;
    }else{
        res = (((pos + 1) / width) | 0) * width ;
    }
    return res;
}