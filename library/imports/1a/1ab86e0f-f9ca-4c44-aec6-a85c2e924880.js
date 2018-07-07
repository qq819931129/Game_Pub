"use strict";
cc._RF.push(module, '1ab864P+cpMRK7GqFwukkiA', 'colliderListener');
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