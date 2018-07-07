//导入外部脚本
var js_dataControl = require("dataControl");
cc.Class({
    extends: cc.Component,

    properties: {
       checkId: 0,
    },
	onLoad: function () {
		var self = this;
		this.node.on(cc.Node.EventType.TOUCH_START, function ( event ) {
	    	js_dataControl.setcheckId(self.checkId)
	    	cc.director.loadScene("battleBuild");
	    });
    },
});
