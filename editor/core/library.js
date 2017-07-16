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

(function(global) {
    global.library = global.library || {};
    global.library.thing = {
        characters: {
            axe: {
                name: "axe",
                typename: "weapon",
                draw: {
                    img: "npc-171",
                    row: 1,
                    column: 4,
                    // xpic0: 4,
                    // ypic0: 4,
                    // picwidth: 16,
                    // picheight: 28,
                },
                // body: {
                //     width: 4,
                //     height: 4,
                // },
                speed: {
                    sky: 1.5,
                },
                signal: {
                    ground: "Reverse",
                    wall: "Die"
                },
                style: {
                    run: "0,1,2,3"
                }
            },
            mario: {
                name: "mario",
                typename: "character",
                draw: {
                    img: "mario-1",
                    indextype: 1,
                    xpic0: 8,
                    ypic0: 1,
                    picwidth: 32,
                    picheight: 32,
                },
                body: {
                    width: 4,
                    height: 15,
                },
                speed: {
                    sky: 1.5,
                },
                signal: {
                    ground: "Reverse",
                    wall: "Die"
                },
                style: {
                    face: function(pos){return [9 - pos[0], 8-pos[1]]},
                    run: ["0,1;5", "face", 5],
                    
                }
            },
            koopa: {
                name: "koopa",
                typename: "character",
                draw: {
                    img: "npc-2",
                    xpic0: 8,
                    ypic0: 1,
                    picwidth: 32,
                    picheight: 32,
                },
                body: {
                    width: 4,
                    height: 12,
                },
                speed: {
                    sky: 1.5,
                },
                signal: {
                    //ground: "Reverse",
                    wall: "Die"
                },
                style: {
                    run: ["0,1", 5]
                }
            },
            tortoise: {
                name: "tortoise",
                typename: "character",
                draw: {
                    img: "npc-6",
                    xpic0: 8,
                    ypic0: 1,
                    picwidth: 32,
                    picheight: 54,
                },
                body: {
                    width: 4,
                    height: 24,
                },
                speed: {
                    sky: 1.5,
                },
                signal: {
                    //ground: "Reverse",
                    wall: "Die"
                },
                style: {
                    run: ["0;0,1", "0;2,3", 5]
                }
            },
            flowerenemy: {
                name: "koopa",
                typename: "character",
                draw: {
                    img: "npc-171",
                    xpic0: 4,
                    ypic0: 4,
                    picwidth: 16,
                    picheight: 28,
                },
                body: {
                    width: 4,
                    height: 4,
                },
                speed: {
                    sky: 1.5,
                },
                signal: {
                    ground: "Reverse",
                    wall: "Die"
                },
                style: {
                    run: "0;0,1,2,3"
                }
            },
            fireflower: {
                name: "koopa",
                typename: "character",
                draw: {
                    img: "npc-171",
                    xpic0: 4,
                    ypic0: 4,
                    picwidth: 16,
                    picheight: 28,
                },
                body: {
                    width: 4,
                    height: 4,
                },
                speed: {
                    sky: 1.5,
                },
                signal: {
                    ground: "Reverse",
                    wall: "Die"
                },
                style: {
                    run: "0;0,1,2,3"
                }
            },
            mushroom: {
                name: "mushroom",
                typename: "character",
                draw: {
                    img: "npc-171",
                    // xpic0: 4,
                    // ypic0: 4,
                    // picwidth: 16,
                    // picheight: 28,
                },
                // body: {
                //     width: 4,
                //     height: 4,
                // },
                speed: {
                    sky: 1.5,
                },
                signal: {
                    ground: "Reverse",
                    wall: "Die"
                },
                style: {
                    run: "0;0,1,2,3"
                }
            },
            shell: {
                name: "shell",
                typename: "character",
                draw: {
                    img: "npc-171",
                    // xpic0: 4,
                    // ypic0: 4,
                    // picwidth: 16,
                    // picheight: 28,
                },
                // body: {
                //     width: 4,
                //     height: 4,
                // },
                speed: {
                    sky: 1.5,
                },
                signal: {
                    ground: "Reverse",
                    wall: "Die"
                },
                style: {
                    run: "0;0,1,2,3"
                }
            },
        },//end characters
    }
    libraryParse(global.library.thing.characters);
})(window)

/**
@param things is a thing map;
*/
function libraryParse(things) {
    for(i in things) {
        var sprite = things[i];
        parseImage(sprite);
        parseStyle(sprite);
    }
    return things;
}

function parseImage(sprite) {
    this.unitscale = 2;
    switch (sprite.draw.constructor) {
        case String:

            break;
        case Object:
            var img = Enjine.Resources.Images[sprite.draw.img];
            var row = sprite.draw.row || 1;
            var column = sprite.draw.column || 4;
            sprite.draw.indextype = sprite.darw.indextype || 0;
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
                sprite.draw.picwidth = sprite.draw.picwidth || img.width / row;
                sprite.draw.picheight = sprite.draw.picheight || img.height / column;
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