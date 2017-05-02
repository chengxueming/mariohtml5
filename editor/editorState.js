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
    this.TileMap = null;
};

Editor.EditorState.prototype = new Enjine.GameState();

Editor.EditorState.prototype.Enter = function() {
    this.FontShadow = Mario.SpriteCuts.CreateBlackFont();
    this.Font = Mario.SpriteCuts.CreateWhiteFont();
    this.Background = new Editor.Background(Enjine.Resources.Images["background2-1"],500,500);
    this.Camera = new Enjine.Camera;
    this.TileMap = new Mario.TileMap(20,15);
};

Editor.EditorState.prototype.Exit = function() {

};


Editor.EditorState.prototype.Update = function(delta) {
  this.Delta = delta;
  this.DeathTime ++;
  this.TileMap.Update();
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
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0,0,320,240);
    this.Background.Draw(context,this.Camera);
    this.TileMap.Draw(context,this.Camera);
};

Editor.EditorState.prototype.CheckForChange = function(context) {
};