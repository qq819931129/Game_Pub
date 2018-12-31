//导入外部脚本
var js_dataControl = require("dataControl");
const AttackType = require('Types').AttackType;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },
    //寻找最近的敌人（向量版）
    // find: function (position, enemyCamp, atkDistMax) {
    //     //key距离、value节点
    //     var enemyMap = {};
    //     var keyArray = new Array();
    //     //循环查找目标
    //     if (enemyCamp == null || enemyCamp.childrenCount == 0) {
    //         return;
    //     }
    //     var enemys = enemyCamp.children;
    //     for (var i = 0; i < enemys.length; i++) {
    //         if (enemys[i] == null || enemys[i].getComponent('person').isDie()) {
    //             continue;
    //         }
    //         var position = this.getTargetDistance(position, enemys[i]);
    //         enemyMap[position] = enemys[i];
    //         keyArray.push(position);
    //     }
    //     //冒泡排序，找到最近的目标
    //     for (var i = 0; i < keyArray.length; i++) {
    //         for (var j = i; j < keyArray.length; j++) {
    //             if (keyArray[i] > keyArray[j]) {
    //                 var key = keyArray[i];
    //                 keyArray[i] = keyArray[j];
    //                 keyArray[j] = key;
    //             }
    //         }
    //     }
    //     if (keyArray[0] <= atkDistMax) {
    //         return enemyMap[keyArray[0]];
    //     } else {
    //         return null;
    //     }
    // },
    // //获取距离
    // getTargetDistance: function (position, atkTarget) {
    //     if (atkTarget == null || atkTarget.getComponent('person').isDie()) {
    //         return 9999;
    //     }
    //     return cc.pDistance(position, atkTarget.getPosition());
    // },

    //新寻敌、攻击方法（格子版）
    findCanAtkGrid: function (atkType, rowGrid, colGrid, atkDistMin, atkDistMax) {
        let canAtkGrids = [];
        let position = Number(`${rowGrid}${colGrid}`);
        //如果是远程，获取身边一个的攻击范围
        if (AttackType.Range == atkType) {
            let top = position + 10;
            let bottom = position - 10;
            let left = position - 1;
            let right = position + 1;
            if(top > 0 && top <= 50){
                canAtkGrids.push(top);
            }
            if(bottom > 0 && bottom <= 50){
                canAtkGrids.push(bottom);
            }
            if(left > 0 && left <= 50 && left.toString().substring(0,1) == rowGrid){
                canAtkGrids.push(left);
            }
            if(right > 0 && right <= 50 && right.toString().substring(0,1) == rowGrid){
                canAtkGrids.push(right);
            }
        }
        //获取最小攻击范围到最大攻击范围的格子坐标
        for (let i = atkDistMin; i <= atkDistMax; i++) {
            var top = position + i * 10;
            var bottom = position - i * 10;
            var left = position - i;
            var right = position + i;
            if(top > 0 && top <= 50){
                canAtkGrids.push(top);
            }
            if(bottom > 0 && bottom <= 50){
                canAtkGrids.push(bottom);
            }
            if(left > 0 && left <= 50 && left.toString().substring(0,1) == rowGrid){
                canAtkGrids.push(left);
            }
            if(right > 0 && right <= 50 && right.toString().substring(0,1) == rowGrid){
                canAtkGrids.push(right);
            }
            //斜角
            if(i < atkDistMax){
                var topLeft = position + i * 11;
                var topRight = position - i * 9;
                var bottomLeft = position - i * 11;
                var bottomRight = position + i * 9;
                if(topLeft > 0 && topLeft <= 50){
                    canAtkGrids.push(topLeft);
                }
                if(topRight > 0 && topRight <= 50){
                    canAtkGrids.push(topRight);
                }
                if(bottomLeft > 0 && bottomLeft <= 50){
                    canAtkGrids.push(bottomLeft);
                }
                if(bottomRight > 0 && bottomRight <= 50){
                    canAtkGrids.push(bottomRight);
                }
            }
        }
        return canAtkGrids;
    },
    findNew: function(atkType, rowGrid, colGrid, atkDistMin, atkDistMax){
        if(js_dataControl.getHeroList() && js_dataControl.getHeroList().length > 0){
            let canAtkGrids = this.findCanAtkGrid(atkType, rowGrid, colGrid, atkDistMin, atkDistMax);
            //cc.log(canAtkGrids);
            let canAtkTreget = {};
            let gridList = [];
            for(let grid of canAtkGrids){
                for(let temp of js_dataControl.getHeroList()){
                    if(temp.groupId == 2 && temp.isDie == 1){
                        let boxId = `${temp.y}${temp.x}`;
                        //cc.log(boxId);
                        if(grid == boxId){
                            canAtkTreget[boxId] = temp;
                            gridList.push(boxId);
                        }
                    }
                }
            }
            for(let i=0;i<gridList.length;i++){
                for(let j=i;j<gridList.length;j++){
                    if (gridList[i] > gridList[j]) {
                        var temp = gridList[i];
                        gridList[i] = gridList[j];
                        gridList[j] = temp;
                    }
                }
            }
            return canAtkTreget[gridList[0]];
        }
    },
    /**
     * 检测当前攻击目标是否还在攻击范围内
     */
    checkTargetInGrids:function(atkType, atkTargetName, rowGrid, colGrid, atkDistMin, atkDistMax){
        for(let temp of js_dataControl.getHeroList()){
            if(temp.heroName == atkTargetName){
                let atkTargetBoxId = `${temp.y}${temp.x}`;
                let canAtkGrids = this.findCanAtkGrid(atkType, rowGrid, colGrid, atkDistMin, atkDistMax);
                for(let grid of canAtkGrids){
                    if(atkTargetBoxId == grid){
                        return true;
                    }
                }
            }
        }
        return false;
    }
});
