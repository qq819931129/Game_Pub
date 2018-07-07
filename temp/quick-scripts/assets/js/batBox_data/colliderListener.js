(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/batBox_data/colliderListener.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1ab864P+cpMRK7GqFwukkiA', 'colliderListener', __filename);
// js/batBox_data/colliderListener.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        boxItem: null //-----------------存放碰到的格子对象
    },
    onLoad: function onLoad() {},
    onEnable: function onEnable() {
        cc.director.getCollisionManager().enabled = true;
    },
    onDisable: function onDisable() {
        cc.director.getCollisionManager().enabled = false;
    },
    onCollisionEnter: function onCollisionEnter(other, self) {
        this.boxItem = other.node;
        //console.log(other, self);
    },

    onCollisionStay: function onCollisionStay(other, self) {
        // console.log('on collision stay');
    },

    onCollisionExit: function onCollisionExit() {}

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
        //# sourceMappingURL=colliderListener.js.map
        