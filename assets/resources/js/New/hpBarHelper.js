cc.Class({
    extends: cc.Component,

    properties: {
        //扣血数字显示集合
        subtractHPList:{
            default: null,
            type: cc.Node
        },
        //扣血数字动画预载资源
        subtractHPPrefab: {
            default: null,
            type: cc.Prefab
        },
        lifeBar:{
            default: null,
            type: cc.ProgressBar
        }
    },

    // use this for initialization
    onLoad: function () {
        this.lifeBar.progress = 1;
    },
    updateLifeBar:function(progress){
        this.lifeBar.progress = progress;
    },
    showDamagePoint:function(harm){
        var labal = cc.instantiate(this.subtractHPPrefab);
        labal.getComponent(cc.Label).string = '-'+harm;
        this.subtractHPList.addChild(labal);
        labal.getComponent(cc.Animation).play();
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
