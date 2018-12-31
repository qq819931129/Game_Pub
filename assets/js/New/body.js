const AttackType = require('Types').AttackType;
cc.Class({
    extends: cc.Component,

    properties: {
       person:{ //身体节点
            default: null,
            type: cc.Node,
        }
    },
    onLoad: function () {
       
    },
    update: function () {

    },
    init:function(){
        this.animHelper = this.getComponent('animHelper');
        this.parentCopm = this.person.getComponent('person');

        //启用碰撞事件
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        this.node.group = this.node.parent.group;
    },
    attackOver: function () {
        if (this.parentCopm.atkTarget == null 
            || !this.parentCopm.atkTarget.activeInHierarchy 
            || this.parentCopm.atkTarget.die == 0) {
            return;
        }
        if(this.parentCopm.atkType == AttackType.Melee){
            var damagePoint = this.parentCopm.atkPoint; //后面会加入伤害公式计算
            this.parentCopm.atkTarget.getComponent('person').damage(damagePoint);
        }else{
            this.parentCopm.createFlyer();
        }
    },
    moveOver: function () {
        // cc.log('moveOver');
    },

    playAttack:function(){
        this.animHelper.playAttack();
    },

    playMove:function(){
        this.animHelper.playMove();
    },
    
    getAnimState:function(){
        this.animHelper.getAnimState();
    },
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        let demage = other.node.getComponent('flyerMove').damage;
        this.parentCopm.atkTarget.getComponent('person').damage(demage);
    }

});