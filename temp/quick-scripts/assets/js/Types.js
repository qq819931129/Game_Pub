(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/Types.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba526Zi8WVJu4u4melbnu8X', 'Types', __filename);
// js/Types.js

'use strict';

var AttackType = cc.Enum({
    Melee: 1, //近战
    Range: 2 //远程
});

//碰撞组名
var GroupName = cc.Enum({
    other: 'other',
    empty: 'empty'
});

module.exports = {
    AttackType: AttackType,
    GroupName: GroupName
};

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
        //# sourceMappingURL=Types.js.map
        