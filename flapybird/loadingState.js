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
    this.Images[4].name = "background";
    this.Images[5].name = "smallMario";
    this.Images[6].name = "mario";
    this.Images[7].name = "ground";
    this.Images[8].name = "particles";
    this.Images[9].name = "enemies";
    
    

    this.Images[0].src = "graphics/npc/npc-176.png";
    this.Images[1].src = "graphics/block/block-294.png";
    this.Images[2].src = "graphics/block/block-295.png";
    this.Images[3].src = "graphics/block/block-296.png";
    this.Images[4].src = "graphics/background2/background2-34.png";
    this.Images[5].src = "images/smallmariosheet.png";
    this.Images[6].src = "images/mariosheet.png";
    this.Images[7].src = "graphics/block/block-81.png";
    this.Images[8].src = "images/particlesheet.png";
    this.Images[9].src = "images/enemysheet.png";
    //this.Images[5].src = "graphics/background2/background2-35.png";
var testAudio = new Audio();
    
        if (testAudio.canPlayType("audio/mp3")) {
        Enjine.Resources.AddSound("1up", "sounds/1-up.mp3", 1)
            .AddSound("breakblock", "sounds/breakblock.mp3")
            .AddSound("bump", "sounds/bump.mp3", 4)
            .AddSound("cannon", "sounds/cannon.mp3")
            .AddSound("coin", "sounds/coin.mp3", 5)
            .AddSound("death", "sounds/death.mp3", 1)
            .AddSound("exit", "sounds/exit.mp3", 1)
            .AddSound("fireball", "sounds/fireball.mp3", 1)
            .AddSound("jump", "sounds/jump.mp3")
            .AddSound("kick", "sounds/kick.mp3")
            .AddSound("pipe", "sounds/pipe.mp3", 1)
            .AddSound("powerdown", "sounds/powerdown.mp3", 1)
            .AddSound("powerup", "sounds/powerup.mp3", 1)
            .AddSound("sprout", "sounds/sprout.mp3", 1)
            .AddSound("stagestart", "sounds/stagestart.mp3", 1)
            .AddSound("stomp", "sounds/stomp.mp3", 2);
    } else {
        Enjine.Resources.AddSound("1up", "sounds/1-up.wav", 1)
            .AddSound("breakblock", "sounds/breakblock.wav")
            .AddSound("bump", "sounds/bump.wav", 2)
            .AddSound("cannon", "sounds/cannon.wav")
            .AddSound("coin", "sounds/coin.wav", 5)
            .AddSound("death", "sounds/death.wav", 1)
            .AddSound("exit", "sounds/exit.wav", 1)
            .AddSound("fireball", "sounds/fireball.wav", 1)
            .AddSound("jump", "sounds/jump.wav", 1)
            .AddSound("kick", "sounds/kick.wav", 1)
            .AddSound("message", "sounds/message.wav", 1)
            .AddSound("pipe", "sounds/pipe.wav", 1)
            .AddSound("powerdown", "sounds/powerdown.wav", 1)
            .AddSound("powerup", "sounds/powerup.wav", 1)
            .AddSound("sprout", "sounds/sprout.wav", 1)
            .AddSound("stagestart", "sounds/stagestart.wav", 1)
            .AddSound("stomp", "sounds/stomp.wav", 1);
    }
    
    Enjine.Resources.AddImages(this.Images);
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
        //Bird.Character = new Bird.Character();
        Mario.Character = new Mario.Character();
        context.ChangeState(new Bird.LevelState());
    }
};