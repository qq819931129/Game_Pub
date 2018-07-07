"use strict";
cc._RF.push(module, '757c48YKDhOcbCieL2A5RY/', 'checkPoint_Control');
// js/checkPoint_Control.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.director.preloadScene("teamBuild", function () {
            cc.log("teamBuild 场景预加载完毕");
        });

        cc.loader.loadRes("test", cc.SpriteAtlas, function (err, atlas) {
            cc.log(atlas);
        });
    }

});

cc._RF.pop();