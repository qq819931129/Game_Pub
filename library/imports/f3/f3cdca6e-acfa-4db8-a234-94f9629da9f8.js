"use strict";
cc._RF.push(module, 'f3cdcpurPpNuKI0lPlinan4', 'batBox_basic');
// js/batBox_data/batBox_basic.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        batBoxName: null, //------------------------------该格子上的父级节点名字
        bat_obstacle: null, //----------------------------该格子上障碍物id
        bat_hero: null, //--------------------------------该格子上英雄对象
        box_current: 0, //--------------------------------该格子高亮标识
        x: 0, //------------------------------------------该格子坐标x
        y: 0 //------------------------------------------该格子坐标y
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();