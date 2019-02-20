cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    statics: {  
        MSG_SOCKET_CONNECTED: "socketConnected",

        MSG_SOCKET_CLOSE: "socketClose",

        MSG_SOCKET_ERROR: "socketError",

        MSG_GET_SMS_CODE_REQ: "getSmsCode", //发送手机验证码

        MSG_GET_SMS_CODE_REP: "getSmsCodeResp", 

        MSG_LOGIN_BY_MOBILE_REQ: "loginByMobile", //手机验证码登录

        MSG_LOGIN_BY_MOBILE_REP: "loginByMobileResp",

        MSG_BASE_DATA_REQ: "setBaseData",//修改个人资料

        MSG_BASE_DATA_REP: "setBaseDataResp",

        MSG_GET_LISTS_REQ: "getMailList",//获取邮件列表

        MSG_GET_LISTS_REP: "getMailListResp",

        MSG_DEL_MAIL_REQ: "delMail",//删除单封邮件

        MSG_DEL_MAIL_REP: "delMailResp",

        MSG_GET_CONTENT_REQ: "getMailContent",//获取邮件详情

        MSG_GET_CONTENT_REP: "getMailContentResp",

        MSG_VALIDATE_CODE_REQ: "validateCode",//验证 旧手机换绑验证码

        MSG_VALIDATE_CODE_REP: "validateCodeResp",

        MSG_CHANGEBING_REQ: "changeBind",//验证 新手机换绑验证码

        MSG_CHANGEBING_REP: "changeBindResp",

        MSG_GET_ACCESSORY_REQ: "getMailAccessory",//获取邮件附件

        MSG_GET_ACCESSORY_REP: "getMailAccessoryResp",

        MSG_GET_UNREADMAIL_REQ: "getUnreadMail",//获取邮件未读数量

        MSG_GET_UNREADMAIL_REP: "getUnreadMailResp",

        MSG_ONFREEZE_REP: "onFreezeResp",//踢玩家下线

        MSG_NEW_MAIL_REP : "newMailResp",

        MSG_AUTHLOGIN_REQ: "authLogin",//登录界面-自动登录

        MSG_AUTHLOGIN_REP : "authLoginResp",

        MSG_RECONNECT_REQ: "reconnect",//断线重连-登录

        MSG_RECONNECT_REP : "reconnectResp",

        MSG_LOGOUT_REQ: "logout",//注销

        MSG_LOGOUT_REP : "logoutResp",

        MSG_heartbeat_REQ: "heartbeat",//心跳包检测

        MSG_heartbeat_REP : "heartbeat",

        MSG_HIDE_MASK_REP : "hideMaskResp",
    },
});
