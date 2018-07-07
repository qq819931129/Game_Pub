
cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed: 100,
        rotationSpeed: 90
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {

    },
	update: function (dt) {
        this.node.x -= dt * this.moveSpeed;
        this.node.rotation += dt * this.rotationSpeed;
    },
});
