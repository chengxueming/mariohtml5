/**
	Renders a background portion of the level.
	Code by Rob Kleffner, 2011
*/

Editor.Context = function(context,img, width, height) {
    this.Height = height;
    this.Width = width;
    this.Image = img;
    this.Context = context;
};

Editor.Context.prototype.Scale = function(x,y) {
}

Editor.Context.prototype.Save = function() {
}

Editor.Context.prototype.ReStore = function() {
}

Editor.Context.prototype.DrawImage = function(x,y) {
    this.Context.drawImage(this.Image, 0, 0, this.Image.width, this.Image.height,
    x,this.Height-y-this.Image.height , this.Image.width, this.Image.height);
};

Editor.Context.prototype.Rect = function(xStart,yStart,width,height) {
	this.Context.rect(xStart,this.Height-yStart-height,width,height);
}

Editor.Context.prototype.Translate = function(xOffset,yOffset) {
	this.Context.translate(xOffset,-yOffset);
}