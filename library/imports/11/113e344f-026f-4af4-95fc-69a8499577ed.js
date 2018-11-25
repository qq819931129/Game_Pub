"use strict";
cc._RF.push(module, '113e3RPAm9K9JX8aahJlXft', 'body');
// js/New/body.js

'use strict';

var AttackType = require('Types').AttackType;
cc.Class({
    extends: cc.Component,

    properties: {
        person: { //身体节点
            default: null,
            type: cc.Node
        }
    },
    onLoad: function onLoad() {},
    update: function update() {},
    init: function init() {
        this.animHelper = this.getComponent('animHelper');
        this.parentCopm = this.person.getComponent('person');

        //启用碰撞事件
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        this.node.group = this.node.parent.group;
        cc.log(this.node.group);
    },
    attackOver: function attackOver() {
        if (this.parentCopm.atkTarget == null || !this.parentCopm.atkTarget.activeInHierarchy || this.parentCopm.atkTarget.die == 0) {
            return;
        }
        if (this.parentCopm.atkType == AttackType.Melee) {
            var damagePoint = this.parentCopm.atkPoint; //后面会加入伤害公式计算
            this.parentCopm.atkTarget.getComponent('person').damage(damagePoint);
        } else {
            this.parentCopm.createFlyer();
        }
    },
    moveOver: function moveOver() {
        // cc.log('moveOver');
    },

    playAttack: function playAttack() {
        this.animHelper.playAttack();
    },

    playMove: function playMove() {
        this.animHelper.playMove();
    },

    getAnimState: function getAnimState() {
        this.animHelper.getAnimState();
    },
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function onCollisionEnter(other, self) {
        var demage = other.node.getComponent('flyerMove').damage;
        this.parentCopm.atkTarget.getComponent('person').damage(demage);
    }

});

cc._RF.pop();