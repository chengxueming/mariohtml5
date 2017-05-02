/**
	Represents a playable level in the game.
	Code by Rob Kleffner, 2011
*/

Mario.Level = function(width, height) {
    this.Width = width;
    this.Height = height;
    this.ExitX = 10;
    this.ExitY = 10;
    
    this.Map = [];
    this.Data = [];
    this.SpriteTemplates = [];
    this.Animate = 0;

    this.Images = null;
    var x = 0, y = 0;
    for (x = 0; x < this.Width; x++) {
        this.Map[x] = [];
        this.Data[x] = [];
        this.SpriteTemplates[x] = [];
        
        for (y = 0; y < this.Height; y++) {
            this.Map[x][y] = 0;
            this.Data[x][y] = 0;
            this.SpriteTemplates[x][y] = null;
        }
    }
};

Mario.Level.prototype = {
    ReSize: function(X,Y) {
        var width = this.Width;
        var height = this.Height;
        this.Width += X;
        this.Height += Y;
        var Map = this.Map.concat();
        var Data = this.Data.concat();
        var SpriteTemplates = this.SpriteTemplates.concat();
        var x = 0, y = 0;
        for (x = 0; x < this.Width; x++) {
            this.Map[x] = [];
            this.Data[x] = [];
            this.SpriteTemplates[x] = [];
            
            for (y = 0; y < this.Height; y++) {
                if(x < width  && y < height)
                {
                    this.Map[x][y] = Map[x][y];
                    this.Data[x][y] = Data[x][y];
                    this.SpriteTemplates[x][y] = SpriteTemplates[x][y];
                }else
                {
                    this.Map[x][y] = 0;
                    this.Data[x][y] = 0;
                    this.SpriteTemplates[x][y] = null;
                }
 
            }
        }
    },
    Update: function() {
        var x = 0, y = 0;
        for (x = 0; x < this.Width; x++) {
            for (y = 0; y < this.Height; y++) {
                if (this.Data[x][y] > 0) {
                    this.Data[x][y]--;
                }
            }
        }
    },

    LoadResource: function() {
        // body...
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        //var f1 = fso.createtextfile("c:\\myjstest.txt",true");
    },

    Draw: function(context,camera) {
        var myContext = new Editor.Context(context,320,240);
        var x = 0, y = 0, b = 0, frame = null, xTileStart = (camera.X / 16) | 0, xTileEnd = ((camera.X + this.Width) / 16) | 0;
        if(xTileEnd + 1 > this.Level.Width)
        {
            xTileEnd = this.Level.Width - 1;
        }
        for (x = xTileStart; x < xTileEnd + 1; x++) {
            for (y = 0; y < this.TilesY; y++) {
                b = this.Level.GetBlock(x, y) & 0xff;
                if ((Mario.Tile.Behaviors[b] & Mario.Tile.Animated) === 0) {
                    frame = this.Background[b % 16][(b / 16) | 0];
                    var block = "block-"+b;
                    if(Enjine.Resources.Images[block].height == 32)
                    {
                        myContext.drawImage(Enjine.Resources.Images[block], ((x << 4) - camera.X) | 0, (y << 4) | 0 ,32 ,32);
                    }else{
                        myContext.drawImage(Enjine.Resources.Images[block], ((x << 4) - camera.X) | 0, (y << 4) | 0 ,32 ,32,this.Animate,4);
                    }
                }
            }
        }
    },
    
    GetBlockCapped: function(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        if (x >= this.Width) { x = this.Width - 1; }
        if (y >= this.Height) { y = this.Height - 1; }
        return this.Map[x][y];
    },
    
    GetBlock: function(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { return 0; }
        if (x >= this.Width) { x = this.Width - 1; }
        if (y >= this.Height) { y = this.Height - 1; }
        return this.Map[x][y];
    },
    
    SetBlock: function(x, y, block) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.Map[x][y] = block;
    },
    
    SetBlockData: function(x, y, data) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.Data[x][y] = data;
    },
    
    IsBlocking: function(x, y, xa, ya) {
        var block = this.GetBlock(x, y);
        var blocking = ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockAll) > 0;
        blocking |= (ya > 0) && ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockUpper) > 0;
        blocking |= (ya < 0) && ((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.BlockLower) > 0;

        return blocking;
    },
    
    GetSpriteTemplate: function(x, y) {
        if (x < 0) { return null; }
        if (y < 0) { return null; }
        if (x >= this.Width) { return null; }
        if (y >= this.Height) { return null; }
        return this.SpriteTemplates[x][y];
    },
    
    SetSpriteTemplate: function(x, y, template) {
        if (x < 0) { return; }
        if (y < 0) { return; }
        if (x >= this.Width) { return; }
        if (y >= this.Height) { return; }
        this.SpriteTemplates[x][y] = template;
    }
};