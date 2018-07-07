const animHelper = cc.Class({
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
    onLoad: function () {

    },

    getAnimState:function(){
        return this.animState;
    },

    playAttack:function(){
        if(this.animState != null && this.animState.name === 'person-attack'){
            return;
        }
        this.animState = this.anim.play('person-attack');
    },

    playMove:function(){
        if(this.animState != null && this.animState.name === 'person-move'){
            return;
        }
        this.animState = this.anim.play('person-move');
    }
});
