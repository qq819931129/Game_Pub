var GameCommon = require("GameCommon");
var EventContents = require("EventContents");
var IOUtils = require("IOUtils");
cc.Class({
    extends: GameCommon,

    initConnectEvent:function() {
        console.log("SocketManager initConnectEvent");
        cc.game.notification.on(EventContents.MSG_SOCKET_CLOSE, this.socketCloseCallback, this);
        cc.game.notification.on(EventContents.MSG_SOCKET_CONNECTED, this.socketConnectCallback, this);
        cc.game.notification.on(EventContents.MSG_heartbeat_REP, this.heartbeatCallback, this);
        cc.game.notification.on(EventContents.MSG_SOCKET_ERROR, this.socketErrorCallback, this);
        cc.game.notification.on(EventContents.MSG_HIDE_MASK_REP, this.hideMaskCallback, this);
    },
    hideMaskCallback:function () {
        console.log("强制关闭loading！！！！");
        this.hideLoadingTips();
    },

    socketErrorCallback:function () {
        console.log("网咯异常！！！！");
        this.socketCloseCallback();
    },

    heartbeatCallback:function() {
        console.log("SocketManager heartbeatCallback");
        var data = {
            "method": EventContents.MSG_heartbeat_REQ
        }
        this.createSocket().emit(data);
    },

    socketCloseCallback:function() {
        console.log("SocketManager socketCloseCallback");
        this.closeAlertTips();
        this.openAlertTips("网络连接失败，重新连接网络", this.retryConnect, 0, this);
    },

    retryConnect:function() {
        console.log("SocketManager retryConnect");
        this.showLoadingTips();
        this.schedule(function() {
            this.createSocket();
        }, 1, 0, 0);
    },

    socketConnectCallback:function() {
        console.log("SocketManager socketConnectCallback");
        this.hideLoadingTips();
        console.log("网络连接成功");
        if(cc.director.getScene().name == LOGIN_SCENE) {

        } else {
            this.authLoginRequest();
        }
    },

    authLoginRequest:function () {
        let token = IOUtils.get("token");
        if (token == null) {
            return;
        }
        cc.game.notification.on(EventContents.MSG_RECONNECT_REP, this.authLoginCallback, this);
        this.showLoadingTips();
        var data = {
            "method": EventContents.MSG_RECONNECT_REQ,
            "token": token,
        }
        this.createSocket().emit(data);
    },

    authLoginCallback:function(data) {
        cc.game.notification.offType(EventContents.MSG_RECONNECT_REP);
        this.hideLoadingTips();
        if(data.result == 1) {
            this.showToast(data.reason);
            this.saveUserInfo(data);
        }
    },

});