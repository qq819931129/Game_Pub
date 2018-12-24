
//获取目标所有可攻击格子位置list  data数组---看A*算法注释  type索敌方式:（1-获取原点目标在最终目标   最近的可攻击的格子位置）（2-获取原点目标位置范围内所有可攻击格子位置）
module.exports.getAttPos_list = function(data,type){
	let attPos_list = [];//-------------可攻击的格子位置数组
	//攻击范围公式数组
	let directionList = [[{y:0,x:1},{y:-1,x:0},{y:0,x:-1},{y:1,x:0}],
	[{y:0,x:2},{y:-1,x:1},{y:-2,x:0},{y:-1,x:-1},{y:0,x:-2},{y:1,x:-1},{y:2,x:0},{y:1,x:1}],
	[{y:0,x:3},{y:-1,x:2},{y:-2,x:1},{y:-3,x:0},{y:-2,x:-1},{y:-1,x:-2},{y:0,x:-3},{y:1,x:-2},{y:2,x:-1},{y:3,x:0},{y:2,x:1},{y:1,x:2}]
	];
	if(data.heroItem.atkType == 3){//--直角类型处理，后续再加
		let attMaxList = module.exports.getAtkRangedMax(data.heroItem);
		//var atkRangedMax = 
	}
	
	//获取公式上的远程攻击最小距离
	var atkRangedMin = data.heroItem.atkRangedDistMin == data.heroItem.atkRangedDistMax ? data.heroItem.atkRangedDistMin - 1 : data.heroItem.atkRangedDistMin;
	for (let i = 0; i < data.heroItem.atkRangedDistMax; i++) {
		if(i == 0 || i >= atkRangedMin){
			if(type == 1){
				//获取原点目标在最终目标   最近的可攻击的格子位置
				var tempCheckTarget = data.batBox.getChildByName("batBox_y" + (data.endTarget.y) + "_x" + (data.endTarget.x));
			}
			if(type == 2){
				//获取原点目标位置范围内所有可攻击格子位置
				var tempCheckTarget = data.batBox.getChildByName("batBox_y" + (data.startTarget.y) + "_x" + (data.startTarget.x));
			}
			if (tempCheckTarget) {//----------是否存在格子
				var checkTarget = tempCheckTarget.getComponent("batBox_basic");
				for (let j = 0; j < directionList[i].length; j++) {
					let attPos_item = {y:(checkTarget.y + directionList[i][j].y),x:(checkTarget.x + directionList[i][j].x)};
					attPos_list.push(attPos_item);
				}
			}
		}
	}
	return attPos_list;
}
//获取直线攻击最远各方向格子
module.exports.getAtkRangedMax = function(target){
	
}
//获取原点目标在最终目标 最近的可攻击的格子位置  data数组---看A*算法注释
module.exports.getAttPos = function(data){
	let attPos_list = module.exports.getAttPos_list(data,1);
	console.log(attPos_list);
	for (let i = 0; i < attPos_list.length; i++) {
		let tempCheckTarget = data.batBox.getChildByName("batBox_y" + (attPos_list[i].y) + "_x" + (attPos_list[i].x));
		if (tempCheckTarget) {//----------是否存在格子
			var checkTarget = tempCheckTarget.getComponent("batBox_basic");
			if(checkTarget.bat_obstacle){//--------------------------当前循环九宫格格子是障碍物
				continue;
			}
			if (!checkTarget.bat_hero.point) {//---------------------当前循环九宫格格子是英雄
				return checkTarget;
			}
		}
	}
}
//索敌算法--------根据自身攻击范围搜索最近敌人 ，返回敌人所在的格子对象
module.exports.getRangeEnemy = function(data){
	let attPos_list = module.exports.getAttPos_list(data,2);
	let tempList = [];
	let enemyList = [];
	var minF = 0;
	for (let i = 0; i < data.hero_list.length; i++) {
		if (data.hero_list[i].groupId == 2) {
	    	let H_x = Math.abs(data.hero_list[i].x - data.startTarget.x);
			let H_y = Math.abs(data.hero_list[i].y - data.startTarget.y);
			let H = (H_x + H_y) * 10;
			let G = 0;
			let item = {
				x: data.hero_list[i].x,
				y: data.hero_list[i].y,
	    		G: G,//--------------------------------从起点 A 移动到指定方格的移动代价，沿着到达该方格而生成的路径。
	    		H: H,//--------------------------------从指定的方格移动到终点 B 的估算成本
	    		F: G+H
			}
			tempList.push(item);
			enemyList.push(data.hero_list[i]);
		}
	}
	for (let i = 0; i < tempList.length; i++) {
		if (tempList[i].F && minF == 0) {//------------------------为了排除可能会遇到没F值的父格子，当存在的F值的循环才初始化
			minF = tempList[i];
		}
		if (minF.F > tempList[i].F) {//根据F值取最近敌人
			minF = tempList[i];
		}
	}
	for (var i = 0; i < attPos_list.length; i++) {
		if(attPos_list[i].y == minF.y && attPos_list[i].x == minF.x){
			for (var j = 0; j < data.hero_list.length; j++) {
				if(data.hero_list[j].y == minF.y && data.hero_list[j].x == minF.x){
					return [data.hero_list[j]];
				}
			}
		}
	}
	return false;
};

//A*算法   (data数组---startTarget：原点目标，endTarget：终点目标，batBox：全局格子数组，hero_list：全局英雄数组，heroItem：移动目标对象)
module.exports.routeDirection = function(data){
	//if (startTarget.x == endTarget.x && startTarget.y == endTarget.y || endTarget.bat_obstacle || endTarget.bat_hero.groupId == 2) { return false; }//---------------如果起点和终点一样就退出方法
	console.log(data);
	if ((data.startTarget.x == data.endTarget.x && data.startTarget.y == data.endTarget.y) || data.endTarget.bat_obstacle) { return false; }//---第一次检测，起点和终点一样就退出方法
	let openList = [];//---------------九宫格临时存放格子数组
	let closeList = [];//--------------九宫格临时存放确认数组
	let sureList = [];//---------------九宫格最终确认数组
	let isSure_start = 0;//------------是否到达终点   0：不是   1：是
	let isSure_end = 0;//--------------是否到达起点   0：不是   1：是
	let minF = 0;//--------------------F值最小值
	let minG = 0;//--------------------G值最小值
	var tempEndTarget = null;//--------最后所选目标格子对象
	let parent = {x: data.startTarget.x, y: data.startTarget.y, isStart: 1, G: 0, H:0, F:0};//-----------isStart: 起点的唯一标识
	openList.push(parent);
	//方向数组  也可用作判断格子九宫格里其余格子是否在战场内数组   id：判断方向的数值   direction：上下左右斜方向值
	let directionList = [{y:0,x:1,direction:1},{y:-1,x:1,direction:2},{y:-1,x:0,direction:3},{y:-1,x:-1,direction:4},{y:0,x:-1,direction:5},{y:1,x:-1,direction:6},{y:1,x:0,direction:7},{y:1,x:1,direction:8}];
	data.batBox.getChildByName("batBox_y" + data.startTarget.y + "_x" + data.startTarget.x).setColor(cc.color("#008102"));//-----测试阶段，上颜色标识用
	data.batBox.getChildByName("batBox_y" + data.endTarget.y + "_x" + data.endTarget.x).setColor(cc.color("#fff"));//-----测试阶段，上颜色标识用
	if(data.endTarget.bat_hero.groupId == 2){//----------------获取敌人目标
		tempEndTarget = module.exports.getAttPos(data);
	}
	if(!tempEndTarget){//如没有获取到敌人目标，就读取传参进来的最终目标
		tempEndTarget = data.batBox.getChildByName("batBox_y" + data.endTarget.y + "_x" + data.endTarget.x).getComponent("batBox_basic");
	}
	if (data.startTarget.x == tempEndTarget.x && data.startTarget.y == tempEndTarget.y) {  return false; }//---第二次检测，起点和终点一样就退出方法，因为可能上面的处理结果会把最终位置改变为路线起点
	for (let j = 0; j < openList.length; j++) {
		if (isSure_start == 1) { break; }//----------已到达终点，退出循环
		let obsExList = [];//--------------障碍物上下左右格子的数组
    	var tempEnemyList = [];//----------敌人上下左右格子的数组
		for (let i = 0; i < directionList.length; i++) {//------------------获取路线障碍物上下左右格子的数组
			//计算出九宫格内当前循环的格子是否在战场内  原理：利用格子的行列值进行运算，得出结果异常则不属于战场内格子
    		let tempCheckTarget = data.batBox.getChildByName("batBox_y" + (parent.y + directionList[i].y) + "_x" + (parent.x + directionList[i].x));
			if (tempCheckTarget) {//----------是否存在格子
				var checkTarget = tempCheckTarget.getComponent("batBox_basic");
    			if (checkTarget.bat_obstacle) {//---------------------当前循环九宫格格子是障碍物
    				if (i == 0 || i == 2 || i == 4 || i == 6) {
    					//----------当前障碍物格子的各方向格子--临时禁止加入临时数组
    					let obsId_right = {y:(checkTarget.y + directionList[0].y),x:(checkTarget.x + directionList[0].x)};
    					let obsId_down = {y:(checkTarget.y + directionList[2].y),x:(checkTarget.x + directionList[2].x)};
    					let obsId_left = {y:(checkTarget.y + directionList[4].y),x:(checkTarget.x + directionList[4].x)};
    					let obsId_top = {y:(checkTarget.y + directionList[6].y),x:(checkTarget.x + directionList[6].x)};
    					obsExList.push(obsId_right,obsId_down,obsId_left,obsId_top);
    				}
    			}
    			var enemyList2 = [];
    			for (var z = 0; z < data.hero_list.length; z++) {
    				if(data.hero_list[z].point == checkTarget.bat_hero.point && data.hero_list[z].groupId == 2){
    					enemyList2.push(data.hero_list[z]);
    				}
    			}
    			if (enemyList2 != "") {
    				if (i == 0 || i == 2 || i == 4 || i == 6) {
					//----------当前敌人格子的各方向格子--临时禁止加入临时数组
    					let enemId_right = {y:(checkTarget.y + directionList[0].y),x:(checkTarget.x + directionList[0].x)};
    					let enemId_down = {y:(checkTarget.y + directionList[2].y),x:(checkTarget.x + directionList[2].x)};
    					let enemId_left = {y:(checkTarget.y + directionList[4].y),x:(checkTarget.x + directionList[4].x)};
    					let enemId_top = {y:(checkTarget.y + directionList[6].y),x:(checkTarget.x + directionList[6].x)};
    					tempEnemyList.push(enemId_right,enemId_down,enemId_left,enemId_top);
    				}
    			}
    		}
		}
    	for (let i = 0; i < directionList.length; i++) {//------------------获取路线临时数组
    		let isOpen = 0;//------------------是否已记录在临时数组标识   0：不是   1：是
    		let isClose = 0;//-----------------是否已记录在确认数组标识   0：不是   1：是
    		let isObstacle = 0;//--------------是否障碍物   0：不是   1：是
    		let isObsEx = 0;//-----------------当前格子是否位于障碍物格子上下左右侧的格子位置上，用于判断是否处于斜格处理   0：不是   1：是
    		var isEnemy = false;//-------------当前格子是否位于敌人格子上下左右侧的格子位置上，用于判断是否处于斜格处理   false：不是   true：是
    		var isEnemy2 = 0;
    		//计算出九宫格内当前循环的格子  原理：利用格子的行列值进行运算，得出结果异常则不属于战场内格子
    		let tempCheckTarget = data.batBox.getChildByName("batBox_y" + (parent.y + directionList[i].y) + "_x" + (parent.x + directionList[i].x));
    		if (tempCheckTarget) {//----------是否存在格子
				var checkTarget = tempCheckTarget.getComponent("batBox_basic");
				var enemyList2 = [];
    			for (var z = 0; z < data.hero_list.length; z++) {
    				if(data.hero_list[z].point == checkTarget.bat_hero.point && data.hero_list[z].groupId == 2){
    					enemyList2.push(data.hero_list[z]);
    				}
    			}
    			if (checkTarget.bat_obstacle) {//---------------------当前循环九宫格格子是障碍物
    				isObstacle = 1;
    			}else if(enemyList2.length != 0){
    				isEnemy = true;
    			}else{
	    			for (let x = 0; x < closeList.length; x++) {//------------------当前循环九宫格格子是否已记录在确认数组
		    			if (checkTarget.x == closeList[x].x && checkTarget.y == closeList[x].y) {
		    				isClose = 1;
		    				break;
		    			}
		    		}
	    			for (let x = 0; x < openList.length; x++) {//-------------------当前循环九宫格格子是否已记录在临时数组
		    			if (checkTarget.x == openList[x].x && checkTarget.y == openList[x].y) {
		    				isOpen = 1;
		    				break;
		    			}
		    		}
	    			for (let o = 0; o < obsExList.length; o++) {//------------------当前循环九宫格格子是否位于障碍物格子上下左右侧的格子位置上，是的话就不能纳入赋值ghf处理
    					if (checkTarget.x == obsExList[o].x && checkTarget.y == obsExList[o].y) {
	    					isObsEx = 1;
	    					break;
	    				}
    				}
	    			for (let o = 0; o < tempEnemyList.length; o++) {//------------------当前循环九宫格格子是否位于敌人格子上下左右侧的格子位置上，是的话就不能纳入赋值ghf处理
    					if (checkTarget.x == tempEnemyList[o].x && checkTarget.y == tempEnemyList[o].y) {
	    					isEnemy2 = 1;
	    					break;
	    				}
    				}
    			}
    			if (isClose == 0 && isOpen == 0 && isObstacle == 0 && isObsEx == 0 && !isEnemy && isEnemy2 == 0) {//-------------如任何检查判断为未触发，则视为当前格子是新处理格子
					let H_x = Math.abs(tempEndTarget.x - checkTarget.x);
					let H_y = Math.abs(tempEndTarget.y - checkTarget.y);
					let H = (H_x + H_y) * 10;
					let G;
					
					if(i == 0 || i == 2 || i == 4 || i == 6){
						G = 10 + parent.G;
					}else{
						G = 14 + parent.G;
					}
					let item = {
						x: checkTarget.x,
						y: checkTarget.y,
			    		G: G,//--------------------------------从起点 A 移动到指定方格的移动代价，沿着到达该方格而生成的路径。
			    		H: H,//--------------------------------从指定的方格移动到终点 B 的估算成本
			    		F: G+H,
			    		direction: directionList[i].direction
					}
			        let label_G = new cc.Node();
			        label_G.addComponent(cc.Label);
			        label_G.getComponent(cc.Label).fontSize = 12
			        label_G.getComponent(cc.Label).string = (checkTarget.y + "" + checkTarget.x)+ "，F："+(G+H)+  "\nG:"+G+"，H:"+H;
			        tempCheckTarget.addChild(label_G);
					openList.push(item);
				}
			}
		}
    	if (openList[0].isStart == 1) {//-----------处理起点的首次增删数组操作
    		closeList.push(openList[0]);
			openList.splice(0,1);
			j = -1;//-------------------------------初始化循环次数
    	}
    	for (let i = 0; i < openList.length; i++) {//----------循环取F值最小值
    		if (openList[i] && minF == 0) {//------------------------为了排除可能会遇到没F值的父格子，当存在的F值的循环才初始化
    			minF = openList[i];
    		}
    		if (minF.F > openList[i].F) {
    			minF = openList[i];
    		}
    	}
    	//console.log(openList,parent);
    	for (let i = 0; i < openList.length; i++) {//----------依靠最新的F值最小值格子得出新的父节点
    		if (openList[i].F == minF.F) {
    			parent = openList[i];
    			closeList.push(openList[i]);
    			openList.splice(i,1);
    			j = -1;//-------------------------------初始化循环次数
    			minF = 0;//-----------初始化F值最小值
    		}
    	}
    	if (parent.x == tempEndTarget.x && parent.y == tempEndTarget.y) {//---------------如果临时确认数组收录了终点，就退出循环
			isSure_start = 1;
		}
	}
	for (let j = 0; j < closeList.length; j++) {
		data.batBox.getChildByName("batBox_y" + closeList[j].y + "_x" + closeList[j].x).setColor(cc.color("#008102"));//-----测试阶段，上颜色标识用
	}
	closeList = closeList.reverse();
	sureList.push(parent);
	//计算最终路线    原理：从临时确认数组中反过来走到起点
	for (let j = 0; j < closeList.length; j++) {
		if (isSure_end == 1) { break; }//----------已回到起点，退出循环
		let obsExList = [];//--------------障碍物上下左右格子的数组
		let obsId_right = null;
		let tempSureList = [];
    	var tempEnemyList = [];
		for (let i = 0; i < directionList.length; i++) {
			//获取当前循环的父节点格子  
    		let tempCheckTarget = data.batBox.getChildByName("batBox_y" + (parent.y + directionList[i].y) + "_x" + (parent.x + directionList[i].x));
    		if (tempCheckTarget) {//----------是否存在格子
				var checkTarget = tempCheckTarget.getComponent("batBox_basic");
    			if (checkTarget.bat_obstacle) {//---------------------当前循环九宫格格子是障碍物
    				if (i == 0 || i == 2 || i == 4 || i == 6) {
    					//----------当前障碍物格子的各方向格子--临时禁止加入临时数组
    					let obsId_right = {y:(checkTarget.y + directionList[0].y),x:(checkTarget.x + directionList[0].x)};
    					let obsId_down = {y:(checkTarget.y + directionList[2].y),x:(checkTarget.x + directionList[2].x)};
    					let obsId_left = {y:(checkTarget.y + directionList[4].y),x:(checkTarget.x + directionList[4].x)};
    					let obsId_top = {y:(checkTarget.y + directionList[6].y),x:(checkTarget.x + directionList[6].x)};
    					obsExList.push(obsId_right,obsId_down,obsId_left,obsId_top);
    				}
    			}
    		}
			var enemyList2 = [];
			for (var z = 0; z < data.hero_list.length; z++) {
				if(data.hero_list[z].point == checkTarget.bat_hero.point && data.hero_list[z].groupId == 2){
					enemyList2.push(data.hero_list[z]);
				}
			}
			if (enemyList2 != "") {
				if (i == 0 || i == 2 || i == 4 || i == 6) {
					//----------当前敌人格子的各方向格子--临时禁止加入临时数组
					let enemId_right = {y:(checkTarget.y + directionList[0].y),x:(checkTarget.x + directionList[0].x)};
					let enemId_down = {y:(checkTarget.y + directionList[2].y),x:(checkTarget.x + directionList[2].x)};
					let enemId_left = {y:(checkTarget.y + directionList[4].y),x:(checkTarget.x + directionList[4].x)};
					let enemId_top = {y:(checkTarget.y + directionList[6].y),x:(checkTarget.x + directionList[6].x)};
					tempEnemyList.push(enemId_right,enemId_down,enemId_left,enemId_top);
				}
			}
		}
		for (let i = 0; i < directionList.length; i++) {
    		let isClose = 0;//-----------------是否已记录在确认数组标识   0：不是   1：是
    		let isObstacle = 0;//--------------是否障碍物   0：不是   1：是
    		let isObsEx = 0;//-----------------当前格子是否位于障碍物格子上下左右侧的格子位置上，用于判断是否处于斜格处理   0：不是   1：是
			var isEnemy = false;
    		var isEnemy2 = 0;
			let tempCheckTarget = data.batBox.getChildByName("batBox_y" + (parent.y + directionList[i].y) + "_x" + (parent.x + directionList[i].x));
    		if (tempCheckTarget) {//----------是否存在格子
    			var checkTarget = tempCheckTarget.getComponent("batBox_basic");
				for (let x = 0; x < closeList.length; x++) {//------------------当前循环九宫格格子是否已记录在确认数组
	    			if (checkTarget.x == closeList[x].x && checkTarget.y == closeList[x].y) {
	    				for (let o = 0; o < obsExList.length; o++) {//------------------当前循环九宫格格子是否位于障碍物格子上下左右侧的格子位置上，是的话就不能纳入赋值ghf处理
	    					if (checkTarget.x == obsExList[o].x && checkTarget.y == obsExList[o].y) {
		    					isObsEx = 1;
		    					break;
		    				}
	    				}
		    			for (let o = 0; o < tempEnemyList.length; o++) {//------------------当前循环九宫格格子是否位于敌人格子上下左右侧的格子位置上，是的话就不能纳入赋值ghf处理
	    					if (checkTarget.x == tempEnemyList[o].x && checkTarget.y == tempEnemyList[o].y) {
		    					isEnemy2 = 1;
		    					break;
		    				}
	    				}
	    				if (isObsEx == 0 && isEnemy2 == 0) {
	    					tempSureList.push(closeList[x]);
	    				}
	    			}
	    		}
    		}
		}
		console.log(tempSureList);
		for (let i = 0; i < tempSureList.length; i++) {//----------循环取F值最小值
    		if (tempSureList[i] && minG == 0) {//------------------------为了排除可能会遇到没G值的父格子，当存在的G值的循环才初始化
    			minG = tempSureList[i];
    		}
    		if (minG.G > tempSureList[i].G) {
    			minG = tempSureList[i];
    		}
    	}
    	for (let i = 0; i < tempSureList.length; i++) {//----------依靠最新的G值最小值格子得出新的父节点
    		if (tempSureList[i].G == minG.G) {
    			parent = tempSureList[i];
    			sureList.push(tempSureList[i]);
    			minG = 0;//-----------初始化G值最小值
    		}
    	}
		if (parent.x == data.startTarget.x && parent.y == data.startTarget.y) {//---------------如果临时确认数组收录了起点，就退出循环
			isSure_end = 1;
		}
	}
	for (let j = 0; j < sureList.length; j++) {
		data.batBox.getChildByName("batBox_y" + sureList[j].y + "_x" + sureList[j].x).setColor(cc.color("#bbb"));//-----测试阶段，上颜色标识用
	}
	console.log(sureList,closeList);
	return sureList.reverse();
};


//索敌算法--------根据自身为出发点搜索最近敌人 ，返回敌人所在的格子对象
module.exports.getNearEnemy = function(data){
	let tempList = [];
	let enemyList = [];
	var minF = 0;
	for (let i = 0; i < data.hero_list.length; i++) {
		if (data.hero_list[i].groupId == 2) {
	    	let H_x = Math.abs(data.hero_list[i].x - data.target.x);
			let H_y = Math.abs(data.hero_list[i].y - data.target.y);
			let H = (H_x + H_y) * 10;
			let G = 0;
			let item = {
				x: data.hero_list[i].x,
				y: data.hero_list[i].y,
	    		G: G,//--------------------------------从起点 A 移动到指定方格的移动代价，沿着到达该方格而生成的路径。
	    		H: H,//--------------------------------从指定的方格移动到终点 B 的估算成本
	    		F: G+H
			}
			tempList.push(item);
			enemyList.push(data.hero_list[i]);
		}
	}
	for (let i = 0; i < tempList.length; i++) {
		if (tempList[i].F && minF == 0) {//------------------------为了排除可能会遇到没F值的父格子，当存在的F值的循环才初始化
			minF = tempList[i];
		}
		if (minF.F > tempList[i].F) {//根据F值取最近敌人
			minF = tempList[i];
		}
	}
	var send = data.batBox.getChildByName("batBox_y" + minF.y + "_x" + minF.x).getComponent("batBox_basic");
	return send;
};