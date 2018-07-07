(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/batBox_data/collTest.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '593c04aUOFMOZBPiVVe4qWT', 'collTest', __filename);
// js/batBox_data/collTest.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed: 100,
        rotationSpeed: 90
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    update: function update(dt) {
        this.node.x -= dt * this.moveSpeed;
        this.node.rotation += dt * this.rotationSpeed;
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
        //# sourceMappingURL=collTest.js.map
        