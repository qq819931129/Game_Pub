const AttackType = cc.Enum({
    Melee: 1, //近战
    Range: 2, //范围远程,有斜角
    straight: 3 // 直线远程，无斜角
});

//碰撞组名
const GroupName = cc.Enum({
    other:'other',
    empty:'empty'
});

module.exports = {
    AttackType,
    GroupName
};