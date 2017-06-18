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

Mario.NotchSprite.MeUp = 1;
Mario.NotchSprite.MeDown = 1 << 1;
Mario.NotchSprite.MeLeft = 1 << 2;
Mario.NotchSprite.MeRight = 1 << 3;

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
    var Debug = true;
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

// Mario.NotchSprite.prototype.SubCollideCheck = function(otherSprite) {
//     //FireFlower 检测碰撞
//     var xMarioD = Mario.MarioCharacter.X - this.X;
//     var yMarioD = Mario.MarioCharacter.Y - this.Y;
//     if (xMarioD > -16 && xMarioD < 16) {
//         if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
//             Mario.MarioCharacter.GetFlower();
//             this.World.RemoveSprite(this);
//         }
//     }

//     //Shell FireBall ColideCheck
//     var xD = fireball.X - this.X, yD = fireball.Y - this.Y;
//     if (xD > -16 && xD < 16) {
//         if (yD > -this.Height && yD < fireball.Height) {
//             if (this.Facing !== 0) {
//                 return true;
//             }
            
//             Enjine.Resources.PlaySound("kick");
            
//             this.Xa = fireball.Facing * 2;
//             this.Ya = -5;
//             if (this.SpriteTemplate !== null) {
//                 this.SpriteTemplate.IsDead = true;
//             }
//             this.DeadTime = 100;
//             this.YFlip = true;
            
//             return true;
//         }
//     }

//     //enmy colide check
//     var xMarioD = Mario.MarioCharacter.X - this.X;
//     var yMarioD = Mario.MarioCharacter.Y - this.Y;
//     if (xMarioD > -this.Width * 2 - 4 && xMarioD < this.Width * 2 + 4) {
//         //if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
//         if (yMarioD < this.Height) {
//             //判断能踩死的精灵(穿山甲踩不死)
//             if (this.Type !== Mario.Enemy.Spiky && Mario.MarioCharacter.Ya < 0 && yMarioD >= 0 && (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)) {
//                 Mario.MarioCharacter.Stomp(this);
//                 if (this.Winged) {
//                     this.Winged = false;
//                     this.Ya = 0;
//                 } else {
//                     this.YPicO = 31 - (32 - 8);
//                     this.PicHeight = 8;
                    
//                     if (this.SpriteTemplate !== null) {
//                         this.SpriteTemplate.IsDead = true;
//                     }
                    
//                     this.DeadTime = 10;
//                     this.Winged = false;
                    
//                     if (this.Type === Mario.Enemy.RedKoopa) {
//                         this.World.AddSprite(new Mario.Shell(this.World, this.X, this.Y, 0));
//                     } else if (this.Type === Mario.Enemy.GreenKoopa) {
//                         this.World.AddSprite(new Mario.Shell(this.World, this.X, this.Y, 1));
//                     }
//                 }
//             } else {
//                 Mario.MarioCharacter.GetHurt();
//             }
//         }
//     }

//     //mushroom colide check
//     var xMarioD = Mario.MarioCharacter.X - this.X, yMarioD = Mario.MarioCharacter.Y - this.Y;
//     if (xMarioD > -16 && xMarioD < 16) {
//         if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
//             Mario.MarioCharacter.GetMushroom();
//             this.World.RemoveSprite(this);
//         }
//     }


// }

Mario.NotchSprite.prototype.SubCollideCheck = function(other) {
    //xD > 0 right; yD > 0 up;
    var left1 = this.X - this.Width, left2 = other.X - other.Width;
    var right1 = (this.X + this.Width), right2 = (other.X + other.Width);
    var bottom1 = this.Y, bottom2 = other.Y;
    var top1 = (this.Y + this.Height), top2 = other.Y + other.Height;
    if (bottom1 > top2) {
        return false;
    }
    if (top1 < bottom2) {
        return false;
    }
    if (right1 < left2) {
        return false;
    }
    if (left1 > right2) {
        return false;
    }

    var status = 0;
    if(bottom1 > bottom2) {
        status |= Mario.NotchSprite.MeUp;
    }else {
        status |= Mario.NotchSprite.MeDown;
    }

    if(right1 > right2) {
        status |= Mario.NotchSprite.MeRight;
    }else {
        status |= Mario.NotchSprite.MeLeft;
    }
    return status;
}

Mario.NotchSprite.prototype.UpdateDeath = function() {
    this.DeadTime--;
    
    if (this.DeadTime === 0) {
        this.DeadTime = 1;
        for (i = 0; i < 8; i++) {
            this.World.AddSprite(new Mario.Sparkle(this.World,((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
        }
        this.World.RemoveSprite(this);
    }
    
    this.X += this.Xa;
    this.Y += this.Ya;
    this.Ya *= 0.95;
    this.Ya -= 1;
    return;
}