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

const TANK_SPEED = 2;
const ROTATION_SPEED = 2;
const BULLET_SPEED = 5;

var hits = 0;

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
    else {
        playerTank.x -= TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        playerTank.y -= TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlight.x -= TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlight.y -= TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlightBorder.x -= TANK_SPEED * Math.cos(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
        spotlightBorder.y -= TANK_SPEED * Math.sin(playerTank.rotation * (Math.PI / 180) - Math.PI / 2);
    }
}
