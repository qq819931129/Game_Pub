
//英雄详细数据存储
module.exports.updateHeroList = function (target) {
    this.heroList = target;
};
module.exports.getHeroList = function () {
    return this.heroList;
};
//战场详细数据存储
module.exports.updateBatBoxList = function (target) {
    this.batlist = target;
};
module.exports.getBatBoxList = function () {
    return this.batlist;
};
module.exports.getHeroByName = function(name){
    try {
        if(this.heroList == undefined || this.heroList == null || this.heroList.length == 0){
            return undefined;
        }
        for(let hero of this.heroList){
            if(name == hero.heroName){
                return hero;
            }
        }
    } catch (error) {
        return null;
    }
};
module.exports.setHeroDieByName =function(name){
    for(let i=0;i<this.heroList.length;i++){
        if(this.heroList[i].heroName == name){
            this.heroList[i].isDie = 0;
        }
    }
}
//关卡id存储
module.exports.setcheckId = function(json){  
    this.checkId = json;    
};
module.exports.getcheckId = function(){  
    return this.checkId;    
};
//障碍物详细数据存储
module.exports.setObstacle = function(json){  
    this.obstacle = json;    
};
module.exports.getObstacle = function(){  
    return this.obstacle;    
};
//战场房间大对象
module.exports.room = function(){
	var item = {
		heroList: this.heroList,
		batlist: this.batlist,
		checkId: this.checkId,
		obstacle: this.obstacle,
	}
    return item;    
};