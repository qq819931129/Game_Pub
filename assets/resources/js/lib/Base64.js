cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    statics:{

        decode : function(_base64Str){
            var BASE64_MAPPING = [
                'A','B','C','D','E','F','G','H',
                'I','J','K','L','M','N','O','P',
                'Q','R','S','T','U','V','W','X',
                'Y','Z','a','b','c','d','e','f',
                'g','h','i','j','k','l','m','n',
                'o','p','q','r','s','t','u','v',
                'w','x','y','z','0','1','2','3',
                '4','5','6','7','8','9','+','/'
            ];
            var _len = _base64Str.length;
            var extra_Zero_Count = 0;
            /**
             *计算在进行BASE64编码的时候，补了几个0
             */
            if(_base64Str.charAt(_len-1) == '='){
                //alert(_base64Str.charAt(_len-1));
                //alert(_base64Str.charAt(_len-2));
                if(_base64Str.charAt(_len-2) == '='){//两个等号说明补了4个0
                    extra_Zero_Count = 4;
                    _base64Str = _base64Str.substring(0 , _len-2);
                }else{//一个等号说明补了2个0
                    extra_Zero_Count = 2;
                    _base64Str = _base64Str.substring(0 , _len - 1);
                }
            }

            var binaryArray = [];
            for(var i = 0 , len = _base64Str.length; i < len ; ++i){
                var c = _base64Str.charAt(i);
                for(var j = 0 , size = BASE64_MAPPING.length ; j < size ; ++j){
                    if(c == BASE64_MAPPING[j]){
                        var _tmp = this._toBinary(j);
                        /*不足6位的补0*/
                        var _tmpLen = _tmp.length;
                        if(6-_tmpLen > 0){
                            for(var k = 6-_tmpLen ; k > 0 ; --k){
                                _tmp.unshift(0);
                            }
                        }
                        binaryArray = binaryArray.concat(_tmp);
                        break;
                    }
                }
            }

            if(extra_Zero_Count > 0){
                binaryArray = binaryArray.slice(0 , binaryArray.length - extra_Zero_Count);
            }

            var unicode = [];
            var unicodeBinary = [];
            for(var i = 0 , len = binaryArray.length ; i < len ; ){
                if(binaryArray[i] == 0){
                    unicode=unicode.concat(this._toDecimal(binaryArray.slice(i,i+8)));
                    i += 8;
                }else{
                    var sum = 0;
                    while(i < len){
                        if(binaryArray[i] == 1){
                            ++sum;
                        }else{
                            break;
                        }
                        ++i;
                    }
                    unicodeBinary = unicodeBinary.concat(binaryArray.slice(i+1 , i+8-sum));
                    i += 8 - sum;
                    while(sum > 1){
                        unicodeBinary = unicodeBinary.concat(binaryArray.slice(i+2 , i+8));
                        i += 8;
                        --sum;
                    }
                    unicode = unicode.concat(this._toDecimal(unicodeBinary));
                    unicodeBinary = [];
                }
            }
            return unicode;
        },
        _toBinary : function(ascii){
            var binary = new Array();
            while(ascii > 0){
                var b = ascii%2;
                ascii = Math.floor(ascii/2);
                binary.push(b);
            }
            /*
            var len = binary.length;
            if(6-len > 0){
                for(var i = 6-len ; i > 0 ; --i){
                    binary.push(0);
                }
            }*/
            binary.reverse();
            return binary;
        },
        _toDecimal : function(binary){
            var dec = 0;
            var p = 0;
            for(var i = binary.length-1 ; i >= 0 ; --i){
                var b = binary[i];
                if(b == 1){
                    dec += Math.pow(2 , p);
                }
                ++p;
            }
            return dec;
        },

        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode : function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = this._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }
            return utftext;
        },
    },
    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
