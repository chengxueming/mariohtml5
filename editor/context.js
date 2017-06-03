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

Editor.Context.prototype.DrawImage = function(img,x,y,width,height) {
    //dir = 1 right
    this.Context.drawImage(img, 0, 0, img.width, img.height,
    x,this.Height-y-height , width, height);
};

Editor.Context.prototype.DrawRightImage = function(img,x,y,width,height,sx) {
    //dir = 1 right
    ox = sx;
    sx = this.ConvertToOrigin(img.width,width,sx);
    this.Context.drawImage(img ,sx , 0, img.width - sx, img.height,
    x,this.Height-y-height , width - ox, height);
};

Editor.Context.prototype.DrawLeftImage = function(img,x,y,width,height,sx) {
    //dir = 1 right
    ox = sx;
    sx = this.ConvertToOrigin(img.width,width,sx);
    this.Context.drawImage(img, 0, 0, sx, img.height,
    x,this.Height-y-height , ox, height);
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

Editor.Context.prototype.ConvertToOrigin = function(oLength,nLength,x) {
    return (oLength/nLength) * x;
}

Editor.Context.prototype.DrawAnimation = function(img,x,y,width,height,ypos,block) {
    // y pos from 0
    sy = (img.height/block) * ypos;
    this.Context.drawImage(img, 0, sy, img.width, img.height/block,
    x,this.Height-y-height , width, height);
}

//从图片的左上角裁剪一定高度 以x，y为左下角绘制到画布
Editor.Context.prototype.DrawClipImage = function(img,x,y,width,height,sx,sy,swidth,sheight) {
    // y pos from 0
    this.Context.drawImage(img, sx, sy, swidth, sheight,
    x,this.Height-y-height , width, height);
}

//从左下角开始指定宽高绘制矩形框
Editor.Context.prototype.StrokeRect = function(xStart,yStart,width,height) {
    // body...
    this.Context.strokeStyle="#000";/*设置边框*/ 
    this.Context.lineWidth=3;/*边框的宽度*/ 
    this.Context.strokeRect(xStart,this.Height-yStart-height,width,height); 
}

Editor.Context.prototype.DrawPoint = function(xStart,yStart) {
    // body...
    this.Context.strokeStyle="#000";/*设置边框*/ 
    this.Context.lineWidth=3;/*边框的宽度*/ 
    with (this.Context)
    {
        moveTo(xStart,yStart);
        lineTo(xStart+1,yStart+1);
    }
}