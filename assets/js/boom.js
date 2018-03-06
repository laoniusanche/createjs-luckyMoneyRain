(function(w){
    var gravity = 0.3,//红包的下降速度
        scale = document.documentElement.clientWidth/320,//图像的缩放情况
        count = 2;//序列帧每行图片数

    var Boom = function(x,y,img){
        this.width = img.width/count;
        this.height = img.height;
        this.state = "normal";
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.type = 0;//标记掉落物品的属性
        this.init(img);
    };

    Boom.prototype = {
        init:function(img){
            //动作序列设置
            var spriteSheet = new createjs.SpriteSheet({
                "images":[img],
                "frames":{"regX":0,"regY":0,"width":this.width,"height":this.height,"count":count},
                "animations":{
                    "normal":{
                        frames:[0]
                    },
                    "explode":{
                        frames:[1]
                    }
                }
            });
            this.sprite = new createjs.Sprite(spriteSheet , this.state);
            this.sprite.setTransform(this.x, this.y, scale, scale);
            stage.addChild(this.sprite);
        },
        update:function(){
            this.vy += gravity;
            this.y = this.sprite.y += this.vy ;
        },
        explode:function(){
            this.sprite.gotoAndPlay("explode");
            this.destory();
        },
        destory:function(){
            var _this = this;
            setTimeout(function(){
                stage.removeChild(_this.sprite);
            },300)
        },
        picsize:function(){
            return {
                type:this.type,
                x:this.x,
                y:this.y,
                w:this.width*scale,
                h:this.width*scale
            }
        }
    };

    w.createBoom = function(x , y , img){
        return new Boom(x , y , img)
    };
})(window);