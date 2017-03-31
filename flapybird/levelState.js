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
    this.bg = {};
    this.Data = [];
    this.EnterMap = false;
    this.SpriteTemplates = [];
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
        this.bg[i] = new Bird.Level(i+1);
        this.bg[i].Initialize();
    }

};

Bird.LevelState.prototype.Exit = function() {

};


Bird.LevelState.prototype.Update = function(delta) {
    this.Camera.X += 4;
    if(this.Camera.X >= this.width){
        if(this.EnterMap === false){
            this.EnterMap = true;
            //    for(i=0;i<2;i++){
            this.bg[0].GenerateMap();
                // }
        }
        this.Camera.X = 0;
        var type = this.bg[0].type;
        this.bg[0].type = this.bg[1].type;
        this.bg[1].type = type;
    }
    //this.Camera.Y += 2;
};

Bird.LevelState.prototype.Draw = function(context) {

    //绘制背景
    var i = 0;
    for(i = 0;i < 2; i++){
        this.bg[i].Draw(context,this.Camera);
    }
};

Bird.LevelState.prototype.CheckForChange = function(context) {
	if (this.GotoLoseState) {
		context.ChangeState(new Bird.LoseState());
	}
};
