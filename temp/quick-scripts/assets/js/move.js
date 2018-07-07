(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/move.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'aecd5d2C+dGlI8DT78+PTXU', 'move', __filename);
// js/move.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        pointA: {
            default: null,
            type: cc.Node
        },
        pointB: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {

        var middleX = Math.abs(this.pointA.getPosition().x) > Math.abs(this.pointB.getPosition().x) ? this.pointA.getPosition().x / 2 : this.pointB.getPosition().x / 2;
        var middleY = Math.abs(this.pointA.getPosition().y) > Math.abs(this.pointB.getPosition().y) ? this.pointA.getPosition().y / 2 : this.pointB.getPosition().y / 2;

        cc.log('x:' + middleX + ',y:' + middleY);

        var bezier = [this.pointA.getPosition(), cc.p(middleX, middleY + (this.pointB.getPosition().x - this.pointA.getPosition().x) * 0.1), this.pointB.getPosition()];
        var bezierTo = cc.bezierTo(1, bezier);
        this.pointA.runAction(bezierTo);
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
        //# sourceMappingURL=move.js.map
        