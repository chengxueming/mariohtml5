
Bird.Level = function() {
    //these are static in Notch's code... here it doesn't seem necessary
    this.Width = 320;
    this.Height = 240;
    this.width = 10;
    this.height = 9;

    this.Block = 32;
    this.BlockWidth = this.Width/this.width;
    this.BlockHeight = this.Height/this.height;
    this.bgImage = Enjine.Resources.Images["background"];
    this.pipeMiddle =  Enjine.Resources.Images["pipe_middle"];
    this.pipeTop =  Enjine.Resources.Images["pipe_top"];
    this.pipeBottom =  Enjine.Resources.Images["pipe_bottom"];
    this.interval = 4;
    this.gap = 4;
    this.tail = 0;
    this.curMap = 0;
    this.Maps = [];
    this.Maps[0] = [];
    this.Maps[1] = [];
    this.ClearMap(this.Maps[0]);
    this.GenerateMap(this.Maps[1]);
};

Bird.Level.prototype = {
	IsBlocking: function(x, y, xa, ya) {
        var block = this.GetBlock(x, y);
//        var blocking = ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockAll) > 0;
  //      blocking |= (ya > 0) && ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockUpper) > 0;
    //    blocking |= (ya < 0) && ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockLower) > 0;
    	var blocking = false;
        return blocking;
    },
	GetBlock: function(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { return 0; }
        if (x >= this.width) { x = this.width - 1; }
        if (y >= this.height) { y = this.height - 1; }
        var Map = [];
        if(parseInt(x/this.width) == this.curMap){
        	Map = this.Maps[0];
        }else{
        	Map = this.Maps[1];
        }
        return Map[x][y];
    },
	ClearMap:function(map) {
	// body...
		var x = 0, y = 0;
	    for (x = 0; x < this.width; x++) {
	        map[x] = [];
	        for (y = 0; y < this.height; y++) {
	            map[x][y] = 0;
	        }
	    }
	},
	GenerateMap:function(map) {
	// body...

		this.ClearMap(map);
	    for (x = this.gap - this.tail -1; x < this.width; x+=this.gap) {
	   		var top = parseInt(Math.random()*(this.height-this.interval));
	        for (y = 0; y < this.height; y++) {
	        	if(y < top){
	        		map[x][y] = 1;
	        	}else if(y > top+this.interval){
	        		map[x][y] = 1;
	        	}
	        }
	        end = x;
	        map[x][top] = 3;
	        map[x][top+this.interval] = 2;
	    }
	    this.tail = this.width - end - 1;
	},
	Draw:function(context,camera) {
	// body...
		var i1 = parseInt(camera.X/this.Width);
		var i2 = i1 + 1;
		if(i1 === this.curMap + 1)
		{
			this.Maps[0] = this.Maps[1].concat();
			this.GenerateMap(this.Maps[1]);
		}
		this.curMap = i1;
		var screenX = camera.X%this.Width;
	    var picX = parseInt(screenX * 1024/this.Width);
	    context.drawImage(this.bgImage, picX, 0, 1024 - picX, 864,
	    		0, 0 , this.Width - screenX, this.Height);
	    context.drawImage(this.bgImage, 0, 0, picX, 864,
	    		this.Width - screenX, 0 , screenX, this.Height);

	    var images = {1:this.pipeMiddle,2:this.pipeTop,3:this.pipeBottom};
	    var x = 0, y = 0;	
    	for (x = 0; x < this.width; x++) {
	        for (y = 0; y < this.height; y++) {
	        	if(this.Maps[0][x][y] >0){
	      			context.drawImage(images[this.Maps[0][x][y]], 0, 0, this.Block, this.Block,
						x*this.BlockWidth - screenX,y*this.BlockHeight , this.BlockWidth, this.BlockHeight);
	        	}
	        }
	    }
    	for (x = 0; x < this.width; x++) {
	        for (y = 0; y < this.height; y++) {
	        	if(this.Maps[1][x][y] > 0){
	      			context.drawImage(images[this.Maps[1][x][y]], 0, 0, this.Block, this.Block,
						x*this.BlockWidth + this.Width - screenX, y*this.BlockHeight , this.BlockWidth, this.BlockHeight);
	        	}
	        }
	    } 		
	}

}

