(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/batBox_data/followMove.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e88e5jH/c5FqpwFrK6Sw+bw', 'followMove', __filename);
// js/batBox_data/followMove.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var self = this;
        var tag = this.node;
        var canvasPos = tag.convertToWorldSpace(0);
        console.log(canvasPos);
        console.log(tag);
        console.log(tag.getPosition());
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var selfItem = this;
            var touches = event.getTouches();
            var self_x = touches[0].getLocationX();
            var self_y = touches[0].getLocationY();
            tag.x = self_x - canvasPos.x - 250;
            tag.y = self_y - canvasPos.y - 0;
            console.log();
            console.log(event.getLocation(), "目标xy：" + tag.getPosition());
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
        //# sourceMappingURL=followMove.js.map
        