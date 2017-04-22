/**
	State for actually playing a randomly generated level.
	Code by Rob Kleffner, 2011
*/

Editor.EditorState = function() {
    this.FontShadow = null;
    this.Font = null;
    this.t = 0;
    this.Delta = 0;
    this.DeathTime = 1;
    this.Camera = null;
    this.Background = null;
};

Editor.EditorState.prototype = new Enjine.GameState();

Editor.EditorState.prototype.Enter = function() {
    this.FontShadow = Mario.SpriteCuts.CreateBlackFont();
    this.Font = Mario.SpriteCuts.CreateWhiteFont();
    this.Background = new Editor.Background(Enjine.Resources.Images["block-38"],320,240);
    this.Camera = new Enjine.Camera;
};

Editor.EditorState.prototype.Exit = function() {

};


Editor.EditorState.prototype.Update = function(delta) {
  this.Delta = delta;
  this.DeathTime ++;
  if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) {
    this.Camera.X += 16;
    }
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up)) {
        this.Camera.Y -= 16;
    }
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
        this.Camera.Y += 16;
    }
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left)) {
            this.Camera.X -= 16;
    }
};

Editor.EditorState.prototype.Draw = function(context) {
    this.Background.Draw(context,this.Camera);
};

Editor.EditorState.prototype.CheckForChange = function(context) {
};