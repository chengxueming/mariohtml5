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
    this.Map = {};
    this.bg = {};
    this.Data = [];
    this.SpriteTemplates = [];
    
    var x = 0, y = 0;
    for (x = 0; x < this.width; x++) {
        this.Map[x] = [];
        for (y = 0; y < this.Height; y++) {
            this.Map[x][y] = 0;
        }
    }
};

Bird.LevelState.prototype = new Enjine.GameState();

Bird.LevelState.prototype.Enter = function() {
    //Bird.Character();
    this.Sprites = new Enjine.DrawableManager();
    this.Camera = new Enjine.Camera();
    //Bird.Character.Initialize(this);
    this.GotoLoseState = false;
    var i = 0;
    for(i=0;i<2;i++){
        this.bg[i] = new Bird.Level();
        this.bg[i].Initialize();
    }

};

Bird.LevelState.prototype.Exit = function() {

};


Bird.LevelState.prototype.Update = function(delta) {
    this.Camera.X += 4;
    if(this.Camera.X >= this.width){
        this.Camera.X = 0;
    }
    //this.Camera.Y += 2;
};

Bird.LevelState.prototype.Draw = function(context) {

    //绘制背景
    this.bg[0].Draw(context,this.Camera,1)
    this.bg[1].Draw(context,this.Camera,2)
};

Bird.LevelState.prototype.CheckForChange = function(context) {
	if (this.GotoLoseState) {
		context.ChangeState(new Bird.LoseState());
	}
};
