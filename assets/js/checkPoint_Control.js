
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
    	cc.director.preloadScene("teamBuild", function () {
		    cc.log("teamBuild 场景预加载完毕");
		});
        
        cc.loader.loadRes("test", cc.SpriteAtlas, function (err, atlas) {
            cc.log(atlas);
        });
		
    },
    
});
