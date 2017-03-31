
Bird.Level = function(type) {
    //these are static in Notch's code... here it doesn't seem necessary
    this.Width = 320;
    this.Height = 240;
    this.width = 10;
    this.BlockWidth = 32;
    this.height = 9;
    this.Map = [];
    this.bgImage = Enjine.Resources.Images["background"];
    this.pipeMiddle =  Enjine.Resources.Images["pipe_middle"];
    this.pipeTop =  Enjine.Resources.Images["pipe_top"];
    this.pipeBottom =  Enjine.Resources.Images["pipe_bottom"];
    this.interval = 3;
    this.type = type;
    this.StartX = 0;
};

Bird.Level.prototype = {
	Initialize:function() {
	// body...
		var x = 0, y = 0;
	    for (x = 0; x < this.width; x++) {
	        this.Map[x] = [];
	        for (y = 0; y < this.height; y++) {
	            this.Map[x][y] = 0;
	        }
	    }
	},
	GenerateMap:function() {
	// body...

		this.Initialize();
	    for (x = 1; x < this.width; x+=2) {
	   		var top = parseInt(Math.random()*(this.height-this.interval));
	        for (y = 0; y < this.height; y++) {
	        	if(y < top){
	        		this.Map[x][y] = 1;
	        	}else if(y > top+this.interval){
	        		this.Map[x][y] = 1;
	        	}
	        }
	        this.Map[x][top] = 2;
	        this.Map[x][top+this.interval] = 3;
	    }
	},
	Draw:function(context,camera) {
	// body...

	    var picX = parseInt(camera.X * 1024/this.Width);
	    var images = {1:this.pipeMiddle,2:this.pipeTop,3:this.pipeBottom};
	    if(1 === this.type){
	    	if(picX === 1024){
	    	//生成地图
	    		this.GenerateMap();
	   		}
		    var x = 0, y = 0;	
	    	context.drawImage(this.bgImage, picX, 0, 1024 - picX, 864,
	    		0, 0 , this.Width - camera.X, this.Height);
	    			    for (x = 0; x < this.width; x++) {
		        for (y = 0; y < this.height; y++) {
		        	if(this.Map[x][y] >0){
		      			context.drawImage(images[this.Map[x][y]], 0, 0, 32, 32,
							x*32 - camera.X,this.Height - y*32 , 32, 32);
		        	}
		        }
		    }
	    }else{
			var x = 0, y = 0;
	    	context.drawImage(this.bgImage, 0, 0, picX, 864,
	    		this.Width - camera.X, 0 , camera.X, this.Height);
	    			    for (x = 0; x < this.width; x++) {
		        for (y = 0; y < this.height; y++) {
		        	if(this.Map[x][y] > 0){
		      			context.drawImage(images[this.Map[x][y]], 0, 0, 32, 32,
							x*32 + this.Width - camera.X, this.Height - y*32 , 32, 32);
		        	}
		        }
		    } 		
    	}
	}

}