(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/js/base/algorithm_A.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3f759Un2IJMQpD0imNNAvxT', 'algorithm_A', __filename);
// js/base/algorithm_A.js

"use strict";

//获取原点目标在最终目标的所有可攻击格子位置list  data数组---看A*算法注释
module.exports.getAttPos_list = function (data) {
	var attPos_list = []; //-------------可攻击的格子位置数组
	//攻击范围公式数组
	var directionList = [[{ y: 0, x: 1 }, { y: -1, x: 0 }, { y: 0, x: -1 }, { y: 1, x: 0 }], [{ y: 0, x: 2 }, { y: -1, x: 1 }, { y: -2, x: 0 }, { y: -1, x: -1 }, { y: 0, x: -2 }, { y: 1, x: -1 }, { y: 2, x: 0 }, { y: 1, x: 1 }], [{ y: 0, x: 3 }, { y: -1, x: 2 }, { y: -2, x: 1 }, { y: -3, x: 0 }, { y: -2, x: -1 }, { y: -1, x: -2 }, { y: 0, x: -3 }, { y: 1, x: -2 }, { y: 2, x: -1 }, { y: 3, x: 0 }, { y: 2, x: 1 }, { y: 1, x: 2 }]];
	if (data.heroItem.atkRangedDistMin == data.heroItem.atkRangedDistMax) {
		var atkRangedMin = data.heroItem.atkRangedDistMin - 1;
	} else {
		var atkRangedMin = data.heroItem.atkRangedDistMin;
	}
	for (var i = 0; i < data.heroItem.atkRangedDistMax; i++) {
		//data.heroItem.
		if (i == 0 || i >= atkRangedMin) {
			//获取最终目标的所有可攻击格子位置
			//let tempCheckTarget = data.batBox.getChildByName("batBox_y" + (data.endTarget.y) + "_x" + (data.endTarget.x));
			//获取原点目标在最终目标的所有可攻击格子位置
			var tempCheckTarget = data.batBox.getChildByName("batBox_y" + data.startTarget.y + "_x" + data.startTarget.x);
			if (tempCheckTarget) {
				//----------是否存在格子
				var checkTarget = tempCheckTarget.getComponent("batBox_basic");
				for (var j = 0; j < directionList[i].length; j++) {
					var attPos_item = { y: checkTarget.y + directionList[i][j].y, x: checkTarget.x + directionList[i][j].x };
					attPos_list.push(attPos_item);
				}
			}
		}
	}
	return attPos_list;
};
//获取原点目标在最终目标 最近的可攻击的格子位置  data数组---看A*算法注释
module.exports.getAttPos = function (data) {
	var attPos_list = module.exports.getAttPos_list(data);
	console.log(attPos_list);
	//重大问题，英雄路过的路线上有其他英雄，会被清除bat_hero，要改移动算法那边
	for (var i = 0; i < attPos_list.length; i++) {
		var tempCheckTarget = data.batBox.getChildByName("batBox_y" + attPos_list[i].y + "_x" + attPos_list[i].x);
		if (tempCheckTarget) {
			//----------是否存在格子
			var checkTarget = tempCheckTarget.getComponent("batBox_basic");
			console.log(checkTarget, checkTarget.bat_obstacle, !checkTarget.bat_hero.point);
			if (checkTarget.bat_obstacle) {
				//--------------------------当前循环九宫格格子是障碍物
				continue;
			}
			if (!checkTarget.bat_hero.point) {
				//---------------------当前循环九宫格格子是英雄
				console.log(checkTarget);
				return checkTarget;
			}
		}
	}
};
//索敌算法--------根据自身攻击范围搜索最近敌人 ，返回敌人所在的格子对象
module.exports.getRangeEnemy = function (data) {
	var attPos_list = module.exports.getAttPos_list(data);
	var tempList = [];
	var enemyList = [];
	var minF = 0;
	for (var _i = 0; _i < data.hero_list.length; _i++) {
		if (data.hero_list[_i].groupId == 2) {
			var H_x = Math.abs(data.hero_list[_i].x - data.startTarget.x);
			var H_y = Math.abs(data.hero_list[_i].y - data.startTarget.y);
			var H = (H_x + H_y) * 10;
			var G = 0;
			var item = {
				x: data.hero_list[_i].x,
				y: data.hero_list[_i].y,
				G: G, //--------------------------------从起点 A 移动到指定方格的移动代价，沿着到达该方格而生成的路径。
				H: H, //--------------------------------从指定的方格移动到终点 B 的估算成本
				F: G + H
			};
			tempList.push(item);
			enemyList.push(data.hero_list[_i]);
		}
	}
	for (var _i2 = 0; _i2 < tempList.length; _i2++) {
		if (tempList[_i2].F && minF == 0) {
			//------------------------为了排除可能会遇到没F值的父格子，当存在的F值的循环才初始化
			minF = tempList[_i2];
		}
		if (minF.F > tempList[_i2].F) {
			//根据F值取最近敌人
			minF = tempList[_i2];
		}
	}
	console.log(data, attPos_list);
	var send = data.batBox.getChildByName("batBox_y" + minF.y + "_x" + minF.x).getComponent("batBox_basic");
	for (var i = 0; i < attPos_list.length; i++) {
		if (attPos_list[i].y == minF.y && attPos_list[i].x == minF.x) {
			for (var j = 0; j < data.hero_list.length; j++) {
				if (data.hero_list[j].y == minF.y && data.hero_list[j].x == minF.x) {
					return data.hero_list[j];
				}
			}
		}
	}
	return false;
};

//A*算法   (data数组---startTarget：原点目标，endTarget：终点目标，batBox：全局格子数组，hero_list：全局英雄数组，heroItem：移动目标对象)
module.exports.routeDirection = function (data) {
	//if (startTarget.x == endTarget.x && startTarget.y == endTarget.y || endTarget.bat_obstacle || endTarget.bat_hero.groupId == 2) { return false; }//---------------如果起点和终点一样就退出方法
	console.log(data);
	if (data.startTarget.x == data.endTarget.x && data.startTarget.y == data.endTarget.y || data.endTarget.bat_obstacle) {
		return false;
	} //---第一次检测，起点和终点一样就退出方法
	var openList = []; //---------------九宫格临时存放格子数组
	var closeList = []; //--------------九宫格临时存放确认数组
	var sureList = []; //---------------九宫格最终确认数组
	var isSure_start = 0; //------------是否到达终点   0：不是   1：是
	var isSure_end = 0; //--------------是否到达起点   0：不是   1：是
	var minF = 0; //--------------------F值最小值
	var minG = 0; //--------------------G值最小值
	var tempEndTarget = null; //--------最后所选目标格子对象
	var parent = { x: data.startTarget.x, y: data.startTarget.y, isStart: 1, G: 0, H: 0, F: 0 }; //-----------isStart: 起点的唯一标识
	openList.push(parent);
	//方向数组  也可用作判断格子九宫格里其余格子是否在战场内数组   id：判断方向的数值   direction：上下左右斜方向值
	var directionList = [{ y: 0, x: 1, direction: 1 }, { y: -1, x: 1, direction: 2 }, { y: -1, x: 0, direction: 3 }, { y: -1, x: -1, direction: 4 }, { y: 0, x: -1, direction: 5 }, { y: 1, x: -1, direction: 6 }, { y: 1, x: 0, direction: 7 }, { y: 1, x: 1, direction: 8 }];
	data.batBox.getChildByName("batBox_y" + data.startTarget.y + "_x" + data.startTarget.x).setColor(cc.color("#008102")); //-----测试阶段，上颜色标识用
	data.batBox.getChildByName("batBox_y" + data.endTarget.y + "_x" + data.endTarget.x).setColor(cc.color("#fff")); //-----测试阶段，上颜色标识用
	if (data.endTarget.bat_hero.groupId == 2) {
		//----------------获取敌人目标
		tempEndTarget = module.exports.getAttPos(data);
	}
	if (!tempEndTarget) {
		//如没有获取到敌人目标，就读取传参进来的最终目标
		tempEndTarget = data.batBox.getChildByName("batBox_y" + data.endTarget.y + "_x" + data.endTarget.x).getComponent("batBox_basic");
	}
	console.log(tempEndTarget);
	if (data.startTarget.x == tempEndTarget.x && data.startTarget.y == tempEndTarget.y) {
		return false;
	} //---第二次检测，起点和终点一样就退出方法，因为可能上面的处理结果会把最终位置改变为路线起点
	for (var j = 0; j < openList.length; j++) {
		if (isSure_start == 1) {
			break;
		} //----------已到达终点，退出循环
		var obsExList = []; //--------------障碍物上下左右格子的数组
		var obsId_right = null; //----------当前障碍物格子的右侧格子--临时禁止加入临时数组
		var obsId_down = null; //-----------当前障碍物格子的下侧格子--临时禁止加入临时数组
		var obsId_left = null; //-----------当前障碍物格子的左侧格子--临时禁止加入临时数组
		var obsId_top = null; //------------当前障碍物格子的上侧格子--临时禁止加入临时数组
		var tempEnemyList = [];
		var enemId_right = null; //----------当前敌人格子的右侧格子--临时禁止加入临时数组
		var enemId_down = null; //-----------当前敌人格子的下侧格子--临时禁止加入临时数组
		var enemId_left = null; //-----------当前敌人格子的左侧格子--临时禁止加入临时数组
		var enemId_top = null; //------------当前敌人格子的上侧格子--临时禁止加入临时数组
		for (var i = 0; i < directionList.length; i++) {
			//------------------获取路线障碍物上下左右格子的数组
			//计算出九宫格内当前循环的格子是否在战场内  原理：利用格子的行列值进行运算，得出结果异常则不属于战场内格子
			var tempCheckTarget = data.batBox.getChildByName("batBox_y" + (parent.y + directionList[i].y) + "_x" + (parent.x + directionList[i].x));
			if (tempCheckTarget) {
				//----------是否存在格子
				var checkTarget = tempCheckTarget.getComponent("batBox_basic");
				if (checkTarget.bat_obstacle) {
					//---------------------当前循环九宫格格子是障碍物
					if (i == 0 || i == 2 || i == 4 || i == 6) {
						obsId_right = { y: checkTarget.y + directionList[0].y, x: checkTarget.x + directionList[0].x };
						obsId_down = { y: checkTarget.y + directionList[2].y, x: checkTarget.x + directionList[2].x };
						obsId_left = { y: checkTarget.y + directionList[4].y, x: checkTarget.x + directionList[4].x };
						obsId_top = { y: checkTarget.y + directionList[6].y, x: checkTarget.x + directionList[6].x };
						obsExList.push(obsId_right, obsId_down, obsId_left, obsId_top);
					}
				}
				var enemyList2 = [];
				for (var z = 0; z < data.hero_list.length; z++) {
					if (data.hero_list[z].point == checkTarget.bat_hero.point && data.hero_list[z].groupId == 2) {
						enemyList2.push(data.hero_list[z]);
					}
				}
				if (enemyList2) {
					if (i == 0 || i == 2 || i == 4 || i == 6) {
						enemId_right = { y: checkTarget.y + directionList[0].y, x: checkTarget.x + directionList[0].x };
						enemId_down = { y: checkTarget.y + directionList[2].y, x: checkTarget.x + directionList[2].x };
						enemId_left = { y: checkTarget.y + directionList[4].y, x: checkTarget.x + directionList[4].x };
						enemId_top = { y: checkTarget.y + directionList[6].y, x: checkTarget.x + directionList[6].x };
						tempEnemyList.push(enemId_right, enemId_down, enemId_left, enemId_top);
					}
				}
			}
		}
		for (var _i3 = 0; _i3 < directionList.length; _i3++) {
			//------------------获取路线临时数组
			var isOpen = 0; //------------------是否已记录在临时数组标识   0：不是   1：是
			var isClose = 0; //-----------------是否已记录在确认数组标识   0：不是   1：是
			var isObstacle = 0; //--------------是否障碍物   0：不是   1：是
			var isObsEx = 0; //-----------------当前格子是否位于障碍物格子上下左右侧的格子位置上，用于判断是否处于斜格处理   0：不是   1：是
			var isEnemy = false;
			var isEnemy2 = 0;
			//计算出九宫格内当前循环的格子  原理：利用格子的行列值进行运算，得出结果异常则不属于战场内格子
			var _tempCheckTarget = data.batBox.getChildByName("batBox_y" + (parent.y + directionList[_i3].y) + "_x" + (parent.x + directionList[_i3].x));
			if (_tempCheckTarget) {
				//----------是否存在格子
				var checkTarget = _tempCheckTarget.getComponent("batBox_basic");
				var enemyList2 = [];
				for (var z = 0; z < data.hero_list.length; z++) {
					if (data.hero_list[z].point == checkTarget.bat_hero.point && data.hero_list[z].groupId == 2) {
						enemyList2.push(data.hero_list[z]);
					}
				}
				if (checkTarget.bat_obstacle) {
					//---------------------当前循环九宫格格子是障碍物
					isObstacle = 1;
				} else if (enemyList2.length != 0) {
					isEnemy = true;
				} else {
					for (var x = 0; x < closeList.length; x++) {
						//------------------当前循环九宫格格子是否已记录在确认数组
						if (checkTarget.x == closeList[x].x && checkTarget.y == closeList[x].y) {
							isClose = 1;
							break;
						}
					}
					for (var _x = 0; _x < openList.length; _x++) {
						//-------------------当前循环九宫格格子是否已记录在临时数组
						if (checkTarget.x == openList[_x].x && checkTarget.y == openList[_x].y) {
							isOpen = 1;
							break;
						}
					}
					for (var o = 0; o < obsExList.length; o++) {
						//------------------当前循环九宫格格子是否位于障碍物格子上下左右侧的格子位置上，是的话就不能纳入赋值ghf处理
						if (checkTarget.x == obsExList[o].x && checkTarget.y == obsExList[o].y) {
							isObsEx = 1;
							break;
						}
					}
					for (var _o = 0; _o < tempEnemyList.length; _o++) {
						//------------------当前循环九宫格格子是否位于障碍物格子上下左右侧的格子位置上，是的话就不能纳入赋值ghf处理
						if (checkTarget.x == tempEnemyList[_o].x && checkTarget.y == tempEnemyList[_o].y) {
							isEnemy2 = 1;
							break;
						}
					}
				}
				if (isClose == 0 && isOpen == 0 && isObstacle == 0 && isObsEx == 0 && !isEnemy && isEnemy2 == 0) {
					//-------------如任何检查判断为未触发，则视为当前格子是新处理格子
					var H_x = Math.abs(tempEndTarget.x - checkTarget.x);
					var H_y = Math.abs(tempEndTarget.y - checkTarget.y);
					var H = (H_x + H_y) * 10;
					var G = void 0;

					if (_i3 == 0 || _i3 == 2 || _i3 == 4 || _i3 == 6) {
						G = 10 + parent.G;
					} else {
						G = 14 + parent.G;
					}
					var item = {
						x: checkTarget.x,
						y: checkTarget.y,
						G: G, //--------------------------------从起点 A 移动到指定方格的移动代价，沿着到达该方格而生成的路径。
						H: H, //--------------------------------从指定的方格移动到终点 B 的估算成本
						F: G + H,
						direction: directionList[_i3].direction
					};
					var label_G = new cc.Node();
					label_G.addComponent(cc.Label);
					label_G.getComponent(cc.Label).fontSize = 12;
					label_G.getComponent(cc.Label).string = checkTarget.y + "" + checkTarget.x + "，F：" + (G + H) + "\nG:" + G + "，H:" + H;
					_tempCheckTarget.addChild(label_G);
					openList.push(item);
				}
			}
		}
		if (openList[0].isStart == 1) {
			//-----------处理起点的首次增删数组操作
			closeList.push(openList[0]);
			openList.splice(0, 1);
			j = -1; //-------------------------------初始化循环次数
		}
		for (var _i4 = 0; _i4 < openList.length; _i4++) {
			//----------循环取F值最小值
			if (openList[_i4] && minF == 0) {
				//------------------------为了排除可能会遇到没F值的父格子，当存在的F值的循环才初始化
				minF = openList[_i4];
			}
			if (minF.F > openList[_i4].F) {
				minF = openList[_i4];
			}
		}
		//console.log(openList,parent);
		for (var _i5 = 0; _i5 < openList.length; _i5++) {
			//----------依靠最新的F值最小值格子得出新的父节点
			if (openList[_i5].F == minF.F) {
				parent = openList[_i5];
				closeList.push(openList[_i5]);
				openList.splice(_i5, 1);
				j = -1; //-------------------------------初始化循环次数
				minF = 0; //-----------初始化F值最小值
			}
		}
		if (parent.x == tempEndTarget.x && parent.y == tempEndTarget.y) {
			//---------------如果临时确认数组收录了终点，就退出循环
			isSure_start = 1;
		}
	}
	//console.log(closeList);
	for (var _j = 0; _j < closeList.length; _j++) {
		data.batBox.getChildByName("batBox_y" + closeList[_j].y + "_x" + closeList[_j].x).setColor(cc.color("#008102")); //-----测试阶段，上颜色标识用
	}
	closeList = closeList.reverse();
	sureList.push(parent);
	//计算最终路线    原理：从临时确认数组中反过来走到起点
	for (var _j2 = 0; _j2 < closeList.length; _j2++) {
		if (isSure_end == 1) {
			break;
		} //----------已回到起点，退出循环
		var _obsExList = []; //--------------障碍物上下左右格子的数组
		var _obsId_right = null; //----------当前障碍物格子的右侧格子--临时禁止加入临时数组
		var _obsId_down = null; //-----------当前障碍物格子的下侧格子--临时禁止加入临时数组
		var _obsId_left = null; //-----------当前障碍物格子的左侧格子--临时禁止加入临时数组
		var _obsId_top = null; //------------当前障碍物格子的上侧格子--临时禁止加入临时数组
		var tempSureList = [];

		var tempEnemyList = [];
		var _enemId_right = null; //----------当前敌人格子的右侧格子--临时禁止加入临时数组
		var _enemId_down = null; //-----------当前敌人格子的下侧格子--临时禁止加入临时数组
		var _enemId_left = null; //-----------当前敌人格子的左侧格子--临时禁止加入临时数组
		var _enemId_top = null; //------------当前敌人格子的上侧格子--临时禁止加入临时数组
		for (var _i6 = 0; _i6 < directionList.length; _i6++) {
			//获取当前循环的父节点格子  
			var _tempCheckTarget2 = data.batBox.getChildByName("batBox_y" + (parent.y + directionList[_i6].y) + "_x" + (parent.x + directionList[_i6].x));
			if (_tempCheckTarget2) {
				//----------是否存在格子
				var checkTarget = _tempCheckTarget2.getComponent("batBox_basic");
				if (checkTarget.bat_obstacle) {
					//---------------------当前循环九宫格格子是障碍物
					if (_i6 == 0 || _i6 == 2 || _i6 == 4 || _i6 == 6) {
						_obsId_right = { y: checkTarget.y + directionList[0].y, x: checkTarget.x + directionList[0].x };
						_obsId_down = { y: checkTarget.y + directionList[2].y, x: checkTarget.x + directionList[2].x };
						_obsId_left = { y: checkTarget.y + directionList[4].y, x: checkTarget.x + directionList[4].x };
						_obsId_top = { y: checkTarget.y + directionList[6].y, x: checkTarget.x + directionList[6].x };
						_obsExList.push(_obsId_right, _obsId_down, _obsId_left, _obsId_top);
					}
				}
			}
			var enemyList2 = [];
			for (var z = 0; z < data.hero_list.length; z++) {
				if (data.hero_list[z].point == checkTarget.bat_hero.point && data.hero_list[z].groupId == 2) {
					console.log(data.hero_list[z].point, checkTarget.bat_hero.point, data.hero_list[z].groupId == 2);
					enemyList2.push(data.hero_list[z]);
					console.log(enemyList2);
				}
			}
			if (enemyList2) {
				if (_i6 == 0 || _i6 == 2 || _i6 == 4 || _i6 == 6) {
					_enemId_right = { y: checkTarget.y + directionList[0].y, x: checkTarget.x + directionList[0].x };
					_enemId_down = { y: checkTarget.y + directionList[2].y, x: checkTarget.x + directionList[2].x };
					_enemId_left = { y: checkTarget.y + directionList[4].y, x: checkTarget.x + directionList[4].x };
					_enemId_top = { y: checkTarget.y + directionList[6].y, x: checkTarget.x + directionList[6].x };
					tempEnemyList.push(_enemId_right, _enemId_down, _enemId_left, _enemId_top);
				}
			}
		}
		for (var _i7 = 0; _i7 < directionList.length; _i7++) {
			var _isClose = 0; //-----------------是否已记录在确认数组标识   0：不是   1：是
			var _isObstacle = 0; //--------------是否障碍物   0：不是   1：是
			var _isObsEx = 0; //-----------------当前格子是否位于障碍物格子上下左右侧的格子位置上，用于判断是否处于斜格处理   0：不是   1：是
			var isEnemy = false;
			var isEnemy2 = 0;
			var _tempCheckTarget3 = data.batBox.getChildByName("batBox_y" + (parent.y + directionList[_i7].y) + "_x" + (parent.x + directionList[_i7].x));
			if (_tempCheckTarget3) {
				//----------是否存在格子
				var checkTarget = _tempCheckTarget3.getComponent("batBox_basic");
				/*if (checkTarget.bat_obstacle) {//---------------------当前循环九宫格格子是障碍物
    	isObstacle = 1;
    }else if(enemyList2.length != 0){
    	console.log(6666);
    	isEnemy = true;
    }else{*/
				for (var _x2 = 0; _x2 < closeList.length; _x2++) {
					//------------------当前循环九宫格格子是否已记录在确认数组
					if (checkTarget.x == closeList[_x2].x && checkTarget.y == closeList[_x2].y) {
						for (var _o2 = 0; _o2 < _obsExList.length; _o2++) {
							//------------------当前循环九宫格格子是否位于障碍物格子上下左右侧的格子位置上，是的话就不能纳入赋值ghf处理
							if (checkTarget.x == _obsExList[_o2].x && checkTarget.y == _obsExList[_o2].y) {
								_isObsEx = 1;
								break;
							}
						}
						for (var _o3 = 0; _o3 < tempEnemyList.length; _o3++) {
							//------------------当前循环九宫格格子是否位于障碍物格子上下左右侧的格子位置上，是的话就不能纳入赋值ghf处理
							if (checkTarget.x == tempEnemyList[_o3].x && checkTarget.y == tempEnemyList[_o3].y) {
								isEnemy2 = 1;
								break;
							}
						}
						if (_isObsEx == 0 && isEnemy2 == 0) {
							tempSureList.push(closeList[_x2]);
						}
					}
				}
				//}
			}
		}
		console.log(tempSureList);
		for (var _i8 = 0; _i8 < tempSureList.length; _i8++) {
			//----------循环取F值最小值
			if (tempSureList[_i8] && minG == 0) {
				//------------------------为了排除可能会遇到没G值的父格子，当存在的G值的循环才初始化
				minG = tempSureList[_i8];
			}
			if (minG.G > tempSureList[_i8].G) {
				minG = tempSureList[_i8];
			}
		}
		for (var _i9 = 0; _i9 < tempSureList.length; _i9++) {
			//----------依靠最新的G值最小值格子得出新的父节点
			if (tempSureList[_i9].G == minG.G) {
				parent = tempSureList[_i9];
				sureList.push(tempSureList[_i9]);
				minG = 0; //-----------初始化G值最小值
			}
		}
		if (parent.x == data.startTarget.x && parent.y == data.startTarget.y) {
			//---------------如果临时确认数组收录了起点，就退出循环
			isSure_end = 1;
		}
	}
	for (var _j3 = 0; _j3 < sureList.length; _j3++) {
		data.batBox.getChildByName("batBox_y" + sureList[_j3].y + "_x" + sureList[_j3].x).setColor(cc.color("#bbb")); //-----测试阶段，上颜色标识用
	}
	console.log(sureList, closeList);
	return sureList.reverse();
};

//索敌算法--------根据自身为出发点搜索最近敌人 ，返回敌人所在的格子对象
module.exports.getNearEnemy = function (data) {
	var tempList = [];
	var enemyList = [];
	var minF = 0;
	for (var i = 0; i < data.hero_list.length; i++) {
		if (data.hero_list[i].groupId == 2) {
			var H_x = Math.abs(data.hero_list[i].x - data.target.x);
			var H_y = Math.abs(data.hero_list[i].y - data.target.y);
			var H = (H_x + H_y) * 10;
			var G = 0;
			var item = {
				x: data.hero_list[i].x,
				y: data.hero_list[i].y,
				G: G, //--------------------------------从起点 A 移动到指定方格的移动代价，沿着到达该方格而生成的路径。
				H: H, //--------------------------------从指定的方格移动到终点 B 的估算成本
				F: G + H
			};
			tempList.push(item);
			enemyList.push(data.hero_list[i]);
		}
	}
	for (var _i10 = 0; _i10 < tempList.length; _i10++) {
		if (tempList[_i10].F && minF == 0) {
			//------------------------为了排除可能会遇到没F值的父格子，当存在的F值的循环才初始化
			minF = tempList[_i10];
		}
		if (minF.F > tempList[_i10].F) {
			//根据F值取最近敌人
			minF = tempList[_i10];
		}
	}
	var send = data.batBox.getChildByName("batBox_y" + minF.y + "_x" + minF.x).getComponent("batBox_basic");
	return send;
};

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
        //# sourceMappingURL=algorithm_A.js.map
        