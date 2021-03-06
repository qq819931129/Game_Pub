// var clipEvent = require("animationClipEvent");

cc.Class({
    extends: cc.Component,
    properties: {
        anim: {
            default: null,
            type: cc.Animation
        },
        animState: {
            default: null,
            type: cc.AnimationState,
            visible: false
        }
    },
    start:function(){

    },
    onLoad: function () {
        this.init();
    },
    init:function(){
        this.frameTime = 10;
        /**
         *  动画动作
            ack       = 攻击（进行时）
            ackStance = 攻击姿势
            art       = 技能
            die       = 死亡
            move      = 移动
            stand     = 站立 
         */
        this.animationMotion = ['ack','ackStance','art','die','move','stand'];
        /**
         * 动画方向
            left      = 左
            downleft  = 左下
            down      = 下
            downright = 右下
            right     = 右
            upright   = 右上
            up        = 上
            upleft    = 左上
         */
        this.animationOrientation =['left','downleft','down','downright','right','upright','up','upleft'];
        /**
         * 英雄列表
         */
        this.heroCodes = ['0001'];

        /**
         * 回调方法参数对象
         * first：第一帧
         * 数字：某一帧
         * last：最后一帧
         */
        this.callBack = {
            'ack':{clipIndex:'last',functionName:'callBack',params:[]},
            'ackStance':{clipIndex:'',functionName:'',params:[]},
            'art':{clipIndex:'',functionName:'',params:[]},
            'die':{clipIndex:'',functionName:'',params:[]},
            'move':{clipIndex:'',functionName:'',params:[]},
            'stand':{clipIndex:'',functionName:'',params:[]}
        };
        
        var self = this
        var heroAnims = {}; 
        // for(let code of this.heroCodes){
        //     for(let motion of this.animationMotion){
        //         let motionList = [];
        //         for(let orientation of this.animationOrientation){
        //             let anim = this.createAnimation(code,motion,orientation);
        //             if(anim){
        //                 motionList.push(anim);
        //             }
        //         }
        //         heroAnims[motion] = motionList;
        //     }
        // }
        // let anim = this.createAnimation('0001','ack','downright');
        // cc.log(anim);
        // cc.log(heroAnims);

        // this.cook().then(function(data){
        //     cc.log(data);
        // }).catch(function(error){
        //     cc.log(error);
        // })
        // this.loadSpriteAtlas('0001/ack/downright');
        this.cook().then(function(data){
             cc.log(data);
        }).catch((error) => {
            cc.log(error);
        });
        cc.log("方法结束");
    },
    createClipEvent : function(frame,func,params){
        return {frame,func,params};
    },
    callBack :function(){
        cc.log('callBack');
    },
    /**
     * code：英雄编号
     * motion：动作
     * orientation：方向
     */
    createAnimation:function(code, motion, orientation){
        let atlasPath = `${code}/${motion}/${orientation}`;
        //var atlasPath = `0001/ack/downright`;
        var self = this;
        var anim = null;
        var aniState = null;
        cc.loader.loadRes(atlasPath, cc.SpriteAtlas, function (err, atlas) {
            //cc.log(atlas);
            if(err){
                cc.log(err);
                return null;
            }
            let spriteFrames = atlas.getSpriteFrames();
            let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, self.frameTime);
            clip.name = orientation
            let cbFrameTime = self.frameTime * spriteFrames.length;
            //let clipEvent = self.createClipEvent(cbFrameTime,'callBack',[]);
            //clip.events.push(clipEvent);
            // cc.log(clipEvent);
            // cc.log(clip.events);
            // cc.log(clip);
            anim = self.node.addComponent(cc.Animation);
            anim.addClip(clip);
            aniState = anim.play(orientation);
            aniState.wrapMode = 2;// 播放模式
            aniState.speed = 1;// 播放速度控制
            //aniState = anim.play('downright');
            cc.log(anim);
            return anim;
        });
        return null;
    },
    loadSpriteAtlas:function(atlasPath){
        cc.log("开始请求图片集");
        var promise = new Promise((resolve, reject) => {
            cc.loader.loadRes(atlasPath, cc.SpriteAtlas, function (err, atlas) {
                //cc.log(atlas);
                if(err){
                    reject(err);
                }
                cc.log("请求成功"+atlas.getSpriteFrames());
                resolve(atlas.getSpriteFrames());
            }); 
        });
        promise.then(function(spriteFrames){
            return spriteFrames;
        }).catch(function(err){
            cc.log(err);
        });
        
    },
    cook :function (){
        console.log('开始做饭。');
        var p = new Promise(function(resolve, reject){
            setTimeout(function(){
                console.log('做饭完毕！');
                if(false){
                    resolve('鸡蛋炒饭');
                }else{
                    reject("厨房爆炸!!!");
                }
            }, 10000);
        });
        return p;
    }
});
 