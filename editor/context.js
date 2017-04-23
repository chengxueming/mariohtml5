/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/

Editor.Context = function(context, width, height) {
    this.Height = height;
    this.Width = width;
    this.Context = context;
    this.ScaleX = 1;
    this.ScaleY = 1;
};

Editor.Context.prototype.Scale = function(x,y) {
    this.ScaleX = x;
    this.ScaleY = y;
}

Editor.Context.prototype.Save = function() {
    this.Context.save();
}

Editor.Context.prototype.ReStore = function() {
    this.ScaleX = 1;
    this.ScaleY = 1;
    this.Context.reStore();
}

Editor.Context.prototype.DrawImage = function(img,x,y) {
    this.Context.drawImage(img, 0, 0, img.width, img.height,
    x,this.Height-y-img.height*this.ScaleY , img.width*this.ScaleX, img.height*this.ScaleY);
};

Editor.Context.prototype.ClipRect = function(xStart,yStart,width,height) {
    this.Context.beginPath();
	this.Context.rect(xStart,this.Height-yStart-height,width,height);
    this.Context.clip();
    this.Context.closePath();  
}

Editor.Context.prototype.Translate = function(xOffset,yOffset) {
	this.Context.translate(xOffset,-yOffset);
}