//导入外部脚本
var js_dataControl = require("dataControl");
var js_algorithm_A = require("algorithm_A");
const GroupName = require('Types').GroupName;
cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Node,
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        choosePrefab: {
            default: null,
            type: cc.Prefab
        },
        Prefab_obstacle_01: {
            default: null,
            type: cc.Prefab
        },
        Prefab_obstacle_02: {
            default: null,
            type: cc.Prefab
        },
        Prefab_obstacle_03: {
            default: null,
            type: cc.Prefab
        },
        Prefab_hero_01: {
            default: null,
            type: cc.Prefab
        },
        Prefab_hero_02: {
            default: null,
            type: cc.Prefab
        },
        Prefab_tempColl_touch: {
            default: null,
            type: cc.Prefab
        },
        background: {
            default: null,
            type: cc.Node
        },
        batBox: {
            default: null,
            type: cc.Node
        },
        other: {
            default: null,
            type: cc.Node
        },
        enemy: {
            default: null,
            type: cc.Node
        },
        icon_arrow: {
            default: null,
            type: cc.Prefab
        },
        followSpeed: 1
    },
    onLoad: function () {
    	
    	
    },
    //生成第一层战场数组-基础数据  (关卡id，预存资源对象)
    battleInit_basic: function(checkId,personPrefabNew) {
		//初始化部分数组
    	this.batlist = this.batBox.children;//-----------战场基础层  需要批量处理基础层格子数据时候用
    	this.hero_list = [];//---------------------------战场英雄存储
    	this.obstacle_list = [];//-----------------------战场障碍物存储
    	this.hero_route_list = [];//---------------------英雄路线数据
    	this.hero_route_list.state = 0;//----------------英雄路线——是否可启用 0=不可用，1=可用
    	this.hero_route_list.name = null;//--------------英雄生成名字
    	this.hero_route_list.list = [];//----------------英雄路线——存储路线数组
    	this.hero_route_list.lastId = -1;//--------------英雄路线——记录上一次格子的名字  -1:初始     加入临时数组时进行赋值
    	this.hero_route_list.boxIndex = -1;//------------英雄路线——记录格子下标   -1:初始   
    	
    	this.hero_route_ok_list = [];//---------------------中心点英雄路线数据
    	this.hero_route_ok_list.state = 0;//----------------中心点英雄路线——是否可启用 0=不可用，1=可用
    	this.hero_route_ok_list.name = null;//--------------中心点英雄生成名字
    	this.hero_route_ok_list.list = [];//----------------中心点英雄路线——存储路线数组
    	this.hero_route_ok_list.lastId = -1;//--------------中心点英雄路线——记录上一次格子的名字  -1:初始     加入确认数组时进行赋值
    	
    	this.isState = 0;
    	this.isOOOK = 1;
    	this.indexNum = 0;
    	
    	this.checkId = js_dataControl.getcheckId();//-------获取关卡id
		//var bat = this.batBox.children;
		for (let i = 0; i < this.batlist.length; i++) {
			var batItem = this.batlist[i].getComponent("batBox_basic");
			/*this.batlist.push(bat[i].getComponent("batBox_basic"));
			this.batlist[i].batBoxName = bat[i].name;
			this.batlist[i].bat_hero = {point:null,groupId:null};*/
			
			batItem.batBoxName = this.batlist[i].name;
			batItem.bat_hero = {point:null,groupId:null};
		}
		console.log(this.batlist);
        this.perfabPool = this.getComponent("prefabPool");
        this.perfabPool.init();
		this.battleInit_obstacle(this.checkId,personPrefabNew);
    },
    //生成第二层战场数组-障碍物   (关卡id)
    battleInit_obstacle: function(checkId,personPrefabNew){
    	//关卡序列
    	if (checkId == 1) {
    		var otherList = [{y: 0,x: 4,point: 1},{y: 2,x: 4,point: 2},{y: 1,x: 4,point: 3},{y: 1,x: 6,point: 1},{y: 2,x: 8,point: 1}];
    	}
    	if (checkId == 2) {
    		var otherList = [{y: 0,x: 4,point: 1},{y: 2,x: 4,point: 2},{y: 1,x: 4,point: 3}];
    	}
    	for (let i = 0; i < otherList.length; i++) {//-----匹配战场数组
    		for (let j = 0; j < this.batlist.length; j++) {//--------战场需要遍历50次，所以用batlist，而不用专门获取的batBox.getChildByName
    			var batItem = this.batlist[j].getComponent("batBox_basic");
	        	if (batItem.x == otherList[i].x && batItem.y == otherList[i].y) {
	        		batItem.bat_obstacle = otherList[i].point;
	        		this.battleInit_obstacle_detail(otherList[i].point,batItem);
	        	}
    		}
    	}
    	console.log(this.obstacle_list);
    	js_dataControl.setObstacle(this.obstacle_list);
    	this.battleInit_hero(this.checkId,personPrefabNew);
    },
    //生成第三层战场数组-英雄   (关卡id)
    battleInit_hero: function(checkId,personPrefabNew){
    	let tempList = [{y: 4,x: 2,point: 6},{y: 3,x: 2,point: 7},{y: 2,x: 2,point: 8},{y: 1,x: 2,point: 9},{y: 0,x: 2,point: 10},{y: 4,x: 1,point: 11}];//----我方阵容-测试用的
		//let tempList = [{y: 4,x: 2,point: 6}];
		let otherList = [];//-----------------------我方阵容
    	let otherList_lock_id = 0;//----------------我方阵容——位置是否有重复英雄导入标识  0:是，1:不是
    	let otherList_lock_point = 0;//-------------我方阵容——不同年龄系列英雄是否重复导入标识  0:是，1:不是
    	var self = this;
    	//let fulinList = [{id: "01",point: 1},{id: "02",point: 2},{id: "03",point: 3}];//------符灵技能栏
    	if (checkId == 1) {
			//var enemyList = [{y: 4,x: 9,point: 1},{y: 2,x: 9,point: 2},{y: 0,x: 9,point: 3},{y: 3,x: 7,point: 4},{y: 1,x: 7,point: 5}];//----敌方阵容
			var enemyList = [{y: 3,x: 8,point: 1}];
    	}
    	if (checkId == 2) {
    		var enemyList = [{y: 3,x: 9,point: 1},{y: 1,x: 9,point: 2},{y: 0,x: 9,point: 3},{y: 0,x: 7,point: 4},{y: 1,x: 7,point: 5}];//----敌方阵容
    	}
    	for (let i = 0; i < tempList.length; i++) {
    		//我方阵容区域内
    		if (tempList[i].id == "00" || tempList[i].id == "10" || tempList[i].id == "20" || tempList[i].id == "30" || tempList[i].id == "40"
    		 || tempList[i].id == "01" || tempList[i].id == "11" || tempList[i].id == "21" || tempList[i].id == "31" || tempList[i].id == "41"
    		 || tempList[i].id == "02" || tempList[i].id == "12" || tempList[i].id == "22" || tempList[i].id == "32" || tempList[i].id == "42") {
    		 	if (otherList.length < 5) {//----------------------------不超出5个英雄选择
    				for (let j = 0; j < otherList.length; j++) {
	    		 		if (otherList[j].x == tempList[i].x && otherList[j].y == tempList[i].y) {//-------发现已有英雄的位置上再放英雄，标识此次操作不加入阵容数组
	    		 			otherList_lock_id = 1;
	    		 		}
	    		 		if (otherList[j].point == tempList[i].point) {//---------发现放了不同年龄系列英雄，一个英雄分不同年龄阶段的卡牌
    		 				otherList_lock_point = 1;
    		 			}
		    		}
	    		}
    		}
    		if (otherList.length < 5) {//----------------------------不超出5个英雄选择
	    		if (otherList_lock_id == 0 && otherList_lock_point == 0) {//------标识们一致允许加入才能增加
	    			otherList.push(tempList[i]);
	    		}
	    		if (otherList_lock_id == 1 || otherList_lock_point == 1) {//------标识们一致允许加入才能增加
	    			otherList.pop();
	    			otherList.push(tempList[i]);
	    		}
    		}
    		//初始化临时用的标识值
    		otherList_lock_id = 0;
    		otherList_lock_point = 0;
		}
		
    	for (let i = 0; i < otherList.length; i++) {//-----我方英雄导入战场
    		for (let j = 0; j < this.batlist.length; j++) {//--------战场需要遍历50次，所以用batlist，而不用专门获取的batBox.getChildByName
    			var batItem = this.batlist[j].getComponent("batBox_basic");
	        	if (batItem.x == otherList[i].x && batItem.y == otherList[i].y) {
	        		batItem.bat_hero = {
	        			point: otherList[i].point,
	        			groupId: 1
	        		}
	        		//this.batBox.getChildByName("batBox_y" + batItem.y + "_x" + batItem.x).bat_hero = batItem.bat_hero;
	        		this.battleInit_hero_detail(otherList[i].point,batItem,1,personPrefabNew);
	        	}
    		}
    	}
    	for (let i = 0; i < enemyList.length; i++) {//-----敌方英雄导入战场
    		for (let j = 0; j < this.batlist.length; j++) {//--------战场需要遍历50次，所以用batlist，而不用专门获取的batBox.getChildByName
    			var batItem = this.batlist[j].getComponent("batBox_basic");
	        	if (batItem.x == enemyList[i].x && batItem.y == enemyList[i].y) {
	        		batItem.bat_hero = {
	        			point: enemyList[i].point,
	        			groupId: 2
	        		}
	        		//this.batBox.getChildByName("batBox_y" + batItem.y + "_x" + batItem.x).bat_hero = batItem.bat_hero;
	        		this.battleInit_hero_detail(enemyList[i].point,batItem,2,personPrefabNew);
	        	}
    		}
    	}
    	//console.log(this.batlist,this.batBox.getChildByName("batBox_y" + 0 + "_x" + 2).getComponent("batBox_basic"));
    	
    	js_dataControl.updateHeroList(this.hero_list);
    	console.log(js_dataControl.room());
		var heroRouteOkList = this.hero_route_ok_list;
    	this.background.getChildByName("stopAllMove").on(cc.Node.EventType.TOUCH_START, function ( event ) {
			let selfItem = this;
			let self_x = event.getLocation().x;
			let self_y = event.getLocation().y;
			let heroList = self.hero_list;
			for (let j = 0; j < heroList.length; j++) {//---------匹配英雄表
				heroList[j].route = heroList[j].route.slice(0,heroList[j].indexNum+1);
			}
		});
		this.background.getChildByName("goAllMove").on(cc.Node.EventType.TOUCH_START, function ( event ) {
			let selfItem = this;
			let self_x = event.getLocation().x;
			let self_y = event.getLocation().y;
			let heroList = self.hero_list;
			for (let j = 0; j < heroList.length; j++) {//---------匹配英雄表
				//if (heroList[j].groupId == 1) {
				if (heroList[j].heroName == "hero_6") {
					//js_algorithm_A.getNearEnemy({target:heroList[j],dataList:heroList,batBox:self.batBox})
					let aaa = js_algorithm_A.getRangeEnemy({
						startTarget:	heroList[j],
						//endTarget:		self.batBox.getChildByName("batBox_y" + 3 + "_x" + 7).getComponent("batBox_basic"),
						batBox:			self.batBox,
						hero_list:		self.hero_list,
						heroItem:		heroList[j]
					});
					console.log(aaa);
					/*let checkRoute = js_algorithm_A.routeDirection({
						startTarget:	heroList[j],
						endTarget:		self.batBox.getChildByName("batBox_y" + 3 + "_x" + 7).getComponent("batBox_basic"),
						batBox:			self.batBox,
						hero_list:		self.hero_list,
						heroItem:		heroList[j]
					});
					console.log(checkRoute);
					heroList[j].route = checkRoute;
					heroList[j].state = 11;
					heroList[j].indexNum = 0;*/
					
					//self.matchOKHeroRoute(heroList[j].name,self.getNearEnemy(heroList[j],heroList));//-------传参英雄名和格子对象给确认数组
					//console.log(heroList[j],checkRoute,self.getNearEnemy(heroList[j],heroList));
				}
				
			}
			
		});
    },
    stopMove:function (point) {
    	var self = this;
    	let heroList = self.hero_list;
		for (let j = 0; j < heroList.length; j++) {//---------匹配英雄表
			if (heroList[j].point == point) {
			//if (heroList[j].heroName == "hero_6") {
				let checkRoute = self.routeDirection(heroList[j],self.getNearEnemy(heroList[j],heroList));
				heroList[j].route = checkRoute;
				heroList[j].state = 11;
				heroList[j].indexNum = 0;
				//lf.matchOKHeroRoute(heroList[j].name,self.getNearEnemy(heroList[j],heroList));//-------传参英雄名和格子对象给确认数组
				//console.log(heroList[j],checkRoute,self.getNearEnemy(heroList[j],heroList));
			}
			
		}
    },
    //选取格子高亮   (格子对象)
    currentBox: function(boxItem){
    	var temp = this.batBox.getChildByName("batBox_y" + boxItem.y + "_x" + boxItem.x);
    	if(temp.getComponent("batBox_basic").box_current == 0){//------------------------------防止重复加载同一个格子高亮导致出现异常bug情况
			temp.getComponent("batBox_basic").box_current = 1;//-------------------------------高亮选择到的格子
	    	let item = cc.instantiate(this.icon_arrow); 
			temp.addChild(item);
			item.setPosition(boxItem.x,boxItem.y);
	    	item.name = "currentBox";
    	}
    },
    //销毁高亮资源   (格子对象)
    currentBox_destroy: function(boxItem){
		this.batBox.getChildByName("batBox_y" + boxItem.y + "_x" + boxItem.x).getComponent("batBox_basic").box_current = 0;//----------------------清除高亮记录
		let child = this.batBox.getChildByName("batBox_y" + boxItem.y + "_x" + boxItem.x).getChildByName("currentBox");
		if (child) { child.destroy(); }//--------------------------------------------------------------销毁高亮资源
    },
    //障碍物具体参数数组   (障碍物编号，格子对象)
    battleInit_obstacle_detail: function(point,box){
    	if (point == 1) { var item = cc.instantiate(this.Prefab_obstacle_01); }
    	if (point == 2) { var item = cc.instantiate(this.Prefab_obstacle_02); }
    	if (point == 3) { var item = cc.instantiate(this.Prefab_obstacle_03); }
    	this.batBox.getChildByName("batBox_y" + box.y + "_x" + box.x).addChild(item);
    	item.setPosition(0,0);
    	item.name = "point_" + point;
    	var itemList = {
    		x		: box.x,				//障碍物当前所处x轴
    		y		: box.y,				//障碍物当前所处y轴
    	}
    	this.obstacle_list.push(itemList);
    	
    },
    //英雄具体参数数组   (英雄编号，格子对象，敌我英雄标识id: 1=我方   2=敌方)
    battleInit_hero_detail: function(point,box,groupId,personPrefabNew){
    	if (point == 1) { var item = this.perfabPool.createEnemy(); }
    	if (point == 2) { var item = this.perfabPool.createEnemy(); }
    	if (point == 3) { var item = this.perfabPool.createEnemy(); }
    	if (point == 4) { var item = this.perfabPool.createEnemy(); }
    	if (point == 5) { var item = this.perfabPool.createEnemy(); }
    	if (point == 6) { var item = this.perfabPool.createEnemy(); }
    	if (point == 7) { var item = this.perfabPool.createEnemy(); }
    	if (point == 8) { var item = this.perfabPool.createEnemy(); }
    	if (point == 9) { var item = this.perfabPool.createEnemy(); }
    	if (point == 10) { var item = this.perfabPool.createEnemy(); }
		if (point == 11) { var item = this.perfabPool.createEnemy(); }
		if(groupId == 1){
			item.getComponent('person').group = GroupName.other
			this.other.addChild(item);
		}
		if(groupId == 2){
			item.getComponent('person').group = GroupName.empty;
			this.enemy.addChild(item);
		}
		var x = this.batBox.getChildByName("batBox_y" + box.y + "_x" + box.x).x;
		var y = this.batBox.getChildByName("batBox_y" + box.y + "_x" + box.x).y;
    	item.setPosition(x,y);
    	item.name = "hero_" + point;
    	if(groupId == 1){ var hero_basic = this.other.getChildByName(item.name).getComponent("person"); }
    	if(groupId == 2){ var hero_basic = this.enemy.getChildByName(item.name).getComponent("person"); }
    	hero_basic.groupId = groupId;
    	hero_basic.heroName = item.name;
    	hero_basic.x = box.x;
    	hero_basic.y = box.y;
    	hero_basic.point = point;
    	hero_basic.groupId = groupId,				//英雄敌我阵容标识
		hero_basic.heroName = item.name,			//英雄预存资源生成名称
		hero_basic.x		= box.x,				//英雄当前所处x轴
		hero_basic.y		= box.y,				//英雄当前所处y轴
		hero_basic.point	= point,				//英雄标记  纪录具体是哪个英雄
		hero_basic.indexNum = 0,					//英雄移动路线的当前到达位置，就是说数组里的第几个位置
		hero_basic.route	= [],					//英雄移动路线   状态切换为移动时，赋值路线
		hero_basic.lockTarget = null,					//英雄移动路线里锁定的最终目标物体
		hero_basic.state	= 10,					//英雄状态   10：待命，11：移动
		hero_basic.isDie   = 1						//死亡标识   0：死亡，1:未死亡
    	
    	/*let itemList = {
    		groupId : groupId,				//英雄敌我阵容标识
    		heroName: item.name,			//英雄预存资源生成名称
    		x		: box.x,				//英雄当前所处x轴
    		y		: box.y,				//英雄当前所处y轴
    		point	: point,				//英雄标记  纪录具体是哪个英雄
    		indexNum: 0,					//英雄移动路线的当前到达位置，就是说数组里的第几个位置
    		route	: [],					//英雄移动路线   状态切换为移动时，赋值路线
    		lockTarget: null,					//英雄移动路线里锁定的最终目标物体
			state	: 10,					//英雄状态   10：待命，11：移动
			isDie   : 1						//死亡标识   0：死亡，1:未死亡
    	}*/
    	this.hero_list.push(hero_basic);
    	var self = this;
		var heroRouteOkList = this.hero_route_ok_list;
		var lastRouteTarget = null;//-------------------用作碰触到障碍物后保留前一个格子对象
		if(groupId == 1){
			this.other.getChildByName("hero_" + point).on(cc.Node.EventType.TOUCH_START, function ( event ) {
				let selfItem = this;
				//console.log(selfItem);
				let self_x = event.getLocation().x;
				let self_y = event.getLocation().y;
				if (self.background.getChildByName("tempColl_touch")) { self.background.getChildByName("tempColl_touch").destroy();}//--------销毁之前生成的临时路线碰触点 
				//---生成临时路线碰触点   如果不重新生成，会出现触碰点一直碰着相同格子没反应的问题，例如不断触碰起点，碰撞系统好像如果不离开碰触体，就不会重新算碰撞到
				let tempColl_touch = cc.instantiate(self.Prefab_tempColl_touch);
				self.background.addChild(tempColl_touch);
				tempColl_touch.setPosition(self_x,self_y);
				self.background.getChildByName("tempColl_touch").getComponent("colliderListener").boxItem = null;//---初始化碰撞点上的格子对象
				
		    	/*if (heroRouteOkList.list.length != 0) {
					let heroList = self.hero_list;
					for (let j = 0; j < heroList.length; j++) {//---------匹配英雄表
						if(self.hero_list[j].heroName == selfItem.name){//--------------找出赋值英雄移动数组
							self.hero_list[j].state = 10;//------------------------------------英雄状态切换为：移动
							self.hero_list[j].route = heroRouteOkList.list;//------------------赋值路线
							self.hero_list[j].indexNum = 0;//----------------------------------初始化移动路线的到达位置
							heroRouteOkList.list = [];//---------------------------临时路线清空
							heroRouteOkList.state = 0;//---------------------------临时路线状态改为不启用
							heroRouteOkList.name = null;//-------------------------临时路线的英雄名清除
							heroRouteOkList.lastId = -1;
						}
					}
				}*/
			});
			this.other.getChildByName("hero_" + point).on(cc.Node.EventType.TOUCH_MOVE, function ( event ) {
				let selfItem = this;
				let self_x = event.getLocation().x;
				let self_y = event.getLocation().y;
				self.background.getChildByName("tempColl_touch").x = self_x;//-------实时更改临时路线碰触点位置
				self.background.getChildByName("tempColl_touch").y = self_y;
				let isCenter = 0;
				var boxItem = self.background.getChildByName("tempColl_touch").getComponent("colliderListener").boxItem;
				if (boxItem) {
					//console.log(111);
					if (boxItem.name == "batBox_Center") {
						boxItem = boxItem.parent.getComponent("batBox_basic");
						isCenter = 1;
					}else{
						boxItem = boxItem.getComponent("batBox_basic");
					}
					var enemyList2 = [];
	    			for (var z = 0; z < self.hero_list.length; z++) {
	    				//console.log(self.hero_list[z].point,boxItem.bat_hero.point);
	    				if(self.hero_list[z].point == boxItem.bat_hero.point && self.hero_list[z].groupId == 2){//获取当前格子上是否有敌人
	    					enemyList2.push(self.hero_list[z]);
	    				}
	    			}
	    			//console.log(boxItem.bat_hero);
	    			//console.log(enemyList2);
	    			//if (!boxItem.bat_obstacle && enemyList2.length == 0) {
					if (!boxItem.bat_obstacle) {
						//console.log(boxItem.batBoxName,heroRouteOkList.lastId);
						if (heroRouteOkList.lastId == -1) {//--------------------------------还没记录到上一次的格子名字，证明是在获取第一次路线信息
							//console.log(666);
							for (let i = 0; i < self.hero_list.length; i++) {//------------循环英雄数组
								if (self.hero_list[i].heroName == selfItem.name) {//----------匹配当前点击的格子上是否存在英雄
									//console.log(333);
									self.matchOKHeroRoute(selfItem.name,boxItem);//-------传参英雄名和格子对象给确认数组
								}
							}
						}else{
							if (isCenter == 1) {
								//console.log(444);
								if(heroRouteOkList.lastId != boxItem.batBoxName){//----------当前触碰的格子不是上一次记录的格子（此判断为了防止不断触碰相同格子一直执行以下方法）
									//console.log(555);
									self.matchOKHeroRoute(heroRouteOkList.name,boxItem);//-------传参英雄名和格子对象给确认数组
								}
							}
						}
					}
				}
			});
			this.other.getChildByName("hero_" + point).on(cc.Node.EventType.TOUCH_CANCEL, function ( event ) {
				let self_x = event.getLocation().x;
				let self_y = event.getLocation().y;
				//console.log(heroRouteOkList.list,heroRouteOkList.name);
				var boxItem = self.background.getChildByName("tempColl_touch").getComponent("colliderListener").boxItem;
				if (boxItem.name == "batBox_Center") {
					boxItem = boxItem.parent.getComponent("batBox_basic");
				}else{
					boxItem = boxItem.getComponent("batBox_basic");
				}
				if(boxItem.bat_hero.groupId != 2){//-----------------------------松手时也要检测松手位置的格子上是否有敌人，有就不再加入路线
					self.matchOKHeroRoute(heroRouteOkList.name,boxItem);//-------传参英雄名和格子对象给确认数组，有时越墙后也能填补后续路线
				}
				self.touchStop(boxItem);
			});
			this.other.getChildByName("hero_" + point).on(cc.Node.EventType.TOUCH_END, function ( event ) {
				let self_x = event.getLocation().x;
				let self_y = event.getLocation().y;
				var boxItem = self.background.getChildByName("tempColl_touch").getComponent("colliderListener").boxItem;
				if (boxItem.name == "batBox_Center") {
					boxItem = boxItem.parent.getComponent("batBox_basic");
				}else{
					boxItem = boxItem.getComponent("batBox_basic");
				}
				if(boxItem.bat_hero.groupId != 2){//-----------------------------松手时也要检测松手位置的格子上是否有敌人，有就不再加入路线
					self.matchOKHeroRoute(heroRouteOkList.name,boxItem);//-------传参英雄名和格子对象给确认数组，有时越墙后也能填补后续路线
				}
				self.touchStop(boxItem);
			});
		}
    },
    update: function (dt) {
    	let self = this;
		let heroList = self.hero_list;
		for (let j = 0; j < heroList.length; j++) {//---------匹配英雄表
			if(heroList[j].state == 11){//--------------找出赋值英雄移动数组
				let targetBoxItem = self.batBox.getChildByName("batBox_y" + heroList[j].route[heroList[j].indexNum].y + "_x" + heroList[j].route[heroList[j].indexNum].x);
				let end = cc.v2(targetBoxItem.x,targetBoxItem.y);//------------------------获取下个目标xy
				if(heroList[j].groupId == 1){ var start = self.other.getChildByName(heroList[j].heroName).position;}//-------------获取目标当前xy 
				if(heroList[j].groupId == 2){ var start = self.enemy.getChildByName(heroList[j].heroName).position;}//-------------获取目标当前xy
				let direction = cc.pNormalize(cc.pSub(end, start));//------------------------先获取俩个向量的差，然后返回一个长度为1的标准化后的向量
				let item = cc.pAdd(start, cc.pMult(direction, self.followSpeed ));//----缩放上面的标准化向量，然后把初始目标xy加上缩放的向量
				if(heroList[j].groupId == 1){ self.other.getChildByName(heroList[j].heroName).setPosition(item);}//----------------更新目标位置
				if(heroList[j].groupId == 2){ self.enemy.getChildByName(heroList[j].heroName).setPosition(item);}//----------------更新目标位置
				let sum = cc.pDistance(start, end);
				if (sum <= 1 && heroList[j].indexNum < heroList[j].route.length) {//-----------------向量测出英雄和下一个格子中心在1范围内就进入下一个路线
					heroList[j].x = targetBoxItem.getComponent("batBox_basic").x;//----------------------------------------英雄当前x轴修改
					heroList[j].y = targetBoxItem.getComponent("batBox_basic").y;//----------------------------------------英雄当前y轴修改
					js_dataControl.updateHeroList(heroList);//----------------更新存储数据层js的英雄详细数组
					if (heroList[j].route[heroList[j].indexNum-1]) {//清除当前移动对象上一步格子里的标识
						//console.log(self.batBox.getChildByName("batBox_y" + heroList[j].route[heroList[j].indexNum-1].y + "_x" + heroList[j].route[heroList[j].indexNum-1].x).getComponent("batBox_basic").bat_hero);
						self.batBox.getChildByName("batBox_y" + heroList[j].route[heroList[j].indexNum-1].y + "_x" + heroList[j].route[heroList[j].indexNum-1].x).getComponent("batBox_basic").bat_hero = {point:null,groupId:null};
						//console.log(self.batBox.getChildByName("batBox_y" + heroList[j].route[heroList[j].indexNum-1].y + "_x" + heroList[j].route[heroList[j].indexNum-1].x).getComponent("batBox_basic").bat_hero);
					}
					//console.log(targetBoxItem.getComponent("batBox_basic"));
					
					//targetBoxItem.getComponent("batBox_basic").bat_hero.point = heroList[j].point;//------更改第一层战场格子上的英雄标记
					targetBoxItem.getComponent("batBox_basic").bat_hero = {
						point:		heroList[j].point,//------更改第一层战场格子上的英雄标记
						groupId:	heroList[j].groupId
					}
					//console.log(heroList[j].groupId,self.batBox.getChildByName("batBox_y" + heroList[j].route[heroList[j].indexNum].y + "_x" + heroList[j].route[heroList[j].indexNum].x).getComponent("batBox_basic").bat_hero );
					/*if(heroList[j].route[heroList[j].indexNum+1] && self.batBox.getChildByName("batBox_y" + heroList[j].route[heroList[j].indexNum+1].y + "_x" + heroList[j].route[heroList[j].indexNum+1].x).getComponent("batBox_basic").bat_hero.groupId == 2){
						for (var i = 0; i < heroList.length; i++) {
							if(heroList[i].point == heroList[j].lockTarget.point && heroList[i].groupId == heroList[j].lockTarget.groupId){
								var endTarget = self.batBox.getChildByName("batBox_y" + heroList[i].y + "_x" + heroList[i].x).getComponent("batBox_basic");
							}
						}
						console.log(heroList[j].groupId,endTarget);
						let checkRoute = js_algorithm_A.routeDirection({
							startTarget:	self.batBox.getChildByName("batBox_y" + heroList[j].y + "_x" + heroList[j].x).getComponent("batBox_basic"),
							endTarget:		endTarget,
							batBox:			self.batBox,
							hero_list:		self.hero_list,
							heroItem:		heroList[j]
						});
						console.log(checkRoute);
						heroList[j].route = checkRoute;
					}*/
					//英雄路线移动完毕后执行以下方法
					if ((heroList[j].indexNum+1) == heroList[j].route.length) {
						heroList[j].state = 10;
					}
					heroList[j].indexNum++;
					/*if(self.batBox.getChildByName("batBox_y" + heroList[j].route[heroList[j].indexNum].y + "_x" + heroList[j].route[heroList[j].indexNum].x).getComponent("batBox_basic").bat_hero.groupId == 1){
						//---获取A*填充数组，条件是当前确认数组最后一个格子对象和最新所选到的格子对象，用作处理可能越几格的路线填充
						let checkRoute = this.routeDirection(targetBoxItem,boxItem);
						console.log(222222,checkRoute);
					}*/
				}
			}
		}
    },
    //获取英雄目标  ---根据英雄节点名字
    getHeroByName: function(name){//
    	for (let i = 0; i < this.hero_list.length; i++) {//------------循环英雄数组
			if (this.hero_list[i].heroName == name) {//----------匹配当前点击的格子上是否存在英雄
				return this.hero_list[i];
			}
		}
    },
    //鼠标或手指碰触结束   (路线确认数组)
    touchStop: function(boxItem){
    	var self = this;
		var heroRouteOkList = this.hero_route_ok_list;
		for (let z = 0; z < heroRouteOkList.list.length; z++) {
			self.currentBox_destroy(heroRouteOkList.list[z]);//--------------------------销毁高亮资源方法
		}
		//console.log(self.hero_list);
    	if (heroRouteOkList.list.length != 0) {
			let heroList = self.hero_list;
			for (let j = 0; j < heroList.length; j++) {//---------匹配英雄表
				if(heroList[j].heroName == heroRouteOkList.name){//--------------找出赋值英雄移动数组
					heroList[j].state = 11;//------------------------------------英雄状态切换为：移动
					heroList[j].route = heroRouteOkList.list;//------------------赋值路线
					heroList[j].indexNum = 0;//----------------------------------初始化移动路线的到达位置
					heroList[j].lockTarget = boxItem.bat_hero;//-----------------赋值英雄锁定的目标
					heroRouteOkList.list = [];//---------------------------临时路线清空
					heroRouteOkList.state = 0;//---------------------------临时路线状态改为不启用
					heroRouteOkList.name = null;//-------------------------临时路线的英雄名清除
					heroRouteOkList.lastId = -1;
				}
			}
		}
    },
    //检测触碰到的英雄-确认   (英雄名,格子对象)
    matchOKHeroRoute: function(heroName,boxItem){
    	let heroRouteOkList = this.hero_route_ok_list;
		heroRouteOkList.state = 1;//----------------------------------临时路线记录数组启用
		heroRouteOkList.name = heroName;//----------------------------临时路线数组，记录英雄标识
		heroRouteOkList.lastId = boxItem.batBoxName;//----------------赋值当前格子的名字
		if (heroRouteOkList.list.length == 0) {//-----------------------------已选格子不再执行以下方法
    		let item = {
    			x	: boxItem.x,
    			y	: boxItem.y
    		}
    		heroRouteOkList.list.push(item);
			this.currentBox(boxItem);
		}else{
			let z = -1;//--------------获取确认数组的最后一个格子id
			//---获取A*填充数组，条件是当前确认数组最后一个格子对象和最新所选到的格子对象，用作处理可能越几格的路线填充
			let checkRoute = js_algorithm_A.routeDirection({
				startTarget:	heroRouteOkList.list[heroRouteOkList.list.length-1],
				endTarget:		boxItem,
				batBox:			this.batBox,
				hero_list:		this.hero_list,
				heroItem:		this.getHeroByName(heroName)
			});
			console.log(checkRoute,heroRouteOkList.list);
			if (checkRoute) { checkRoute.splice(0,1); }//-----------清空A*返回的路线数组的第一个格子路线，因为会和旧路线最后一个格子重复了
			let repeatList = [];//-----------------存储A*填充数组里和当前确认数组重复的格子对象，用作出现路线重复回滚
			let noRepeatList = [];//---------------存储A*填充数组里不和当前确认数组不重复的格子对象，用作出现路线重复回滚时，可以继续填充路线
			let ok_list = [];//--------------------临时存储确认数组的list
			let repeatIndex = -1;//----------------记录A*填充数组最后一个格子下标   -1:初始   
			let repeatIndexItem = null;//----------记录A*填充数组最后一个格子对象   -1:初始   
			let noRepeatIndex = -1;//--------------记录回滚点是否触发的标识   1:是，2:否  
			for (let i = 0; i < checkRoute.length; i++) {
				for (let j = 0; j < heroRouteOkList.list.length; j++) {
					if (heroRouteOkList.list[j].x == checkRoute[i].x && heroRouteOkList.list[j].y == checkRoute[i].y) {
						repeatList.push(checkRoute[i]);
						checkRoute[i].repeat = 1;
					}
				}
				heroRouteOkList.list.push(checkRoute[i]);
				this.currentBox(this.batBox.getChildByName("batBox_y" + checkRoute[i].y + "_x" + checkRoute[i].x).getComponent("batBox_basic"));
			}
			//console.log(repeatList,heroRouteOkList.list);
			if (repeatList.length > 0) {//-----------A*填充数组存在2个值时代表越墙或者终点不只在起点九宫格
				for (let x = 0; x < heroRouteOkList.list.length; x++) {
					if (repeatIndex == -1) {//-----------------标识不存在时
						if (repeatList[repeatList.length-1].x == heroRouteOkList.list[x].x && repeatList[repeatList.length-1].y == heroRouteOkList.list[x].y) {//------当前格子id等于确认数组id时
							repeatIndex = x;//-----------------赋值标识为当前循环下标
							repeatIndexItem = this.batBox.getChildByName("batBox_y" + heroRouteOkList.list[x].y + "_x" + heroRouteOkList.list[x].x).getComponent("batBox_basic");
						}
					}else{
						let temp_okItem = this.batBox.getChildByName("batBox_y" + heroRouteOkList.list[x].y + "_x" + heroRouteOkList.list[x].x).getComponent("batBox_basic").batBoxName;
						console.log(repeatIndexItem.batBoxName , temp_okItem,noRepeatIndex);
						if (repeatIndexItem.batBoxName != temp_okItem && noRepeatIndex == -1) {//还没检测到出现回滚点，就一直销毁前面的高亮路线
							this.currentBox_destroy(heroRouteOkList.list[x]);//--------------------------销毁高亮资源方法
						}else{//-----------------------------------------------------------------检测到出现回滚点，停止销毁高亮路线，保留后续循环的路线，因为那些基本上是回滚后的新路线
							noRepeatIndex = 1;
						}
					}
				}
				for (let o = 0; o < repeatIndex +1; o++) {//---循环不重复的下标+1的次数来获取确认数组路线
					let item = {
						x	: heroRouteOkList.list[o].x,
						y	: heroRouteOkList.list[o].y
					}
					ok_list.push(item);
				}
				heroRouteOkList.list = ok_list;
				console.log(repeatIndex,heroRouteOkList.list);
				console.log(noRepeatList,repeatList);
			}
		}
		//console.log(heroRouteOkList.list);
    },
    
});
