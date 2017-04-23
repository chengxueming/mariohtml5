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
    console.log(camera);
    var myContext = new Editor.Context(context,320,240);
    context.save();
    myContext.Translate(-camera.X,-camera.Y);
    myContext.ClipRect(0,0,this.Width,this.Height);
    var xTileStart = (camera.X/this.Img.width)|0;
    var yTileStart = (camera.Y/this.Img.height)|0;
    var xTileEnd = ((camera.X+this.Width)/this.Img.width)|0;
    var yTileEnd = ((camera.Y+this.Height)/this.Img.height)|0;
    xTileEnd = (xTileEnd < (this.Width/this.Img.width)|0)?xTileEnd:(this.Width/this.Img.width)|0;
    yTileEnd = (yTileEnd < (this.Height/this.Img.height)|0)?yTileEnd:(this.Height/this.Img.height)|0;

    myContext.Scale(0.5,0.5);
    xTileStart = 0;
    yTileStart = 0;

    xTileEnd = ((this.Width)/this.Img.width*0.5)|0;
    yTileEnd = ((this.Height)/this.Img.height*0.5)|0;
    
    for(var x = 0;x <= 3;x++)
    {
        for(var y = 0;y<=3;y++)
        {
            myContext.DrawImage(this.Img,x*this.Img.width*0.5,y*this.Img.height*0.5);
        }
    }
    context.restore();
};