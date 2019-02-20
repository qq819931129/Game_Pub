var Base64 = require("Base64");
var md5 = require("md5");
var EventContents = require("EventContents");
var WeSocket = require("socket.io")
cc.Class({
    extends: cc.Component,

    properties: {   
    },
  
    onLoad: function () { 

    },

    ready:function(){       
    },

    createSocket:function() {
        if(cc.game.socket == null) {
            var websocket = new WeSocket();
            cc.game.socket = websocket.connect("ws://" + SERVER_IP + ":" + SERVER_PORT)
        }
        return cc.game.socket;
    },
    
    showToast:function(text) {
        if(cc.game.toastTips.size() == 0) {
            return;
        }        
        if(cc.game.toastTips.size() > 0) {
            this.toastTips = cc.game.toastTips.get();
            this.toastTips.parent = cc.find("Canvas");
            var toastTipScript = this.toastTips.getComponent("ToastTips");
            toastTipScript.setText(text);
            var delay = cc.delayTime(1);
            var seq = cc.sequence(delay, cc.callFunc(function(){
                this._hiddeToast();
            }.bind(this)));
            this.toastTips.runAction(seq);
        }
    },

    _hiddeToast:function() {
        if(cc.find("Canvas/toastTips")) {
            cc.game.toastTips.put(cc.find("Canvas/toastTips"));
        }
    },

    openWindow:function(prefab) {        
        if(cc.game.openwin != null){
            console.log("openWindow not null");
            return;
        }
        if(prefab!=null){
            cc.game.openwin = cc.instantiate(prefab) ;
            cc.game.openwin.scaleX = 0;
            cc.game.openwin.scaleY = 0;
            cc.game.openwin.parent = this.mask();
            this.mask().active = true;
            let scaleTo = cc.scaleTo(0.25, 1, 1);        
            cc.game.openwin.runAction(scaleTo);
        }
    },

    openChildWindow:function(prefab, jsName, target) {// jsName:js名称，作用域对象（this）
        if(cc.game.childWin != null){
            return;
        }
        if(prefab!=null){
            cc.game.childWin = cc.instantiate(prefab) ;
            cc.game.childWin.scaleX = 0;
            cc.game.childWin.scaleY = 0;
            cc.game.childWin.parent = this.mask();
            if(jsName) {
                var childWinScript = cc.game.childWin.getComponent(jsName);
                childWinScript.show(target);
            }
            let scaleTo = cc.scaleTo(0.25, 1, 1);        
            cc.game.childWin.runAction(scaleTo);
        }
    },

    getChildWindow:function () {
        return cc.game.childWin;
    },

    closeChildWindow:function() {
        if(cc.game.childWin != null){
            let scaleTo = cc.scaleTo(0.25, 0, 0);  
            var seq = cc.sequence(scaleTo, 
                cc.callFunc(function(){
                    if(cc.game.childWin != null) {
                        cc.game.childWin.destroy();
                    }
                    cc.game.childWin = null ;                    
            }.bind(this)));
            cc.game.childWin.runAction(seq);
        }
    },

    closeWindow:function(){
        cc.log("closeWindow")
        if(cc.game.openwin != null){
            let scaleTo = cc.scaleTo(0.25, 0, 0);  
            var seq = cc.sequence(scaleTo, 
                cc.callFunc(function(){
                    if (cc.game.openwin) {
                        cc.game.openwin.destroy();
                    }
                    cc.game.openwin = null ;
                    this.mask().active = false;
            }.bind(this)));
            cc.game.openwin.runAction(seq);
        }
    },    

    openAlertTips:function(text, okCallback, type, target) {//提示内容，回调函数，提示框类型，作用域对象（this）
        if(cc.game.alertTips.size() == 0) {
            console.log("openAlertTips return");
            return;
        }
        if(cc.game.alertTips.size() > 0) {
            this.mask().active = true;
            this.alertTips = cc.game.alertTips.get();
            this.alertTips.parent = cc.find("Canvas");
            var alertScript = this.alertTips.getComponent("AlertDialog");
            alertScript.show(text, okCallback, type,  target);
        }
    },

    openConFirmTips:function(text, okCallback, cancenlCallback, target) {
        if(cc.game.confirmTips.size() == 0) {
            return;
        }
        if(cc.game.confirmTips.size() > 0) {
            this.mask().active = true;
            this.confirmTips = cc.game.confirmTips.get();
            this.confirmTips.parent = cc.find("Canvas");
            var conFirmScript = this.confirmTips.getComponent("ConfirmDialog");
            conFirmScript.show(text, okCallback, cancenlCallback, target);
        }
    },

    closeConfirmTips:function() {
        if(cc.find("Canvas/confirm")) {    
            var conFirmScript = this.confirmTips.getComponent("ConfirmDialog");   
            conFirmScript.hide(); 
            if(cc.game.openwin == null) {
                this.mask().active = false;  
            }          
        }
    },

    closeAlertTips:function()  {
        this._closeAlertTips();
    },

    _closeAlertTips:function () {
        if(cc.find("Canvas/alert")) {
            cc.game.alertTips.put(cc.find("Canvas/alert"));
        }
    },


    _closeConfirmTips:function() {
        if(cc.find("Canvas/confirm")) {    
            cc.game.confirmTips.put(cc.find("Canvas/confirm"));                
        }
    },

    showLoadingTips:function() {
        if(cc.game.loadingTips.size() == 0) {

        } 
        if(cc.game.loadingTips.size() > 0) {
            this.loadingTips = cc.game.loadingTips.get();
            this.loadingTips.parent = cc.find("Canvas");
            var animationCtrl = this.loadingTips.getComponent(cc.Animation);
            animationCtrl.play("loading");
        }
    },

    hideLoadingTips:function() {
        if(cc.find("Canvas/loading")) {
            cc.game.loadingTips.put(cc.find("Canvas/loading"));
        }
    },    
    
    decodeEncryptedData:function() {
        var encryptedData = cc.sys.localStorage.getItem("encryptedData");
        var sessionKey = cc.sys.localStorage.getItem("sessionKey");
        var iv = cc.sys.localStorage.getItem("iv");
        KBEngine.INFO_MSG("decodeEncryptedData: encryptedData=" + encryptedData + " ,iv=" + iv + " ,sessionKey=" + sessionKey);
        if(sessionKey && encryptedData && iv) {
            var pc = new WxBizDataCrypt(APPID, sessionKey);
            var data = pc.descrytData(encryptedData , iv);
            console.log('解密后 data: ', data)
        }
     },

     createDictString: function(dic) {
        var dictString = "";
        var len = 0;
        for(var pro in dic) len++;

        if(len > 0) {
            var index = 0;
            var dictString = "{"
            for(var prop in dic) {
                dictString += "'" + prop + "'" ;
                dictString += ":";
                dictString += "'" + dic[prop] + "'";
                if(index == len-1) {
                    dictString += "}";
                }else {
                    dictString += ",";
                }
                index++;
            }
        }

        return dictString;
     },
        
    scene:function(name, self){              
        cc.director.preloadScene(name, function () {                       
            if(cc.game){
                // self.closeloadding(self.loaddingDialog);
                self.destroyCommon(self);
            }
            console.log("scene");
            cc.director.loadScene(name);
        });
    },

    destroyCommon:function(self) {
        console.log("destroyCommon");
        self._closeConfirmTips();
        self.hideLoadingTips();
        self._hiddeToast();
        self._closeAlertTips();
        if(cc.game.openwin != null) {
            cc.game.openwin.destroy();
            cc.game.openwin = null ;
        }
        if(cc.game.childWin != null) {
            cc.game.childWin.destroy();
            cc.game.childWin = null ;  
        }
              
    },
    preload:function(extparams , self){
        this.loadding();
        /**
         *切换游戏场景之前，需要先检查是否 是在游戏中，如果是在游戏中，则直接进入该游戏，如果不在游戏中，则执行 新场景游戏
         */
        /**
         * 发送状态查询请求，如果玩家当前在游戏中，则直接进入游戏回复状态，如果玩家不在游戏中，则创建新游戏场景
         */
        
    },
    main:function() {
        return cc.find("Canvas/main");
    },
    mask:function() {
        return cc.find("Canvas/mask");
    },
    root:function(){
        return cc.find("Canvas");
    },
    decode:function(data){
        return Base64.decode(data) ;
    },
    parse:function(result){
        return JSON.parse(result) ;
    },
    reset:function(data , result){              
    },       
    /**
     * 解决Layout的渲染顺序和显示顺序不一致的问题
     * @param target
     * @param func
     */
    layout:function(target , func){
        if(target != null){
            let temp = new Array() ;
            let children = target.children ;
            for(var inx = 0 ; inx < children.length ; inx++){
                temp.push(children[inx]) ;
            }
            for(var inx = 0 ; inx < temp.length ; inx++){
                target.removeChild(temp[inx]) ;
            }

            temp.sort(func) ;
            for(var inx =0 ; inx<temp.length ; inx++){
                temp[inx].parent = target ;
            }
            temp.splice(0 , temp.length) ;
        }
    },
    saveUserInfo : function(data){//保存用户数据
        var userInfo = {};
        userInfo.avatar_id = data.user.avatar_id;
        userInfo.connect = data.user.connect;
        userInfo.diamond = data.user.diamond;
        userInfo.gold = data.user.gold;
        userInfo.id = data.user.id;
        userInfo.name = data.user.name;
        userInfo.online = data.user.online;
        userInfo.phone_number = data.user.phone_number;
        userInfo.sex = data.user.sex;
        userInfo.ticket = data.user.ticket;
        cc.game.userInfo = userInfo;
    },

});
