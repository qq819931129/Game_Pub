cc.Class({
    extends: cc.Component,

    properties: {
        enemyPrefab1: cc.Prefab,
        enemyPrefab1Count: null
    },
    onLoad: function () {
        
    },
    init:function(){
        this.enemyPool = new cc.NodePool();
        for (let i = 0; i < this.enemyPrefab1Count; i++) {
            let enemy = cc.instantiate(this.enemyPrefab1); // 创建节点
            this.enemyPool.put(enemy); // 通过 putInPool 接口放入对象池
        }
    },
    createEnemy: function () {
        let enemy = null;
        if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.enemyPrefab1);
        }
        return enemy;
    },
    onEnemyKilled: function (enemy) {
        // enemy 应该是一个 cc.Node
        this.enemyPool.put(enemy); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    }
});
