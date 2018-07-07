(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/prefabPool.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f3f04eYHREZIoICD5mBFFQ', 'prefabPool', __filename);
// js/prefabPool.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        enemyPrefab1: cc.Prefab,
        enemyPrefab1Count: null
    },
    onLoad: function onLoad() {},
    init: function init() {
        this.enemyPool = new cc.NodePool();
        for (var i = 0; i < this.enemyPrefab1Count; i++) {
            var enemy = cc.instantiate(this.enemyPrefab1); // 创建节点
            this.enemyPool.put(enemy); // 通过 putInPool 接口放入对象池
        }
    },
    createEnemy: function createEnemy() {
        var enemy = null;
        if (this.enemyPool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.enemyPrefab1);
        }
        return enemy;
    },
    onEnemyKilled: function onEnemyKilled(enemy) {
        // enemy 应该是一个 cc.Node
        this.enemyPool.put(enemy); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
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
        //# sourceMappingURL=prefabPool.js.map
        