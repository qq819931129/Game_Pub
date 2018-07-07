"use strict";
cc._RF.push(module, '593c04aUOFMOZBPiVVe4qWT', 'collTest');
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