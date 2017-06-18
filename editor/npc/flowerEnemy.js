/**
	Represents a flower enemy.
	Code by Rob Kleffner, 2011
*/

Mario.FlowerEnemy = function(world, x, y) {
    this.Image = Enjine.Resources.Images["enemies"];
    this.World = world;
    this.X = x;
    this.Y = y;
    this.Facing = 1;
    this.Type = Mario.Enemy.Spiky;
    this.Winged = false;
    this.NoFireballDeath = false;
    this.XPic = 0;
    this.YPic = 6;
    this.YPicO = 24;
    this.Height = 12;
    this.Width = 2;
    this.YStart = y;
    this.Ya = -8;
    this.Y -= 1;
    this.Layer = 0;
    this.JumpTime = 0;
    
    var i = 0;
    for (i = 0; i < 4; i++) {
        this.Move();
    }
};

Mario.FlowerEnemy.prototype = new Mario.Enemy();

Mario.FlowerEnemy.prototype.Move = function() {
    var i = 0, xd = 0;
    if (this.DeadTime > 0) {
        this.UpdateDeath();
        return;
    }
    
    
    if (this.Y >= this.YStart) {
        this.YStart = this.Y;
        xd = Math.abs(Mario.MarioCharacter.X - this.X) | 0;
        this.JumpTime++;
        if (this.JumpTime > 40 && xd > 24) {
            this.Ya = -8;
        } else {
            this.Ya = 0;
        }
    } else {
        this.JumpTime = 0;
    }
    
    this.Y += this.Ya;
    this.Ya *= 0.9;
    this.Ya += 0.1;
    
    this.XPic = (((this.Tick / 2) | 0) & 1) * 2 + (((this.Tick / 6) | 0) & 1);
};

Mario.FlowerEnemy.prototype.EditorMove = function() {
    this.XPic = (((this.Tick / 2) | 0) & 1) * 2 + (((this.Tick / 6) | 0) & 1);
}