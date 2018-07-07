(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/checkPoint_Control.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '757c48YKDhOcbCieL2A5RY/', 'checkPoint_Control', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=checkPoint_Control.js.map
        