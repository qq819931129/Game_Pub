cc.Class({
    extends: cc.Component,

    properties: {

    },

    connect:function(url){
        this.connect = false;
        let self = this ;
        this.url = url; 
        self.connect = false;    
        console.log("connecting ip=" + this.url);   
        this.ws = new WebSocket(this.url);
        this.ws.onopen = function (event) {  
            console.log("socket open");
            cc.game.notification.emit("socketConnected", null);
            self.connect = true;            
        };
        this.ws.onmessage = function (event) {
            self.connect = true;
            var data = self.parse(event.data) ;
            if(data!=null){      
                console.log("response text msg: " + event.data);                                                  
                cc.game.notification.emit(data.method, data);
            }            
        };
        this.ws.onerror = function (event) {
            console.log("socket onerror");
            self.connect = false;  
            cc.game.socket = null;  
            cc.game.notification.emit("socketError", null);
        };
        this.ws.onclose = function (event) {   
            console.log("socket close");                   
            this.ws = null;            
            self.connect = false;  
            cc.game.socket = null; 
            cc.game.notification.emit("socketClose", null);
        };
        return this;
    },
    on:function(command , func){
    },
    exec:function(data){
        if(this.ws.readyState != null) {
            if (this.ws.readyState === WebSocket.OPEN) {
                console.log("request msg text:" + JSON.stringify(data));       
                this.ws.send(JSON.stringify(data));
            } 
        }
    },
    emit:function(data){       
        this.exec(data) ;
    },
    disconnect:function(){
        console.log("socket disconnect");
        this.connect = false;
        this.ws.close();
        this.ws = null;
    },
    parse:function(result){
        return JSON.parse(result);
    },
});
