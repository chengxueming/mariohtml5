/**
	State for actually playing a randomly generated level.
	Code by Rob Kleffner, 2011
*/

Bird.LevelState = function() {
    this.GotoLoseState = false;
    this.Sprites = null;
    this.Camera = null;
    this.width = 320;
    this.height = 256;
    this.EnterMap = false;
    this.SpriteTemplates = [];
    this.Level = null;
};

Bird.LevelState.prototype = new Enjine.GameState();

Bird.LevelState.prototype.Enter = function() {
    //Bird.Character();
    this.Camera = new Enjine.Camera();
    this.Level = new Bird.Level();
    //Bird.Character.Initialize(this);
    Mario.MarioCharacter.Initialize(this);
    this.Sprites = new Enjine.DrawableManager();
    this.AddSprite(Mario.MarioCharacter);
   //this.AddSprite(new Mario.FlowerEnemy(this,200,200));
   //this.AddSprite(new Mario.StoneEnemy(this,100,200));
    this.AddSprite(new Mario.Enemy(this,50,200,0,0,false));
    //this.AddSprite(new Mario.Enemy(this,300,200,0,0,true));
    this.GotoLoseState = false;
};

Bird.LevelState.prototype.Exit = function() {

};


Bird.LevelState.prototype.Update = function(delta) {
    //Bird.Character.Update(delta);
    this.Camera.X = Mario.MarioCharacter.X - 160;
    if (this.Camera.X < 0) {
        this.Camera.X = 0;
    }
    if (this.Camera.Y < 0) {
        this.Camera.Y = 0;
    }

    for (i = 0; i < this.Sprites.Objects.length; i++) {
        this.Sprites.Objects[i].Update(delta);
    }

    for (i = 0; i < this.Sprites.Objects.length; i++) {
        this.Sprites.Objects[i].CollideCheck();
    }


    Mario.MarioCharacter.Update(delta);

    this.Camera.X = (Mario.MarioCharacter.XOld + (Mario.MarioCharacter.X - Mario.MarioCharacter.XOld) * delta) - 160;
    this.Camera.Y = (Mario.MarioCharacter.YOld + (Mario.MarioCharacter.Y - Mario.MarioCharacter.YOld) * delta) - 128;
    //this.Camera.Y += 2;
};

Bird.LevelState.prototype.Draw = function(context) {

    //绘制背景
    if (this.Camera.X < 0) {
        this.Camera.X = 0;
    }
    if (this.Camera.Y < 0) {
        this.Camera.Y = 0;
    }

    if (this.Camera.Y > this.Level.height * 32 - 256) {
        this.Camera.Y = this.Level.height * 32 - 256;
    }

    this.Level.Draw(context,this.Camera);
    context.save();
    context.translate(-this.Camera.X, -this.Camera.Y);
    //Bird.Character.Draw(context, this.Camera);
    for (i = 0; i < this.Sprites.Objects.length; i++) {
        if (this.Sprites.Objects[i].Layer === 1) {
            this.Sprites.Objects[i].Draw(context, this.Camera);
        }
    }
    context.restore();
    
};

Bird.LevelState.prototype.CheckForChange = function(context) {
	if (this.GotoLoseState) {
		context.ChangeState(new Bird.LoseState());
	}
};

Bird.LevelState.prototype.AddSprite = function(sprite) {
    this.Sprites.Add(sprite);
};

Bird.LevelState.prototype.RemoveSprite = function(sprite) {
    this.Sprites.Remove(sprite);
};
