//           picwidth
//         |---------|
//          xpic0
//         |----|
//          _________           _
//         |  _____  |  _       | 
//         | |     | |  |       | 
//         | |     | |  |    picheight    
//      _  | |(x,y)| | height   |
// ypic0|  | |——#——| |  |       |
//      _  | |__|__| |  _       _

//           |--|
//            width
//var gnamespace = window;
(function(global) {
    global.library = global.library || {};
    global.library.thing = {
        characters: {
            axe: {
                draw: "npc-171",
                style: {
                    run: "0,1,2,3"
                }
            },
            mario: {
                small: {
                    draw: {
                        img: "mario-1",
                        indextype: 1,
                    },
                    style: {
                        face: function(pos){return [9 - pos[0], 8-pos[1]]},
                        run: ["0,1;5", "face", 5],
                    }
                },
                big: {
                    normal:function() {
                        var me = cloneObj(this.characters.mario.small);
                        me.draw.img = "mario-2";
                        return me;
                    },
                    yellow:function() {
                        var me = cloneObj(this.characters.mario.big.normal);
                        me.draw.img = "mario-3";
                        return me;
                    }
                }
            },
            koopa: {
                draw: {
                    img: "npc-2",
                    column: 2,
                },
                style: {
                    run: ["0,1", 5]
                }
            },
            tortoise: {
                draw: "npc-6",
                style: {
                    run: ["0;0,1", "0;2,3", 5]
                }
            },
            mushroom: {
                draw: {
                    img: "npc-171",
                    column: 1,
                },
                style: {
                    run: ["0;0",5]
                }
            },
            fireflower: function() {
                        var me = cloneObj(this.characters.mushroom);
                        me.draw.img = "npc-14";
                        return me;
                    },
            shell: {
                draw: "npc-5",
                style: {
                    run: "0;0,1,2,3"
                }
            },
        },//end characters
    }
    //libraryParse(global.library.thing.characters);
})(global);//测试时为node 全局对象global 使用时为dom全局对象 window
var two = require("../toned");
var toned = two.TonedJS(false);
toned.giveSup(toned, global);
global.window = {};
libraryParse(global.library.thing);
mlog(library.thing.characters.fireflower);
//TEST
// sublibraryParse(global.library.thing.characters.mushroom);
// mlog(global.library.thing.characters.mushroom);
// mlog(global.library.thing.characters.mushroom.style.run);

/**
@param things is a thing map;
*/
function libraryParse(things) {
    //递归的将所有函数转换为对象
    this.endTag = "draw";
    this.predealthings = function(things){
        // body... 
        for(i in things) {
            switch (things[i].constructor) {
                case Function:
                    things[i] = things[i].call(library.thing);
                    break;
                case Object:
                    if(!things[i].hasOwnProperty(this.endTag)) {
                        predealthings(things[i]);
                    }
            }
        };
    };
    this.sublibraryParse = function(things) {
        this.sub = function (sprite) {
            parseImage(sprite);
            parseStyle(sprite);
        };
        for(i in things) {
            switch (things[i].constructor) {
                case Object:
                    if(things[i].hasOwnProperty(this.endTag)) {
                        //默认包含draw的为根节点
                        var sprite = things[i];
                        this.sub(sprite);
                    } else {
                        sublibraryParse(things[i])
                    }
                    break;
            }
        }
        return things;
    };
    this.predealthings(things);
    this.sublibraryParse(things);
}

function parseImage(sprite) {
    this.unitscale = 2;
    switch (sprite.draw.constructor) {
        case String:
            sprite.draw = {img: sprite.draw};
        case Object:
            //var img = Enjine.Resources.Images[sprite.draw.img];
            var img = {width: 32, height: 32};
            sprite.draw.indextype = sprite.draw.indextype || 0;
            if(sprite.draw.indextype) {
            //对于mario等
                row = row || 10;
                column = column || 10;
                sprite.draw.unitwidth = sprite.draw.unitwidth || img.width / row;
                sprite.draw.unitheight = sprite.draw.unitheight || img.height / column;
                sprite.draw.picwidth = sprite.draw.picwidth || 32;
                sprite.draw.picheight = sprite.draw.picheight || 32;
            }else {
            //对于全部npc 和 effect
                var row = sprite.draw.row || 1;
                var column = sprite.draw.column || 4;
                sprite.draw.picwidth = sprite.draw.picwidth || img.width / row;
                sprite.draw.picheight = sprite.draw.picheight || img.height / column;
                sprite.draw.unitwidth = sprite.draw.unitwidth || sprite.draw.picwidth;
                sprite.draw.unitheight = sprite.draw.unitheight || sprite.draw.picwidth;
            }
            //普遍为精灵的一半
            sprite.draw.xpic0 = sprite.draw.xpic0 || sprite.draw.picwidth/this.unitscale/2;
            //普遍为1
            sprite.draw.ypic0 = sprite.draw.ypic0 || 1;
            sprite.body = sprite.body || {};
            //宽度的一半减去4个像素
            sprite.body.width = sprite.body.width || (sprite.draw.picwidth/this.unitscale/2 - 4);
            //高度的一半减去4个像素
            sprite.body.height = sprite.body.height || (sprite.draw.picheight/this.unitscale - 4);
            break;
    }
    delete sprite.draw.row;
    delete sprite.draw.column;
    delete sprite.draw.indextype;
}
/**
style: {
    run:"0;0,1,2,3"
    run:["0;0,1", 5]
    run:["0;0,1", "0;2,3", 5]
    face: function(pos){return [9 - pos[0], 8-pos[1]]},
    run: ["0,1;5", "face", 5],
    face: function(pos){return [9 - pos[0], 8-pos[1]]},
    run: ["face", "0,1;5", 5],
    run: [[[0,5],[1,5]],[[9,3],[8,3]],5]
}
*/
function parseStyle(sprite) {
    sprite.style = sprite.style || {};
    style = sprite.style;
    this.defaultFreq = 1;
    var unzip = function(s, s2) {
        if(typeof s == "array") {
            return s;
        }
        if(s.indexOf(";") == -1 && typeof style[s] == "function") {
            return unzip(s2).map(style[s]);
        }
        var semicRight = s.replace(/.*;/, "").split(",").map(function(a){return parseInt(a);});
        var semicLeft = s.replace(/;.*/, "").split(",").map(function(a){return parseInt(a);});
        var l = mzip(semicLeft, semicRight);
        return l;
    };
    for(i in style) {
        switch (style[i].constructor) {
            case String:
                l = unzip(style[i]);
                style[i] = [l, l, this.defaultFreq];
                break;
            case Array:
                var v1 = style[i][0];
                if(style[i].length == 2) {
                    if(typeof style[i][1] == "string") {
                        style[i].push(this.defaultFreq);
                    }else if(typeof style[i][1] == "number") {
                        minsert(style[i], 1, v1);
                    }
                }
                var v2 = style[i][1];
                style[i][0] = unzip(v1, v2);
                style[i][1] = unzip(v2, v1);
                break;
            case Function:
                break;
        }
    }
    return style;
}