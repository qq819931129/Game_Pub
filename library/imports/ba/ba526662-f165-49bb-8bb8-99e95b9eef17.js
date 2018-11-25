"use strict";
cc._RF.push(module, 'ba526Zi8WVJu4u4melbnu8X', 'Types');
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