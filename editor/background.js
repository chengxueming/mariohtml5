/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/

Editor.Background = function(Img, width, height) {
    this.Height = height;
    this.Width = width;
    this.Img = Img;
    this.BgWidth = 320;
    this.BgHeight = 200;
    this.CloudImg = Enjine.Resources.Images["background2-2"]
};

Editor.Background.prototype = new Enjine.Drawable();

Editor.Background.prototype.Draw = function(context, camera) {
    console.log(camera);
    var myContext = new Editor.Context(context,320,240);
    context.save();
    myContext.Translate(-camera.X,-camera.Y);
    myContext.ClipRect(0,0,this.Width,this.Height);
    this.DrawBgImg(myContext,this.Img,((camera.X / 16) * 10),this.BgWidth,this.BgHeight,0);
    this.DrawBgImg(myContext,this.CloudImg,((camera.X / 16) * 1),this.BgWidth/3,this.BgHeight,this.BgHeight);
    context.restore();
};

Editor.Background.prototype.DrawBgImg = function(context,img,scrollSpeed,width,height,y)
{
    var rightAlign = scrollSpeed;
    while(rightAlign > width)
    {
        rightAlign = rightAlign - width;
    }
    var startX = 0;
    var imgCount = ((this.Width / width) + 1) | 0;
    for(var x = 0;x < imgCount ;x++)
    {
        if(startX == 0 && rightAlign != 0)
        {
            context.DrawRightImage(img,startX,y,width,height,rightAlign);
            startX = rightAlign;
        }else{
            context.DrawImage(img,startX,y,width,height);
            startX += width;
        }
    }
    context.DrawLeftImage(img,startX,y,width,height,rightAlign);
};