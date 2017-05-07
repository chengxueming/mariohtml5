/**
	Represents a playable level in the game.
	Code by Rob Kleffner, 2011
*/
Mario.Tile = {
    BlockUpper: 1 << 0,
    BlockAll: 1 << 1,
    BlockLower: 1 << 2,
    Special: 1 << 3,
    Bumpable: 1 << 4,
    Breakable: 1 << 5,
    PickUpable: 1 << 6,
    Animated: 1 << 7,
    Behaviors: [],
    
    LoadBehaviors: function() {
        var b = {};
        b[1] = this.BlockAll;
        b[2] = this.BlockAll;
        b[3] = this.BlockAll;
        b[4] = this.BlockLower | this.Animated; 
        this.Behaviors = b;
    }
};


Mario.TileMap = function(width, height) {
    this.Width = width;
    this.Height = height;
    
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

    for (x = 0; x < this.Width; x++) {
        this.Map[x][0] = 1;
        this.Map[x][1] = 2;
        this.Map[x][2] = 3;
        this.Map[x][3] = 4;
    }
};

Mario.TileMap.prototype = {
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
        this.Animate ++;
        this.Animate %= 4;
    },

    Draw: function(context,camera) {
        var myContext = new Editor.Context(context,320,240);
        var x = 0, y = 0, b = 0, frame = null, xTileStart = (camera.X / 16) | 0, xTileEnd = ((camera.X + this.Width*16) / 16) | 0;
        if(xTileEnd + 1 > this.Width)
        {
            xTileEnd = this.Width - 1;
        }
        context.save();
        myContext.Translate(-camera.X,-camera.Y);
        for (x = xTileStart; x < xTileEnd + 1; x++) {
            for (y = 0; y < this.Height; y++) {
                b = this.GetBlock(x, y);
                if(b == 0){
                    continue;
                }
                var block = "block-"+b;
                if(Enjine.Resources.Images[block].height == 32)
                {
                    myContext.DrawImage(Enjine.Resources.Images[block], ((x << 4)) | 0, (y << 4) | 0 ,16 ,16);
                }else{
                    myContext.DrawAnimation(Enjine.Resources.Images[block], ((x << 4)) | 0, (y << 4) | 0 ,16 ,16,this.Animate,4);
                }
            }
        }
        context.restore();
    },
    
    GetBlockCapped: function(x, y) {
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        if (x >= this.Width) { x = this.Width - 1; }
        if (y >= this.Height) { y = this.Height - 1; }
        return this.Map[x][y];
    },
    
    GetBlock: function(x, y) {
        // if (x < 0) { x = 0; }
        // if (y < 0) { return 0; }
        // if (x >= this.Width) { x = this.Width - 1; }
        // if (y >= this.Height) { y = this.Height - 1; }
        if(x < 0 || y < 0 || x >= this.Width || y >= this.Height)
        {
            return 0;
        }
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

        return (block > 0);
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