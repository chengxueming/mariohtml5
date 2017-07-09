/**
    Represents a Thing.
    Code by Rob Kleffner, 2011
*/
// var setting = {
//     name: "axe",
//     typename: "weapon",
//     draw: {
//         img: "npc-171",
//         xpic0: 4,
//         ypic0: 4,
//         picwidth: 16,
//         picheight: 28,
//     }
//     body: {
//         width: 4,
//         height: 4,
//     }
//     signal: {
//         ground: "Reverse",
//         wall: "Die"
//     },
//     //
//     eventset {
//         move: "normal",
//         colide: "WeaponEnemy",
//     }
//     speed: {
//         sky: 1.5,
//     }
//     style: {
//         run: "0,1,2,3"
//     }
// }
Mario.Thing = function(world, x, y, facing, setting) {

    if(typeof setting == String) {
        setting = window.library.thing[setting];
    }

    this.GroundInertia = 0.89;
    this.AirInertia = 0.89;

    this.Image = Enjine.Resources.Images[setting.draw.img];

    this.World = world;
    this.X = x;
    this.Y = y;
    this.Facing = facing;

    this.Style = setting.style || {};
    this.Status = "run";
    this.StyleIndex = 0;

    this.SignalCalls = setting.signal || {};

    this.XPicO = setting.draw.xpic0 || 8;
    this.YPicO = setting.draw.ypic0 || 1;
    this.YPic = 0;
    this.XPic = 0;
    this.Height = setting.body.height || 15;
    this.Width = setting.body.width || 4;
    this.PicWidth = setting.draw.picwidth || 32;
    this.PicHeight = setting.draw.picheight || 32;
    var speed = setting.speed || {};
    this.EventSet = setting.eventset || {};
    this.SkySpeed = speed.sky;
    this.Ya = 4;
    this.Dead = false;
    this.DeadTime = 0;
    this.Name = setting.name;
    this.typeName = setting.typename || "";

    this.Anim = 0;
    this.OnGround = false;
};

Mario.Thing.prototype = new Mario.NotchSprite();

Mario.Thing.prototype.Move = function() {
    var i = 0,
        sideWaysSpeed = 8;

    if (this.DeadTime > 0) {
        for (i = 0; i < 8; i++) {
            this.World.AddSprite(new Mario.Sparkle(this.World, ((this.X + Math.random() * 8 - 4) | 0) + 4, ((this.Y + Math.random() * 8 - 4) | 0) + 2, Math.random() * 2 - 1 * this.Facing, Math.random() * 2 - 1, 0, 1, 5));
        }
        this.World.RemoveSprite(this);
        return;
    }

    if (this.Facing != 0) {
        this.Anim++;
    }

    if (this.Xa > 2) {
        this.Facing = 1;
    }
    if (this.Xa < -2) {
        this.Facing = -1;
    }

    this.Xa = this.Facing * sideWaysSpeed;

    //this.World.CheckThingCollide(this);

    this.FlipX = this.Facing === -1;

    //this.YPic = this.Anim % 4;

    if (!this.SubMove(this.Xa, 0)) {
        //this.Die();
        this.CallSignal("wall");
        //eval("this."+this.SinalCalls.wall+"()");
        //"wall"
    }

    this.OnGround = false;
    this.SubMove(0, this.Ya);
    if (this.OnGround) {
        this.CallSignal("ground");
        //eval("this."+this.SinalCalls.ground+"()");
    }

    this.Ya *= 0.95;
    if (this.OnGround) {
        this.Xa *= this.GroundInertia;
    } else {
        this.Xa *= this.AirInertia;
    }

    if (!this.OnGround) {
        this.Ya -= this.SkySpeed;
    }

    this.CallPic();
};

Mario.Thing.prototype.Reverse = function() {
    this.Ya = 10;
}

Mario.Thing.prototype.CallSignal = function(signal) {
    if (this.SignalCalls.hasOwnProperty(signal)) {
        eval("this." + this.SignalCalls[signal] + "()");
    }
}

Mario.Thing.prototype.CallUserFunc = function(funcName, args) {
    if (this.__proto__.hasOwnProperty(funcName)) {
        this[funcName](args);
        return true;
    }
    return false;
}

Mario.Thing.prototype.CallPic = function() {
    // body... 
    var status = this.Style[this.Status].split(",");
    if (this.StyleIndex >= status.length) {
        this.StyleIndex = 0;
    } else {
        this.StyleIndex++;
    }
    this.YPic = status[this.StyleIndex];
};


Mario.Thing.prototype.IsBlocking = function(x, y, xa, ya) {
    x = (x / 16) | 0;
    y = (y / 16) | 0;

    if (x === (this.X / 16) | 0 && y === (this.Y / 16) | 0) {
        return false;
    }

    return this.World.TileMap.IsBlocking(x, y, xa, ya);
};

Mario.Thing.prototype.Die = function() {
    this.Dead = true;
    this.Xa = -this.Facing * 2;
    this.Ya = 5;
    this.DeadTime = 100;
};

Mario.Thing.prototype.WeaponEnemyColide = function(args) {
    var colideObj = args[0];
    if(colideObj.typeName == "character") {
        this.Trigger("hurt", colideObj);
    }
};

Mario.Thing.prototype.WeaponCharacterColide = function(args) {
    var colideObj = args[0];
    if(colideObj.typeName == "enemy") {
        this.Trigger("hurt", colideObj);
    }
};

Mario.Thing.prototype.EnemyHurt = function() {
    console.log("enemyhurt");
}

Mario.Thing.prototype.Trigger = function(eventName) {
    var args = arrayMake(arguments);
    //如果自己setting 有设置则按照setting
    var event = "";
    if (this.EventSet.hasOwnProperty(eventName)) {
        event = this.EventSet[eventName];
    }
    var nameList = [this.Name + event + eventName, this.Typename + event + eventName, event + eventName, eventName];
    var ele = this;
    nameList.forEach(function(element, index) {
        // statements
        if(true == ele.CallUserFunc(element, args)) {
            return;
        }
    });
}

Mario.Thing.prototype.CollideCheck = function(thingTwo) {
    return this.SubCollideCheck(thingTwo);
}
