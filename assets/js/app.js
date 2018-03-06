var timer = 30,
    t1, t2,
    fallSpeed = 250,//掉落物品下降速度
    score = 0,
    scoreAdd = 3,//加分
    scoreReduce = -5,//降分
    isPlay = false;
var stage, C_W, C_H, player, boom, luckyMoney, fallDownArr = [], loader, bg;

//通过两倍缩放canvas，适应retina
var sWidth = document.documentElement.clientWidth, sHeight = document.documentElement.clientHeight, ratio = sWidth / 320;
document.querySelector("canvas").style.width = sWidth + "px";document.querySelector("canvas").style.height = sHeight + "px";

function init() {
    isPlay = true;
    stage = new createjs.Stage("canvas");
    stage.canvas.width = sWidth * 2;
    stage.canvas.height = sHeight * 2;
    C_W = stage.canvas.width;
    C_H = stage.canvas.height;
    var manifest = [
        {src: "assets/images/player.png", id: "player"},
        {src: "assets/images/boom.png", id: "boom"},
        {src: "assets/images/LuckyMoneyRain.png", id: "luckyMoney"}
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest);

    t2 = window.setInterval(function () {
        if (timer > 0) {
            timer--
        } else {
            timer = 0;
            isPlay = false;
            window.clearInterval(t1);
            window.clearInterval(t2);
        }
        console.log(score);
    }, 1000)
}

function handleComplete() {
    bg = new createjs.Shape();
    bg.graphics.beginFill("#61beef").drawRect(0, 0, C_W, C_H);
    stage.addChild(bg);

    var playerImage = loader.getResult("player");
    player = createPlayer(C_W / 2 - playerImage.width / 4 * ratio, C_H - playerImage.height * ratio, playerImage);

    stage.canvas.addEventListener("touchstart", function (e) {
        stage.canvas.addEventListener('touchmove', function (e) {
            //鼠标位置
            var moveX = e.targetTouches[0].clientX * 2 - player.picsize().w / 2;//当前适应retina，画布宽高为两倍
            if (moveX < 0) {
                moveX = 0;
            } else if (moveX > C_W - player.picsize().w) {
                moveX = C_W - player.picsize().w;
            }
            player.update(moveX);
        });
    });

    t1 = setInterval(fallDownCreate, fallSpeed);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", handleTick);
}

function fallDownCreate() {
    var luckyMoneyImage = loader.getResult("luckyMoney");
    var boomImage = loader.getResult("boom");
    if (Math.floor(Math.random() * (2)) === 1) {
        luckyMoney = createLuckyMoney(Math.random() * (C_W - luckyMoneyImage.width / 4 * ratio), -luckyMoneyImage.height * ratio, luckyMoneyImage);
        fallDownArr.push(luckyMoney);
    } else {
        boom = createBoom(Math.random() * (C_W - boomImage.width / 4 * ratio), -boomImage.height * ratio, boomImage);
        fallDownArr.push(boom);
    }
}

function scoreTipCreate(text){
    var scoreTip  = new createjs.Text(text , "40px Times", "red");
    scoreTip .y = player.picsize().y - 40;
    scoreTip .x = player.picsize().x + player.picsize().w/2 - 20;
    stage.addChild(scoreTip);
    setTimeout(function(){
        stage.removeChild(scoreTip);
    },150);
}

function handleTick() {
    if (isPlay) {
        for (var i = 0; i < fallDownArr.length; i++) {
            fallDownArr[i].update();
            if (fallDownArr[i].picsize().y + fallDownArr[i].picsize().h >= player.picsize().y && fallDownArr[i].picsize().y < C_H) {//高度检测
                if (fallDownArr[i].picsize().x + fallDownArr[i].picsize().w >= player.picsize().x && fallDownArr[i].picsize().x <= player.picsize().x + player.picsize().w) {
                    if (fallDownArr[i].picsize().type === 1) {
                        score += scoreAdd;
                        scoreTipCreate(scoreAdd);
                        fallDownArr[i].destory();
                        fallDownArr.splice(i, 1);
                    } else {
                        score -= scoreReduce <=0?0:score -= scoreReduce;
                        scoreTipCreate(scoreReduce);
                        fallDownArr[i].explode();
                        fallDownArr.splice(i, 1);
                    }
                }
            } else if (fallDownArr[i].picsize().y >= C_H) {
                fallDownArr[i].destory();
                fallDownArr.splice(i, 1);
            }
        }
        stage.update();
    }
}

init();