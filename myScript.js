/*
    if (typeof String.prototype.startsWith != 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) == 0;
        };
    }
    */



function clearExtraIntervals(intervalsArray) {

    for (var i = 0; i < intervalsArray.length; i++) {
        //if (i != 0) {
        clearIntervalGbl(intervalsArray[i]);
        //}
    }

    //var mLoop = intervals[0];
    //intervals = [];
    //intervals.push(mLoop);
}

function gameInit() {
    killAllShapes(shapeList);
    clearExtraIntervals(intervals);
    shapeList = [];
    currentLevel = [];

    startMainLoop();
    startTime = new Date(Date.now());
    xpto = -1;
    frameCount = 0;
    color = "#FF0000";
    //loop = null;
    c = document.getElementById('canvas');
    hud = null;
    fishToEat = 0;
    InitShapes();
}

function killAllShapes(list) {
    if (list != undefined && list != null) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].kill) {
                list[i].kill();
                //console.log("killing " + list[i].shape.name);
            }
        }
    }
}

function init() {
    alert('Mr Elementualle has been in a deserter island for a couple of years, \nunexpectedly he ran into a magic coconut which gave him magical powers that will help him escape from the island. \nPress:'
+ '\n    "1"  - to fix the raft, with your earth power, and gain some health;'
+ '\n    "2"  - to catch a fish, with your air power, and gain some health;'
+ '\n    "3"  - to attack the sharks, with your fire power;'
+ '\n    <=-  - to move left;'
+ '\n    -=>  - to move right.');

    //Set up key listener
    function onkey(d, e) {
        if (!e) e = window.e;
        var c = e.keyCode;
        if (e.charCode && c == 0)
            c = e.charCode;

        

        if (c == 37) { //left
            if (this.magePlayer.direction != "L") {
                this.magePlayer.direction = "L";
                this.magePlayer.shape.vx = 0;
            }
            else
                this.magePlayer.shape.vx = -d * 2;
        } else if (c == 39) { //right
            if (this.magePlayer.direction != "R") {
                this.magePlayer.direction = "R";
            }
            else
                this.magePlayer.shape.vx = d * 2;
        }

        //key 1
        if (c == 49) {
            earthSpellLogic();
        }

        //key 2
        if (c == 50) {
            airSpellLogic();
        }

        //key 3
        if (c == 51) {
            fireSpellLogic();
        }

        //if (c == 38) keys.u1 = d; //up

        //if (c == 40) keys.d1 = d; //down

        //if (c == 65 || c == 81) keys.l2 = d; //a/q
        //if (c == 90 || c == 87) keys.u2 = d; //z/w
        //if (c == 83) keys.d2 = d; //s
        //if (c == 68) keys.r2 = d; //d

        //if (!d) {
        //    if (c == 27) { //Escape
        //        setState(INTRO);
        //    }
        //    if (c == 32) { //Scape
        //        if (state == INTRO) {
        //            introNext();
        //        }
        //    }

        //    if (c == 82) { //R
        //        if (state == INTRO || state == GAMEOVER) {
        //            setState(GAME);
        //        }
        //    }
        //}
    };
    document.onkeyup = function (e) {
        onkey(0, e);
    };
    document.onkeydown = function (e) {
        onkey(1, e);
    };


    document.getElementById("stopLoop").addEventListener('click', function () {
        funcStopLoop(intervals[0]);
        //alert("clear:" + intervals[0]);

    }, false);

    document.getElementById("restartGame").addEventListener('click', function () {
        alert("Game Restart!");
        gameInit();
    }, false);

    document.getElementById("fire1").addEventListener('click', function () {
        fireSpellLogic();
    }, false);

    document.getElementById("air1").addEventListener('click', function () {
        airSpellLogic();
    }, false);

    document.getElementById("earth1").addEventListener('click', function () {
        earthSpellLogic();
    }, false);

    function fireSpellLogic() {
        if (magePlayer != null && magePlayer != undefined) {
            var btn = document.getElementById("fire1");
            if (!btn.disabled) {
                magePlayer.castSpell(3);
                lockoutSubmit(btn, 1000);
            }
        }
    }

    function airSpellLogic() {
        if (magePlayer != null && magePlayer != undefined) {
            var btn = document.getElementById("air1");
            if (!btn.disabled) {
                magePlayer.castSpell(2);
                lockoutSubmit(btn, 1000);
            }

        }
    }

    function earthSpellLogic() {
        if (magePlayer != null && magePlayer != undefined) {
            var btn = document.getElementById("earth1");
            if (!btn.disabled) {
                magePlayer.castSpell(1);
                lockoutSubmit(btn, 5000);
            }
        }
    }

    gameInit();


}


function startMainLoop() {
    animFrame = null; // TODO: improve this for other browsers
    var intervalId = null;

    if (animFrame !== null) {
        var canvas = document.getElementById('canvas');//.get(0);

        var isMozilla = false; //$.browser.mozilla
        if (isMozilla) {
            var recursiveAnim = function () {
                mainloop();
                animFrame();
            };

            // setup for multiple calls
            window.addEventListener("MozBeforePaint", recursiveAnim, false);

            // start the mainloop
            animFrame();
        } else {
            var recursiveAnim = function () {
                mainloop();
                animFrame(recursiveAnim, canvas);
            };

            // start the mainloop
            intervalId = animFrame(recursiveAnim, canvas);
        }
    } else {
        var ONE_FRAME_TIME = 1000.0 / 60.0;
        setIntervalGbl(mainloop, ONE_FRAME_TIME);

    }
}
function lockoutSubmit(button, cdValue) {
    //var oldValue = button.value;
    var oldText = button.innerText;

    button.setAttribute('disabled', true);
    button.value = '...processing...';

    setTimeout(function () {
        button.innerText = oldText;
        button.removeAttribute('disabled');
    }, cdValue);

    var started = new Date(Date.now());
    var intervalMethod = function () {
        showCooldown(button, started, cdValue / 1000, oldText);
    };

    var interval = setIntervalGbl(intervalMethod, 1000); //update cooldown every sec

    setTimeout(function () {
        clearIntervalGbl(interval);
        button.value = oldText;
    }, cdValue - 1);

}

function showCooldown(obj, startTime, totalSeconds, oldText) {
    var now = new Date(Date.now());
    var secondsPast = new Date((now - startTime)).getSeconds();
    var totalLeft = totalSeconds - secondsPast;
    obj.innerText = oldText + " (" + totalLeft + ")";
}

/* ---- NAMESPACES (+) ---- */
var lvl = {
    init: function () {
        //setInterval(function () { console.log("timerAvr: " + frameCount + " OR " + currentSeconds() + " seconds!" + new Date(Date.now()).getSeconds())}, 10*1000);
        hud = new Hud();
        //hud.init();
    },

    lvl01: function () {

        var lessThan = Math.random() < .5;
        lessThan = true;

        var side1 = lessThan ? "R" : "L";
        var side2 = lessThan ? "L" : "R";

        //console.log("lessThan:" + lessThan + " side1:" + side1 + "; side2:" + side2);


        currentLevel.push(new lvlEvent(0, new Raft()));

        /*
        currentLevel.push(new lvlEvent(3, new Fish()));
        currentLevel.push(new lvlEvent(6, new Fish()));
        currentLevel.push(new lvlEvent(9, new Fish()));
        currentLevel.push(new lvlEvent(12, new Fish()));
        currentLevel.push(new lvlEvent(15, new Fish()));
        currentLevel.push(new lvlEvent(18, new Fish()));
        currentLevel.push(new lvlEvent(21, new Fish()));

        return;*/

        
        //currentLevel.push(new lvlEvent(3, new Shark(null, side2)));


        currentLevel.push(new lvlEvent(3, new Shark(null, side1)));
        currentLevel.push(new lvlEvent(6, new Shark(null, side1)));

        currentLevel.push(new lvlEvent(10, new Fish()));
        currentLevel.push(new lvlEvent(13, new Shark(null, null, true)));
        currentLevel.push(new lvlEvent(16, new Shark(null, side2)));
        currentLevel.push(new lvlEvent(16, new Fish()));
        currentLevel.push(new lvlEvent(18, new Shark(null, side2)));

        currentLevel.push(new lvlEvent(20, new Shark(null, side1, true))); //9
        currentLevel.push(new lvlEvent(22, new Shark(null, side1, true)));
        currentLevel.push(new lvlEvent(23, new Fish()));

        lessThan = Math.random() < .5; side1 = lessThan ? "R" : "L"; side2 = side1 == "R" ? "L" : "R";

        currentLevel.push(new lvlEvent(27, new Shark(null, side1, true)));
        currentLevel.push(new lvlEvent(29, new Shark(null, side1)));
        currentLevel.push(new lvlEvent(30, new Fish()));
        currentLevel.push(new lvlEvent(30, new Shark(null, side1, true)));
        currentLevel.push(new lvlEvent(32, new Fish()));

        currentLevel.push(new lvlEvent(33, new Shark(null, side2)));
        currentLevel.push(new lvlEvent(34, new Fish()));

        //currentLevel.push(new lvlEvent(16, new Fish()));


        //currentLevel.push(new lvlEvent(17, new Shark()));
        //currentLevel.push(new lvlEvent(18, new Shark()));
    }
}


var Constants = {
    PLAYER_MAX_HP: 6,
    SHARK_MAX_HP: 3,
    SPEED_NORMAL: 1,
    SPEED_ENRAGED: 2
}

//var NPC = {
//    spawn: function (timer) {
//        console.log("spawn from NPC");
//    },

//    kill: function () {
//        console.log('need to implement this method on child!');
//    },

//    action: function () {
//        console.log('need to implement this method on child!');
//    }
//}

var Mage = function (parent) {
    this.shape = gen(parent);
    this.direction = "R";

    this.spawn = function () {
        shapeList.push(that);
    }

    this.gotHit = function (hitFrom) {
        //console.log('I("' + this.shape.name + '") was hit by "' + hitFrom.shape.name + '"');
    };

    this.hitWith = function (target) {
        //console.log('I("' + this.name + '") just hit "' + target.name + '"');
        target.gotHit(this);
    }

    //this.takeDps = function (dps) {
    //    hud.health -= dps;
    //}

    this.healDps = function (dps) {
        var newHp = hud.health + dps;
        if (newHp > Constants.PLAYER_MAX_HP)
            newHp = Constants.PLAYER_MAX_HP;

        hud.health = newHp;
    }

    this.isSameDirection = function (otherShape) {
        var isRaft = that.shape.name;
        //var triz = this.shape.w /2;
        var res = otherShape.x >= this.shape.x && this.direction == "R"
                || otherShape.x <= this.shape.x && this.direction == "L"
                || (isRaft && (otherShape.x + otherShape.w) >= this.shape.x && otherShape.x <= (this.shape.x + this.shape.w))

        console.log("res: " + res);
        //console.log("this.x - otherShape.x: " + (this.shape.x - otherShape.x) + " <= " + triz + "?");
        return res;
    }

    this.castSpell = function (attackId) {
        //alert(attackId);
        switch (attackId) {
            case 1: //earth, fix boat
                var dps = 1;
                cast(function () {
                    that.healDps(dps);
                }, 0, null, this);
                break;
            case 2: //air, get fish
                //castGetFish();
                cast(function () { getFish() }, 0, null, this);
                ;
                break;
            case 3: //fire, attack shark
                //attackShark
                var dps = 1;
                cast(function () { attackShark(dps); }, 0, null, this);
                ;
                break;
            default:
                ;
        }
    }

    this.isCasting = false;

    var that = this;

    function gen(parentShape) {
        //ctx.fillRect(166, 240, 85, 130);
        var mageW = 85;
        var mageH = 130;
        var parentCenter = Math.floor(parentShape.w / 2);
        var mageCenter = Math.floor(mageW / 2);
        var mageX = parentShape.x + parentCenter - mageCenter;

        return new Shape(mageX, parentShape.y - mageH, mageW, mageH, "#038EEF", parentShape.vx, parentShape.vy, "mage")
    }


    //function castGetFish() {
    //    setTimeout(function () { getFish(); }, 0.5 * 1000);
    //}

    function getFish() {
        for (var i = 0; i < shapeList.length; i++) {
            var item = shapeList[i];

            if (item.shape.name.lastIndexOf("fish", 0) === 0) {
                if (magePlayer.isSameDirection(item.shape)) {
                    item.catch();
                    break;
                }
            }

        }
    }

    function attackShark(dps) {
        //get shark to attack
        for (var i = 0; i < shapeList.length; i++) {
            var item = shapeList[i];

            if (item.shape.name.lastIndexOf("shark", 0) === 0) {
                if (magePlayer.isSameDirection(item.shape)) {
                    var newHp = item.takeDps(dps);
                    if (newHp == 0) {
                        item.kill();
                    }
                    break;
                }

            }
        }
    }


}

var Raft = function () {
    this.shape = new Shape(100, 370, 184, 18, "#0000FF", 0, 0, "raft");
    var that = this;
    this.mage = new Mage(this.shape);
    this.spawn = function () {
        shapeList.push(that);
        shapeList.push(that.mage);
        magePlayer = that.mage;
    }

    this.gotHit = function (hitFrom) {
        //console.log('I("' + this.shape.name + '") was hit by "' + hitFrom.shape.name + '"');
    };

    this.hitWith = function (target) {
        //console.log('I("' + this.name + '") just hit "' + target.name + '"');
        target.gotHit(this);
    }

    this.takeDps = function (dps) {
        hud.health -= dps;
        return hud.health;
    }
}

var Shark = function (hp, spawnSide, goesEnrage) {
    if (goesEnrage == undefined || goesEnrage == null) goesEnrage = false;
    if (hp == undefined || hp == null) hp = 3;
    this.health = hp;

    this.attackIntervals = [];
    this.drawBlast = false;
    this.spawnSide = spawnSide;
    this.goesEnrage = goesEnrage;
    this.hasAttacked = false;



    var attack1Dps = 1;
    var _enemy = null;
    var that = this;

    this.shape = gen();

    //OVERRIDE
    this.spawn = function () {
        shapeList.push(that);
        //logEveryFrameX("I just spawned " + shapeList);
    }

    this.gotHit = function (hitFrom) {
        //console.log('I("' + this.shape.name + '") was hit by "' + hitFrom.shape.name + '"');
    };

    this.hitWith = function (target) {
        //console.log('I("' + this.name + '") just hit "' + target.name + '"');
        target.gotHit(this);
        if (target.shape.name == "raft") {
            attack(target, attack1Dps);
        }
    }

    this.takeDps = function (dps) {
        this.drawBlast = true;

        setTimeout(function () {
            that.drawBlast = false;
        }, .5 * 1000);

        //console.log("this.health: " + this.health + "; this.shape.vx: " + this.shape.vx);
        if (this.health == Constants.SHARK_MAX_HP && Math.abs(this.shape.vx) == Constants.SPEED_NORMAL) {
            var signal = 1;
            if (magePlayer.shape.x < that.shape.x)
                signal = -1;

            if (that.goesEnrage)
                this.shape.vx = signal * Constants.SPEED_ENRAGED;
        }

        var newHp = this.health - dps;
        this.health = newHp > 0 ? newHp : 0;
        return this.health;
    }

    this.kill = function () {
        that.shape.vx = 0;
        killListIntervals(that.attackIntervals);

        setTimeout(function () {
            var pos = shapeList.indexOf(that);
            if (pos > 1)
                shapeList.splice(pos, 1);
        }, 1 * 1000);

    }

    function gen() {
        var spawnX, spawnVx, spawnY = null;
        var spanInLeftSide = Math.random() < .5;
        //logEveryFrameX("spanInLeftSide: " + spanInLeftSide);

        if (that != undefined) {
            if (that.spawnSide != undefined && that.spawnSide != null) {
                spanInLeftSide = (spawnSide == "L");
                //console.log("override spawn with spawnInLeft: " + spanInLeftSide);
            }
        }

        if (spanInLeftSide) {
            spawnX = -65;
            spawnVx = Constants.SPEED_NORMAL;
        }
        else {
            spawnX = 700;
            spawnVx = -Constants.SPEED_NORMAL;
        }

        spawnY = 340 + (Math.random() * 5) * 5;

        //bool spanInLeftSide;
        //int delay
        return new Shape(spawnX, spawnY, 150, 65, "#0000FF", spawnVx, 0, "shark" + currentLevel.length);
    }



    function attack(enemy, dps) {
        if (_enemy == null) {
            _enemy = enemy;
            that.shape.vx = 0;

            var attackCastTime = 2 * 1000; //2secs
            var castMethod = function () {
                if (that.health <= 0) {
                    that.kill(); return false;
                }

                console.log(that.shape.name + " is attaking " + enemy.shape.name);
                var isStillCollided = doCollide(that.shape, enemy.shape);
                if (isStillCollided) {
                    enemy.takeDps(dps);
                }
                else {
                    killListIntervals(that.attackIntervals);
                    that.shape.isCollision = false;
                    var signal = 1;
                    if (enemy.shape.x < that.shape.x)
                        signal = -1;

                    that.shape.vx = signal * Constants.SPEED_ENRAGED;
                    _enemy = null;
                    return false;
                }
            };
            //castMethod();

            if (that.health > 0) {
                enemy.takeDps(dps); //call first time
                that.hasAttacked = true;
            }

            cast(castMethod, 1000, attackCastTime, that); //call in loop from second time forward
        }
    }

    //function cast(method, attackCastTime) {
    //    var castDelay = 1000; //1sec

    //    var timeoutMethod = function () {
    //        var intervalId = window.setInterval(method, attackCastTime);
    //        intervals.push(intervalId);
    //    };
    //    setTimeout(timeoutMethod, castDelay);
    //}


}
var Fish = function () {
    this.shape = gen();
    this.isCaught = false;
    var that = this;

    var attack1Dps = 1;
    var _enemy = null;

    //OVERRIDE
    this.spawn = function () {
        shapeList.push(that);

        //logEveryFrameX("I just spawned " + shapeList);
    }

    this.gotHit = function (hitFrom) {
        //console.log('I("' + this.shape.name + '") was hit by "' + hitFrom.shape.name + '"');
    };

    this.hitWith = function (target) {
        //console.log('I("' + this.name + '") just hit "' + target.name + '"');
        target.gotHit(that);
        if (target.shape.name == "raft") {
            //attack(target, attack1Dps);
        } else if (target.shape.name == "mage") {
            if (that.isCaught)
                that.kill();
        }
    }

    this.kill = function () {
        if (this.isCaught) {
            magePlayer.healDps(2);
            fishToEat++;
        }

        var pos = shapeList.indexOf(that);
        if (pos > 1)
            shapeList.splice(pos, 1);


        //console.log("fish killed! isCaught:" + this.isCaught);
    }

    this.catch = function () {
        this.isCaught = true;
    }

    function gen() {
        var spawnX, spawnVy = null;
        var spawnDistance = 10; //distance in px between fish spawns
        spawnVy = -2;
        var spanInLeftSide = Math.random() < .5;

        var randomX = Math.floor(Math.random() * spawnDistance);
        var spawnX = Math.floor(c.width / spawnDistance) * randomX;
        //var spawnX = 20;

        return new Shape(spawnX, 305, 50, 65, "#FFFF00", 0, spawnVy, "fish" + currentLevel.length);
    }

    //function attack(enemy, dps) {
    //    if (_enemy == null) {
    //        _enemy = enemy;
    //        that.shape.vx = 0;

    //        var attackCastTime = 2 * 1000; //2secs
    //        var castMethod = function () {
    //            enemy.takeDps(dps);
    //        };
    //        //castMethod();
    //        cast(castMethod, attackCastTime);
    //    }
    //}
}

function cast(method, castDelay, attackCastTime, iShape) {
    if (castDelay == undefined || castDelay == null)
        castDelay = 0.5 * 1000; //0.5sec

    if (iShape != undefined && iShape != null) {
        if (iShape.isCasting != undefined && iShape.isCasting != null) {
            iShape.isCasting = true;
        }
    }



    var timeoutMethod = function () {
        if (attackCastTime == undefined || attackCastTime == null) {
            method(); //call method
        } else {
            var intervalId = setIntervalGbl(method, attackCastTime);
            if (iShape != undefined && iShape != null) {
                iShape.attackIntervals.push(intervalId);
            }
        }


    };


    setTimeout(function () {
        if (iShape != undefined && iShape != null) {
            if (iShape.isCasting != undefined && iShape.isCasting != null)
                iShape.isCasting = false;
        };
    }, 1000);

    //console.log("timeoutMethod:" + timeoutMethod);
    setTimeout(timeoutMethod, castDelay);
}

/* ---- NAMESPACES (-) ---- */

function ChangeColor(val) {
    if (color == "#FF0000") {
        return "#00FF00";
    } else {
        return "#FF0000";
    }
}

function killListIntervals(list) {
    if (list != null && list != undefined) {
        for (var i = 0; i < list.length; i++) {
            clearIntervalGbl(list[i]);
        }
    }
}

function setIntervalGbl(handler, timeout) {
    var intervalId = window.setInterval(handler, timeout);
    intervals.push(intervalId);
    return intervalId;
}

function clearIntervalGbl(id) {
    if (intervals != undefined && intervals != null) { }
    var pos = intervals.indexOf(id);
    if (pos > 0) {
        intervals.splice(pos, 1);
    }
    window.clearInterval(id);
}


function InitShapes() {

    /*
    var arr = [];
    arr.push(1);
    arr.push(2);
    arr.push(3);
    arr.push(4);
    console.log("arr:" + arr);
    arr.shift();
    console.log("arr.poped; arr: " + arr);
    */

    lvl.init();
    lvl.lvl01(); //INIT level 01;
    //shapeList.push(new Shape(10, 0, 25, 25, "#00FFFF", 1, 1, "sUm"));
    //shapeList.push(new Shape(0, 40, 39, 25, "#00FF00", -1, -1, "sDois"));
    //shapeList.push(new Shape(0, 80, 100, 25, "#0000FF", -1, 1, "sTres"));



    //shapeList.push(new Shape(600, 350, 150, 65, "#0000FF", 1, 0, "shark"));
    //shapeList.push(new Shape(565, 200, 50, 65, "#0000FF", 0, 1, "fish"));

    /*
    var xpto = new Shark();
    xpto.NPC.spawn(null);
    */
}

function updateGame() {
    //logEveryFrameX(Math.random()<.5, 100);
    frameCount++;
    document.getElementById("lblMsg").innerText = xpto;
    var ctx = c.getContext("2d");
    ctx.globalAlpha = opacity;
    ctx.clearRect(0, 0, c.width, c.height);

    if (hud.health <= 0) {
        funcStopLoop(intervals[0]);
        clearExtraIntervals(intervals);
        currentLevel = null;
        var playAgain = confirm("Game Over! You survived " + currentSeconds() + " seconds!")
        if (playAgain)
            gameInit();
        else {
            clearExtraIntervals(intervals);
            funcStopLoop(intervals[0]);
        }
        //console.log("Game Over!");
    }

    //START LOGIC:
    if (currentLevel != null) {
        while (currentLevel.length > 0
                && currentLevel[0].spawnTime <= currentSeconds()) {
            var event = currentLevel.shift().event;
            event.spawn(null);
        }
    }

    /*
    var imgBg = new Image();
    imgBg.src = "thumb01.png";
    imgBg.onload = function () {
        ctx.drawImage(imgBg, 0, 0);
    }
    */

    for (var i in shapeList) {
        shapeList[i].shape.isCollision = false; //reset collision;
        var iShape = moveShape(shapeList[i], c);
        if (iShape != null) {
            currShape = iShape.shape;

            ctx.fillStyle = getFill(currShape);
            ctx.fillRect(currShape.x, currShape.y, currShape.w, currShape.h);
            write(iShape);

            //if (iShape.shape.name == "mage") {

            //}
        }
    }


    /*
    var newXpto = xpto++;
    ctx.fillStyle = color;
    if (xpto > 480)
    {
        color = ChangeColor(xpto);
        xpto = -1;
    }
    ctx.fillRect(0, 0, xpto++, 75);
    */

    debug()

}

function debug() {
    //var ctx = c.getContext("2d");
    //ctx.globalAlpha = 0.5;
    //ctx.fillStyle = "Green";
    //ctx.fillRect(0, 220, c.width, 60);

    //mage
    //ctx.fillRect(166, 240, 85, 130);

    //ctx.globalAlpha = 1;
}

function drawBlast(x, y) {
    //var ctx = c.getContext("2d");
    //ctx.fillStyle = "White";
    //ctx.fillText("BLAST!!!", x + 40, y + 20);

    //return;
    var radius = 80;
    var context = c.getContext("2d");
    context.beginPath();
    context.arc(x, y, radius, Math.PI, 2 * Math.PI, false);
    context.fillStyle = '#FFA500';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#FF8C00';
    context.stroke();
}

function moveShape(iShape, canvas) {
    var speed = 1; //Math.random() * 2;
    var shape = iShape.shape;
    var isRaft = (shape.name == "raft");

    if (shape.name.lastIndexOf("fish", 0) === 0) {
        var playerMiddleX = this.magePlayer.shape.x + (this.magePlayer.shape.w / 2);
        var playerMiddleY = this.magePlayer.shape.y + (this.magePlayer.shape.h / 2);

        var diff = shape.x - playerMiddleX;
        //console.log("shape.y " + shape.y + "; playerMiddleY: " + playerMiddleY);
        if (iShape.isCaught) {
            var speedCaught = 14;
            if (Math.abs(shape.x - playerMiddleX) <= speedCaught + 5 && shape.y <= playerMiddleY) {
                //iShape.kill();
            }
            else {

                var signalY = this.magePlayer.shape.y < shape.y ? -1 : 1;
                shape.vy = signalY * speedCaught;

                var signalX = playerMiddleX < shape.x ? -1 : 1;
                shape.vx = signalX * speedCaught;
            }
        } else if ((shape.y) <= 220)
            shape.vy *= -1;
        else if ((shape.y) >= 320 && shape.vy > 0) {
            iShape.kill();
            return null;
        }
    } else if (isRaft) {
        shape.vx = this.magePlayer.shape.vx;
    }

    var isRaftOrMage = isRaft || shape.name == "mage";
    var movedShape = clippedMoveTo(iShape, isRaftOrMage);

    //check X boundaries
    //if (!isWithinXCanvas(movedShape, canvas)) {
    //    shape.vx = 0;
    //    movedShape.x = shape.x + speed * (shape.vx);
    //}

    ////check Y boundaries
    //if (!isWithinYCanvas(movedShape, canvas)) {
    //    shape.vy = 0;
    //    movedShape.y = shape.y + speed * (shape.vy);
    //}

    shape.x = movedShape.x;
    shape.y = movedShape.y;


    var currShapeIndex = shapeList.indexOf(iShape);
    //for each shape that has already been moved (before currIndex), check if this move colides!
    for (var i = 0; i < currShapeIndex; i++) {
        var colided = doCollide(shape, shapeList[i].shape);
        shape.isCollision |= colided;

        if (colided) {
            iShape.hitWith(shapeList[i]);
            //console.log("'" + shape.name + "' colidede with '" + shapeList[i].shape.name+ "'");
        }

        //if (flag)
        //    logEveryFrameX("checking coll between '"+shape.name+"' and '"+shapeList[i].name+"'");

        //if (shape.isCollision)
        //  logEveryFrameX("'" + shape.name + "' colided with '" + shapeList[i].name + "'");
    }

    //logEveryFrameX("name: " + shape.name + "; x:" + shape.x + "; y:" + shape.y, 100);
    iShape.shape = shape;
    return iShape;
}

function clippedMoveTo(iShape, forceClipping) {
    var speed = 1;
    var calculateNextPos = function (s) {
        return new Shape(s.x + speed * (s.vx),
            s.y + speed * (s.vy),
            s.w, s.h, s.fill, s.vx, s.vy, s.name);
    };

    if (forceClipping) {
        var clipShape = function (notClipped, toClip) {
            if (toClip == undefined)
                toClip = notClipped;

            var xDiff = 0;
            if (notClipped.x < 0) {
                xDiff = notClipped.x - 0;
                var newX = toClip.x + xDiff;
                var raftMin = -(notClipped.x - toClip.x);
                if (newX < raftMin && toClip.name == "raft") {
                    newX = raftMin;
                } else if (newX < 0 && toClip.name == "mage") {
                    newX = 0;
                }

                toClip.x = newX;
            } else if (notClipped.x + notClipped.w > canvas.width) {
                xDiff = canvas.width - (notClipped.w + notClipped.x);
                toClip.x = toClip.x + xDiff;
            }
            return toClip;
        };

        var clipped = null;
        if (iShape.shape.name == "raft") {
            var playerNextPos = calculateNextPos(this.magePlayer.shape);
            var raftNextPos = calculateNextPos(iShape.shape);
            clipped = clipShape(playerNextPos, raftNextPos);
        } else {
            var shapeNextPos = calculateNextPos(iShape.shape);
            clipped = clipShape(shapeNextPos);
        }
        return clipped;
    } else {
        return calculateNextPos(iShape.shape);
    }
}

function doCollide(s1, s2) {

    if (s1.x < s2.x + s2.w &&
        s1.x + s1.w > s2.x &&
        s1.y < s2.y + s2.h &&
        s1.h + s1.y > s2.y) {
        return true;
    }
    return false;


    var xd = s1.x - s2.x;
    var yd = s1.y - s2.y;
    var wt = s2.w + s1.w;

    var c = document.getElementById('canvas');
    var context = c.getContext("2d");
    context.beginPath();
    context.moveTo(xd, yd);
    context.lineTo(yd, wt);
    context.lineTo(wt, xd);
    context.stroke();

    //context.fillStyle = "#B97A57";
    //context.fillRect(xd, yd, wt, s1.h + s2.h);


    return (xd * xd + yd * yd <= wt * wt);
}

function drawGame() {
    hud.draw();
}


function getFill(shape) {
    if (shape.isCollision && false) {
        return "#FF0000";
    }
    else {
        return shape.fill;
    }
}

function lvlEvent(spawnTime, event) {
    this.spawnTime = spawnTime;
    this.event = event;
}

function Shape(x, y, w, h, fill, vx, vy, name) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
    this.vx = vx;
    this.vy = vy;
    this.name = name;
    this.isCollision = false;
    this.ignoreRightBottomCanvas = true;
}

function write(iShape) {
    var shape = iShape.shape;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "Red";
    ctx.fillText(shape.name, shape.x, shape.y);

    if (shape.name.lastIndexOf("shark", 0) === 0) {
        ctx.fillStyle = "White";
        ctx.fillText(iShape.health, shape.x + 40, shape.y + 20);

        //console.log(iShape.drawBlast);
        if (iShape.drawBlast) {
            drawBlast(shape.x + shape.w / 2, shape.y + 20);
        }

        Draw.shark(ctx, iShape); // 100.000000, 1000.000000);

    } else if (iShape.shape.name == "mage") {

        Draw.mage(ctx, iShape);

        if (true) {; }
        else if (this.magePlayer.direction == "R") {
            ctx.fillText("=>", shape.x + (shape.w / 2) - 15, shape.y + 30)
        } else {
            ctx.fillText("<=", shape.x + (shape.w / 2) - 15, shape.y + 30)
        }
    }
}

function logPos(shape, logIt) {
    var msg = "name:" + shape.name + " x: " + shape.x + "; y: " + shape.y;
    if (logIt)
        console.log(msg);
    return msg;
}

function Hud(hp, str) {
    if (hp == undefined) {
        hp = Constants.PLAYER_MAX_HP;
    }
    if (str == undefined)
        str = 10;

    //this.init = function () {
    //        strength = 10;
    //        draftHealth = 6;
    //}
    this.strength = str;
    this.health = hp;
    this.draw = function () {
        var ctx = c.getContext("2d");
        ctx.font = '15pt Verdana';
        ctx.fillStyle = "Black";
        var hpTxt = "Health:     " + this.health;
        var strengthTxt = "Strength: " + this.strength;




        var y = 30;
        ctx.fillText(hpTxt, 10, y);
        //ctx.fillText(strengthTxt, 10, y + 25);



        ctx.fillText("Time: " + currentSeconds(), c.width - 130, y);

        if (magePlayer != null && magePlayer != undefined) {
            //ctx.fillText("IsCasting: " + magePlayer.isCasting, 10, y + 2 * 25);
            var direction = "->";
            if (magePlayer.direction == "L")
                direction = "<-";

            //ctx.fillText("SIDE: " + direction, 10, y + 3 * 25);
        }
        //debugHud(this);

    }

    function debugHud(obj) {
        var ctx = c.getContext("2d");
        ctx.fillText("FishToEat: " + fishToEat, 10, obj.y + 2 * 25);

        if (magePlayer != null && magePlayer != undefined) {
            var direction = "->";
            if (magePlayer.direction == "L")
                direction = "<-";

            //ctx.fillText("SIDE: " + direction, 10, obj.y + 3 * 25);
        }


    }

    //this.updateHud = function(hp, str) {
    //    if(hp != undefined && hp != null){
    //        this.drafthealth = hp;
    //    }
    //    if(str != undefined && str != null)
    //        strength = str;
    //};

    //function updateHud(hp, str) {
    //    if (hp != undefined && hp != null)
    //        draftHealth = hp;
    //    if (str != undefined && str != null)
    //        strength = str;
    //}
}

function isWithinXCanvas(shape, canvas) {
    //logEveryFrameX("X:{0}; x >= 0?: {1}; x <= canvas.width({2}): {3}".format(shape.x, thi, shape.y, canvas.height));
    return shape.ignoreRightBottomCanvas || (shape.x >= 0 && shape.x + shape.w <= canvas.width);
}

function isWithinYCanvas(shape, canvas) {
    return shape.ignoreRightBottomCanvas || (shape.y >= 0 && shape.y + shape.h <= canvas.height);
}

function isWithinCanvas(shape, canvas) {
    return isWithinXCanvas(shape, canvas) && isWithinYCanvas(shape, canvas);
}



var mainloop = function () {
    updateGame();
    drawGame();

    //if (this.magePlayer != undefined) {
    //    var msg = logPos(shapeList.length, false);
    //    logEveryFrameX(msg, 100);
    //}
};

var animFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        null;



function funcStopLoop(loop2) {
    if (animFrame !== null) {
        console.log('TODO');
    } else {
        clearIntervalGbl(loop2);
        //console.log(loop2);
    }
}

function logEveryFrameX(val, frameX) {
    if (frameCount % frameX == 0 || frameCount == 1 || frameX == undefined) {
        console.log(val);
    }
}

function currentSeconds(now) {
    if (now == undefined)
        now = new Date(Date.now());

    return new Date((now - startTime)).getSeconds();
}


function vectorize(shape, originalX) {

    var isRightSide;
    if (shape.name == "mage") {
        isRightSide = !(this.magePlayer.direction == "R");
    } else {
        isRightSide = (shape.x < magePlayer.shape.x);
    }

    if (isRightSide) {
        return { scaleHoriz: -1, moveHoriz: shape.w + Math.abs(originalX) };
    } else {//if (shape.x < magePlayer.shape.x) {
        return { scaleHoriz: 1, moveHoriz: originalX };
    }
}


function ctxtransform(var1, var2, var3, var4, var5, var6, ctx, shape) {
    ctxTransform(var1, var2, var3, var4, var5, var6, ctx, shape);
}


function ctxTransform(var1, var2, var3, var4, var5, var6, ctx, shape) {
    var fix = { x: 0, y: 0 };
    var aux = vectorize(shape, var5);

    if (shape.name.lastIndexOf("shark", 0) === 0) {
        fix.y = -(shape.h / 2);
    }

    var auxX = shape.x + aux.moveHoriz + fix.x;
    var auxY = var6 + shape.y + fix.y;// - (shape.h / 2);

    ctx.transform(var1 * aux.scaleHoriz, var2, var3, var4, auxX, auxY);
}

var Draw = {
    shark: function (ctx, iShape) {
        if (Math.abs(iShape.shape.vx) > 1 || iShape.goesEnrage || iShape.hasAttacked) {
            this.sharkAttacking(ctx, iShape.shape);
            iShape.hasAttacked = true;
        } else {
            this.sharkSwimming(ctx, iShape.shape);
        }
    },

    mage: function (ctx, iShape) {
        if (iShape.isCasting)
            this.mageCasting(ctx, iShape.shape);
        else
            this.mageStanding(ctx, iShape.shape);
    },

    sharkSwimming: function (ctx, shape) {
        // #g3210
        ctx.save();
        ctxtransform(1.250000, 0.000000, 0.000000, -1.250000, 0.000000, 71.448000, ctx, shape);

        // #g3212
        ctx.save();
        ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -184.143000, -450.698600);

        // #g3214
        ctx.save();
        ctx.beginPath();

        // #path3218
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3220
        ctx.fillStyle = 'rgb(58, 72, 82)';
        ctx.beginPath();
        ctx.moveTo(261.133000, 507.857000);
        ctx.lineTo(267.132000, 507.857000);
        ctx.bezierCurveTo(263.398000, 497.260000, 257.139000, 489.187000, 254.134000, 477.861000);
        ctx.bezierCurveTo(252.711000, 484.402000, 260.598000, 496.832000, 264.133000, 504.857000);
        ctx.bezierCurveTo(263.971000, 506.029000, 262.310000, 505.701000, 261.133000, 505.857000);
        ctx.lineTo(257.134000, 505.857000);
        ctx.bezierCurveTo(256.418000, 508.572000, 261.849000, 505.142000, 261.133000, 507.857000);
        ctx.fill();

        // #path3222
        ctx.fillStyle = 'rgb(62, 153, 188)';
        ctx.beginPath();
        ctx.moveTo(257.134000, 505.857000);
        ctx.lineTo(261.133000, 505.857000);
        ctx.bezierCurveTo(248.045000, 496.108000, 230.596000, 493.387000, 216.139000, 483.860000);
        ctx.bezierCurveTo(216.433000, 485.899000, 218.844000, 485.821000, 219.139000, 487.859000);
        ctx.bezierCurveTo(229.240000, 495.089000, 242.000000, 499.661000, 254.134000, 504.857000);
        ctx.bezierCurveTo(254.295000, 506.029000, 255.957000, 505.701000, 257.134000, 505.857000);
        ctx.fill();

        // #path3224
        ctx.fillStyle = 'rgb(58, 72, 82)';
        ctx.beginPath();
        ctx.moveTo(226.138000, 450.864000);
        ctx.bezierCurveTo(210.750000, 450.475000, 195.898000, 450.621000, 184.143000, 453.864000);
        ctx.bezierCurveTo(197.748000, 480.587000, 223.146000, 495.517000, 254.134000, 504.857000);
        ctx.bezierCurveTo(242.000000, 499.661000, 229.240000, 495.089000, 219.139000, 487.859000);
        ctx.bezierCurveTo(206.270000, 479.064000, 193.523000, 470.146000, 186.143000, 455.863000);
        ctx.bezierCurveTo(195.077000, 464.594000, 202.712000, 474.623000, 213.139000, 481.860000);
        ctx.bezierCurveTo(210.102000, 472.227000, 194.641000, 466.367000, 190.142000, 454.864000);
        ctx.bezierCurveTo(200.098000, 451.488000, 215.213000, 453.271000, 226.138000, 450.864000);
        ctx.fill();

        // #path3226
        ctx.fillStyle = 'rgb(46, 108, 143)';
        ctx.beginPath();
        ctx.moveTo(226.138000, 450.864000);
        ctx.bezierCurveTo(215.213000, 453.271000, 200.098000, 451.488000, 190.142000, 454.864000);
        ctx.bezierCurveTo(194.641000, 466.367000, 210.102000, 472.227000, 213.139000, 481.860000);
        ctx.bezierCurveTo(202.712000, 474.623000, 195.077000, 464.594000, 186.143000, 455.863000);
        ctx.bezierCurveTo(193.523000, 470.146000, 206.270000, 479.064000, 219.139000, 487.859000);
        ctx.bezierCurveTo(218.844000, 485.821000, 216.433000, 485.899000, 216.139000, 483.860000);
        ctx.bezierCurveTo(230.596000, 493.387000, 248.045000, 496.108000, 261.133000, 505.857000);
        ctx.bezierCurveTo(262.310000, 505.701000, 263.971000, 506.029000, 264.133000, 504.857000);
        ctx.bezierCurveTo(260.598000, 496.832000, 252.711000, 484.402000, 254.134000, 477.861000);
        ctx.bezierCurveTo(251.874000, 469.789000, 249.450000, 461.881000, 249.135000, 451.864000);
        ctx.bezierCurveTo(240.669000, 452.331000, 234.914000, 450.086000, 226.138000, 450.864000);
        ctx.fill();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    sharkAttacking: function (ctx, shape) {
        // #g3166
        ctx.save();
        ctxtransform(1.250000, 0.000000, 0.000000, -1.250000, -606.044710, 418.414910, ctx, shape);

        // #g3168
        ctx.save();
        ctx.transform(0.592406, 0.000000, 0.000000, 0.539200, 197.616240, 117.973580);

        // #g3170
        ctx.save();
        ctx.beginPath();

        // #path3174
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3176
        ctx.fillStyle = 'rgb(112, 87, 101)';
        ctx.beginPath();
        ctx.moveTo(570.989000, 373.003000);
        ctx.bezierCurveTo(571.291000, 375.638000, 569.604000, 376.285000, 566.989000, 376.003000);
        ctx.bezierCurveTo(565.985000, 372.666000, 568.377000, 372.725000, 570.989000, 373.003000);
        ctx.moveTo(561.990000, 380.003000);
        ctx.bezierCurveTo(567.116000, 379.129000, 572.473000, 378.487000, 571.989000, 372.004000);
        ctx.bezierCurveTo(566.279000, 369.268000, 562.463000, 374.453000, 561.990000, 380.003000);
        ctx.fill();

        // #path3178
        ctx.fillStyle = 'rgb(90, 58, 71)';
        ctx.beginPath();
        ctx.moveTo(566.989000, 376.003000);
        ctx.bezierCurveTo(569.604000, 376.285000, 571.291000, 375.638000, 570.989000, 373.003000);
        ctx.bezierCurveTo(568.377000, 372.725000, 565.985000, 372.666000, 566.989000, 376.003000);
        ctx.fill();

        // #path3180
        ctx.fillStyle = 'rgb(211, 210, 216)';
        ctx.beginPath();
        ctx.moveTo(615.983000, 366.004000);
        ctx.bezierCurveTo(613.614000, 362.226000, 603.497000, 365.525000, 600.985000, 368.004000);
        ctx.bezierCurveTo(605.612000, 370.547000, 612.552000, 367.876000, 615.983000, 366.004000);
        ctx.fill();

        // #path3182
        ctx.fillStyle = 'rgb(90, 58, 71)';
        ctx.beginPath();
        ctx.moveTo(531.994000, 344.007000);
        ctx.bezierCurveTo(534.205000, 343.218000, 534.496000, 340.510000, 535.993000, 339.008000);
        ctx.bezierCurveTo(538.069000, 339.599000, 539.402000, 340.932000, 539.993000, 343.007000);
        ctx.bezierCurveTo(542.299000, 343.313000, 541.104000, 340.119000, 542.992000, 340.008000);
        ctx.bezierCurveTo(546.290000, 340.043000, 546.814000, 342.851000, 546.992000, 346.007000);
        ctx.bezierCurveTo(553.846000, 341.633000, 555.441000, 350.508000, 561.990000, 352.006000);
        ctx.bezierCurveTo(561.201000, 358.795000, 563.113000, 362.882000, 564.990000, 367.004000);
        ctx.bezierCurveTo(564.744000, 345.250000, 558.558000, 320.778000, 546.992000, 307.012000);
        ctx.bezierCurveTo(544.176000, 309.725000, 538.033000, 312.151000, 534.994000, 309.012000);
        ctx.bezierCurveTo(533.217000, 310.234000, 534.789000, 314.807000, 529.994000, 313.011000);
        ctx.bezierCurveTo(535.501000, 321.485000, 533.229000, 332.479000, 531.994000, 344.007000);
        ctx.fill();

        // #path3184
        ctx.fillStyle = 'rgb(155, 154, 169)';
        ctx.beginPath();
        ctx.moveTo(560.990000, 330.009000);
        ctx.bezierCurveTo(562.840000, 330.160000, 561.604000, 333.395000, 562.990000, 334.008000);
        ctx.bezierCurveTo(565.116000, 331.165000, 564.494000, 322.543000, 559.990000, 323.010000);
        ctx.bezierCurveTo(559.266000, 326.068000, 561.716000, 325.951000, 560.990000, 329.009000);
        ctx.lineTo(560.990000, 330.009000);
        ctx.closePath();
        ctx.fill();

        // #path3186
        ctx.fillStyle = 'rgb(211, 210, 216)';
        ctx.beginPath();
        ctx.moveTo(537.993000, 272.017000);
        ctx.bezierCurveTo(539.476000, 274.571000, 545.488000, 277.802000, 543.992000, 280.016000);
        ctx.bezierCurveTo(542.274000, 277.695000, 535.698000, 275.029000, 537.993000, 272.017000);
        ctx.moveTo(528.994000, 315.011000);
        ctx.lineTo(527.994000, 315.011000);
        ctx.bezierCurveTo(527.746000, 309.278000, 520.752000, 310.108000, 517.996000, 312.011000);
        ctx.bezierCurveTo(518.809000, 306.949000, 518.516000, 306.968000, 515.996000, 304.012000);
        ctx.bezierCurveTo(520.607000, 300.625000, 527.780000, 299.798000, 530.994000, 295.014000);
        ctx.bezierCurveTo(526.232000, 288.443000, 525.614000, 277.729000, 524.995000, 267.017000);
        ctx.bezierCurveTo(536.680000, 269.907000, 544.416000, 288.008000, 554.991000, 290.014000);
        ctx.bezierCurveTo(567.378000, 292.364000, 572.019000, 282.629000, 578.988000, 275.016000);
        ctx.bezierCurveTo(588.183000, 264.973000, 600.373000, 260.541000, 612.984000, 258.018000);
        ctx.bezierCurveTo(608.843000, 268.875000, 598.646000, 273.676000, 597.985000, 288.015000);
        ctx.bezierCurveTo(611.826000, 292.316000, 626.720000, 300.248000, 637.980000, 308.012000);
        ctx.bezierCurveTo(642.130000, 310.873000, 642.894000, 315.257000, 647.979000, 316.011000);
        ctx.bezierCurveTo(652.922000, 316.743000, 658.241000, 310.503000, 662.978000, 316.011000);
        ctx.bezierCurveTo(645.193000, 318.198000, 660.794000, 335.470000, 659.979000, 343.007000);
        ctx.bezierCurveTo(651.095000, 338.559000, 646.804000, 329.518000, 643.980000, 319.010000);
        ctx.bezierCurveTo(634.669000, 319.790000, 627.129000, 310.238000, 616.983000, 315.011000);
        ctx.bezierCurveTo(613.342000, 316.724000, 602.814000, 334.589000, 602.985000, 337.008000);
        ctx.bezierCurveTo(603.813000, 348.703000, 622.399000, 345.867000, 630.981000, 352.006000);
        ctx.bezierCurveTo(625.311000, 353.785000, 622.400000, 357.445000, 616.983000, 359.005000);
        ctx.bezierCurveTo(607.635000, 361.698000, 594.438000, 357.762000, 585.987000, 362.005000);
        ctx.bezierCurveTo(580.423000, 364.798000, 577.818000, 374.529000, 573.988000, 378.003000);
        ctx.bezierCurveTo(555.840000, 394.463000, 518.682000, 404.259000, 487.000000, 399.000000);
        ctx.bezierCurveTo(487.857000, 378.194000, 502.554000, 371.226000, 512.996000, 360.005000);
        ctx.bezierCurveTo(512.194000, 357.684000, 509.793000, 354.328000, 511.996000, 352.006000);
        ctx.bezierCurveTo(515.654000, 352.247000, 519.250000, 346.478000, 522.995000, 352.006000);
        ctx.bezierCurveTo(522.676000, 349.688000, 523.156000, 348.167000, 523.995000, 347.007000);
        ctx.bezierCurveTo(527.136000, 345.343000, 528.081000, 350.726000, 528.994000, 348.007000);
        ctx.bezierCurveTo(529.342000, 336.260000, 533.824000, 327.701000, 529.994000, 317.011000);
        ctx.bezierCurveTo(529.771000, 316.235000, 529.967000, 315.039000, 528.994000, 315.011000);
        ctx.moveTo(489.999000, 402.000000);
        ctx.lineTo(515.996000, 402.000000);
        ctx.bezierCurveTo(537.180000, 398.000000, 562.875000, 390.890000, 575.988000, 378.003000);
        ctx.bezierCurveTo(579.295000, 374.754000, 582.191000, 365.590000, 587.987000, 363.005000);
        ctx.bezierCurveTo(602.531000, 356.517000, 622.567000, 366.734000, 632.981000, 350.006000);
        ctx.bezierCurveTo(623.731000, 345.406000, 606.715000, 347.967000, 604.984000, 338.008000);
        ctx.bezierCurveTo(604.376000, 334.503000, 613.885000, 317.582000, 617.983000, 316.011000);
        ctx.bezierCurveTo(621.240000, 314.762000, 627.181000, 315.417000, 629.981000, 316.011000);
        ctx.bezierCurveTo(637.266000, 317.557000, 638.732000, 326.186000, 643.980000, 320.010000);
        ctx.bezierCurveTo(645.262000, 333.060000, 651.108000, 341.545000, 662.978000, 344.007000);
        ctx.bezierCurveTo(660.118000, 333.397000, 647.592000, 319.502000, 664.978000, 316.011000);
        ctx.lineTo(664.978000, 315.011000);
        ctx.bezierCurveTo(660.460000, 309.768000, 650.248000, 315.976000, 644.979000, 314.011000);
        ctx.bezierCurveTo(639.410000, 311.934000, 641.705000, 308.742000, 638.980000, 304.012000);
        ctx.bezierCurveTo(627.872000, 306.946000, 615.014000, 287.475000, 599.985000, 285.015000);
        ctx.bezierCurveTo(602.221000, 272.252000, 612.023000, 267.057000, 615.983000, 256.019000);
        ctx.lineTo(609.984000, 256.019000);
        ctx.bezierCurveTo(604.647000, 259.452000, 593.737000, 261.453000, 586.987000, 266.017000);
        ctx.bezierCurveTo(578.655000, 271.651000, 575.755000, 281.867000, 568.989000, 285.015000);
        ctx.bezierCurveTo(567.019000, 285.932000, 555.041000, 287.879000, 552.991000, 287.015000);
        ctx.bezierCurveTo(549.460000, 285.525000, 549.866000, 281.634000, 546.992000, 278.016000);
        ctx.bezierCurveTo(540.699000, 270.094000, 534.895000, 268.483000, 523.995000, 266.017000);
        ctx.bezierCurveTo(522.609000, 275.387000, 526.109000, 287.667000, 528.994000, 296.014000);
        ctx.bezierCurveTo(520.232000, 299.623000, 509.485000, 303.299000, 517.996000, 314.011000);
        ctx.bezierCurveTo(521.704000, 314.719000, 522.287000, 312.303000, 525.995000, 313.011000);
        ctx.bezierCurveTo(532.456000, 321.731000, 529.838000, 333.095000, 527.994000, 345.007000);
        ctx.bezierCurveTo(519.533000, 346.023000, 517.161000, 348.924000, 510.997000, 350.006000);
        ctx.bezierCurveTo(517.555000, 366.688000, 487.542000, 371.415000, 485.000000, 384.002000);
        ctx.bezierCurveTo(484.468000, 386.635000, 485.005000, 400.893000, 489.999000, 402.000000);
        ctx.fill();

        // #path3188
        ctx.fillStyle = 'rgb(155, 154, 169)';
        ctx.beginPath();
        ctx.moveTo(535.993000, 308.012000);
        ctx.bezierCurveTo(538.613000, 307.827000, 540.154000, 302.208000, 541.993000, 307.012000);
        ctx.bezierCurveTo(543.218000, 304.888000, 544.337000, 299.651000, 542.992000, 298.013000);
        ctx.bezierCurveTo(535.470000, 298.822000, 530.902000, 302.587000, 522.995000, 303.012000);
        ctx.bezierCurveTo(524.691000, 299.376000, 530.723000, 300.075000, 531.994000, 296.014000);
        ctx.bezierCurveTo(528.502000, 288.506000, 526.373000, 279.637000, 525.995000, 269.017000);
        ctx.bezierCurveTo(535.651000, 273.691000, 541.012000, 282.662000, 549.992000, 288.015000);
        ctx.bezierCurveTo(549.645000, 292.333000, 542.340000, 289.695000, 541.993000, 294.014000);
        ctx.bezierCurveTo(552.344000, 290.502000, 561.381000, 294.787000, 568.989000, 291.014000);
        ctx.bezierCurveTo(573.101000, 288.975000, 574.772000, 281.533000, 577.988000, 278.016000);
        ctx.bezierCurveTo(586.258000, 268.970000, 596.559000, 264.152000, 608.984000, 260.018000);
        ctx.bezierCurveTo(603.503000, 267.544000, 589.969000, 267.805000, 582.987000, 277.016000);
        ctx.bezierCurveTo(577.857000, 283.785000, 576.969000, 291.926000, 571.989000, 299.013000);
        ctx.bezierCurveTo(576.251000, 300.264000, 589.844000, 294.456000, 593.986000, 289.014000);
        ctx.bezierCurveTo(609.898000, 292.512000, 624.592000, 301.657000, 636.980000, 310.012000);
        ctx.bezierCurveTo(642.811000, 313.943000, 647.509000, 319.893000, 657.979000, 315.011000);
        ctx.bezierCurveTo(649.911000, 319.032000, 653.744000, 331.499000, 658.979000, 340.008000);
        ctx.bezierCurveTo(649.160000, 337.161000, 648.446000, 325.209000, 643.980000, 317.011000);
        ctx.bezierCurveTo(634.261000, 318.075000, 626.039000, 309.066000, 615.983000, 314.011000);
        ctx.bezierCurveTo(613.616000, 315.175000, 602.188000, 332.096000, 601.985000, 335.008000);
        ctx.bezierCurveTo(601.170000, 346.685000, 615.723000, 349.357000, 628.981000, 351.006000);
        ctx.bezierCurveTo(619.368000, 357.707000, 608.296000, 359.202000, 595.986000, 360.005000);
        ctx.bezierCurveTo(579.623000, 361.073000, 580.176000, 371.868000, 570.989000, 379.003000);
        ctx.bezierCurveTo(555.777000, 390.818000, 531.599000, 394.225000, 506.997000, 396.001000);
        ctx.bezierCurveTo(502.586000, 396.319000, 494.406000, 398.581000, 489.999000, 395.001000);
        ctx.bezierCurveTo(492.349000, 367.521000, 539.216000, 340.479000, 559.990000, 365.005000);
        ctx.bezierCurveTo(561.348000, 364.695000, 560.820000, 362.501000, 560.990000, 361.005000);
        ctx.lineTo(560.990000, 360.005000);
        ctx.bezierCurveTo(559.116000, 355.903000, 556.385000, 348.884000, 551.991000, 353.006000);
        ctx.bezierCurveTo(550.614000, 351.717000, 551.002000, 348.663000, 550.991000, 346.007000);
        ctx.bezierCurveTo(548.634000, 346.315000, 549.131000, 349.479000, 545.992000, 349.007000);
        ctx.bezierCurveTo(544.635000, 348.697000, 545.163000, 346.503000, 544.992000, 345.007000);
        ctx.lineTo(544.992000, 343.007000);
        ctx.bezierCurveTo(541.324000, 344.705000, 538.422000, 347.954000, 536.993000, 342.007000);
        ctx.bezierCurveTo(536.184000, 342.198000, 535.997000, 343.011000, 534.994000, 343.007000);
        ctx.bezierCurveTo(533.989000, 344.336000, 534.048000, 346.728000, 531.994000, 347.007000);
        ctx.bezierCurveTo(528.535000, 337.582000, 536.983000, 324.494000, 529.994000, 317.011000);
        ctx.bezierCurveTo(533.824000, 327.701000, 529.342000, 336.260000, 528.994000, 348.007000);
        ctx.bezierCurveTo(528.081000, 350.726000, 527.136000, 345.343000, 523.995000, 347.007000);
        ctx.bezierCurveTo(523.156000, 348.167000, 522.676000, 349.688000, 522.995000, 352.006000);
        ctx.bezierCurveTo(519.250000, 346.478000, 515.654000, 352.247000, 511.996000, 352.006000);
        ctx.bezierCurveTo(509.793000, 354.328000, 512.194000, 357.684000, 512.996000, 360.005000);
        ctx.bezierCurveTo(502.554000, 371.226000, 487.857000, 378.194000, 487.000000, 399.000000);
        ctx.bezierCurveTo(518.682000, 404.259000, 555.840000, 394.463000, 573.988000, 378.003000);
        ctx.bezierCurveTo(577.818000, 374.529000, 580.423000, 364.798000, 585.987000, 362.005000);
        ctx.bezierCurveTo(594.438000, 357.762000, 607.635000, 361.698000, 616.983000, 359.005000);
        ctx.bezierCurveTo(622.400000, 357.445000, 625.311000, 353.785000, 630.981000, 352.006000);
        ctx.bezierCurveTo(622.399000, 345.867000, 603.813000, 348.703000, 602.985000, 337.008000);
        ctx.bezierCurveTo(602.814000, 334.589000, 613.342000, 316.724000, 616.983000, 315.011000);
        ctx.bezierCurveTo(627.129000, 310.238000, 634.669000, 319.790000, 643.980000, 319.010000);
        ctx.bezierCurveTo(646.804000, 329.518000, 651.095000, 338.559000, 659.979000, 343.007000);
        ctx.bezierCurveTo(660.794000, 335.470000, 645.193000, 318.198000, 662.978000, 316.011000);
        ctx.bezierCurveTo(658.241000, 310.503000, 652.922000, 316.743000, 647.979000, 316.011000);
        ctx.bezierCurveTo(642.894000, 315.257000, 642.130000, 310.873000, 637.980000, 308.012000);
        ctx.bezierCurveTo(626.720000, 300.248000, 611.826000, 292.316000, 597.985000, 288.015000);
        ctx.bezierCurveTo(598.646000, 273.676000, 608.843000, 268.875000, 612.984000, 258.018000);
        ctx.bezierCurveTo(600.373000, 260.541000, 588.183000, 264.973000, 578.988000, 275.016000);
        ctx.bezierCurveTo(572.019000, 282.629000, 567.378000, 292.364000, 554.991000, 290.014000);
        ctx.bezierCurveTo(544.416000, 288.008000, 536.680000, 269.907000, 524.995000, 267.017000);
        ctx.bezierCurveTo(525.614000, 277.729000, 526.232000, 288.443000, 530.994000, 295.014000);
        ctx.bezierCurveTo(527.780000, 299.798000, 520.607000, 300.625000, 515.996000, 304.012000);
        ctx.bezierCurveTo(518.516000, 306.968000, 518.809000, 306.949000, 517.996000, 312.011000);
        ctx.bezierCurveTo(520.752000, 310.108000, 527.746000, 309.278000, 527.994000, 315.011000);
        ctx.lineTo(528.994000, 315.011000);
        ctx.bezierCurveTo(529.720000, 311.953000, 527.270000, 312.070000, 527.994000, 309.012000);
        ctx.lineTo(527.994000, 307.012000);
        ctx.bezierCurveTo(530.683000, 306.323000, 529.927000, 309.079000, 530.994000, 310.012000);
        ctx.bezierCurveTo(532.650000, 309.001000, 532.080000, 305.765000, 532.994000, 304.012000);
        ctx.bezierCurveTo(534.434000, 304.572000, 535.434000, 305.572000, 535.993000, 307.012000);
        ctx.lineTo(535.993000, 308.012000);
        ctx.closePath();
        ctx.fill();

        // #path3190
        ctx.fillStyle = 'rgb(115, 121, 142)';
        ctx.beginPath();
        ctx.moveTo(571.989000, 372.004000);
        ctx.bezierCurveTo(572.473000, 378.487000, 567.116000, 379.129000, 561.990000, 380.003000);
        ctx.bezierCurveTo(562.463000, 374.453000, 566.279000, 369.268000, 571.989000, 372.004000);
        ctx.moveTo(560.990000, 361.005000);
        ctx.bezierCurveTo(560.820000, 362.501000, 561.348000, 364.695000, 559.990000, 365.005000);
        ctx.bezierCurveTo(539.216000, 340.479000, 492.349000, 367.521000, 489.999000, 395.001000);
        ctx.bezierCurveTo(494.406000, 398.581000, 502.586000, 396.319000, 506.997000, 396.001000);
        ctx.bezierCurveTo(531.599000, 394.225000, 555.777000, 390.818000, 570.989000, 379.003000);
        ctx.bezierCurveTo(580.176000, 371.868000, 579.623000, 361.073000, 595.986000, 360.005000);
        ctx.bezierCurveTo(608.296000, 359.202000, 619.368000, 357.707000, 628.981000, 351.006000);
        ctx.bezierCurveTo(615.723000, 349.357000, 601.170000, 346.685000, 601.985000, 335.008000);
        ctx.bezierCurveTo(602.188000, 332.096000, 613.616000, 315.175000, 615.983000, 314.011000);
        ctx.bezierCurveTo(626.039000, 309.066000, 634.261000, 318.075000, 643.980000, 317.011000);
        ctx.bezierCurveTo(648.446000, 325.209000, 649.160000, 337.161000, 658.979000, 340.008000);
        ctx.bezierCurveTo(653.744000, 331.499000, 649.911000, 319.032000, 657.979000, 315.011000);
        ctx.bezierCurveTo(647.509000, 319.893000, 642.811000, 313.943000, 636.980000, 310.012000);
        ctx.bezierCurveTo(624.592000, 301.657000, 609.898000, 292.512000, 593.986000, 289.014000);
        ctx.bezierCurveTo(589.844000, 294.456000, 576.251000, 300.264000, 571.989000, 299.013000);
        ctx.bezierCurveTo(576.969000, 291.926000, 577.857000, 283.785000, 582.987000, 277.016000);
        ctx.bezierCurveTo(589.969000, 267.805000, 603.503000, 267.544000, 608.984000, 260.018000);
        ctx.bezierCurveTo(596.559000, 264.152000, 586.258000, 268.970000, 577.988000, 278.016000);
        ctx.bezierCurveTo(574.772000, 281.533000, 573.101000, 288.975000, 568.989000, 291.014000);
        ctx.bezierCurveTo(561.381000, 294.787000, 552.344000, 290.502000, 541.993000, 294.014000);
        ctx.bezierCurveTo(542.340000, 289.695000, 549.645000, 292.333000, 549.992000, 288.015000);
        ctx.bezierCurveTo(541.012000, 282.662000, 535.651000, 273.691000, 525.995000, 269.017000);
        ctx.bezierCurveTo(526.373000, 279.637000, 528.502000, 288.506000, 531.994000, 296.014000);
        ctx.bezierCurveTo(530.723000, 300.075000, 524.691000, 299.376000, 522.995000, 303.012000);
        ctx.bezierCurveTo(530.902000, 302.587000, 535.470000, 298.822000, 542.992000, 298.013000);
        ctx.bezierCurveTo(544.337000, 299.651000, 543.218000, 304.888000, 541.993000, 307.012000);
        ctx.bezierCurveTo(540.154000, 302.208000, 538.613000, 307.827000, 535.993000, 308.012000);
        ctx.bezierCurveTo(539.294000, 308.442000, 544.266000, 308.201000, 545.992000, 304.012000);
        ctx.bezierCurveTo(551.332000, 312.004000, 557.893000, 318.775000, 560.990000, 329.009000);
        ctx.bezierCurveTo(561.716000, 325.951000, 559.266000, 326.068000, 559.990000, 323.010000);
        ctx.bezierCurveTo(564.494000, 322.543000, 565.116000, 331.165000, 562.990000, 334.008000);
        ctx.bezierCurveTo(561.604000, 333.395000, 562.840000, 330.160000, 560.990000, 330.009000);
        ctx.bezierCurveTo(562.257000, 343.460000, 568.116000, 357.474000, 566.989000, 370.004000);
        ctx.bezierCurveTo(562.019000, 369.976000, 563.793000, 363.202000, 560.990000, 361.005000);
        ctx.fill();

        // #path3192
        ctx.fillStyle = 'rgb(112, 87, 101)';
        ctx.beginPath();
        ctx.moveTo(529.994000, 313.011000);
        ctx.bezierCurveTo(534.789000, 314.807000, 533.217000, 310.234000, 534.994000, 309.012000);
        ctx.bezierCurveTo(538.033000, 312.151000, 544.176000, 309.725000, 546.992000, 307.012000);
        ctx.bezierCurveTo(558.558000, 320.778000, 564.744000, 345.250000, 564.990000, 367.004000);
        ctx.bezierCurveTo(563.113000, 362.882000, 561.201000, 358.795000, 561.990000, 352.006000);
        ctx.bezierCurveTo(555.441000, 350.508000, 553.846000, 341.633000, 546.992000, 346.007000);
        ctx.bezierCurveTo(546.814000, 342.851000, 546.290000, 340.043000, 542.992000, 340.008000);
        ctx.bezierCurveTo(541.104000, 340.119000, 542.299000, 343.313000, 539.993000, 343.007000);
        ctx.bezierCurveTo(539.402000, 340.932000, 538.069000, 339.599000, 535.993000, 339.008000);
        ctx.bezierCurveTo(534.496000, 340.510000, 534.205000, 343.218000, 531.994000, 344.007000);
        ctx.bezierCurveTo(533.229000, 332.479000, 535.501000, 321.485000, 529.994000, 313.011000);
        ctx.moveTo(560.990000, 330.009000);
        ctx.lineTo(560.990000, 329.009000);
        ctx.bezierCurveTo(557.893000, 318.775000, 551.332000, 312.004000, 545.992000, 304.012000);
        ctx.bezierCurveTo(544.266000, 308.201000, 539.294000, 308.442000, 535.993000, 308.012000);
        ctx.lineTo(535.993000, 307.012000);
        ctx.bezierCurveTo(535.189000, 306.483000, 534.370000, 305.969000, 532.994000, 306.012000);
        ctx.bezierCurveTo(533.126000, 308.477000, 533.146000, 310.830000, 531.994000, 312.011000);
        ctx.bezierCurveTo(529.364000, 312.308000, 531.207000, 308.132000, 527.994000, 309.012000);
        ctx.bezierCurveTo(527.270000, 312.070000, 529.720000, 311.953000, 528.994000, 315.011000);
        ctx.bezierCurveTo(529.967000, 315.039000, 529.771000, 316.235000, 529.994000, 317.011000);
        ctx.bezierCurveTo(536.983000, 324.494000, 528.535000, 337.582000, 531.994000, 347.007000);
        ctx.bezierCurveTo(534.048000, 346.728000, 533.989000, 344.336000, 534.994000, 343.007000);
        ctx.bezierCurveTo(535.437000, 342.117000, 535.872000, 341.219000, 536.993000, 341.008000);
        ctx.bezierCurveTo(538.335000, 341.666000, 538.855000, 343.145000, 538.993000, 345.007000);
        ctx.bezierCurveTo(541.537000, 344.885000, 542.870000, 343.552000, 542.992000, 341.008000);
        ctx.bezierCurveTo(543.883000, 341.451000, 544.781000, 341.886000, 544.992000, 343.007000);
        ctx.lineTo(544.992000, 345.007000);
        ctx.bezierCurveTo(546.164000, 345.168000, 545.836000, 346.830000, 545.992000, 348.007000);
        ctx.bezierCurveTo(548.495000, 348.176000, 549.122000, 346.471000, 549.992000, 345.007000);
        ctx.bezierCurveTo(552.546000, 345.119000, 551.977000, 348.355000, 551.991000, 351.006000);
        ctx.bezierCurveTo(554.720000, 351.735000, 554.004000, 349.020000, 555.991000, 349.007000);
        ctx.bezierCurveTo(556.869000, 355.346000, 562.295000, 351.206000, 560.990000, 360.005000);
        ctx.lineTo(560.990000, 361.005000);
        ctx.bezierCurveTo(563.793000, 363.202000, 562.019000, 369.976000, 566.989000, 370.004000);
        ctx.bezierCurveTo(568.116000, 357.474000, 562.257000, 343.460000, 560.990000, 330.009000);
        ctx.fill();

        // #path3194
        ctx.fillStyle = 'rgb(115, 121, 142)';
        ctx.beginPath();
        ctx.moveTo(560.990000, 360.005000);
        ctx.bezierCurveTo(562.295000, 351.206000, 556.869000, 355.346000, 555.991000, 349.007000);
        ctx.bezierCurveTo(554.004000, 349.020000, 554.720000, 351.735000, 551.991000, 351.006000);
        ctx.bezierCurveTo(551.977000, 348.355000, 552.546000, 345.119000, 549.992000, 345.007000);
        ctx.bezierCurveTo(549.122000, 346.471000, 548.495000, 348.176000, 545.992000, 348.007000);
        ctx.bezierCurveTo(545.836000, 346.830000, 546.164000, 345.168000, 544.992000, 345.007000);
        ctx.bezierCurveTo(545.163000, 346.503000, 544.635000, 348.697000, 545.992000, 349.007000);
        ctx.bezierCurveTo(549.131000, 349.479000, 548.634000, 346.315000, 550.991000, 346.007000);
        ctx.bezierCurveTo(551.002000, 348.663000, 550.614000, 351.717000, 551.991000, 353.006000);
        ctx.bezierCurveTo(556.385000, 348.884000, 559.116000, 355.903000, 560.990000, 360.005000);
        ctx.fill();

        // #path3196
        ctx.fillStyle = 'rgb(115, 121, 142)';
        ctx.beginPath();
        ctx.moveTo(534.994000, 343.007000);
        ctx.bezierCurveTo(535.997000, 343.011000, 536.184000, 342.198000, 536.993000, 342.007000);
        ctx.bezierCurveTo(538.422000, 347.954000, 541.324000, 344.705000, 544.992000, 343.007000);
        ctx.bezierCurveTo(544.781000, 341.886000, 543.883000, 341.451000, 542.992000, 341.008000);
        ctx.bezierCurveTo(542.870000, 343.552000, 541.537000, 344.885000, 538.993000, 345.007000);
        ctx.bezierCurveTo(538.855000, 343.145000, 538.335000, 341.666000, 536.993000, 341.008000);
        ctx.bezierCurveTo(535.872000, 341.219000, 535.437000, 342.117000, 534.994000, 343.007000);
        ctx.fill();

        // #path3198
        ctx.fillStyle = 'rgb(115, 121, 142)';
        ctx.beginPath();
        ctx.moveTo(527.994000, 309.012000);
        ctx.bezierCurveTo(531.207000, 308.132000, 529.364000, 312.308000, 531.994000, 312.011000);
        ctx.bezierCurveTo(533.146000, 310.830000, 533.126000, 308.477000, 532.994000, 306.012000);
        ctx.bezierCurveTo(534.370000, 305.969000, 535.189000, 306.483000, 535.993000, 307.012000);
        ctx.bezierCurveTo(535.434000, 305.572000, 534.434000, 304.572000, 532.994000, 304.012000);
        ctx.bezierCurveTo(532.080000, 305.765000, 532.650000, 309.001000, 530.994000, 310.012000);
        ctx.bezierCurveTo(529.927000, 309.079000, 530.683000, 306.323000, 527.994000, 307.012000);
        ctx.lineTo(527.994000, 309.012000);
        ctx.closePath();
        ctx.fill();

        // #path3200
        ctx.fillStyle = 'rgb(155, 154, 169)';
        ctx.beginPath();
        ctx.moveTo(543.992000, 280.016000);
        ctx.bezierCurveTo(545.488000, 277.802000, 539.476000, 274.571000, 537.993000, 272.017000);
        ctx.bezierCurveTo(535.698000, 275.029000, 542.274000, 277.695000, 543.992000, 280.016000);
        ctx.fill();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    mageStanding: function (ctx, shape) {
        // #g3236
        ctx.save();
        ctxtransform(1.250000, 0.000000, 0.000000, -1.250000, -450.821250, 445.834610, ctx, shape);

        // #g3238

        // #g3240
        ctx.save();
        ctx.beginPath();

        // #path3244
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3246
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(416.650000, 315.671000);
        ctx.lineTo(416.650000, 316.671000);
        ctx.bezierCurveTo(421.336000, 316.024000, 428.623000, 317.979000, 431.648000, 315.671000);
        ctx.lineTo(416.650000, 315.671000);
        ctx.closePath();
        ctx.fill();

        // #path3248
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(395.653000, 255.679000);
        ctx.lineTo(395.653000, 251.680000);
        ctx.bezierCurveTo(394.650000, 251.676000, 394.463000, 252.489000, 393.653000, 252.680000);
        ctx.lineTo(393.653000, 254.680000);
        ctx.bezierCurveTo(392.945000, 258.387000, 395.361000, 258.971000, 394.653000, 262.678000);
        ctx.bezierCurveTo(396.889000, 262.248000, 395.058000, 257.750000, 395.653000, 255.679000);
        ctx.fill();

        // #path3250
        ctx.fillStyle = 'rgb(197, 195, 197)';
        ctx.beginPath();
        ctx.moveTo(401.652000, 242.681000);
        ctx.bezierCurveTo(406.096000, 246.136000, 399.939000, 247.386000, 397.653000, 249.680000);
        ctx.bezierCurveTo(394.756000, 249.120000, 399.187000, 248.120000, 398.652000, 246.680000);
        ctx.bezierCurveTo(395.964000, 245.991000, 396.720000, 248.747000, 395.653000, 249.680000);
        ctx.lineTo(395.653000, 251.680000);
        ctx.bezierCurveTo(396.463000, 251.869000, 396.649000, 252.683000, 397.653000, 252.680000);
        ctx.bezierCurveTo(397.494000, 247.439000, 409.234000, 246.496000, 401.652000, 242.681000);
        ctx.fill();

        // #path3252
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(378.655000, 329.669000);
        ctx.bezierCurveTo(376.999000, 330.680000, 377.569000, 333.917000, 376.655000, 335.669000);
        ctx.bezierCurveTo(381.329000, 335.361000, 386.365000, 339.912000, 388.654000, 338.668000);
        ctx.bezierCurveTo(387.850000, 338.140000, 387.031000, 337.625000, 385.654000, 337.668000);
        ctx.bezierCurveTo(385.667000, 335.682000, 388.382000, 336.397000, 387.654000, 333.669000);
        ctx.bezierCurveTo(383.666000, 332.681000, 384.643000, 336.658000, 380.655000, 335.669000);
        ctx.bezierCurveTo(378.100000, 335.557000, 378.670000, 332.321000, 378.655000, 329.669000);
        ctx.fill();

        // #path3254
        ctx.fillStyle = 'rgb(144, 139, 142)';
        ctx.beginPath();
        ctx.moveTo(373.656000, 333.669000);
        ctx.bezierCurveTo(379.094000, 331.997000, 380.748000, 323.160000, 378.655000, 314.671000);
        ctx.bezierCurveTo(373.696000, 314.964000, 373.305000, 310.689000, 370.656000, 308.672000);
        ctx.bezierCurveTo(371.098000, 305.781000, 372.764000, 304.114000, 375.655000, 303.673000);
        ctx.bezierCurveTo(376.938000, 301.289000, 377.570000, 298.255000, 380.655000, 297.674000);
        ctx.bezierCurveTo(381.059000, 295.744000, 385.234000, 297.586000, 383.654000, 293.674000);
        ctx.bezierCurveTo(384.575000, 289.992000, 378.380000, 291.856000, 377.655000, 292.674000);
        ctx.bezierCurveTo(377.556000, 289.575000, 378.108000, 287.128000, 379.655000, 285.676000);
        ctx.bezierCurveTo(379.868000, 280.777000, 383.908000, 274.047000, 382.654000, 264.678000);
        ctx.bezierCurveTo(380.829000, 260.504000, 379.942000, 255.392000, 378.655000, 250.680000);
        ctx.bezierCurveTo(376.837000, 249.497000, 377.869000, 245.467000, 376.655000, 243.680000);
        ctx.bezierCurveTo(376.951000, 239.846000, 384.905000, 239.910000, 387.654000, 241.681000);
        ctx.bezierCurveTo(387.811000, 245.504000, 383.571000, 244.930000, 381.655000, 246.680000);
        ctx.bezierCurveTo(381.838000, 247.530000, 381.265000, 247.623000, 380.655000, 247.680000);
        ctx.bezierCurveTo(381.184000, 248.484000, 381.698000, 249.303000, 381.655000, 250.680000);
        ctx.bezierCurveTo(384.272000, 253.728000, 386.462000, 257.204000, 386.654000, 262.678000);
        ctx.lineTo(386.654000, 273.677000);
        ctx.lineTo(386.654000, 278.676000);
        ctx.bezierCurveTo(395.211000, 277.826000, 393.881000, 266.650000, 392.653000, 258.679000);
        ctx.lineTo(392.653000, 257.679000);
        ctx.bezierCurveTo(390.354000, 255.313000, 392.295000, 248.705000, 391.653000, 244.680000);
        ctx.bezierCurveTo(392.458000, 244.151000, 393.276000, 243.637000, 394.653000, 243.680000);
        ctx.bezierCurveTo(396.106000, 244.227000, 399.821000, 242.512000, 399.652000, 244.680000);
        ctx.lineTo(401.652000, 244.680000);
        ctx.bezierCurveTo(400.919000, 245.613000, 399.834000, 246.195000, 398.652000, 246.680000);
        ctx.bezierCurveTo(399.187000, 248.120000, 394.756000, 249.120000, 397.653000, 249.680000);
        ctx.bezierCurveTo(399.939000, 247.386000, 406.096000, 246.136000, 401.652000, 242.681000);
        ctx.lineTo(400.652000, 242.681000);
        ctx.bezierCurveTo(397.234000, 240.934000, 393.489000, 242.150000, 390.653000, 243.680000);
        ctx.bezierCurveTo(388.252000, 256.610000, 396.394000, 268.602000, 389.654000, 276.676000);
        ctx.bezierCurveTo(388.208000, 266.123000, 387.055000, 255.277000, 382.654000, 247.680000);
        ctx.bezierCurveTo(384.065000, 245.424000, 389.167000, 246.859000, 388.654000, 242.681000);
        ctx.bezierCurveTo(389.204000, 240.464000, 386.745000, 241.257000, 386.654000, 239.681000);
        ctx.bezierCurveTo(382.018000, 239.377000, 377.998000, 239.690000, 375.655000, 241.681000);
        ctx.bezierCurveTo(376.007000, 255.986000, 385.287000, 266.977000, 378.655000, 279.676000);
        ctx.bezierCurveTo(378.517000, 284.204000, 377.124000, 287.477000, 375.655000, 290.674000);
        ctx.bezierCurveTo(378.146000, 301.497000, 371.446000, 303.130000, 369.656000, 309.672000);
        ctx.bezierCurveTo(373.916000, 312.785000, 381.651000, 321.825000, 375.655000, 328.670000);
        ctx.bezierCurveTo(375.108000, 330.123000, 376.824000, 333.838000, 374.655000, 333.669000);
        ctx.lineTo(373.656000, 333.669000);
        ctx.closePath();
        ctx.fill();

        // #path3256
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(373.656000, 336.669000);
        ctx.bezierCurveTo(376.491000, 338.752000, 386.436000, 343.542000, 387.654000, 340.668000);
        ctx.bezierCurveTo(382.087000, 340.236000, 380.330000, 335.994000, 373.656000, 336.669000);
        ctx.fill();

        // #path3258
        ctx.fillStyle = 'rgb(144, 139, 142)';
        ctx.beginPath();
        ctx.moveTo(391.653000, 340.668000);
        ctx.bezierCurveTo(393.898000, 330.582000, 394.724000, 319.075000, 407.651000, 319.671000);
        ctx.lineTo(409.651000, 319.671000);
        ctx.bezierCurveTo(415.436000, 315.788000, 440.313000, 321.463000, 432.648000, 310.672000);
        ctx.bezierCurveTo(428.240000, 310.930000, 426.385000, 313.740000, 420.650000, 312.672000);
        ctx.lineTo(408.651000, 312.672000);
        ctx.bezierCurveTo(407.801000, 312.488000, 407.708000, 313.062000, 407.651000, 313.672000);
        ctx.lineTo(426.648000, 313.672000);
        ctx.bezierCurveTo(430.107000, 314.484000, 430.870000, 311.805000, 432.648000, 313.672000);
        ctx.bezierCurveTo(432.811000, 314.834000, 432.428000, 315.451000, 431.648000, 315.671000);
        ctx.bezierCurveTo(428.623000, 317.979000, 421.336000, 316.024000, 416.650000, 316.671000);
        ctx.bezierCurveTo(411.277000, 315.964000, 408.108000, 317.462000, 404.652000, 318.671000);
        ctx.bezierCurveTo(393.814000, 319.832000, 392.324000, 330.340000, 390.653000, 340.668000);
        ctx.lineTo(391.653000, 340.668000);
        ctx.closePath();
        ctx.fill();

        // #path3260
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(387.654000, 340.668000);
        ctx.bezierCurveTo(386.436000, 343.542000, 376.491000, 338.752000, 373.656000, 336.669000);
        ctx.bezierCurveTo(380.330000, 335.994000, 382.087000, 340.236000, 387.654000, 340.668000);
        ctx.moveTo(399.652000, 318.671000);
        ctx.bezierCurveTo(395.441000, 321.792000, 392.563000, 326.247000, 390.653000, 331.669000);
        ctx.bezierCurveTo(390.813000, 334.829000, 390.689000, 337.704000, 388.654000, 338.668000);
        ctx.bezierCurveTo(386.365000, 339.912000, 381.329000, 335.361000, 376.655000, 335.669000);
        ctx.bezierCurveTo(377.569000, 333.917000, 376.999000, 330.680000, 378.655000, 329.669000);
        ctx.bezierCurveTo(379.586000, 327.268000, 382.673000, 327.022000, 381.655000, 322.670000);
        ctx.bezierCurveTo(377.335000, 319.274000, 382.126000, 312.917000, 377.655000, 309.672000);
        ctx.bezierCurveTo(376.569000, 309.919000, 376.977000, 311.660000, 375.655000, 311.672000);
        ctx.bezierCurveTo(369.914000, 310.901000, 371.901000, 304.888000, 375.655000, 303.673000);
        ctx.bezierCurveTo(372.764000, 304.114000, 371.098000, 305.781000, 370.656000, 308.672000);
        ctx.bezierCurveTo(373.305000, 310.689000, 373.696000, 314.964000, 378.655000, 314.671000);
        ctx.bezierCurveTo(380.748000, 323.160000, 379.094000, 331.997000, 373.656000, 333.669000);
        ctx.lineTo(367.656000, 333.669000);
        ctx.bezierCurveTo(367.513000, 338.479000, 373.127000, 337.531000, 374.655000, 340.668000);
        ctx.bezierCurveTo(372.067000, 347.745000, 367.424000, 352.768000, 360.657000, 355.667000);
        ctx.bezierCurveTo(368.866000, 359.438000, 382.754000, 351.844000, 386.654000, 344.668000);
        ctx.bezierCurveTo(390.380000, 344.064000, 392.978000, 347.224000, 395.653000, 344.668000);
        ctx.bezierCurveTo(395.697000, 342.958000, 394.910000, 342.078000, 393.653000, 341.668000);
        ctx.bezierCurveTo(392.843000, 341.478000, 392.656000, 340.665000, 391.653000, 340.668000);
        ctx.lineTo(390.653000, 340.668000);
        ctx.bezierCurveTo(392.324000, 330.340000, 393.814000, 319.832000, 404.652000, 318.671000);
        ctx.lineTo(399.652000, 318.671000);
        ctx.closePath();
        ctx.fill();

        // #path3262
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(390.653000, 331.669000);
        ctx.bezierCurveTo(392.563000, 326.247000, 395.441000, 321.792000, 399.652000, 318.671000);
        ctx.bezierCurveTo(393.297000, 318.648000, 396.027000, 327.710000, 387.654000, 325.670000);
        ctx.bezierCurveTo(388.271000, 328.052000, 392.011000, 327.312000, 390.653000, 331.669000);
        ctx.fill();

        // #path3264
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(404.652000, 318.671000);
        ctx.bezierCurveTo(408.108000, 317.462000, 411.277000, 315.964000, 416.650000, 316.671000);
        ctx.lineTo(416.650000, 315.671000);
        ctx.bezierCurveTo(412.729000, 314.213000, 404.872000, 318.648000, 407.651000, 314.671000);
        ctx.bezierCurveTo(405.343000, 316.903000, 396.685000, 318.090000, 394.653000, 314.671000);
        ctx.lineTo(393.653000, 314.671000);
        ctx.bezierCurveTo(394.232000, 319.092000, 401.998000, 316.325000, 404.652000, 318.671000);
        ctx.fill();

        // #path3266
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(375.655000, 311.672000);
        ctx.bezierCurveTo(376.977000, 311.660000, 376.569000, 309.919000, 377.655000, 309.672000);
        ctx.bezierCurveTo(382.126000, 312.917000, 377.335000, 319.274000, 381.655000, 322.670000);
        ctx.bezierCurveTo(380.878000, 321.781000, 380.580000, 320.413000, 380.655000, 318.671000);
        ctx.bezierCurveTo(383.301000, 320.965000, 387.007000, 320.965000, 389.654000, 318.671000);
        ctx.bezierCurveTo(390.482000, 316.061000, 386.630000, 313.185000, 389.654000, 311.672000);
        ctx.lineTo(389.654000, 309.672000);
        ctx.bezierCurveTo(387.231000, 308.761000, 387.006000, 305.654000, 386.654000, 302.673000);
        ctx.bezierCurveTo(381.171000, 300.679000, 376.185000, 305.615000, 375.655000, 311.672000);
        ctx.fill();

        // #path3268
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(389.654000, 309.672000);
        ctx.bezierCurveTo(383.809000, 300.619000, 392.589000, 294.811000, 392.653000, 285.676000);
        ctx.bezierCurveTo(389.827000, 284.849000, 390.063000, 287.084000, 387.654000, 286.675000);
        ctx.bezierCurveTo(395.178000, 290.984000, 385.261000, 295.455000, 386.654000, 302.673000);
        ctx.bezierCurveTo(387.006000, 305.654000, 387.231000, 308.761000, 389.654000, 309.672000);
        ctx.fill();

        // #path3270
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(394.653000, 314.671000);
        ctx.bezierCurveTo(396.685000, 318.090000, 405.343000, 316.903000, 407.651000, 314.671000);
        ctx.bezierCurveTo(413.663000, 314.017000, 422.300000, 315.988000, 426.648000, 313.672000);
        ctx.lineTo(407.651000, 313.672000);
        ctx.lineTo(406.651000, 313.672000);
        ctx.bezierCurveTo(404.715000, 317.185000, 398.250000, 315.235000, 394.653000, 314.671000);
        ctx.fill();

        // #path3272
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(431.648000, 315.671000);
        ctx.bezierCurveTo(432.428000, 315.451000, 432.811000, 314.834000, 432.648000, 313.672000);
        ctx.bezierCurveTo(430.870000, 311.805000, 430.107000, 314.484000, 426.648000, 313.672000);
        ctx.bezierCurveTo(422.300000, 315.988000, 413.663000, 314.017000, 407.651000, 314.671000);
        ctx.bezierCurveTo(404.872000, 318.648000, 412.729000, 314.213000, 416.650000, 315.671000);
        ctx.lineTo(431.648000, 315.671000);
        ctx.closePath();
        ctx.fill();

        // #path3274
        ctx.fillStyle = 'rgb(144, 139, 142)';
        ctx.beginPath();
        ctx.moveTo(394.653000, 314.671000);
        ctx.bezierCurveTo(398.250000, 315.235000, 404.715000, 317.185000, 406.651000, 313.672000);
        ctx.bezierCurveTo(402.087000, 313.237000, 395.642000, 314.683000, 392.653000, 312.672000);
        ctx.bezierCurveTo(390.907000, 311.752000, 390.446000, 309.546000, 390.653000, 306.672000);
        ctx.lineTo(389.654000, 306.672000);
        ctx.bezierCurveTo(387.358000, 300.236000, 391.424000, 295.470000, 393.653000, 290.674000);
        ctx.bezierCurveTo(396.468000, 278.639000, 403.004000, 267.275000, 397.653000, 252.680000);
        ctx.bezierCurveTo(396.649000, 252.683000, 396.463000, 251.869000, 395.653000, 251.680000);
        ctx.lineTo(395.653000, 255.679000);
        ctx.bezierCurveTo(396.062000, 261.243000, 400.823000, 269.779000, 396.653000, 273.677000);
        ctx.bezierCurveTo(397.076000, 275.767000, 395.967000, 276.324000, 395.653000, 277.676000);
        ctx.bezierCurveTo(394.801000, 280.490000, 392.423000, 281.778000, 392.653000, 285.676000);
        ctx.bezierCurveTo(392.589000, 294.811000, 383.809000, 300.619000, 389.654000, 309.672000);
        ctx.lineTo(389.654000, 311.672000);
        ctx.bezierCurveTo(390.523000, 313.136000, 391.150000, 314.841000, 393.653000, 314.671000);
        ctx.lineTo(394.653000, 314.671000);
        ctx.closePath();
        ctx.fill();

        // #path3276
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(379.655000, 288.675000);
        ctx.bezierCurveTo(380.815000, 287.836000, 382.335000, 287.355000, 384.654000, 287.675000);
        ctx.bezierCurveTo(384.507000, 285.195000, 384.468000, 282.822000, 386.654000, 282.676000);
        ctx.bezierCurveTo(388.011000, 282.984000, 387.483000, 285.179000, 387.654000, 286.675000);
        ctx.bezierCurveTo(390.063000, 287.084000, 389.827000, 284.849000, 392.653000, 285.676000);
        ctx.bezierCurveTo(392.423000, 281.778000, 394.801000, 280.490000, 395.653000, 277.676000);
        ctx.bezierCurveTo(392.873000, 278.229000, 392.853000, 281.542000, 391.653000, 283.676000);
        ctx.bezierCurveTo(387.519000, 281.115000, 393.048000, 278.231000, 393.653000, 274.677000);
        ctx.bezierCurveTo(390.409000, 276.432000, 391.015000, 282.037000, 384.654000, 280.676000);
        ctx.bezierCurveTo(384.555000, 277.576000, 385.107000, 275.129000, 386.654000, 273.677000);
        ctx.lineTo(386.654000, 262.678000);
        ctx.bezierCurveTo(384.499000, 261.834000, 385.810000, 257.523000, 383.654000, 256.679000);
        ctx.bezierCurveTo(383.855000, 261.478000, 386.331000, 264.002000, 385.654000, 269.678000);
        ctx.bezierCurveTo(383.468000, 269.530000, 383.507000, 267.158000, 383.654000, 264.678000);
        ctx.lineTo(382.654000, 264.678000);
        ctx.bezierCurveTo(383.908000, 274.047000, 379.868000, 280.777000, 379.655000, 285.676000);
        ctx.bezierCurveTo(381.436000, 286.408000, 379.799000, 287.493000, 379.655000, 288.675000);
        ctx.fill();

        // #path3278
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(375.655000, 303.673000);
        ctx.bezierCurveTo(377.859000, 300.543000, 380.858000, 298.211000, 385.654000, 297.674000);
        ctx.bezierCurveTo(385.483000, 294.846000, 386.514000, 290.814000, 383.654000, 290.674000);
        ctx.bezierCurveTo(385.139000, 292.453000, 386.160000, 299.830000, 380.655000, 297.674000);
        ctx.bezierCurveTo(377.570000, 298.255000, 376.938000, 301.289000, 375.655000, 303.673000);
        ctx.fill();

        // #path3280
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(380.655000, 297.674000);
        ctx.bezierCurveTo(386.160000, 299.830000, 385.139000, 292.453000, 383.654000, 290.674000);
        ctx.lineTo(379.655000, 290.674000);
        ctx.lineTo(379.655000, 288.675000);
        ctx.bezierCurveTo(379.799000, 287.493000, 381.436000, 286.408000, 379.655000, 285.676000);
        ctx.bezierCurveTo(378.108000, 287.128000, 377.556000, 289.575000, 377.655000, 292.674000);
        ctx.bezierCurveTo(378.380000, 291.856000, 384.575000, 289.992000, 383.654000, 293.674000);
        ctx.bezierCurveTo(385.234000, 297.586000, 381.059000, 295.744000, 380.655000, 297.674000);
        ctx.fill();

        // #path3282
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(396.653000, 273.677000);
        ctx.bezierCurveTo(400.823000, 269.779000, 396.062000, 261.243000, 395.653000, 255.679000);
        ctx.bezierCurveTo(395.058000, 257.750000, 396.889000, 262.248000, 394.653000, 262.678000);
        ctx.bezierCurveTo(395.361000, 258.971000, 392.945000, 258.387000, 393.653000, 254.680000);
        ctx.bezierCurveTo(392.481000, 254.840000, 392.810000, 256.502000, 392.653000, 257.679000);
        ctx.lineTo(392.653000, 258.679000);
        ctx.bezierCurveTo(394.251000, 261.414000, 394.712000, 265.285000, 394.653000, 269.678000);
        ctx.bezierCurveTo(396.394000, 263.987000, 398.636000, 270.221000, 396.653000, 273.677000);
        ctx.fill();

        // #path3284
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(386.654000, 273.677000);
        ctx.bezierCurveTo(385.107000, 275.129000, 384.555000, 277.576000, 384.654000, 280.676000);
        ctx.bezierCurveTo(391.015000, 282.037000, 390.409000, 276.432000, 393.653000, 274.677000);
        ctx.bezierCurveTo(393.244000, 272.268000, 395.479000, 272.503000, 394.653000, 269.678000);
        ctx.bezierCurveTo(394.712000, 265.285000, 394.251000, 261.414000, 392.653000, 258.679000);
        ctx.bezierCurveTo(393.881000, 266.650000, 395.211000, 277.826000, 386.654000, 278.676000);
        ctx.lineTo(386.654000, 273.677000);
        ctx.closePath();
        ctx.fill();

        // #path3286
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(392.653000, 257.679000);
        ctx.bezierCurveTo(392.810000, 256.502000, 392.481000, 254.840000, 393.653000, 254.680000);
        ctx.lineTo(393.653000, 252.680000);
        ctx.bezierCurveTo(393.048000, 250.285000, 392.215000, 248.117000, 392.653000, 244.680000);
        ctx.bezierCurveTo(393.816000, 244.843000, 394.432000, 244.459000, 394.653000, 243.680000);
        ctx.bezierCurveTo(393.276000, 243.637000, 392.458000, 244.151000, 391.653000, 244.680000);
        ctx.bezierCurveTo(392.295000, 248.705000, 390.354000, 255.313000, 392.653000, 257.679000);
        ctx.fill();

        // #path3288
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(383.654000, 256.679000);
        ctx.bezierCurveTo(384.724000, 252.943000, 381.171000, 253.829000, 381.655000, 250.680000);
        ctx.bezierCurveTo(381.698000, 249.303000, 381.184000, 248.484000, 380.655000, 247.680000);
        ctx.bezierCurveTo(381.265000, 247.623000, 381.838000, 247.530000, 381.655000, 246.680000);
        ctx.bezierCurveTo(382.383000, 244.409000, 384.663000, 243.689000, 386.654000, 242.681000);
        ctx.bezierCurveTo(385.910000, 240.426000, 381.046000, 242.289000, 378.655000, 241.681000);
        ctx.bezierCurveTo(376.919000, 245.012000, 379.159000, 246.116000, 378.655000, 250.680000);
        ctx.bezierCurveTo(379.942000, 255.392000, 380.829000, 260.504000, 382.654000, 264.678000);
        ctx.lineTo(383.654000, 264.678000);
        ctx.bezierCurveTo(383.507000, 267.158000, 383.468000, 269.530000, 385.654000, 269.678000);
        ctx.bezierCurveTo(386.331000, 264.002000, 383.855000, 261.478000, 383.654000, 256.679000);
        ctx.fill();

        // #path3290
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(386.654000, 262.678000);
        ctx.bezierCurveTo(386.462000, 257.204000, 384.272000, 253.728000, 381.655000, 250.680000);
        ctx.bezierCurveTo(381.171000, 253.829000, 384.724000, 252.943000, 383.654000, 256.679000);
        ctx.bezierCurveTo(385.810000, 257.523000, 384.499000, 261.834000, 386.654000, 262.678000);
        ctx.fill();

        // #path3292
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(378.655000, 250.680000);
        ctx.bezierCurveTo(379.159000, 246.116000, 376.919000, 245.012000, 378.655000, 241.681000);
        ctx.bezierCurveTo(381.046000, 242.289000, 385.910000, 240.426000, 386.654000, 242.681000);
        ctx.bezierCurveTo(384.663000, 243.689000, 382.383000, 244.409000, 381.655000, 246.680000);
        ctx.bezierCurveTo(383.571000, 244.930000, 387.811000, 245.504000, 387.654000, 241.681000);
        ctx.bezierCurveTo(384.905000, 239.910000, 376.951000, 239.846000, 376.655000, 243.680000);
        ctx.bezierCurveTo(377.869000, 245.467000, 376.837000, 249.497000, 378.655000, 250.680000);
        ctx.fill();

        // #path3294
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(393.653000, 252.680000);
        ctx.bezierCurveTo(394.463000, 252.489000, 394.650000, 251.676000, 395.653000, 251.680000);
        ctx.lineTo(395.653000, 249.680000);
        ctx.bezierCurveTo(394.423000, 249.243000, 393.600000, 248.400000, 393.653000, 246.680000);
        ctx.bezierCurveTo(393.765000, 244.125000, 397.001000, 244.695000, 399.652000, 244.680000);
        ctx.bezierCurveTo(399.821000, 242.512000, 396.106000, 244.227000, 394.653000, 243.680000);
        ctx.bezierCurveTo(394.432000, 244.459000, 393.816000, 244.843000, 392.653000, 244.680000);
        ctx.bezierCurveTo(392.215000, 248.117000, 393.048000, 250.285000, 393.653000, 252.680000);
        ctx.fill();

        // #path3296
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(388.654000, 338.668000);
        ctx.bezierCurveTo(390.689000, 337.704000, 390.813000, 334.829000, 390.653000, 331.669000);
        ctx.bezierCurveTo(392.011000, 327.312000, 388.271000, 328.052000, 387.654000, 325.670000);
        ctx.bezierCurveTo(396.027000, 327.710000, 393.297000, 318.648000, 399.652000, 318.671000);
        ctx.lineTo(404.652000, 318.671000);
        ctx.bezierCurveTo(401.998000, 316.325000, 394.232000, 319.092000, 393.653000, 314.671000);
        ctx.bezierCurveTo(391.150000, 314.841000, 390.523000, 313.136000, 389.654000, 311.672000);
        ctx.bezierCurveTo(386.630000, 313.185000, 390.482000, 316.061000, 389.654000, 318.671000);
        ctx.bezierCurveTo(387.007000, 320.965000, 383.301000, 320.965000, 380.655000, 318.671000);
        ctx.bezierCurveTo(380.580000, 320.413000, 380.878000, 321.781000, 381.655000, 322.670000);
        ctx.bezierCurveTo(382.673000, 327.022000, 379.586000, 327.268000, 378.655000, 329.669000);
        ctx.bezierCurveTo(378.670000, 332.321000, 378.100000, 335.557000, 380.655000, 335.669000);
        ctx.bezierCurveTo(384.643000, 336.658000, 383.666000, 332.681000, 387.654000, 333.669000);
        ctx.bezierCurveTo(388.382000, 336.397000, 385.667000, 335.682000, 385.654000, 337.668000);
        ctx.bezierCurveTo(387.031000, 337.625000, 387.850000, 338.140000, 388.654000, 338.668000);
        ctx.fill();

        // #path3298
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(386.654000, 302.673000);
        ctx.bezierCurveTo(385.261000, 295.455000, 395.178000, 290.984000, 387.654000, 286.675000);
        ctx.bezierCurveTo(387.483000, 285.179000, 388.011000, 282.984000, 386.654000, 282.676000);
        ctx.bezierCurveTo(384.468000, 282.822000, 384.507000, 285.195000, 384.654000, 287.675000);
        ctx.bezierCurveTo(382.335000, 287.355000, 380.815000, 287.836000, 379.655000, 288.675000);
        ctx.lineTo(379.655000, 290.674000);
        ctx.lineTo(383.654000, 290.674000);
        ctx.bezierCurveTo(386.514000, 290.814000, 385.483000, 294.846000, 385.654000, 297.674000);
        ctx.bezierCurveTo(380.858000, 298.211000, 377.859000, 300.543000, 375.655000, 303.673000);
        ctx.bezierCurveTo(371.901000, 304.888000, 369.914000, 310.901000, 375.655000, 311.672000);
        ctx.bezierCurveTo(376.185000, 305.615000, 381.171000, 300.679000, 386.654000, 302.673000);
        ctx.fill();

        // #path3300
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(395.653000, 277.676000);
        ctx.bezierCurveTo(395.967000, 276.324000, 397.076000, 275.767000, 396.653000, 273.677000);
        ctx.bezierCurveTo(398.636000, 270.221000, 396.394000, 263.987000, 394.653000, 269.678000);
        ctx.bezierCurveTo(395.479000, 272.503000, 393.244000, 272.268000, 393.653000, 274.677000);
        ctx.bezierCurveTo(393.048000, 278.231000, 387.519000, 281.115000, 391.653000, 283.676000);
        ctx.bezierCurveTo(392.853000, 281.542000, 392.873000, 278.229000, 395.653000, 277.676000);
        ctx.fill();

        // #path3302
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(395.653000, 249.680000);
        ctx.bezierCurveTo(396.720000, 248.747000, 395.964000, 245.991000, 398.652000, 246.680000);
        ctx.bezierCurveTo(399.834000, 246.195000, 400.919000, 245.613000, 401.652000, 244.680000);
        ctx.lineTo(399.652000, 244.680000);
        ctx.bezierCurveTo(397.001000, 244.695000, 393.765000, 244.125000, 393.653000, 246.680000);
        ctx.bezierCurveTo(393.600000, 248.400000, 394.423000, 249.243000, 395.653000, 249.680000);
        ctx.fill();
        ctx.restore();
        ctx.restore();
    },

    mageCasting: function (ctx, shape) {
        // #g3312
        ctx.save();
        ctxtransform(1.250000, 0.000000, 0.000000, -1.250000, -469.350240, 448.356870, ctx, shape);

        // #g3314

        // #g3316
        ctx.save();
        ctx.beginPath();

        // #path3320
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3322
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(395.664000, 327.670000);
        ctx.bezierCurveTo(397.968000, 326.309000, 401.243000, 325.917000, 400.663000, 321.671000);
        ctx.bezierCurveTo(400.049000, 320.285000, 396.814000, 321.521000, 396.664000, 319.671000);
        ctx.bezierCurveTo(394.374000, 320.505000, 393.926000, 325.814000, 395.664000, 327.670000);
        ctx.fill();

        // #path3324
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(393.664000, 299.674000);
        ctx.bezierCurveTo(395.213000, 298.557000, 395.746000, 296.424000, 398.663000, 296.674000);
        ctx.bezierCurveTo(398.442000, 295.895000, 397.826000, 295.512000, 396.664000, 295.674000);
        ctx.bezierCurveTo(394.911000, 296.588000, 391.674000, 296.018000, 390.664000, 297.674000);
        ctx.bezierCurveTo(392.235000, 297.770000, 394.131000, 297.540000, 393.664000, 299.674000);
        ctx.fill();

        // #path3326
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(379.666000, 285.676000);
        ctx.bezierCurveTo(377.941000, 287.951000, 377.527000, 291.535000, 377.666000, 295.674000);
        ctx.bezierCurveTo(378.845000, 288.979000, 386.786000, 292.896000, 390.664000, 294.674000);
        ctx.bezierCurveTo(390.970000, 291.647000, 393.758000, 291.102000, 392.664000, 286.676000);
        ctx.bezierCurveTo(391.407000, 287.085000, 390.620000, 287.965000, 390.664000, 289.675000);
        ctx.bezierCurveTo(390.708000, 291.051000, 390.193000, 291.870000, 389.664000, 292.674000);
        ctx.bezierCurveTo(388.661000, 292.678000, 388.474000, 291.865000, 387.665000, 291.675000);
        ctx.bezierCurveTo(384.484000, 291.521000, 383.266000, 289.408000, 379.666000, 289.675000);
        ctx.lineTo(379.666000, 285.676000);
        ctx.closePath();
        ctx.fill();

        // #path3328
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(395.664000, 256.680000);
        ctx.lineTo(395.664000, 252.680000);
        ctx.bezierCurveTo(394.661000, 252.676000, 394.474000, 253.489000, 393.664000, 253.680000);
        ctx.lineTo(393.664000, 255.680000);
        ctx.bezierCurveTo(392.956000, 259.387000, 395.372000, 259.971000, 394.664000, 263.678000);
        ctx.bezierCurveTo(396.899000, 263.248000, 395.069000, 258.750000, 395.664000, 256.680000);
        ctx.fill();

        // #path3330
        ctx.fillStyle = 'rgb(197, 195, 197)';
        ctx.beginPath();
        ctx.moveTo(401.662000, 243.681000);
        ctx.bezierCurveTo(406.523000, 247.713000, 398.186000, 249.146000, 395.664000, 251.680000);
        ctx.lineTo(395.664000, 252.680000);
        ctx.bezierCurveTo(396.473000, 252.869000, 396.660000, 253.683000, 397.663000, 253.680000);
        ctx.bezierCurveTo(397.505000, 248.439000, 409.246000, 247.496000, 401.662000, 243.681000);
        ctx.fill();

        // #path3332
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(383.665000, 337.669000);
        ctx.bezierCurveTo(389.473000, 338.193000, 395.996000, 338.003000, 397.663000, 342.668000);
        ctx.bezierCurveTo(394.561000, 339.438000, 386.202000, 341.465000, 383.665000, 337.669000);
        ctx.moveTo(380.666000, 351.667000);
        ctx.bezierCurveTo(380.558000, 354.340000, 371.411000, 359.025000, 377.666000, 358.666000);
        ctx.bezierCurveTo(392.005000, 358.674000, 390.360000, 342.697000, 405.662000, 343.668000);
        ctx.bezierCurveTo(405.716000, 341.948000, 404.893000, 341.105000, 403.662000, 340.668000);
        ctx.bezierCurveTo(399.662000, 336.568000, 402.896000, 330.655000, 403.662000, 324.670000);
        ctx.bezierCurveTo(399.324000, 328.721000, 402.395000, 335.402000, 399.663000, 339.668000);
        ctx.bezierCurveTo(398.048000, 339.950000, 397.941000, 338.724000, 396.664000, 338.669000);
        ctx.bezierCurveTo(394.136000, 336.530000, 388.720000, 337.280000, 385.665000, 335.669000);
        ctx.bezierCurveTo(386.260000, 333.598000, 384.429000, 329.101000, 386.665000, 328.670000);
        ctx.bezierCurveTo(391.258000, 324.661000, 387.989000, 322.714000, 386.665000, 317.671000);
        ctx.lineTo(385.665000, 317.671000);
        ctx.bezierCurveTo(388.928000, 323.841000, 386.461000, 332.913000, 380.666000, 335.669000);
        ctx.bezierCurveTo(379.169000, 335.839000, 376.976000, 335.312000, 376.666000, 336.669000);
        ctx.bezierCurveTo(378.657000, 339.344000, 383.861000, 338.806000, 384.665000, 342.668000);
        ctx.bezierCurveTo(384.708000, 347.045000, 382.169000, 348.838000, 380.666000, 351.667000);
        ctx.fill();

        // #path3334
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(396.664000, 319.671000);
        ctx.bezierCurveTo(396.814000, 321.521000, 400.049000, 320.285000, 400.663000, 321.671000);
        ctx.bezierCurveTo(401.243000, 325.917000, 397.968000, 326.309000, 395.664000, 327.670000);
        ctx.bezierCurveTo(393.926000, 325.814000, 394.374000, 320.505000, 396.664000, 319.671000);
        ctx.moveTo(396.664000, 338.669000);
        ctx.bezierCurveTo(397.941000, 338.724000, 398.048000, 339.950000, 399.663000, 339.668000);
        ctx.bezierCurveTo(402.395000, 335.402000, 399.324000, 328.721000, 403.662000, 324.670000);
        ctx.bezierCurveTo(404.107000, 320.226000, 400.954000, 319.380000, 399.663000, 316.671000);
        ctx.bezierCurveTo(399.280000, 302.411000, 416.413000, 300.782000, 426.660000, 305.673000);
        ctx.bezierCurveTo(424.548000, 295.564000, 406.740000, 307.041000, 406.662000, 295.674000);
        ctx.lineTo(405.662000, 295.674000);
        ctx.lineTo(400.663000, 295.674000);
        ctx.lineTo(400.663000, 296.674000);
        ctx.lineTo(401.662000, 296.674000);
        ctx.bezierCurveTo(403.879000, 296.123000, 403.086000, 298.584000, 404.662000, 298.674000);
        ctx.bezierCurveTo(404.646000, 302.325000, 401.820000, 303.164000, 400.663000, 305.673000);
        ctx.bezierCurveTo(400.040000, 308.716000, 398.442000, 310.785000, 394.664000, 310.672000);
        ctx.bezierCurveTo(395.490000, 314.748000, 394.817000, 314.115000, 394.664000, 318.671000);
        ctx.bezierCurveTo(387.057000, 319.613000, 389.135000, 310.868000, 387.665000, 305.673000);
        ctx.bezierCurveTo(389.872000, 304.214000, 391.757000, 302.433000, 393.664000, 300.673000);
        ctx.lineTo(393.664000, 299.674000);
        ctx.bezierCurveTo(394.131000, 297.540000, 392.235000, 297.770000, 390.664000, 297.674000);
        ctx.bezierCurveTo(387.737000, 297.413000, 387.592000, 299.935000, 384.665000, 299.674000);
        ctx.bezierCurveTo(384.503000, 300.845000, 382.842000, 300.517000, 381.665000, 300.673000);
        ctx.bezierCurveTo(380.940000, 303.732000, 383.390000, 303.614000, 382.665000, 306.673000);
        ctx.bezierCurveTo(383.801000, 310.203000, 385.764000, 312.906000, 385.665000, 317.671000);
        ctx.lineTo(386.665000, 317.671000);
        ctx.bezierCurveTo(387.989000, 322.714000, 391.258000, 324.661000, 386.665000, 328.670000);
        ctx.lineTo(386.665000, 335.669000);
        ctx.bezierCurveTo(390.156000, 336.427000, 394.214000, 332.643000, 396.664000, 335.669000);
        ctx.bezierCurveTo(395.463000, 336.982000, 396.274000, 337.242000, 396.664000, 338.669000);
        ctx.fill();

        // #path3336
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(386.665000, 328.670000);
        ctx.bezierCurveTo(384.429000, 329.101000, 386.260000, 333.598000, 385.665000, 335.669000);
        ctx.bezierCurveTo(388.720000, 337.280000, 394.136000, 336.530000, 396.664000, 338.669000);
        ctx.bezierCurveTo(396.274000, 337.242000, 395.463000, 336.982000, 396.664000, 335.669000);
        ctx.bezierCurveTo(394.214000, 332.643000, 390.156000, 336.427000, 386.665000, 335.669000);
        ctx.lineTo(386.665000, 328.670000);
        ctx.closePath();
        ctx.fill();

        // #path3338
        ctx.fillStyle = 'rgb(144, 139, 142)';
        ctx.beginPath();
        ctx.moveTo(385.665000, 322.671000);
        ctx.bezierCurveTo(387.005000, 325.385000, 383.456000, 331.764000, 381.665000, 334.669000);
        ctx.bezierCurveTo(381.055000, 334.726000, 380.481000, 334.819000, 380.666000, 335.669000);
        ctx.bezierCurveTo(386.461000, 332.913000, 388.928000, 323.841000, 385.665000, 317.671000);
        ctx.bezierCurveTo(385.764000, 312.906000, 383.801000, 310.203000, 382.665000, 306.673000);
        ctx.bezierCurveTo(380.446000, 305.226000, 381.284000, 300.722000, 379.666000, 298.674000);
        ctx.bezierCurveTo(381.433000, 296.816000, 382.584000, 299.108000, 384.665000, 299.674000);
        ctx.bezierCurveTo(387.592000, 299.935000, 387.737000, 297.413000, 390.664000, 297.674000);
        ctx.bezierCurveTo(391.674000, 296.018000, 394.911000, 296.588000, 396.664000, 295.674000);
        ctx.bezierCurveTo(397.422000, 294.021000, 404.903000, 294.021000, 405.662000, 295.674000);
        ctx.lineTo(406.662000, 295.674000);
        ctx.bezierCurveTo(406.740000, 307.041000, 424.548000, 295.564000, 426.660000, 305.673000);
        ctx.bezierCurveTo(416.413000, 300.782000, 399.280000, 302.411000, 399.663000, 316.671000);
        ctx.bezierCurveTo(400.954000, 319.380000, 404.107000, 320.226000, 403.662000, 324.670000);
        ctx.bezierCurveTo(402.896000, 330.655000, 399.662000, 336.568000, 403.662000, 340.668000);
        ctx.bezierCurveTo(401.773000, 334.683000, 403.777000, 329.170000, 405.662000, 322.671000);
        ctx.bezierCurveTo(403.611000, 318.179000, 400.762000, 317.458000, 401.662000, 312.672000);
        ctx.bezierCurveTo(403.629000, 302.228000, 421.158000, 305.417000, 427.660000, 306.673000);
        ctx.bezierCurveTo(428.514000, 301.819000, 425.336000, 300.998000, 422.660000, 299.674000);
        ctx.bezierCurveTo(419.248000, 296.206000, 412.537000, 301.751000, 409.662000, 298.674000);
        ctx.bezierCurveTo(408.900000, 296.103000, 407.234000, 294.436000, 404.662000, 293.674000);
        ctx.bezierCurveTo(400.371000, 291.162000, 398.017000, 294.471000, 393.664000, 294.674000);
        ctx.bezierCurveTo(391.484000, 292.584000, 394.164000, 291.820000, 393.664000, 288.675000);
        ctx.bezierCurveTo(398.627000, 279.576000, 401.837000, 266.450000, 397.663000, 253.680000);
        ctx.bezierCurveTo(396.660000, 253.683000, 396.473000, 252.869000, 395.664000, 252.680000);
        ctx.lineTo(395.664000, 256.680000);
        ctx.bezierCurveTo(396.073000, 262.243000, 400.833000, 270.779000, 396.664000, 274.677000);
        ctx.bezierCurveTo(397.087000, 276.767000, 395.978000, 277.324000, 395.664000, 278.676000);
        ctx.bezierCurveTo(394.812000, 281.491000, 392.434000, 282.779000, 392.664000, 286.676000);
        ctx.bezierCurveTo(393.758000, 291.102000, 390.970000, 291.647000, 390.664000, 294.674000);
        ctx.bezierCurveTo(386.786000, 292.896000, 378.845000, 288.979000, 377.666000, 295.674000);
        ctx.bezierCurveTo(377.527000, 291.535000, 377.941000, 287.951000, 379.666000, 285.676000);
        ctx.bezierCurveTo(380.426000, 278.770000, 383.857000, 274.535000, 382.665000, 265.678000);
        ctx.bezierCurveTo(380.840000, 261.504000, 379.953000, 256.392000, 378.666000, 251.680000);
        ctx.bezierCurveTo(376.848000, 250.498000, 377.880000, 246.467000, 376.666000, 244.681000);
        ctx.bezierCurveTo(376.961000, 240.846000, 384.916000, 240.910000, 387.665000, 242.681000);
        ctx.bezierCurveTo(387.822000, 246.504000, 383.582000, 245.930000, 381.665000, 247.680000);
        ctx.bezierCurveTo(381.849000, 248.530000, 381.275000, 248.623000, 380.666000, 248.680000);
        ctx.bezierCurveTo(381.194000, 249.484000, 381.708000, 250.303000, 381.665000, 251.680000);
        ctx.bezierCurveTo(384.283000, 254.728000, 386.473000, 258.204000, 386.665000, 263.678000);
        ctx.lineTo(386.665000, 274.677000);
        ctx.bezierCurveTo(386.346000, 276.996000, 386.825000, 278.516000, 387.665000, 279.676000);
        ctx.bezierCurveTo(394.924000, 277.786000, 393.961000, 267.508000, 392.664000, 259.679000);
        ctx.lineTo(392.664000, 258.679000);
        ctx.bezierCurveTo(390.364000, 256.313000, 392.306000, 249.705000, 391.664000, 245.680000);
        ctx.bezierCurveTo(392.468000, 245.151000, 393.287000, 244.637000, 394.664000, 244.681000);
        ctx.bezierCurveTo(396.117000, 245.228000, 399.832000, 243.512000, 399.663000, 245.680000);
        ctx.lineTo(401.662000, 245.680000);
        ctx.bezierCurveTo(400.397000, 248.081000, 395.697000, 247.047000, 395.664000, 250.680000);
        ctx.lineTo(395.664000, 251.680000);
        ctx.bezierCurveTo(398.186000, 249.146000, 406.523000, 247.713000, 401.662000, 243.681000);
        ctx.lineTo(400.663000, 243.681000);
        ctx.bezierCurveTo(397.245000, 241.934000, 393.500000, 243.150000, 390.664000, 244.681000);
        ctx.bezierCurveTo(388.263000, 257.610000, 396.404000, 269.602000, 389.664000, 277.676000);
        ctx.bezierCurveTo(388.219000, 267.123000, 387.066000, 256.277000, 382.665000, 248.680000);
        ctx.bezierCurveTo(384.075000, 246.424000, 389.177000, 247.859000, 388.665000, 243.681000);
        ctx.bezierCurveTo(389.215000, 241.464000, 386.755000, 242.257000, 386.665000, 240.682000);
        ctx.bezierCurveTo(381.933000, 240.615000, 376.823000, 240.172000, 375.666000, 243.681000);
        ctx.bezierCurveTo(376.464000, 257.301000, 385.125000, 268.332000, 378.666000, 280.676000);
        ctx.bezierCurveTo(377.888000, 286.512000, 374.592000, 294.910000, 378.666000, 299.674000);
        ctx.bezierCurveTo(381.491000, 306.847000, 383.278000, 315.059000, 385.665000, 322.671000);
        ctx.fill();

        // #path3340
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(397.663000, 342.668000);
        ctx.bezierCurveTo(395.996000, 338.003000, 389.473000, 338.193000, 383.665000, 337.669000);
        ctx.bezierCurveTo(386.202000, 341.465000, 394.561000, 339.438000, 397.663000, 342.668000);
        ctx.fill();

        // #path3342
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(400.663000, 305.673000);
        ctx.bezierCurveTo(398.901000, 306.578000, 399.011000, 309.354000, 396.664000, 309.672000);
        ctx.lineTo(394.664000, 309.672000);
        ctx.bezierCurveTo(392.332000, 306.624000, 391.211000, 304.324000, 393.664000, 300.673000);
        ctx.bezierCurveTo(391.757000, 302.433000, 389.872000, 304.214000, 387.665000, 305.673000);
        ctx.bezierCurveTo(389.135000, 310.868000, 387.057000, 319.613000, 394.664000, 318.671000);
        ctx.bezierCurveTo(394.817000, 314.115000, 395.490000, 314.748000, 394.664000, 310.672000);
        ctx.bezierCurveTo(398.442000, 310.785000, 400.040000, 308.716000, 400.663000, 305.673000);
        ctx.fill();

        // #path3344
        ctx.fillStyle = 'rgb(144, 139, 142)';
        ctx.beginPath();
        ctx.moveTo(402.662000, 298.674000);
        ctx.bezierCurveTo(401.156000, 302.500000, 398.522000, 305.199000, 395.664000, 307.673000);
        ctx.bezierCurveTo(392.392000, 302.664000, 397.443000, 295.371000, 402.662000, 298.674000);
        ctx.moveTo(393.664000, 300.673000);
        ctx.bezierCurveTo(391.211000, 304.324000, 392.332000, 306.624000, 394.664000, 309.672000);
        ctx.lineTo(396.664000, 309.672000);
        ctx.bezierCurveTo(398.376000, 305.386000, 402.877000, 303.888000, 403.662000, 298.674000);
        ctx.bezierCurveTo(402.772000, 298.230000, 401.874000, 297.796000, 401.662000, 296.674000);
        ctx.lineTo(400.663000, 296.674000);
        ctx.bezierCurveTo(397.012000, 296.689000, 396.173000, 299.516000, 393.664000, 300.673000);
        ctx.fill();

        // #path3346
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(396.664000, 309.672000);
        ctx.bezierCurveTo(399.011000, 309.354000, 398.901000, 306.578000, 400.663000, 305.673000);
        ctx.bezierCurveTo(401.820000, 303.164000, 404.646000, 302.325000, 404.662000, 298.674000);
        ctx.bezierCurveTo(403.086000, 298.584000, 403.879000, 296.123000, 401.662000, 296.674000);
        ctx.bezierCurveTo(401.874000, 297.796000, 402.772000, 298.230000, 403.662000, 298.674000);
        ctx.bezierCurveTo(402.877000, 303.888000, 398.376000, 305.386000, 396.664000, 309.672000);
        ctx.fill();

        // #path3348
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(384.665000, 299.674000);
        ctx.bezierCurveTo(382.584000, 299.108000, 381.433000, 296.816000, 379.666000, 298.674000);
        ctx.bezierCurveTo(381.284000, 300.722000, 380.446000, 305.226000, 382.665000, 306.673000);
        ctx.bezierCurveTo(383.390000, 303.614000, 380.940000, 303.732000, 381.665000, 300.673000);
        ctx.bezierCurveTo(382.842000, 300.517000, 384.503000, 300.845000, 384.665000, 299.674000);
        ctx.fill();

        // #path3350
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(393.664000, 299.674000);
        ctx.lineTo(393.664000, 300.673000);
        ctx.bezierCurveTo(396.173000, 299.516000, 397.012000, 296.689000, 400.663000, 296.674000);
        ctx.lineTo(400.663000, 295.674000);
        ctx.lineTo(405.662000, 295.674000);
        ctx.bezierCurveTo(404.903000, 294.021000, 397.422000, 294.021000, 396.664000, 295.674000);
        ctx.bezierCurveTo(397.826000, 295.512000, 398.442000, 295.895000, 398.663000, 296.674000);
        ctx.bezierCurveTo(395.746000, 296.424000, 395.213000, 298.557000, 393.664000, 299.674000);
        ctx.fill();

        // #path3352
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(387.665000, 291.675000);
        ctx.bezierCurveTo(388.474000, 291.865000, 388.661000, 292.678000, 389.664000, 292.674000);
        ctx.bezierCurveTo(390.193000, 291.870000, 390.708000, 291.051000, 390.664000, 289.675000);
        ctx.bezierCurveTo(389.860000, 289.146000, 389.041000, 288.632000, 387.665000, 288.675000);
        ctx.lineTo(387.665000, 282.676000);
        ctx.bezierCurveTo(382.134000, 282.609000, 385.420000, 290.627000, 387.665000, 291.675000);
        ctx.fill();

        // #path3354
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(379.666000, 285.676000);
        ctx.lineTo(379.666000, 289.675000);
        ctx.bezierCurveTo(383.266000, 289.408000, 384.484000, 291.521000, 387.665000, 291.675000);
        ctx.bezierCurveTo(385.420000, 290.627000, 382.134000, 282.609000, 387.665000, 282.676000);
        ctx.lineTo(387.665000, 288.675000);
        ctx.bezierCurveTo(389.041000, 288.632000, 389.860000, 289.146000, 390.664000, 289.675000);
        ctx.bezierCurveTo(390.620000, 287.965000, 391.407000, 287.085000, 392.664000, 286.676000);
        ctx.bezierCurveTo(392.434000, 282.779000, 394.812000, 281.491000, 395.664000, 278.676000);
        ctx.bezierCurveTo(392.884000, 279.229000, 392.864000, 282.543000, 391.664000, 284.676000);
        ctx.bezierCurveTo(387.529000, 282.116000, 393.059000, 279.231000, 393.664000, 275.677000);
        ctx.bezierCurveTo(390.502000, 276.848000, 391.465000, 282.144000, 386.665000, 281.676000);
        ctx.bezierCurveTo(385.019000, 281.540000, 385.019000, 274.813000, 386.665000, 274.677000);
        ctx.lineTo(386.665000, 263.678000);
        ctx.bezierCurveTo(384.509000, 262.834000, 385.821000, 258.523000, 383.665000, 257.679000);
        ctx.bezierCurveTo(383.866000, 262.478000, 386.341000, 265.002000, 385.665000, 270.678000);
        ctx.bezierCurveTo(383.479000, 270.530000, 383.518000, 268.158000, 383.665000, 265.678000);
        ctx.lineTo(382.665000, 265.678000);
        ctx.bezierCurveTo(383.857000, 274.535000, 380.426000, 278.770000, 379.666000, 285.676000);
        ctx.fill();

        // #path3356
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(396.664000, 274.677000);
        ctx.bezierCurveTo(400.833000, 270.779000, 396.073000, 262.243000, 395.664000, 256.680000);
        ctx.bezierCurveTo(395.069000, 258.750000, 396.899000, 263.248000, 394.664000, 263.678000);
        ctx.bezierCurveTo(395.372000, 259.971000, 392.956000, 259.387000, 393.664000, 255.680000);
        ctx.bezierCurveTo(392.492000, 255.840000, 392.820000, 257.502000, 392.664000, 258.679000);
        ctx.lineTo(392.664000, 259.679000);
        ctx.bezierCurveTo(394.262000, 262.414000, 394.722000, 266.285000, 394.664000, 270.678000);
        ctx.bezierCurveTo(396.405000, 264.987000, 398.646000, 271.221000, 396.664000, 274.677000);
        ctx.fill();

        // #path3358
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(386.665000, 274.677000);
        ctx.bezierCurveTo(385.019000, 274.813000, 385.019000, 281.540000, 386.665000, 281.676000);
        ctx.bezierCurveTo(391.465000, 282.144000, 390.502000, 276.848000, 393.664000, 275.677000);
        ctx.bezierCurveTo(393.254000, 273.268000, 395.490000, 273.504000, 394.664000, 270.678000);
        ctx.bezierCurveTo(394.722000, 266.285000, 394.262000, 262.414000, 392.664000, 259.679000);
        ctx.bezierCurveTo(393.961000, 267.508000, 394.924000, 277.786000, 387.665000, 279.676000);
        ctx.bezierCurveTo(386.825000, 278.516000, 386.346000, 276.996000, 386.665000, 274.677000);
        ctx.fill();

        // #path3360
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(392.664000, 258.679000);
        ctx.bezierCurveTo(392.820000, 257.502000, 392.492000, 255.840000, 393.664000, 255.680000);
        ctx.lineTo(393.664000, 253.680000);
        ctx.bezierCurveTo(393.059000, 251.285000, 392.226000, 249.117000, 392.664000, 245.680000);
        ctx.bezierCurveTo(393.826000, 245.843000, 394.443000, 245.459000, 394.664000, 244.681000);
        ctx.bezierCurveTo(393.287000, 244.637000, 392.468000, 245.151000, 391.664000, 245.680000);
        ctx.bezierCurveTo(392.306000, 249.705000, 390.364000, 256.313000, 392.664000, 258.679000);
        ctx.fill();

        // #path3362
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(383.665000, 257.679000);
        ctx.bezierCurveTo(384.734000, 253.943000, 381.182000, 254.829000, 381.665000, 251.680000);
        ctx.bezierCurveTo(381.708000, 250.303000, 381.194000, 249.484000, 380.666000, 248.680000);
        ctx.bezierCurveTo(381.275000, 248.623000, 381.849000, 248.530000, 381.665000, 247.680000);
        ctx.bezierCurveTo(382.394000, 245.409000, 384.674000, 244.689000, 386.665000, 243.681000);
        ctx.bezierCurveTo(385.920000, 241.426000, 381.056000, 243.289000, 378.666000, 242.681000);
        ctx.bezierCurveTo(376.929000, 246.012000, 379.170000, 247.116000, 378.666000, 251.680000);
        ctx.bezierCurveTo(379.953000, 256.392000, 380.840000, 261.504000, 382.665000, 265.678000);
        ctx.lineTo(383.665000, 265.678000);
        ctx.bezierCurveTo(383.518000, 268.158000, 383.479000, 270.530000, 385.665000, 270.678000);
        ctx.bezierCurveTo(386.341000, 265.002000, 383.866000, 262.478000, 383.665000, 257.679000);
        ctx.fill();

        // #path3364
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(386.665000, 263.678000);
        ctx.bezierCurveTo(386.473000, 258.204000, 384.283000, 254.728000, 381.665000, 251.680000);
        ctx.bezierCurveTo(381.182000, 254.829000, 384.734000, 253.943000, 383.665000, 257.679000);
        ctx.bezierCurveTo(385.821000, 258.523000, 384.509000, 262.834000, 386.665000, 263.678000);
        ctx.fill();

        // #path3366
        ctx.fillStyle = 'rgb(97, 82, 102)';
        ctx.beginPath();
        ctx.moveTo(378.666000, 251.680000);
        ctx.bezierCurveTo(379.170000, 247.116000, 376.929000, 246.012000, 378.666000, 242.681000);
        ctx.bezierCurveTo(381.056000, 243.289000, 385.920000, 241.426000, 386.665000, 243.681000);
        ctx.bezierCurveTo(384.674000, 244.689000, 382.394000, 245.409000, 381.665000, 247.680000);
        ctx.bezierCurveTo(383.582000, 245.930000, 387.822000, 246.504000, 387.665000, 242.681000);
        ctx.bezierCurveTo(384.916000, 240.910000, 376.961000, 240.846000, 376.666000, 244.681000);
        ctx.bezierCurveTo(377.880000, 246.467000, 376.848000, 250.498000, 378.666000, 251.680000);
        ctx.fill();

        // #path3368
        ctx.fillStyle = 'rgb(93, 71, 64)';
        ctx.beginPath();
        ctx.moveTo(393.664000, 253.680000);
        ctx.bezierCurveTo(394.474000, 253.489000, 394.661000, 252.676000, 395.664000, 252.680000);
        ctx.lineTo(395.664000, 251.680000);
        ctx.lineTo(395.664000, 250.680000);
        ctx.bezierCurveTo(394.434000, 250.243000, 393.610000, 249.400000, 393.664000, 247.680000);
        ctx.bezierCurveTo(393.775000, 245.125000, 397.012000, 245.695000, 399.663000, 245.680000);
        ctx.bezierCurveTo(399.832000, 243.512000, 396.117000, 245.228000, 394.664000, 244.681000);
        ctx.bezierCurveTo(394.443000, 245.459000, 393.826000, 245.843000, 392.664000, 245.680000);
        ctx.bezierCurveTo(392.226000, 249.117000, 393.059000, 251.285000, 393.664000, 253.680000);
        ctx.fill();

        // #path3370
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(395.664000, 278.676000);
        ctx.bezierCurveTo(395.978000, 277.324000, 397.087000, 276.767000, 396.664000, 274.677000);
        ctx.bezierCurveTo(398.646000, 271.221000, 396.405000, 264.987000, 394.664000, 270.678000);
        ctx.bezierCurveTo(395.490000, 273.504000, 393.254000, 273.268000, 393.664000, 275.677000);
        ctx.bezierCurveTo(393.059000, 279.231000, 387.529000, 282.116000, 391.664000, 284.676000);
        ctx.bezierCurveTo(392.864000, 282.543000, 392.884000, 279.229000, 395.664000, 278.676000);
        ctx.fill();

        // #path3372
        ctx.fillStyle = 'rgb(64, 55, 53)';
        ctx.beginPath();
        ctx.moveTo(395.664000, 250.680000);
        ctx.bezierCurveTo(395.697000, 247.047000, 400.397000, 248.081000, 401.662000, 245.680000);
        ctx.lineTo(399.663000, 245.680000);
        ctx.bezierCurveTo(397.012000, 245.695000, 393.775000, 245.125000, 393.664000, 247.680000);
        ctx.bezierCurveTo(393.610000, 249.400000, 394.434000, 250.243000, 395.664000, 250.680000);
        ctx.fill();
        ctx.restore();
        ctx.restore();
    }
}