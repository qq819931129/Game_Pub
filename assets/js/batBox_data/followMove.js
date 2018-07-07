
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
    	var self = this;
    	var tag = this.node
    	var canvasPos = tag.convertToWorldSpace(0);
    	console.log(canvasPos);
    	console.log(tag);
    	console.log(tag.getPosition());
    	this.node.on(cc.Node.EventType.TOUCH_MOVE, function ( event ) {
			let selfItem = this;
			let touches = event.getTouches();
			let self_x = touches[0].getLocationX();
			let self_y = touches[0].getLocationY();
			tag.x = self_x - canvasPos.x - 250;
			tag.y = self_y - canvasPos.y - 0;
			console.log();
			console.log(event.getLocation(),"目标xy：" + tag.getPosition());
		});
    },
    
});
