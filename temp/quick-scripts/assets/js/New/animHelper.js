(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/New/animHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c219ev8+y9E5Yqp8vL7fP4S', 'animHelper', __filename);
// js/New/animHelper.js

'use strict';

var animHelper = cc.Class({
    extends: cc.Component,

    properties: {
        anim: {
            default: null,
            type: cc.Animation
        },
        animState: {
            default: null,
            type: cc.AnimationState,
            visible: false
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    getAnimState: function getAnimState() {
        return this.animState;
    },

    playAttack: function playAttack() {
        if (this.animState != null && this.animState.name === 'person-attack') {
            return;
        }
        this.animState = this.anim.play('person-attack');
    },

    playMove: function playMove() {
        if (this.animState != null && this.animState.name === 'person-move') {
            return;
        }
        this.animState = this.anim.play('person-move');
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
        //# sourceMappingURL=animHelper.js.map
        