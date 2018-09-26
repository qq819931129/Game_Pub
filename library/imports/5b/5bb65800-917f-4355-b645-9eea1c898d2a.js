"use strict";
cc._RF.push(module, '5bb65gAkX9DVbZFnuociY0q', 'flyerMove');
// js/New/flyerMove.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        damage: 0,
        targetNode: {
            default: null,
            type: cc.Node
        },
        targetDefPosition: 0,
        deviation: 0
    },
    // use this for initialization
    onLoad: function onLoad() {
        //启用碰撞事件
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        this.moveToPosition(this.targetDefPosition);
    },
    moveToPosition: function moveToPosition(position) {

        var thisPosition = this.node.getPosition();
        position = this.node.convertToNodeSpaceAR(position);

        var middleX = Math.abs(position.x) > Math.abs(thisPosition.x) ? Math.abs(position.x) / 2 : Math.abs(thisPosition.x) / 2;
        var middleY = Math.abs(position.y) > Math.abs(thisPosition.y) ? Math.abs(position.y) / 2 : Math.abs(thisPosition.y) / 2;

        var bezier = [thisPosition, cc.p(middleX, middleY + (position.x - thisPosition.x) * 0.1), position];
        //cc.log(bezier);
        var bezierTo = cc.bezierTo(1, bezier);
        this.node.runAction(bezierTo);
    },
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function onCollisionEnter(other, self) {
        if (this.targetNode.name == other.node.parent.name) {
            this.node.active = false;
        }
    },
    update: function update() {}
});

cc._RF.pop();