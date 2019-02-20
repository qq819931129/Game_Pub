
var WeSocket = require("socket.io")
cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
    	/*this.initGame();
    	var websocket = new WeSocket();
        cc.game.socket = websocket.connect("ws://" + "192.168.0.109" + ":" + "8001");*/
        
    	cc.director.preloadScene("teamBuild", function () {
		    cc.log("teamBuild 场景预加载完毕");
		});
        
        cc.loader.loadRes("test", cc.SpriteAtlas, function (err, atlas) {
            cc.log(atlas);
        });
		
    },
    initGame:function() {
    	
        var GameNotification = require("GameNotification");
        cc.game.notification = new GameNotification();    
        var SocketManager = require("SocketMananger");
        cc.game.socketManager = new SocketManager();
        cc.game.socketManager.initConnectEvent();
    },
    
});
