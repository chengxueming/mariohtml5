/**
	State for actually playing a randomly generated level.
	Code by Rob Kleffner, 2011
*/

Editor.EditorState = function() {
    this.GotoLevelState = false;
    this.width = 320;
    this.height = 256;
    this.Level = null;
    this.Layer = null;
};

Editor.EditorState.prototype = new Enjine.GameState();

Editor.EditorState.prototype.Enter = function() {
    //Editor.Character();

    this.Camera = new Enjine.Camera();
    this.Level = new Mario.Level(20,15);
    this.Sprites = new Enjine.DrawableManager();

  this.Level.Map = [[0,0,1,2,3,4,5,0,0,0,0,0,0,129,145],
    [10,11,12,0,0,0,0,0,0,0,0,0,0,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,129,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,26,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,27,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,28,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,30,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,32,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,36,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,39,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,130,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,130,129,145],
    [0,0,0,0,0,4,5,6,7,0,0,0,0,129,145],
    [0,0,0,0,0,32,33,34,35,0,0,0,0,129,145],
    [0,0,0,0,0,16,17,18,19,20,21,0,0,129,145],
    [0,0,0,0,0,0,224,225,226,0,0,0,0,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,129,145],
    [0,0,0,0,0,0,0,32,28,0,0,0,0,129,145],
    [0,0,0,0,0,0,62,71,0,0,0,0,0,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,129,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,129,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,129,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,129,129,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,129,145],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,129,145]];


    //this.Level.SetSpriteTemplate(10, 10, new Mario.SpriteTemplate(type, ((Math.random() * 35) | 0) < this.level.Difficulty));
    this.Level.SpriteTemplates[10][10] = new Mario.SpriteTemplate(0, ((Math.random() * 35) | 0) < 0);
    this.Level.SpriteTemplates[11][10] = new Mario.SpriteTemplate(1, ((Math.random() * 35) | 0) < 0);
    this.Level.SpriteTemplates[12][10] = new Mario.SpriteTemplate(2, ((Math.random() * 35) | 0) < 0);
    this.Level.SpriteTemplates[13][10] = new Mario.SpriteTemplate(3, ((Math.random() * 35) | 0) < 0);
    this.Level.SpriteTemplates[4][6] = new Mario.SpriteTemplate(4, ((Math.random() * 35) | 0) < 0);


    this.Layer = new Mario.LevelRenderer(this.Level, 320, 240);
    $("#editor").find("img").click(function(e){
        // body...
        var num = this.attr("target");
        var type = this.attr("type");
        $("#editor").find("img[state=1]").eq(0).removeAttr("state");
        this.attr("state",1);
    });
    function getMapIndex(e,ele,width=16,height=16){
        var X = parseInt(e.clientX - ele.offset().left);
        var Y = parseInt(e.clientY - ele.offset().top);
        var map = {};
        map.X = parseInt(X/width);
        map.Y = parseInt(Y/height);
        return map;
    }
    $("#canvas").mousemove(function(e) {
        // body...
         // body...
        var img = $("#editor").find("img[state=1]").eq(0);
        var target = img.attr("target");
        var type = img.attr("type");
        var map = getMapIndex(e,this);
        lastTarget = undefined;
        lastType = undefined;
        lastX = undefined;
        lastY = undefined;

 
        switch(type){
            case "block":
                this.Level.SetBlock(lastX,lastY,lastTarget);
                lastTarget = this.Level.GetBlock(map.X,map.Y);
                this.Level.SetBlock(map.X,map.Y,target);
            break;
            case "npc":
                this.Level.SetSpriteTemplate(lastX,lastY,new Mario.SpriteTemplate(lastTarget, ((Math.random() * 35) | 0) < 0);)
                lastTarget = this.Level.GetSpriteTemplate(map.X,map.Y);
                this.Level.SetSpriteTemplate(map.X,map.Y,new Mario.SpriteTemplate(target, ((Math.random() * 35) | 0) < 0);)
            break;
        };
        lastTarget = target;
        lasttype = type;
        lastX = map.X;
        lastY = map.Y;
    })
    $("#canvas").click(function(e) {
        var img = $("#editor").find("img[state=1]").eq(0);
        var target = img.attr("target");
        var map = getMapIndex(e,this)
        if(map == {"X":lastX,"Y":lastY})
        {
            lastTarget = target;
        }
    })
};

Editor.EditorState.prototype.Exit = function() {
    delete this.Camera;
    delete this.Level;
    delete this.Sprites;
};


Editor.EditorState.prototype.Update = function(delta) {

    this.Layer.SetLevel(this.Level);
    this.Layer.Update(delta);
    this.Level.Update();
    for (x = ((this.Camera.X / 16) | 0) - 1; x <= (((this.Camera.X + this.Layer.Width) / 16) | 0) + 1; x++) {
        for (y = ((this.Camera.Y / 16) | 0) - 1; y <= (((this.Camera.Y + this.Layer.Height) / 16) | 0) + 1; y++) {

            st = this.Level.GetSpriteTemplate(x, y);
            dir = 1;
            if (st !== null) {
                if (st.LastVisibleTick !== this.Tick - 1) {
                    if (st.Sprite === null || !this.Sprites.Contains(st.Sprite)) {
                        st.Spawn(this, x, y, dir);
                    }
                }

                st.LastVisibleTick = this.Tick;
            }
        }
    }

    for (i = 0; i < this.Sprites.Objects.length; i++) {
        this.Sprites.Objects[i].UpdateEditor(delta);
    }
};

Editor.EditorState.prototype.Draw = function(context) {

    context.save();
    context.translate(-this.Camera.X, -this.Camera.Y);
    //Editor.Character.Draw(context, this.Camera);
    this.Layer.Draw(context, this.Camera);
    for (i = 0; i < this.Sprites.Objects.length; i++) {
        if (this.Sprites.Objects[i].Layer === 1) {
            this.Sprites.Objects[i].Draw(context, this.Camera);
        }
    }
    context.restore();
};

Editor.EditorState.prototype.CheckForChange = function(context) {
	if (this.GotoLevelState) {
        Mario.MarioCharacter = new Mario.Character();
        Mario.MarioCharacter.Image = Enjine.Resources.Images["smallMario"];
		context.ChangeState(new Editor.LevelState(Mario.LevelType.Overground,this.Level));
	}
};



Editor.EditorState.prototype.AddSprite = function(sprite) {
    this.Sprites.Add(sprite);
};

Editor.EditorState.prototype.RemoveSprite = function(sprite) {
    this.Sprites.Remove(sprite);
};
