cc.Class({
    extends: cc.Component,

    properties: {
        _eventMap: [],
    },   

    on: function(type, callback, target) {
        if (this._eventMap[type] === undefined) {
            this._eventMap[type] = [];
        }        
        this._eventMap[type].push({ callback: callback, target: target });
    },

    emit: function(type, parameter) {
        var array = this._eventMap[type];        
        if (array === undefined) return;        
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element) element.callback.call(element.target, parameter);
        }
    },

    off: function(type, callback) {
        var array = this._eventMap[type];
        if (array === undefined) return;

        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element && element.callback === callback) {
                array[i] = undefined;
                break;
            }
        }
    },

    offType: function(type) {
        this._eventMap[type] = undefined;
    },
});