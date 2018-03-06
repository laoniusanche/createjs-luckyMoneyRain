(function(w){
    var scale = document.documentElement.clientWidth/320,//图像的缩放情况
        count = 2;//序列帧每行图片数

    var Player = function(x,y,img){
        this.width = img.width/count;
        this.height = img.height;
        this.state = "normal";
        this.x = x;
        this.y = y;
        this.init(img);
    };

    Player.prototype = {
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
            // this.sprite.x = this.x;
            // this.sprite.y = this.y;
            this.sprite.setTransform(this.x, this.y, scale, scale);
            stage.addChild(this.sprite);
        },
        update:function(moveX){
            this.x = this.sprite.x = moveX ;
        },
        normal:function(){
            this.sprite.gotoAndPlay("normal");
        },
        explode:function(){
            this.sprite.gotoAndPlay("explode");
            var _this = this;
            setTimeout(function(){
                _this.normal();
            },500)
        },
        picsize:function(){
            return {
                x:this.x,
                y:this.y,
                w:this.width*scale,
                h:this.width*scale
            }
        }
    };

    w.createPlayer = function(x , y , img){
        return new Player(x , y , img)
    };
})(window);