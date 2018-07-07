"use strict";
cc._RF.push(module, 'f3f6dECoeVD+79wt/PcBI7b', 'checkPointData');
// js/checkPointData.js

"use strict";

//导入外部脚本
var js_dataControl = require("dataControl");
cc.Class({
			extends: cc.Component,

			properties: {
						checkId: 0
			},
			onLoad: function onLoad() {
						var self = this;
						this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
									js_dataControl.setcheckId(self.checkId);
									cc.director.loadScene("battleBuild");
						});
			}
});

cc._RF.pop();