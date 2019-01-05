//导入外部脚本
var js_dataControl = require("dataControl");
var js_algorithm_A = require("algorithm_A");
const AttackType = require('Types').AttackType;
cc.Class({
    extends: cc.Component,
    properties: {
        atkPoint: 10,//攻击力
        speed: 1,//游戏速度
        atkType: AttackType.Melee,//攻击类型
        atkDist: null,//近身攻击距离
        atkDistMax:null,//最大攻击距离
        atkRangedDistMin:null,//远程攻击最小距离
        atkRangedDistMax:null,//远程攻击最大距离
        defalutHP:500,//默认生命值
        allHP:500,//当前生命值
        die: 1,//是否死亡 1否 0是，默认否（1）
        type: 0,
        body: { //身体节点
            default: null,
            type: cc.Node,
        },
        group: null, //组，我方or敌方
        atkTarget: { //正在攻击的敌人
            default: null,
            type: cc.Node,
            visible: false
        },
        flyerList:{//飞行物数组
            default: null,
            type: cc.Node
        },
        flyer:{//飞行物资源
            default: null,
            type: cc.Prefab
        },
        groupId : null,		//英雄敌我阵容标识
		heroName: null,		//英雄预存资源生成名称
		x		: null,		//英雄当前所处格子的x轴
		y		: null,		//英雄当前所处格子的y轴
		point	: null,		//英雄标记  纪录具体是哪个英雄
		route	: [],		//英雄移动路线   状态切换为移动时，赋值路线
		state	: 10		//英雄状态   10：静止，11：移动
    },

    // use this for initialization
    onLoad: function () {
        this.findAtkTarget = this.getComponent('findAtkTarget');
        this.HPBar = this.getComponent('hpBarHelper');
        this.bodyComp = this.body.getComponent('body');
        this.personComp = this.getComponent('person');
        this.enemyNode =  cc.find('/background/enemy');
        this.background = cc.find('/background'); //获取这个节点的作用是用于坐标转换
        this.bodyComp.init();
        this.bodyComp.playMove();

        //测试远程攻击
        this.atkType = AttackType.Range;//攻击类型
        this.atkDist = 1;//近身攻击距离
        this.atkDistMax = 1;//最大攻击距离
        this.atkRangedDistMin = 3;//远程攻击最小距离
        this.atkRangedDistMax = 3;//远程攻击最大距离
    },

    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
        // let aaa = js_algorithm_A.getRangeEnemy({
        //     startTarget:	this,
        //     //endTarget:		self.batBox.getChildByName("batBox_y" + 3 + "_x" + 7).getComponent("batBox_basic"),
        //     batBox:			js_dataControl.batlist,
        //     hero_list:		js_dataControl.getHeroList(),
        //     heroItem:		this
        // });
        // console.log(aaa);
    },

    createFlyer:function(){
        if(this.atkRangedDistMin && this.atkRangedDistMax){
            if(this.atkTarget != null){
                var flyer = cc.instantiate(this.flyer);
                flyer.group = this.group;
                flyer.setPosition(cc.v2(0,0));
                // flyer.setPosition(this.Canvas.convertToNodeSpace(flyer.getPosition()));
                flyer.getComponent('flyerMove').damage = this.atkPoint;
                flyer.getComponent('flyerMove').targetNode = this.atkTarget;
                flyer.getComponent('flyerMove').targetDefPosition = this.atkTarget.getPosition();
                flyer.setLocalZOrder(10);
                this.flyerList.addChild(flyer);
                //flyer.getComponent('flyerMove').moveToPosition(this.atkTarget.getPosition());
            }
        }
    },

    isDie:function(){
        return !this.node.activeInHierarchy || this.die == 0 || this.allHP <= 0;
    },
    goDie: function () {
        this.die = 0;
        this.node.parent.active = false;
        js_dataControl.setHeroDieByName(this.heroName);
    },
    damage: function(damagePoint){
        this.allHP = this.allHP - damagePoint;
        this.HPBar.updateLifeBar(this.allHP / this.defalutHP);
        this.HPBar.showDamagePoint(damagePoint);
        if (this.allHP <= 0 ) {
            this.goDie();
        }
    },
    enemyIsDie:function(){
        if (this.atkTarget.allHP <= 0 ) {
            this.atkTarget.goDie();
            this.atkTarget = null;
            return true;
        }else{
            return false;
        }
    },
});
