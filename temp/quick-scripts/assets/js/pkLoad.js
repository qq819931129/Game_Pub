(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/pkLoad.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '79f1bdraUxNU6kRAY2y3bJ2', 'pkLoad', __filename);
// js/pkLoad.js

'use strict';

cc.Class({
    extends: cc.Component,
    properties: {
        leftCamp: {
            default: null,
            type: cc.Node
        },
        rightCamp: {
            default: null,
            type: cc.Node
        },
        personPrefabNew: {
            default: null,
            type: cc.Prefab
        }
    },
    onLoad: function onLoad() {
        this.battle_Control = this.getComponent('battle_Control');
        this.battle_Control.battleInit_basic(1);

        this.perfabPool = this.getComponent("prefabPool");
        this.perfabPool.init();

        // this.init();
    },
    init: function init() {
        var person1 = this.perfabPool.createEnemy();
        person1.getComponent('person').group = 'left';
        person1.x = 250;
        person1.y = 250;
        person1.name = 'person1';
        cc.log(person1);
        this.leftCamp.addChild(person1);

        var person2 = this.perfabPool.createEnemy();
        person2.getComponent('person').body.scaleX = -1;
        person2.getComponent('person').group = 'right';
        person2.x = 750;
        person2.y = 250;
        person2.name = 'person2';
        cc.log(person2);
        this.rightCamp.addChild(person2);

        var person3 = this.perfabPool.createEnemy();
        person3.name = 'person3';
        person3.getComponent('person').group = 'left'; //少了这个属性没赋值会抱错？？？？
        person3.x = 250;
        person3.y = 250;
        cc.log(person3);
        this.leftCamp.addChild(person3);

        var person4 = this.perfabPool.createEnemy();
        person4.name = 'person4';
        person4.getComponent('person').body.scaleX = -1;
        person4.getComponent('person').group = '11'; //少了这个属性没赋值会抱错？？？？
        person4.x = 750;
        person4.y = 250;
        cc.log(person4);
        this.rightCamp.addChild(person4);
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
        //# sourceMappingURL=pkLoad.js.map
        