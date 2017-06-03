/**
	Renders a playable tileMap.
	Code by Rob Kleffner, 2011
*/

Mario.TileMapRenderer = function(tilemap, width, height) {
    this.Width = width;
    this.Height = height;
    this.tileMap = tilemap;
    this.Delta = 0;
    this.Tick = 0;
    this.Bounce = 0;
    this.AnimTime = 0;
};

Mario.TileMapRenderer.prototype = new Enjine.Drawable();

Mario.TileMapRenderer.prototype.Update = function(delta) {
    this.AnimTime += delta;
    this.Tick = this.AnimTime | 0;
    this.Bounce += delta * 30;
    this.Delta = delta;
};

Mario.TileMapRenderer.prototype.Draw = function(context, camera) {
    this.DrawStatic(context, camera);
    this.DrawDynamic(context, camera);
};

Mario.TileMapRenderer.prototype.DrawStatic = function(context, camera) {
    var x = 0, y = 0, b = 0;
    var xTileStart = (camera.X / 16) | 0;
    var xTileEnd = ((camera.X + this.Width) / 16) | 0;
    var yTileStart = (camera.Y / 16) | 0;
    var yTileEnd = (camera.Y / 16 + this.Height) | 0;
    if(xTileEnd + 1 > this.tileMap.Width)
    {
        xTileEnd = this.tileMap.Width - 1;
    }
    if(yTileEnd + 1 > this.tileMap.Height)
    {
        yTileEnd = this.tileMap.Height - 1;
    }
    var myContext = new Editor.Context(context,320,240);
    for (x = xTileStart; x < xTileEnd + 1; x++) {
        for (y = yTileStart; y < yTileEnd; y++) {
            b = this.tileMap.GetBlock(x, y) & 0xff;
            if ((Mario.Tile.Behaviors[b] & Mario.Tile.Animated) === 0) {
                this.DrawImage(myContext,camera,b,x,y);
            }
        }
    }
};

Mario.TileMapRenderer.prototype.DrawImage = function(context,camera,b,x,y)
{
    if(b == 0)
    {
        return;
    }
    block = "block-"+b;
    context.DrawImage(Enjine.Resources.Images[block], ((x << 4) - camera.X) | 0, ((y << 4) - camera.Y) | 0 ,16 ,16);
}

Mario.TileMapRenderer.prototype.DrawAnimation = function(context,camera,b,x,y,frame,yo = 0)
{
    if(b == 0)
    {
        return;
    }
    block = "block-"+b;
    context.DrawAnimation(Enjine.Resources.Images[block], ((x << 4) - camera.X) | 0, ((y << 4) - camera.Y - yo) | 0 ,16 ,16,frame,4);
}

Mario.TileMapRenderer.prototype.DrawDynamic = function(context, camera) {
    var x = 0, y = 0, b = 0;
    var xTileStart = (camera.X / 16) | 0;
    var xTileEnd = ((camera.X + this.Width) / 16) | 0;
    var yTileStart = (camera.Y / 16) | 0;
    var yTileEnd = (camera.Y / 16 + this.Height) | 0;
    if(xTileEnd + 1 > this.tileMap.Width)
    {
        xTileEnd = this.tileMap.Width - 1;
    }
    if(yTileEnd + 1 > this.tileMap.Height)
    {
        yTileEnd = this.tileMap.Height - 1;
    }
    var myContext = new Editor.Context(context,320,240);

    var yo = 0,animTime = 0;
    for (x = xTileStart; x < xTileEnd + 1; x++) {
        for (y = yTileStart; y < yTileEnd; y++) {
            b = this.tileMap.GetBlock(x, y);  
            if (((Mario.Tile.Behaviors[b & 0xff]) & Mario.Tile.Animated) > 0) {
                animTime = ((this.Bounce / 3) | 0) % 4;
                //if ((((b % 16) / 4) | 0) === 0 && ((b / 16) | 0) === 1) {
                if (4 == b) {
                    animTime = ((this.Bounce / 2 + (x + y) / 8) | 0) % 20;
                    if (animTime > 3) {
                        animTime = 0;
                    }
                }
                if ((((b % 16) / 4) | 0) === 3 && ((b / 16) | 0) === 0) {
                    animTime = 2;
                }
                yo = 0;
                if (x >= 0 && y >= 0 && x < this.tileMap.Width && y < this.tileMap.Height) {
                    yo = this.tileMap.Data[x][y];
                }
                //绘制石头弹起来起的效果
                if (yo > 0) {
                    yo = (Math.sin((yo - this.Delta) / 4 * Math.PI) * 8) | 0;
                }
                //context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (x << 4) - camera.X, (y << 4) - camera.Y - yo, frame.Width, frame.Height);
                this.DrawAnimation(myContext,camera,b,x,y,animTime,yo);
            }
        }
    }
};