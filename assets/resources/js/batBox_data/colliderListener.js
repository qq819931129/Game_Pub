
cc.Class({
    extends: cc.Component,

    properties: {
    	boxItem: null,//-----------------存放碰到的格子对象
    },
	onLoad: function () {
    },
    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
    },
    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
    },
    onCollisionEnter: function (other, self) {
        this.boxItem = other.node;
        //console.log(other, self);
    },
    
    onCollisionStay: function (other, self) {
        // console.log('on collision stay');
    },
    
    onCollisionExit: function () {
    }
	

});