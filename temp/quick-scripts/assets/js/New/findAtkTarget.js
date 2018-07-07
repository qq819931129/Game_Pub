(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/New/findAtkTarget.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7b18crismhNyquHclqjXfxo', 'findAtkTarget', __filename);
// js/New/findAtkTarget.js

"use strict";

//导入外部脚本
var js_dataControl = require("dataControl");
var AttackType = require('Types').AttackType;
cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},
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
    findCanAtkGrid: function findCanAtkGrid(atkType, rowGrid, colGrid, atkDistMin, atkDistMax) {
        var canAtkGrids = [];
        var position = Number("" + rowGrid + colGrid);
        //如果是远程，获取身边一个的攻击范围
        if (AttackType.Range == atkType) {
            var _top = position + 10;
            var _bottom = position - 10;
            var _left = position - 1;
            var _right = position + 1;
            if (_top > 0 && _top <= 50) {
                canAtkGrids.push(_top);
            }
            if (_bottom > 0 && _bottom <= 50) {
                canAtkGrids.push(_bottom);
            }
            if (_left > 0 && _left <= 50 && _left.toString().substring(0, 1) == rowGrid) {
                canAtkGrids.push(_left);
            }
            if (_right > 0 && _right <= 50 && _right.toString().substring(0, 1) == rowGrid) {
                canAtkGrids.push(_right);
            }
        }
        //获取最小攻击范围到最大攻击范围的格子坐标
        for (var i = atkDistMin; i <= atkDistMax; i++) {
            var top = position + i * 10;
            var bottom = position - i * 10;
            var left = position - i;
            var right = position + i;
            if (top > 0 && top <= 50) {
                canAtkGrids.push(top);
            }
            if (bottom > 0 && bottom <= 50) {
                canAtkGrids.push(bottom);
            }
            if (left > 0 && left <= 50 && left.toString().substring(0, 1) == rowGrid) {
                canAtkGrids.push(left);
            }
            if (right > 0 && right <= 50 && right.toString().substring(0, 1) == rowGrid) {
                canAtkGrids.push(right);
            }
            //斜角
            if (i < atkDistMax) {
                var topLeft = position + i * 11;
                var topRight = position - i * 9;
                var bottomLeft = position - i * 11;
                var bottomRight = position + i * 9;
                if (topLeft > 0 && topLeft <= 50) {
                    canAtkGrids.push(topLeft);
                }
                if (topRight > 0 && topRight <= 50) {
                    canAtkGrids.push(topRight);
                }
                if (bottomLeft > 0 && bottomLeft <= 50) {
                    canAtkGrids.push(bottomLeft);
                }
                if (bottomRight > 0 && bottomRight <= 50) {
                    canAtkGrids.push(bottomRight);
                }
            }
        }
        return canAtkGrids;
    },
    findNew: function findNew(atkType, rowGrid, colGrid, atkDistMin, atkDistMax) {
        if (js_dataControl.getHeroList() && js_dataControl.getHeroList().length > 0) {
            var canAtkGrids = this.findCanAtkGrid(atkType, rowGrid, colGrid, atkDistMin, atkDistMax);
            //cc.log(canAtkGrids);
            var canAtkTreget = {};
            var gridList = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = canAtkGrids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var grid = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = js_dataControl.getHeroList()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _temp = _step2.value;

                            if (_temp.groupId == 2 && _temp.isDie == 1) {
                                var boxId = "" + _temp.y + _temp.x;
                                //cc.log(boxId);
                                if (grid == boxId) {
                                    canAtkTreget[_temp.boxId] = _temp;
                                    gridList.push(_temp.boxId);
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            for (var i = 0; i < gridList.length; i++) {
                for (var j = i; j < gridList.length; j++) {
                    if (gridList[i] > gridList[j]) {
                        var temp = gridList[i];
                        gridList[i] = gridList[j];
                        gridList[j] = temp;
                    }
                }
            }
            var atkTarget = canAtkTreget[gridList[0]];
            if (atkTarget && atkTarget instanceof Object) {
                return atkTarget.heroName;
            }
        }
    },
    /**
     * 检测当前攻击目标是否还在攻击范围内
     */
    checkTargetInGrids: function checkTargetInGrids(atkType, atkTargetName, rowGrid, colGrid, atkDistMin, atkDistMax) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = js_dataControl.getHeroList()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var temp = _step3.value;

                if (temp.heroName == atkTargetName) {
                    var atkTargetBoxId = "" + temp.y + temp.x;
                    var canAtkGrids = this.findCanAtkGrid(atkType, rowGrid, colGrid, atkDistMin, atkDistMax);
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = canAtkGrids[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var grid = _step4.value;

                            if (atkTargetBoxId == grid) {
                                return true;
                            }
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return false;
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
        //# sourceMappingURL=findAtkTarget.js.map
        