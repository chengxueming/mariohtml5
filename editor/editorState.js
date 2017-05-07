/**
	State for actually playing a randomly generated TileMap.
	Code by Rob Kleffner, 2011
*/

Editor.EditorState = function() {
    this.t = 0;
    this.Delta = 0;
    this.DeathTime = 1;
    //locate left down
    this.Camera = null;
    this.Background = null;
    this.TileMap = null;
    this.TileMapRenderer = null;
    this.Sprites = null;
};

Editor.EditorState.prototype = new Enjine.GameState();

Editor.EditorState.prototype.Enter = function() {

    Mario.MarioCharacter.Initialize(this);

    this.Background = new Editor.Background(Enjine.Resources.Images["background2-1"],500,500);
    this.Camera = new Enjine.Camera;
    this.TileMap = new Mario.TileMap(20,15);
    this.TileMapRenderer = new Mario.TileMapRenderer(this.TileMap,320,240);
    this.Sprites = new Enjine.DrawableManager();
    this.ShellsToCheck = [];
    this.FireballsToCheck = [];
    this.SpritesToAdd = [];
    this.SpritesToRemove = [];

    this.Sprites.Add(Mario.MarioCharacter);
};

Editor.EditorState.prototype.Exit = function() {

};

Editor.EditorState.prototype.UpdateCameraBefore = function(delta) {
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
}

Editor.EditorState.prototype.Update = function(delta) {
    this.Delta = delta;
    this.DeathTime ++;
    Mario.MarioCharacter.Update(delta);
    this.UpdateCameraBefore(delta);
    this.UpdateGame(delta);
    this.UpdateCameraAfter(delta);

};

Editor.EditorState.prototype.Draw = function(context) {
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0,0,320,240);
    this.UpdateCameraBefore();
    this.Background.Draw(context,this.Camera);
    this.DrawSprites(context,0);
    this.TileMapRenderer.Draw(context,this.Camera);
    this.DrawSprites(context,1);
};

Editor.EditorState.prototype.CheckForChange = function(context) {
};

Editor.EditorState.prototype.AddSprite = function(sprite) {
    this.Sprites.Add(sprite);
};

Editor.EditorState.prototype.RemoveSprite = function(sprite) {
    this.Sprites.Remove(sprite);
};