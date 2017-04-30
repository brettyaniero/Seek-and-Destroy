/**
 * @keyboard_handler.js
 * This file contains the code to handle all keyboard input
 *
 */

const SPACEBAR = 32;
const ARROW_KEY_LEFT = 37;
const ARROW_KEY_UP = 38;
const ARROW_KEY_RIGHT = 39;
const ARROW_KEY_DOWN = 40;
var leftKeyDown = false;
var upKeyDown = false;
var rightKeyDown = false;
var downKeyDown = false;

var TANK_SPEED = 2;
var ROTATION_SPEED = 2;
const BULLET_SPEED = 5;

var hits = 0;
var bulletStream = [];

 data = {
    images: ["Assets/explosion.png"],
    frames: { width: 64, height: 64, regX: 32, regY: 64, spacing: 0, count: 24, margin: 0 },
    animations: {
        stand: 0,
        explode: [1, 24, , .3]   // start,end,next*,speed*
    }
};


function handleKeyboardEvents() {
    var topX = playerTank.x - (playerTank.image.height / 2) * Math.sin(playerTank.rotation * (Math.PI / -180));
    var topY = playerTank.y - (playerTank.image.height / 2) * Math.cos(playerTank.rotation * (Math.PI / -180));

    var bottomX = playerTank.x + (playerTank.image.height / 2) * Math.sin(playerTank.rotation * (Math.PI / -180));
    var bottomY = playerTank.y + (playerTank.image.height / 2) * Math.cos(playerTank.rotation * (Math.PI / -180));

    if (leftKeyDown && upKeyDown) {
        playerTank.rotation -= ROTATION_SPEED;
        advanceTankForward(topX, topY);
    }
    else if (rightKeyDown && upKeyDown) {
        playerTank.rotation += ROTATION_SPEED;
        advanceTankForward(topX, topY);
    }
    else if (leftKeyDown && downKeyDown) {
        playerTank.rotation -= ROTATION_SPEED;
        advanceTankBackward(bottomX, bottomY);
    }
    else if (rightKeyDown && downKeyDown) {
        playerTank.rotation += ROTATION_SPEED;
        advanceTankBackward(bottomX, bottomY);
    }
    else if (upKeyDown) {
        advanceTankForward(topX, topY);
    }
    else if (downKeyDown) {
        advanceTankBackward(bottomX, bottomY);
    }
    else if (leftKeyDown) {
        playerTank.rotation -= ROTATION_SPEED;
    }
    else if (rightKeyDown) {
        playerTank.rotation += ROTATION_SPEED;
    }

    for (element in bulletStream) {
        var bullet = bulletStream[element];

        bullet.x -= Math.sin(bullet.rotation * (Math.PI / -180)) * BULLET_SPEED;
        bullet.y -= Math.cos(bullet.rotation * (Math.PI / -180)) * BULLET_SPEED;

        if (!pathContainer.hitTest(bullet.x, bullet.y)) {
            // Get rid of that bullet
            bullet.x = -10;
            gameUI.removeElement(bullet);
        }

        if (enemyTankMask.hitTest(bullet.x, bullet.y)) {
            bullet.x = -10;
            hits += 1;

            if (hits <= 1) {
                gameUI.removeElement(enemyTank);
                
                var spritesheet = new createjs.SpriteSheet(data);

                exploding = new createjs.Sprite(spritesheet, 'explode');
                exploding.x = enemyTankOutline.x;
                exploding.y = enemyTankOutline.y + 30;
                gameUI.addElement(exploding);

                gameUI.removeElement(enemyTankMask);
                handleWinEvent();
            }
        }
    }
}

function handleKeyDown(e) {
    switch (e.keyCode) {
        case ARROW_KEY_LEFT:
            leftKeyDown = true;
            break;
        case ARROW_KEY_UP:
            upKeyDown = true;
            break;
        case ARROW_KEY_RIGHT:
            rightKeyDown = true;
            break;
        case ARROW_KEY_DOWN:
            downKeyDown = true;
            break;
    }
}

function handleKeyUp(e) {
    switch (e.keyCode) {
        case ARROW_KEY_LEFT:
            leftKeyDown = false;
            break;
        case ARROW_KEY_UP:
            upKeyDown = false;
            break;
        case ARROW_KEY_RIGHT:
            rightKeyDown = false;
            break;
        case ARROW_KEY_DOWN:
            downKeyDown = false;
            break;
        case SPACEBAR:
            fireBullet();
            break;
    }
}

function advanceTankForward(upperX, upperY) {
    if (!pathContainer.hitTest(upperX, upperY)) {
        // Make tank stop
    }
    else if (enemyTankOutline.hitTest(upperX, upperY)) {
        // Make tank stop
    }
    else {
        playerTank.x += TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        playerTank.y += TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlight.x += TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlight.y += TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlightBorder.x += TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlightBorder.y += TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
    }
}

function advanceTankBackward(lowerX, lowerY) {
    if (!pathContainer.hitTest(lowerX, lowerY)) {
        // Make tank stop
    }
    else if (enemyTankOutline.hitTest(lowerX, lowerY)) {
        // Make tank stop
    }
    else {
        playerTank.x -= TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        playerTank.y -= TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlight.x -= TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlight.y -= TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlightBorder.x -= TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlightBorder.y -= TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
    }
}

function fireBullet() {
    var bullet_img = preloader.getResult("bullet");
    var bullet = new createjs.Bitmap(bullet_img);
    bullet.regX = bullet.image.width / 2;
    bullet.regY = bullet.image.height / 2;
    
    bullet.x = playerTank.x - (playerTank.image.height / 2) * Math.sin(playerTank.rotation * (Math.PI / -180));
    bullet.y = playerTank.y - (playerTank.image.height / 2) * Math.cos(playerTank.rotation * (Math.PI / -180));
    bullet.rotation = playerTank.rotation;

    bullet.mask = spotlight;

    bulletStream[bulletStream.length] = bullet;

    gameUI.addElement(bullet);
}

