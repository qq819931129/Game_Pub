(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/New/hpBarHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '650daGV4EREUYHQ5l6OBC08', 'hpBarHelper', __filename);
// js/New/hpBarHelper.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        //扣血数字显示集合
        subtractHPList: {
            default: null,
            type: cc.Node
        },
        //扣血数字动画预载资源
        subtractHPPrefab: {
            default: null,
            type: cc.Prefab
        },
        lifeBar: {
            default: null,
            type: cc.ProgressBar
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.lifeBar.progress = 1;
    },
    updateLifeBar: function updateLifeBar(progress) {
        this.lifeBar.progress = progress;
    },
    showDamagePoint: function showDamagePoint(harm) {
        var labal = cc.instantiate(this.subtractHPPrefab);
        labal.getComponent(cc.Label).string = '-' + harm;
        this.subtractHPList.addChild(labal);
        labal.getComponent(cc.Animation).play();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        //# sourceMappingURL=hpBarHelper.js.map
        