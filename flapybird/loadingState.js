/**
	State that loads all the resources for the game.
	Code by Rob Kleffner, 2011
*/

Bird.LoadingState = function() {
    this.Images = [];
    this.ImagesLoaded = false;
    this.ScreenColor = 0;
    this.ColorDirection = 1;
    this.ImageIndex = 0;
    this.SoundIndex = 0;
};

Bird.LoadingState.prototype = new Enjine.GameState();

Bird.LoadingState.prototype.Enter = function() {
    var i = 0;
    for (i = 0; i < 15; i++) {
        this.Images[i] = {};
    }
    
    this.Images[0].name = "bird";
    this.Images[1].name = "pipe_top";
    this.Images[2].name = "pipe_middle";
    this.Images[3].name = "pipe_bottom";

    this.Images[0].src = "graphics/npc/npc-176.png";
    this.Images[1].src = "graphics/block/block-294.png";
    this.Images[2].src = "graphics/block/block-295.png";
    this.Images[3].src = "graphics/block/block-296.png";
    
    Enjine.Resources.AddImages(this.Images);
    
    var testAudio = new Audio();
	
    if (testAudio.canPlayType("audio/mp3")) {
    	Enjine.Resources.AddSound("1up", "sounds/1-up.mp3", 1)
		    .AddSound("breakblock", "sounds/breakblock.mp3")
    } else {
	    Enjine.Resources.AddSound("1up", "sounds/1-up.wav", 1)
		    .AddSound("breakblock", "sounds/breakblock.wav")
    }
    
    //load the array of tile behaviors
    Bird.Tile.LoadBehaviors();
};

Bird.LoadingState.prototype.Exit = function() {
    delete this.Images;
};

Bird.LoadingState.prototype.Update = function(delta) {
    if (!this.ImagesLoaded) {
        this.ImagesLoaded = true;
        var i = 0;
        for (i = 0; i < this.Images.length; i++) {
            if (Enjine.Resources.Images[this.Images[i].name].complete !== true) {
                this.ImagesLoaded = false;
                break;
            }
        }
    }
    
    this.ScreenColor += this.ColorDirection * 255 * delta;
    if (this.ScreenColor > 255) {
        this.ScreenColor = 255;
        this.ColorDirection = -1;
    } else if (this.ScreenColor < 0) {
        this.ScreenColor = 0;
        this.ColorDirection = 1;
    }
};

Bird.LoadingState.prototype.Draw = function(context) {
    if (!this.ImagesLoaded) {
        var color = parseInt(this.ScreenColor, 10);
        context.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
        context.fillRect(0, 0, 640, 480);
    } else {
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, 640, 480);
    }
};

Bird.LoadingState.prototype.CheckForChange = function(context) {
    if (this.ImagesLoaded) {
		//set up the global map state variable
        Bird.Character = new Bird.Character();
        context.ChangeState(new Bird.LevelState());
    }
};