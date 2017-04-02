/**
	State for actually playing a randomly generated level.
	Code by Rob Kleffner, 2011
*/

Bird.LevelState = function() {
    this.GotoLoseState = false;
    this.Sprites = null;
    this.Camera = null;
    this.width = 320;
    this.height = 240;
    this.EnterMap = false;
    this.SpriteTemplates = [];
    this.Level = null;
};

Bird.LevelState.prototype = new Enjine.GameState();

Bird.LevelState.prototype.Enter = function() {
    //Bird.Character();
    this.Sprites = new Enjine.DrawableManager();
    this.Camera = new Enjine.Camera();
    this.Level = new Bird.Level();
    Bird.Character.Initialize(this);
    this.GotoLoseState = false;
};

Bird.LevelState.prototype.Exit = function() {

};


Bird.LevelState.prototype.Update = function(delta) {
    Bird.Character.Update(delta);
    this.Camera.X = Bird.Character.X - 160;
        if (this.Camera.X < 0) {
        this.Camera.X = 0;
    }
    //this.Camera.Y += 2;
};

Bird.LevelState.prototype.Draw = function(context) {

    //绘制背景

    this.Level.Draw(context,this.Camera);
    context.save();
    context.translate(-this.Camera.X, -this.Camera.Y);
    Bird.Character.Draw(context, this.Camera);
    context.restore();
};

Bird.LevelState.prototype.CheckForChange = function(context) {
	if (this.GotoLoseState) {
		context.ChangeState(new Bird.LoseState());
	}
};
