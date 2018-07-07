"use strict";
cc._RF.push(module, 'e88e5jH/c5FqpwFrK6Sw+bw', 'followMove');
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