"use strict";
cc._RF.push(module, '530731AVytH65Ps1Eazs97A', 'dataControl');
// js/dataControl.js

"use strict";

//英雄详细数据存储
module.exports.updateHeroList = function (target) {
    this.heroList = target;
};
module.exports.getHeroList = function () {
    return this.heroList;
};
module.exports.getHeroByName = function (name) {
    try {
        if (this.heroList == undefined || this.heroList == null || this.heroList.length == 0) {
            return undefined;
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.heroList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var hero = _step.value;

                if (name == hero.heroName) {
                    return hero;
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
    } catch (error) {
        return null;
    }
};
module.exports.setHeroDieByName = function (name) {
    for (var i = 0; i < this.heroList.length; i++) {
        if (this.heroList[i].heroName == name) {
            this.heroList[i].isDie = 0;
        }
    }
};
//关卡id存储
module.exports.setcheckId = function (json) {
    this.checkId = json;
};
module.exports.getcheckId = function () {
    return this.checkId;
};
//障碍物详细数据存储
module.exports.setObstacle = function (json) {
    this.obstacle = json;
};
module.exports.getObstacle = function () {
    return this.obstacle;
};
//战场房间大对象
module.exports.room = function () {
    var item = {
        heroList: this.heroList,
        checkId: this.checkId,
        obstacle: this.obstacle
    };
    return item;
};

cc._RF.pop();