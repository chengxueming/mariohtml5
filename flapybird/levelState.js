/**
	State for actually playing a randomly generated level.
	Code by Rob Kleffner, 2011
*/

Bird.LevelState = function() {
    this.GotoLoseState = false;
    this.Sprites = null;
};

Bird.LevelState.prototype = new Enjine.GameState();

Bird.LevelState.prototype.Enter = function() {
    Bird.Character();
    this.Sprites = new Enjine.DrawableManager();
    this.Camera = new Enjine.Camera();
    Bird.Character.Initialize(this);
    this.GotoLoseState = false;

};

Bird.LevelState.prototype.Exit = function() {

};


Bird.LevelState.prototype.Update = function(delta) {

};

Bird.LevelState.prototype.Draw = function(context) {

};

Bird.LevelState.prototype.CheckForChange = function(context) {
	if (this.GotoLoseState) {
		context.ChangeState(new Bird.LoseState());
	}
};
