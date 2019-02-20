cc.Class({
    extends: cc.Component,

    properties: {
        pointA: {
            default: null,
            type: cc.Node
        },
        pointB: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

        var middleX = Math.abs(this.pointA.getPosition().x) > Math.abs(this.pointB.getPosition().x) ?
                             this.pointA.getPosition().x / 2 : this.pointB.getPosition().x / 2
        var middleY =  Math.abs(this.pointA.getPosition(). y) > Math.abs(this.pointB.getPosition().y) ?
                            this.pointA.getPosition().y / 2 : this.pointB.getPosition().y / 2
        
        cc.log('x:'+middleX+',y:'+middleY);

        var bezier = [this.pointA.getPosition(),
                cc.p(middleX, middleY+((this.pointB.getPosition().x-this.pointA.getPosition().x)*0.1)),
                this.pointB.getPosition()];
        var bezierTo = cc.bezierTo(1, bezier);
        this.pointA.runAction(bezierTo);

    }
});
