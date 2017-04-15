/**
	State for actually playing a randomly generated level.
	Code by Rob Kleffner, 2011
*/

Editor.EditorState = function() {
    this.GotoLevelState = false;
    this.width = 320;
    this.height = 256;
    this.BlockWidth = 16;
    this.Level = null;
    this.Layer = null;
    this.lastTarget = undefined;
    this.lastType = undefined;
    this.lastX = undefined;
    this.lastY = undefined;
    this.CharacterX = 0;
    this.CharacterY = 0;
    this.BgLayer = [];
    this.Sprites = null;
    this.Player1 = null;
    this.LevelType = 0;
};

Editor.EditorState.prototype = new Enjine.GameState();

Editor.EditorState.prototype.Enter = function() {
    //Editor.Character();

    this.Camera = new Enjine.Camera();
    this.Level = new Mario.Level(20,15);
    this.Sprites = new Enjine.DrawableManager();

    function generateBackground(levelType) {
      // body...
      for (i = 0; i < 2; i++) {
        scrollSpeed = 4 >> i;
        w = ((((Editor.editor.Level.Width * 16) - 320) / scrollSpeed) | 0) + 320;
        h = ((((Editor.editor.Level.Height * 16) - 240) / scrollSpeed) | 0) + 240;
        bgLevelGenerator = new Mario.BackgroundGenerator(w / 32 + 1, h / 32 + 1, i === 0, levelType);
        Editor.editor.BgLayer[i] = new Mario.BackgroundRenderer(bgLevelGenerator.CreateLevel(), 320, 240, scrollSpeed);
      }
    }
    this.Layer = new Mario.LevelRenderer(this.Level, 320, 240);
    $("#background").find("button").click(function(e) {
      // body...
        Editor.editor.LevelType = Mario.LevelType[$(this).text()];
        generateBackground(Editor.editor.LevelType);
    });
    function getMapIndex(e,ele,width=32,height=32) {
        var X = parseInt(e.clientX - 0);//ele.offset().left);
        var Y = parseInt(e.clientY - 0);//ele.offset().top);
        var map = {};
        map.X = parseInt(X/width);
        map.Y = parseInt(Y/height);
        return map;
    };
    $("#TileSet").find("div").each(function (){
        //deal button 
        if($(this).attr("id") != "navButton")
        {
           if($(this).attr("id") != "Grass")
           {
              $(this).css("display","none");
           }
           $(this).find("img").click(function () {
             // body...
             removeState();
             $(this).attr("state",1);
           })
        }
        $("#navButton").find("button").click(function (e){
            var target = $(this).text();
            
            //deal show style
            $("#TileSet").find("div").each(function () {
              // body...
                if($(this).attr("id") != "navButton")
                {
                   if($(this).attr("id") == target)
                   {  
                     $(this).css("display","inline");
                   }else
                   {
                     $(this).css("display","none");
                   }
                }else
                {
                   $(this).find("button").each(function (){
                     // body...
                      if($(this).text() == target)
                      {
                        $(this).css("color","green");
                      }else
                      {
                        $(this).removeAttr("style");
                      }
                   })
                }
            });
        });
    });

    function removeState() {
          if($("#editor").find("[state=1]").eq(0) != null)
          {
              $("#editor").find("[state=1]").eq(0).removeAttr("state");
          }
    }

    function getTargetAndType() {
      // body...
        var img = $("#editor").find("[state=1]").eq(0);
        if(img == undefined)
        {
            return;
        }
        var target = img.attr("target");
        var type = img.parent().attr("id");
        return {"target":target,"type":type};
    }


    $("#canvas").mousemove(function(e){
        // body...
         // body...
        var m = getTargetAndType();
        var target = m.target;
        var type = m.type;
        var map = getMapIndex(e,this);


        switch(type)
        {
            case "block":
                if(Editor.editor.lastTarget == undefined || !(Editor.editor.lastX == map.X && Editor.editor.lastY == map.Y))
                {
                    if(!(Editor.editor.lastX == undefined || Editor.editor.lastY == undefined))
                    {
                        Editor.editor.Level.SetBlock(Editor.editor.lastX,Editor.editor.lastY,Editor.editor.lastTarget);
                    }
                    Editor.editor.lastTarget = Editor.editor.Level.GetBlock(map.X,map.Y);
                }
                Editor.editor.Level.SetBlock(map.X,map.Y,target);
                break;
            case "npc":
                if(Editor.editor.lastTarget === undefined || !(Editor.editor.lastX === map.X && Editor.editor.lastY === map.Y))
                {
                      // console.log("From old pos X:"+Editor.editor.lastX+" Y:"+Editor.editor.lastY);
                      // console.log("to new pos X:"+map.X +" Y:"+map.Y);
                    if(!(Editor.editor.lastX === undefined || Editor.editor.lastY === undefined) && Editor.editor.lastTarget !== undefined)
                     {
                       var last = Editor.editor.Level.GetSpriteTemplate(Editor.editor.lastX,Editor.editor.lastY);
                       Editor.editor.Level.SetSpriteTemplate(Editor.editor.lastX,Editor.editor.lastY,Editor.editor.lastTarget);
                     }

                     Editor.editor.lastTarget = Editor.editor.Level.GetSpriteTemplate(map.X,map.Y);
                     // console.log("current pos:"+map.X+" "+map.Y);
                     // console.log("last target is:");
                     // console.log(Editor.editor.lastTarget);
                }
                Editor.editor.Level.SetSpriteTemplate(map.X,map.Y,new Mario.SpriteTemplate(target, ((Math.random() * 35) | 0) < 0));
                break;
            case "player":
                if(Editor.editor.Player1 == null)
                {
                  Editor.editor.Player1 = new Mario.Character();
                  Editor.editor.Player1.Image = Enjine.Resources.Images["smallMario"];
                  Editor.editor.Player1.Initialize(this);
                }
                Editor.editor.Player1.SetPosition(map.X * Editor.editor.BlockWidth,map.Y * Editor.editor.BlockWidth);
                break;
            case "LevelBoundy":
                switch(target)
                {
                  case "Right":
                      if(map.X >= Editor.editor.Level.Width)
                      {
                          Editor.editor.Level.ReSize(map.X - Editor.editor.Level.Width + 1,0);
                      }
                  break;
                  case "Up":
                      if(map.X >= Editor.editor.Level.Width)
                      {
                          Editor.editor.Level.ReSize(0,map.Y - Editor.editor.Level.Height + 1);
                      }
                  break;
                  case "Left":
                  break;
                  case "Bottom":
                  break;
                }
                generateBackground(this.LevelType);
        };
        Editor.editor.lasttype = type;
         if(Editor.editor.lastX != map.X || Editor.editor.lastY != map.Y)
         {
                Editor.editor.lastX = map.X;
                Editor.editor.lastY = map.Y;
         }

    });
    $("#canvas").click(function(e) {
        var m = getTargetAndType();
        var target = m.target;
        var type = m.type;
        var map = getMapIndex(e,this);
        switch(type)
        {
            case "player":
                //Editor.editor.Player1.SetPosition(map.X * this.BlockWidth,map.Y * this.BlockWidth);
                removeState();
            break;
            case "npc":
                Editor.editor.lastTarget = new Mario.SpriteTemplate(target, ((Math.random() * 35) | 0) < 0);
            break;
            case "block":
                Editor.editor.lastTarget = target;
                break;
        };
    });
    (function(argument) {
      // body...
      $("#player").find("button").click(function() {
          removeState();
          $(this).attr("state",1);
      });

      $("#npc").find("div").each(function() {
        // body...
        var img = new Image();
        img.src = $(this).attr("src");
        img.onload = function() {
           var obj = $("div[src="+$(this).attr("src")+"]");
           var count = obj.attr("count");
           obj.css("height",parseInt(img.height/count));
           obj.css("width",parseInt(img.width));
           obj.css("background-image","url('"+obj.attr("src")+"')");
           obj.css("background-repeat","no-repeat");
           obj.css("float","left");
        };


        $("#player").css("clear","both");
        $(this).click(function(e) {
          // body...
          removeState();
          $(this).attr("state",1);
          });
      })
    })();
    $("#LevelBoundy").find("button").each(function(argument) {
        $(this).click(function(e) {
          removeState();
          $(this).attr("state",1);
        });
    });
    function changeContent() {
      // body...
      var obj = {
        0:{"src":""},
        1:{"src":"graphics\\npc\\npc-9.png"},
        2:{"src":"graphics\\npc\\npc-14.png"},
        3:{"src":""},
        4:{"src":""},
        5:{"src":""}
      };
      var index = $("#slider").slider("value");
      $("#BlockCotents").find("img").eq(0).attr("src",obj[index].src);
    }
    $("#slider").slider({
      max: 8,
      min: 0,
      change: changeContent
    });

      function objToTable(obj){
         var html = "<table>";
        var row = parseInt(obj.data.length/obj.width);
         for(var i =0;i<row;i++)
         {
            var tr = "<tr>";
            for(var j = 0;j<obj.width;j++)
            {
               var index = i*row + j;
               tr += "<td>"+obj.data[index]+"</td>"
            }
            tr +="</tr>"
            html += tr;
         }
         html +="</table>";
         return html;
      }
    (function(){
      var obj = {
          "width":3,
          "data":[
          '',
          '<button type="button" class="btn btn-default" aria-label="Left Align"><span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>',
          '',
              '<button type="button" class="btn btn-default" aria-label="Left Align"><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></button>',
        '<button type="button" class="btn btn-default" aria-label="Left Align"><span class=" " aria-hidden="true"></span></button>',
        '<button type="button" class="btn btn-default" aria-label="Left Align"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></button>',
      '',
          '<button type="button" class="btn btn-default" aria-label="Left Align"><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></button>',
      '']
      };
      var html = objToTable(obj);
      $("#BlockSize").append(html);
    })();
    
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
    this.Sprites = new Enjine.DrawableManager();
    if(this.Player1 != null)
    {
      this.Sprites.Add(this.Player1);
    }
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.F5)) {
        this.GotoLevelState = true;
    }    
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) {
        this.Camera.X += this.BlockWidth;
    }
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up)) {
        this.Camera.Y -= this.BlockWidth;
    }
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {

    }
    if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left)) {

    }
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
    if(this.BgLayer.length == 2)
    {
      for (i = 0; i < 2; i++) {
        this.BgLayer[i].Draw(context, this.Camera);
      }
    }
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
      Mario.MarioCharacter.SetPosition(this.Player1.CharacterX,this.Player1.CharacterY);
      Mario.MarioCharacter.Image = Enjine.Resources.Images["smallMario"];
		  context.ChangeState(new Editor.LevelState(this.LevelType,this.Level));
	}
};



Editor.EditorState.prototype.AddSprite = function(sprite) {
    this.Sprites.Add(sprite);
};

Editor.EditorState.prototype.RemoveSprite = function(sprite) {
    this.Sprites.Remove(sprite);
};
