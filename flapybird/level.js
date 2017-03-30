
Bird.Level = function() {
    //these are static in Notch's code... here it doesn't seem necessary
    this.Width = 320;
    this.Height = 240;
    this.width = 10;
    this.height = 8;
    this.Map = [];
    this.bgImage = Enjine.Resources.Images["background"];
    this.pipeMiddle =  Enjine.Resources.Images["pipe_middle"];
};

Bird.Level.prototype = {
	Initialize:function() {
	// body...
		this.GenerateMap();
	},
	GenerateMap:function() {
	// body...
		    var x = 0, y = 0;
	    for (x = 0; x < this.width; x++) {
	        this.Map[x] = [];
	        for (y = 0; y < this.height; y++) {
	            this.Map[x][y] = 0;
	        }
	    }

	    for (x = 1; x < this.width; x+=2) {
	   		this.Map[x] = [];
	        for (y = 0; y < 5; y++) {
	            this.Map[x][y] = 1;
	        }
	    }
	},
	Draw:function(context,camera,type) {
	// body...
		if(camera.X === 0){
	    	//生成地图
	    	this.GenerateMap();
	   	}
	    var picX = camera.X * 1024/this.Width;
	    if(1 === type){
		    var x = 0, y = 0;

	    	context.drawImage(this.bgImage, picX, 0, 1024 - picX, 864,
	    		0, 0 , this.Width - camera.X, this.Height);
	    			    for (x = 0; x < this.width; x++) {
		        for (y = 0; y < this.height; y++) {
		        	if(this.Map[x][y] == 1){
		      			context.drawImage(this.pipeMiddle, 0, 0, 32, 32,
							x*32 - camera.X, this.Height - y*32 , 32, 32);
		        	}
		        }
		    }
	    }else{
			var x = 0, y = 0;

	    	context.drawImage(this.bgImage, 0, 0, picX, 864,
	    		this.Width - camera.X, 0 , camera.X, this.Height);
	    			    for (x = 0; x < this.width; x++) {
		        for (y = 0; y < this.height; y++) {
		        	if(this.Map[x][y] == 1){
		      			context.drawImage(this.pipeMiddle, 0, 0, 32, 32,
							x*32 + this.Width - camera.X, this.Height - y*32 , 32, 32);
		        	}
		        }
		    } 		
    	}
}

}