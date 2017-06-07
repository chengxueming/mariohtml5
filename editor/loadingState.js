/**
	State that loads all the resources for the game.
	Code by Rob Kleffner, 2011
*/

Editor.LoadingState = function() {
    this.Images = [];
    this.ImagesLoaded = false;
    this.ScreenColor = 0;
    this.ColorDirection = 1;
    this.ImageIndex = 0;
    this.SoundIndex = 0;
};



Editor.LoadingState.prototype = new Enjine.GameState();

Editor.LoadingState.prototype.Enter = function() {
    var i = 0;
    for (i = 0; i < 18; i++) {
        this.Images[i] = {};
    }
    
    this.Images[0].name = "background";
    this.Images[1].name = "endScene";
    this.Images[2].name = "enemies";
    this.Images[3].name = "fireMario";
    this.Images[4].name = "font";
    this.Images[5].name = "gameOverGhost";
    this.Images[6].name = "items";
    this.Images[7].name = "logo";
    this.Images[8].name = "map";
    this.Images[9].name = "mario";
    this.Images[10].name = "particles";
    this.Images[11].name = "racoonMario";
    this.Images[12].name = "smallMario";
    this.Images[13].name = "title";
    this.Images[14].name = "worldMap";
    this.Images[15].name = "background2-1";
    this.Images[16].name = "block-38";
    this.Images[17].name = "background2-2";

    this.Images[0].src = "images/bgsheet.png";
    this.Images[1].src = "images/endscene.gif";
    this.Images[2].src = "images/enemysheet.png";
    this.Images[3].src = "images/firemariosheet.png";
    this.Images[4].src = "images/font.gif";
    this.Images[5].src = "images/gameovergost.gif";
    this.Images[6].src = "images/itemsheet.png";
    this.Images[7].src = "images/logo.gif";
    this.Images[8].src = "images/mapsheet.png";
    this.Images[9].src = "images/mariosheet.png";
    this.Images[10].src = "images/particlesheet.png";
    this.Images[11].src = "images/racoonmariosheet.png";
    this.Images[12].src = "images/smallmariosheet.png";
    this.Images[13].src = "images/title.gif";
    this.Images[14].src = "images/worldmap.png";
    this.Images[15].src = "graphics/background2/background2-1.png";
    this.Images[16].src = "graphics/block/block-38.png";
    this.Images[17].src = "graphics/background2/background2-2.png";
    
    Enjine.Resources.AddImages(this.Images);
    this.LoadSmbxResource("block",638);
    this.LoadSmbxResource("mario",7);
    this.LoadSmbxResource("effect",148);
    this.LoadSmbxResource("npc",291);
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
    
    //load the array of tile behaviors
    Mario.Tile.LoadBehaviors();
};


// Editor.LoadingState.prototype.LoadResource = function() {
//     // body...
//     var path = "graphics/block/";
//     var files = [
//     "block-1",
//     "block-2",
//     "block-3",
//     "block-4",
//     "block-5",
//     "block-6",
//     "block-81",
//     "block-87",
//     ];
//     var imgs = [];
//     for (var i = 0; i < files.length; i++) {
//         var img = {"name":files[i],"src":path+files[i]+".png"};
//         imgs.push(img);
//     };
//     Enjine.Resources.AddImages(imgs);
// };

Editor.LoadingState.prototype.LoadSmbxResource = function(type,count) {
    // body...
    var imgs = [];
    var path = "graphics/" + type + "/";
    for (i = 1; i <= count; i++) {
        var img = {"name":type+"-"+i,"src":path+type+"-"+i+".png"};
        imgs.push(img);
    };
    Enjine.Resources.AddImages(imgs);
};

// Editor.LoadingState.prototype.LoadSmbxResource = function(type) {
//     // body...
//     var path = "graphics/" + type + "/";
//     var files = [
//     "1",
//     "2",
//     "3",
//     "4",
//     "5",
//     "6",
//     "81",
//     "87"
//     ];
//     var imgs = [];
//     for (var i = 0; i < files.length; i++) {
//         var img = {"name":type+"-"+files[i],"src":path+type+"-"+files[i]+".png"};
//         imgs.push(img);
//     };
//     if("block" == type) {
//         for (i = 7; i <= 20; i++) {
//             var img = {"name":type+"-"+i,"src":path+type+"-"+i+".png"};
//             imgs.push(img);
//         };
//     }
//     if("npc" == type) {
//         for (i = 109; i <= 112; i++) {
//             var img = {"name":type+"-"+i,"src":path+type+"-"+i+".png"};
//             imgs.push(img);
//         };
//     }
//     Enjine.Resources.AddImages(imgs);
// };



Editor.LoadingState.prototype.Exit = function() {
    delete this.Images;
};

Editor.LoadingState.prototype.Update = function(delta) {
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

Editor.LoadingState.prototype.Draw = function(context) {
    if (!this.ImagesLoaded) {
        var color = parseInt(this.ScreenColor, 10);
        context.fillStyle = "rgb(" + color + "," + color + "," + color + ")";
        context.fillRect(0, 0, 640, 480);
    } else {
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(0, 0, 640, 480);
    }
};

Editor.LoadingState.prototype.CheckForChange = function(context) {
    if (this.ImagesLoaded) {
        Mario.MarioCharacter = new Mario.Character();
        Mario.MarioCharacter.Image = Enjine.Resources.Images["smallMario"];
		//set up the global map state variable
        Editor.editor = new Editor.LevelState();
        context.ChangeState(Editor.editor);
    }
};