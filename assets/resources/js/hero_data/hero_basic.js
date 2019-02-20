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
        groupId : null,				//英雄敌我阵容标识
		heroName: null,			//英雄预存资源生成名称
		x		: null,		//英雄当前所处格子的x轴
		y		: null,		//英雄当前所处格子的y轴
		point	: null,				//英雄标记  纪录具体是哪个英雄
		route	: [],					//英雄移动路线   状态切换为移动时，赋值路线
		state	: 10					//英雄状态   10：静止，11：移动
    },


    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
