/**
    State for actually playing a randomly generated TileMap.
    Code by Rob Kleffner, 2011
*/

Editor.LevelState = function() {
    this.FontShadow = null;
    this.Font = null;
    this.t = 0;
    this.Delta = 0;
    this.DeathTime = 1;
    //locate left down
    this.Camera = null;
    this.Background = null;
    this.TileMap = null;
    this.TileMapRenderer = null;
    //用来更新每一个物体的状态（蘑菇，花，乌龟，子弹）
    this.Sprites = null;
    this.TestEvent = 2;
}; 

Editor.LevelState.prototype = new Enjine.GameState();

Editor.LevelState.prototype.Enter = function() {

    Mario.MarioCharacter.Initialize(this);

    this.Background = new Editor.Background(Enjine.Resources.Images["background2-1"],960,720);
    this.Camera = new Enjine.Camera;
    this.TileMap = new Mario.TileMap(60,45);
    this.TileMapRenderer = new Mario.TileMapRenderer(this.TileMap,320,240);
    this.Sprites = new Enjine.DrawableManager();
    this.AddSprite(new Mario.Enemy(this,100,80,0,0,false));
    this.AddSprite(new Mario.Enemy(this,100,100,0,0,false));
    this.AddSprite(new Mario.Enemy(this,100,120,0,0,false));
    this.AddSprite(new Mario.Enemy(this,100,150,0,0,false));
    this.ShellsToCheck = [];
    this.FireballsToCheck = [];
    this.SpritesToAdd = [];
    this.SpritesToRemove = [];

    window.EventHandler = new EventHandlr({
        onSpriteCycleStart: "onadding",
        doSpriteCycleStart: "placed",
        cycleCheckValidity: "alive",
        timingDefault: 9
    });
    function testEvent(obj) {
        --obj.TestEvent;
    }
    EventHandler.addEventInterval(testEvent , 2, Infinity,this);

    this.Sprites.Add(Mario.MarioCharacter);
    Mario.MessageHandler = new Mario.MessageHandler();

    Mario.MessageHandler.On(this,"HIT_BLOCK",this.TestMessage);
};

Editor.LevelState.prototype.Exit = function() {

};

Editor.LevelState.prototype.TestMessage = function(recvObject,jsonParam) {
    console.log("message get success DeathTime:" + recvObject.DeathTime);

};

Editor.LevelState.prototype.CheckShellCollide = function(shell) {
    this.ShellsToCheck.push(shell);
};

Editor.LevelState.prototype.CheckFireballCollide = function(fireball) {
    this.FireballsToCheck.push(fireball);
};

//让Mario除了边界以外都位于屏幕的中央
Editor.LevelState.prototype.UpdateCameraBefore = function(delta) {
    this.Camera.X = Mario.MarioCharacter.X - 160;
    this.Camera.Y = Mario.MarioCharacter.Y - 120;
    if (this.Camera.X < 0) {
        this.Camera.X = 0;
    }
    if (this.Camera.X > this.TileMap.Width * 16 - 320) {
        this.Camera.X = this.TileMap.Width * 16 - 320;
    }
    if (this.Camera.Y < 0) {
        this.Camera.Y = 0;
    }
    if (this.Camera.Y > this.TileMap.Height * 16 - 240) {
        this.Camera.Y = this.TileMap.Height * 16 - 240;
    }
}

Editor.LevelState.prototype.UpdateCameraAfter = function(delta) {
    this.Camera.X = (Mario.MarioCharacter.XOld + (Mario.MarioCharacter.X - Mario.MarioCharacter.XOld) * delta) - 160;
    this.Camera.Y = (Mario.MarioCharacter.YOld + (Mario.MarioCharacter.Y - Mario.MarioCharacter.YOld) * delta) - 120;
}

Editor.LevelState.prototype.UpdateGame = function(delta) {
        this.FireballsOnScreen = 0;
    //remove the sprites outsight
    // for (i = 0; i < this.Sprites.Objects.length; i++) {
    //     sprite = this.Sprites.Objects[i];
    //     if (sprite !== Mario.MarioCharacter) {
    //         xd = sprite.X - this.Camera.X;
    //         yd = sprite.Y - this.Camera.Y;
    //         //if (xd < -64 || xd > 320 + 64 || yd < -64 || yd > 240 + 64) {
    //         if (xd < -64 || xd > 320 + 64) {
    //             this.Sprites.RemoveAt(i);
    //         } else {
    //             if (sprite instanceof Mario.Fireball) {
    //                 this.FireballsOnScreen++;
    //             }
    //         }
    //     }
    // }

    if (this.Paused) {
        for (i = 0; i < this.Sprites.Objects.length; i++) {
            if (this.Sprites.Objects[i] === Mario.MarioCharacter) {
                this.Sprites.Objects[i].Update(delta);
            } else {
                this.Sprites.Objects[i].UpdateNoMove(delta);
            }
        }
    } else {
        this.TileMap.Update();
        this.TileMapRenderer.Update(delta);

        hasShotCannon = false;
        xCannon = 0;
        this.Tick++;
        //update the sprites on map via tilemap spritetemplates
        for (x = ((this.Camera.X / 16) | 0) - 1; x <= (((this.Camera.X + this.TileMapRenderer.Width) / 16) | 0) + 1; x++) {
            for (y = ((this.Camera.Y / 16) | 0) - 1; y <= (((this.Camera.Y + this.TileMapRenderer.Height) / 16) | 0) + 1; y++) {
                dir = 0;
                //right of the mairo
                if (x * 16 + 8 > Mario.MarioCharacter.X + 16) {
                    dir = -1;
                }
                //left of the mario 
                if (x * 16 + 8 < Mario.MarioCharacter.X - 16) {
                    dir = 1;
                }

                st = this.TileMap.GetSpriteTemplate(x, y);

                if (st !== null) {
                    if (st.LastVisibleTick !== this.Tick - 1) {
                        if (st.Sprite === null || !this.Sprites.Contains(st.Sprite)) {
                            st.Spawn(this, x, y, dir);
                        }
                    }

                    st.LastVisibleTick = this.Tick;
                }

                if (dir !== 0) {
                    b = this.TileMap.GetBlock(x, y);
                    //只有大炮才符合条件（14） 
                    if (((Mario.Tile.Behaviors[b & 0xff]) & Mario.Tile.Animated) > 0) {
                        if ((((b % 16) / 4) | 0) === 3 && ((b / 16) | 0) === 0) {
                            if ((this.Tick - x * 2) % 100 === 0) {
                                xCannon = x;
                                for (i = 0; i < 8; i++) {
                                    this.AddSprite(new Mario.Sparkle(this.World, this, x * 16 + 8, y * 16 + ((Math.random() * 16) | 0), Math.random() * dir, 0, 0, 1, 5));
                                }
                                this.AddSprite(new Mario.BulletBill(this, x * 16 + 8 + dir * 8, y * 16 + 15, dir));
                                hasShotCannon = true;
                            }
                        }
                    }
                }
            }
        }

        if (hasShotCannon) {
            Enjine.Resources.PlaySound("cannon");
        }

        //显示动画，物理碰撞的关键，调用notchsprite定义的move
        for (i = 0; i < this.Sprites.Objects.length; i++) {
            this.Sprites.Objects[i].Update(delta);
        }

        //依次遍历每一个精灵与猪脚的碰撞效果
        for (i = 0; i < this.Sprites.Objects.length; i++) {
            this.Sprites.Objects[i].CollideCheck();
        }

        //依次遍历每一个乌龟是否落到每一个精灵身上
        for (i = 0; i < this.ShellsToCheck.length; i++) {
            for (j = 0; j < this.Sprites.Objects.length; j++) {
                if (this.Sprites.Objects[j] !== this.ShellsToCheck[i] && !this.ShellsToCheck[i].Dead) {
                    if (this.Sprites.Objects[j].ShellCollideCheck(this.ShellsToCheck[i])) {
                        if (Mario.MarioCharacter.Carried === this.ShellsToCheck[i] && !this.ShellsToCheck[i].Dead) {
                            Mario.MarioCharacter.Carried = null;
                            this.ShellsToCheck[i].Die();
                        }
                    }
                }
            }
        }
        this.ShellsToCheck.length = 0;

        //依次遍历每一个子弹是否落到每一个精灵身上
        for (i = 0; i < this.FireballsToCheck.length; i++) {
            for (j = 0; j < this.Sprites.Objects.length; j++) {
                if (this.Sprites.Objects[j] !== this.FireballsToCheck[i] && !this.FireballsToCheck[i].Dead) {
                    if (this.Sprites.Objects[j].FireballCollideCheck(this.FireballsToCheck[i])) {
                        this.FireballsToCheck[i].Die();
                    }
                }
            }
        }

        this.FireballsToCheck.length = 0;
    }

    this.Sprites.AddRange(this.SpritesToAdd);
    this.Sprites.RemoveList(this.SpritesToRemove);
    this.SpritesToAdd.length = 0;
    this.SpritesToRemove.length = 0;    
}


Editor.LevelState.prototype.Update = function(delta) {
    this.Delta = delta;
    EventHandler.handleEvents();
    this.DeathTime ++;
    //Mario.MarioCharacter.Update(delta);
    this.UpdateCameraBefore(delta);
    this.UpdateGame(delta);
    //this.UpdateCameraAfter(delta);
    // if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Right)) {
    // this.Camera.X += 16;
    // }
    // if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Up)) {
    //     this.Camera.Y -= 16;
    // }
    // if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Down)) {
    //     this.Camera.Y += 16;
    // }
    // if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.Left)) {
    //         this.Camera.X -= 16;
    // }
};

Editor.LevelState.prototype.Draw = function(context) {
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0,0,320,240);
    this.UpdateCameraBefore();
    this.Background.Draw(context,this.Camera);
    this.DrawSprites(context,0);
    this.TileMapRenderer.Draw(context,this.Camera);
    this.DrawSprites(context,1);
};

Editor.LevelState.prototype.DrawSprites = function(context,layer){
    var myContext = new Editor.Context(context,320,240);
    context.save();
    myContext.Translate(-this.Camera.X, -this.Camera.Y);
    for (i = 0; i < this.Sprites.Objects.length; i++) {
        if (this.Sprites.Objects[i].Layer === layer) {
            this.Sprites.Objects[i].Draw(context, this.Camera);
        }
    }
    context.restore();
}

Editor.LevelState.prototype.CheckForChange = function(context) {
};

Editor.LevelState.prototype.AddSprite = function(sprite) {
    this.Sprites.Add(sprite);
};

Editor.LevelState.prototype.RemoveSprite = function(sprite) {
    this.Sprites.Remove(sprite);
};

Editor.LevelState.prototype.Bump = function(x, y, canBreakBricks) {
    var block = this.TileMap.GetBlock(x, y), xx = 0, yy = 0;

    if ((Mario.Tile.Behaviors[block & 0xff] & Mario.Tile.Bumpable) > 0) {
        this.BumpInto(x, y + 1);
        //设置为实心石头
        this.TileMap.SetBlock(x, y, 2);
        this.TileMap.SetBlockData(x, y, 4);

        if ((Mario.Tile.Behaviors[block & 0xff] & Mario.Tile.Special) > 0) {
            Enjine.Resources.PlaySound("sprout");
            if (!Mario.MarioCharacter.Large) {
                this.AddSprite(new Mario.Mushroom(this, x * 16 + 8, y * 16 + 8));
            } else {
                this.AddSprite(new Mario.FireFlower(this, x * 16 + 8, y * 16 + 8));
            }
        } else {
            Mario.MarioCharacter.GetCoin();
            Enjine.Resources.PlaySound("coin");
            this.AddSprite(new Mario.CoinAnim(this, x, y));
        }
    }

    if ((Mario.Tile.Behaviors[block & 0xff] & Mario.Tile.Breakable) > 0) {
        this.BumpInto(x, y + 1);
        if (canBreakBricks) {
            Enjine.Resources.PlaySound("breakblock");
            this.TileMap.SetBlock(x, y, 0);
            for (xx = 0; xx < 2; xx++) {
                for (yy = 0; yy < 2; yy++) {
                    //生成4个左右对称的粒子 一高一低 先上升 后下降
                    this.AddSprite(new Mario.Particle(this, x * 16 + xx * 8 + 4, y * 16 + yy * 8 + 4, (xx * 2 - 1) * 4, (yy * 2 - 1) * 4 + 8));
                }
            }
        }
    }
};

Editor.LevelState.prototype.BumpInto = function(x, y) {
    var block = this.TileMap.GetBlock(x, y), i = 0;
    if (((Mario.Tile.Behaviors[block & 0xff]) & Mario.Tile.PickUpable) > 0) {
        Mario.MarioCharacter.GetCoin();
        Enjine.Resources.PlaySound("coin");
        this.TileMap.SetBlock(x, y, 0);
        this.AddSprite(new Mario.CoinAnim(x, y + 1));
    }

    for (i = 0; i < this.Sprites.Objects.length; i++) {
        this.Sprites.Objects[i].BumpCheck(x, y);
    }
};
