const AttackType = cc.Enum({
    Melee: 1, //近战
    Range: 2  //远程
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