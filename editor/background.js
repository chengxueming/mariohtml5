/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/

Editor.Background = function(Img, width, height) {
    this.Height = height;
    this.Width = width;
    this.Img = Img;
};

Editor.Background.prototype = new Enjine.Drawable();

Editor.Background.prototype.Draw = function(context, camera) {
    var myContext = new Editor.Context(context,this.Img,320,240);
    context.save();
    myContext.Translate(-camera.X,-camera.Y);
    myContext.Rect(0,0,this.Width,this.Height);
    context.clip();
    var xTileStart = (camera.X/this.Img.width)|0;
    var yTileStart = (camera.Y/this.Img.height)|0;
    var xTileEnd = ((camera.X+this.Width)/this.Img.width)|0;
    var yTileEnd = ((camera.Y+this.Height)/this.Img.height)|0;
    xTileEnd = (xTileEnd < (this.Width/this.Img.width)|0)?xTileEnd:(this.Width/this.Img.width)|0;
    yTileEnd = (yTileEnd < (this.Height/this.Img.height)|0)?yTileEnd:(this.Height/this.Img.height)|0;
    
    for(var x = xTileStart;x <= xTileEnd;x++)
    {
        for(var y = yTileStart;y<=yTileEnd;y++)
        {
            myContext.DrawImage(x*this.Img.width,y*this.Img.height);
        }
    }
    context.stroke();
    context.restore();
};