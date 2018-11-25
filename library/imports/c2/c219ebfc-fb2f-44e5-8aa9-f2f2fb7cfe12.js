"use strict";
cc._RF.push(module, 'c219ev8+y9E5Yqp8vL7fP4S', 'animHelper');
// js/New/animHelper.js

'use strict';

var animHelper = cc.Class({
    extends: cc.Component,

    properties: {
        anim: {
            default: null,
            type: cc.Animation
        },
        animState: {
            default: null,
            type: cc.AnimationState,
            visible: false
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    getAnimState: function getAnimState() {
        return this.animState;
    },

    playAttack: function playAttack() {
        if (this.animState != null && this.animState.name === 'person-attack') {
            return;
        }
        this.animState = this.anim.play('person-attack');
    },

    playMove: function playMove() {
        if (this.animState != null && this.animState.name === 'person-move') {
            return;
        }
        this.animState = this.anim.play('person-move');
    }
});

cc._RF.pop();