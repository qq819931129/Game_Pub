(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/checkPointData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f3f6dECoeVD+79wt/PcBI7b', 'checkPointData', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=checkPointData.js.map
        