
var preloader;
var canvas;
var stage;

var GameStates = {
    MAIN_MENU: 0, 
    STORE: 10,
    INSTRUCTIONS: 20,
    GAME: 30,
    GAMEOVER: 40,
    GAMEWIN: 50
}
var currentGameState;

var startMenu;
var mistImage;
var mapImage;
var menuSpotlight;
var spotlightPercent = 0;
var spotlightStartPt;
var spotlightEndPt;
var crosshairsImage;
var instructionsMenu;
var storeMenu;

var spotlight;
var spotlightBorder;
var spotlightRadius;

var gameUI;
var enemyTank;
var enemyTankOutline;
var enemyTankMask;
var playerTank;

var pathContainer;

var startTime;
var timerText;
var timerRefreshIntervalID;
var timePerLevel = 30;
var gameOverTextRefreshIntervalID;
var endMenu;
var winMenu;
var score = 0;
var seconds;

function load() {
    preloader = new createjs.LoadQueue(false);
    preloader.installPlugin(createjs.Sound);
    preloader.addEventListener("complete", init);
    preloader.loadManifest([
        { id: "menu_title", src: "Assets/menu_title.png" },
        { id: "play_button", src: "Assets/play_button.png" },
        { id: "instructions_button", src: "Assets/instructions_button.png" },
        { id: "store_button", src: "Assets/store_button.png" },
        { id: "map", src: "Assets/map.jpg" },
        { id: "crosshairs", src: "Assets/crosshairs.png" }, 
        { id: "mist", src: "Assets/mist.png" }, 
        { id: "menu_music", src: "Assets/menu_music.mp3" },
        { id: "brick", src: "Assets/brick.jpg" },
        { id: "stopwatch", src: "Assets/stopwatch.png" },
        { id: "speed_arrow", src: "Assets/arrow.png" },
        { id: "big_spotlight", src: "Assets/big_spotlight.png" },
        { id: "enemy", src: "Assets/enemy.png" },
        { id: "buy", src: "Assets/buy.png" },
        { id: "player", src: "Assets/player.png" },
        { id: "bullet", src: "Assets/bullet.png" },
        { id: "explosion", src: "Assets/explosion.png" },
        { id: "menu_button", src: "Assets/menu.png" }
    ]);
}

function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", run);
    buildStartMenu();
    gameUI = new Menu();
    spotlightRadius = 400;

    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
}

function buildStartMenu() {
    currentGameState = GameStates.MAIN_MENU;

    var mist = preloader.getResult("mist");
    mistImage = new createjs.Shape();
    mistImage.graphics.beginBitmapFill(mist).drawRect(0, 0, stage.canvas.width + mist.width, mist.height);
    mistImage.tileW = mist.width;
    mistImage.y = -150;

    var map = preloader.getResult("map");
    mapImage = new createjs.Bitmap(map);
    mapImage.scaleX = 0.55;
    mapImage.scaleY = 0.55;

    initSpotlight();
    mapImage.mask = menuSpotlight;

    var title = preloader.getResult("menu_title");
    var title_image = new createjs.Bitmap(title);
    title_image.scaleX = 0.9;
    title_image.scaleY = 0.9;
    
    var play_button = preloader.getResult("play_button");
    var instructions_button = preloader.getResult("instructions_button");
    var store_button = preloader.getResult("store_button");

    title_image.x = (stage.canvas.width - (title.width * title_image.scaleX)) / 2;
    title_image.y = 0.03 * stage.canvas.height;

    var buttonGroup = new ButtonGroup(instructions_button.width + 30, 30, "#21ba2b", 150);
    buttonGroup.addButton(play_button, "#21ba2b", handlePlayEvent);
    buttonGroup.addButton(instructions_button, "#21ba2b", handleInstructionsEvent);
    buttonGroup.addButton(store_button, "#21ba2b", handleStoreEvent);
    buttonGroup.setScale(0.55);
    buttonGroup.setXPosition(stage.canvas.width / 2);
    buttonGroup.setYPosition(415);

    startMenu = new Menu();
    startMenu.playMusic("menu_music");
    startMenu.addElement(mapImage);
    startMenu.addElement(menuSpotlight);
    startMenu.addElement(crosshairsImage);
    startMenu.addElement(title_image);
    startMenu.addElement(buttonGroup.getContainer());
    startMenu.addElement(mistImage);

    startMenu.setVisible(true);
}
function build_Instructions() {
    var title = preloader.getResult("instructions_button");
    var title_image = new createjs.Bitmap(title);
    title_image.scaleX = 1;
    title_image.scaleY = 1;
    title_image.x = 175;

    var play_button = preloader.getResult("play_button");

    instruction1 = new createjs.Text("Your mission, if you choose to accept, is to eliminate the enemy tank. \n\nYou must find and eliminate the enemy by any means possible. \n\nUse the arrow keys to move, and the spacebar to fire. \n\nPurchase upgrades in the store by successfully eliminating the enemy.", "18px courier", "#2AF620");
    instruction1.textAlign = "left";
    instruction1.x = 105;
    instruction1.y = 175;

    var instructionsGroup = new ButtonGroup(play_button.width + 30, 30, "#21ba2b", 150);
    instructionsGroup.addButton(play_button, "#21ba2b", handlePlayEvent);
    instructionsGroup.setScale(0.55);
    instructionsGroup.setXPosition(stage.canvas.width / 2);
    instructionsGroup.setYPosition(600);

    instructionsMenu = new Menu();
    
    //storeMenu.playMusic("menu_music");
    instructionsMenu.addElement(instruction1);
    instructionsMenu.addElement(title_image);
    instructionsMenu.addElement(instructionsGroup.getContainer());
    instructionsMenu.setVisible(true);
}


function initSpotlight() {
    var graphics = new createjs.Graphics();
    graphics.beginFill("white").drawCircle(0, 0, 80);
    menuSpotlight = new createjs.Shape(graphics);
    menuSpotlight.alpha = 0;

    var crosshairs = preloader.getResult("crosshairs");
    crosshairsImage = new createjs.Bitmap(crosshairs);
    crosshairsImage.regX = crosshairs.width / 2;
    crosshairsImage.regY = crosshairs.height / 2;

    spotlightStartPt = {
        x: stage.canvas.width / 2,
        y: stage.canvas.height / 2
    };

    spotlightEndPt = {
        x: Math.random() * stage.canvas.width,
        y: Math.random() * stage.canvas.height
    };
}

function run(event) {
    if (currentGameState === GameStates.MAIN_MENU) {
        // Update spotlight position
        var xy = updateSpotlightXY({
            x: spotlightStartPt.x,
            y: spotlightStartPt.y
        }, {
            x: spotlightEndPt.x,
            y: spotlightEndPt.y
            }, spotlightPercent);

        spotlightPercent += 0.005;
        
        menuSpotlight.x = xy.x;
        menuSpotlight.y = xy.y;
        crosshairsImage.x = menuSpotlight.x;
        crosshairsImage.y = menuSpotlight.y;

        var deltaS = event.delta / 1000;
        mistImage.x = (mistImage.x - deltaS * 100) % mistImage.tileW;
    }
    else if (currentGameState === GameStates.GAME) {
        handleKeyboardEvents();
    }

    stage.update();
}

function updateSpotlightXY(startPt, endPt, percent) {
    if (percent <= 1) {
        var dx = endPt.x - startPt.x;
        var dy = endPt.y - startPt.y;
        var X = startPt.x + dx * percent;
        var Y = startPt.y + dy * percent;
        return ({
            x: X,
            y: Y
        });
    }
    else {
        spotlightPercent = 0;
        spotlightStartPt = {
            x: menuSpotlight.x,
            y: menuSpotlight.y 
        };

        spotlightEndPt = {
            x: Math.random() * stage.canvas.width,
            y: Math.random() * stage.canvas.height
        };
        return ({
            x: spotlightStartPt.x,
            y: spotlightStartPt.y
        });
    }
}

function handlePlayEvent() {

    if (currentGameState === GameStates.MAIN_MENU) {
        startMenu.setVisible(false);
    }
    else if (currentGameState === GameStates.INSTRUCTIONS) {
        instructionsMenu.setVisible(false);
    }
    else if (currentGameState === GameStates.STORE) {
        storeMenu.setVisible(false);
    }
    else if (currentGameState === GameStates.GAMEOVER) {
        endMenu.setVisible(false);
    }
    else if (currentGameState === GameStates.GAMEWIN) {
        winMenu.setVisible(false);
    }

    var background = new createjs.Shape();
    background.graphics.beginFill("#2AF620").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    gameUI.addElement(background);
    generateMaze(6, 5, 15);
    spawnTanks(6, 5, 15);

    spotlight = new createjs.Shape();
    spotlight.graphics.beginFill("#FFFFFF").drawCircle(0, 0, spotlightRadius);
    spotlight.x = playerTank.x;
    spotlight.y = playerTank.y;
    spotlight.alpha = 0;
    gameUI.addElement(spotlight);

    spotlightBorder = new createjs.Shape();
    spotlightBorder.graphics.beginStroke("black").drawCircle(0, 0, spotlightRadius);
    spotlightBorder.x = playerTank.x;
    spotlightBorder.y = playerTank.y;
    gameUI.addElement(spotlightBorder);

    pathContainer.mask = spotlight;
    background.mask = spotlight;
    enemyTank.mask = spotlight;



    gameUI.setVisible(true);
    //endMenu.setVisible(false);
    currentGameState = GameStates.GAME;
    startTimer(timePerLevel);
}



function handleInstructionsEvent() {
    startMenu.setVisible(false);
    currentGameState = GameStates.INSTRUCTIONS;
    build_Instructions();
}

function handleStoreEvent() {
    startMenu.setVisible(false);
    currentGameState = GameStates.STORE;
    build_StoreMenu();
}
function handleGameOverEvent() {
    gameUI.setVisible(false);
    currentGameState = GameStates.GAMEOVER;
    gameOver();
}
function handleWinEvent() {
    gameUI.setVisible(false);
    currentGameState = GameStates.GAMEWIN;
    score += 1;
    
    gameWin();
}

//Timer


function startTimer(duration) {

    timerText = new createjs.Text(":" + timePerLevel, "bold 48px Arial", "red");
    timerText.textBaseline = "right";
    timerText.x = canvas.width - 80;
    timerText.y = 45;
    gameUI.addElement(timerText);

    timerRefreshIntervalID = setInterval(incrementTimer, 1000);
    seconds = timePerLevel;

    function incrementTimer() {
        seconds--;

        if (seconds < 10) {
            timerText.text = ":0" + seconds;
             
            if (seconds === 0) {
                setTimeout(function () {
                    clearInterval(timerRefreshIntervalID);
                    handleGameOverEvent();
                }, 500);
            }
        }
        else {
            timerText.text = ":" + seconds;
        }
    }
}


//Game Over

function gameOver() {
   
   
    endMenu = new Menu();
    var gameOverText = new createjs.Text("GAME OVER", "bold 36px Arial", "white");
    gameOverText.textBaseline = "middle";
    gameOverText.textAlign = "center";
    gameOverText.x = canvas.width / 2;
    gameOverText.y = canvas.height / 2;
    endMenu.addElement(gameOverText);

    gameOverTextRefreshIntervalID = setInterval(toggleText, 1000);

    function toggleText() {
        if (gameOverText.alpha === 1) {
            gameOverText.alpha = 0;
        }
        else {
            gameOverText.alpha = 1;
        }

        stage.update();
    }
    endMenu.setVisible(true);
    
    
    var play_button = preloader.getResult("play_button")
    var instructionsGroup = new ButtonGroup(play_button.width + 30, 30, "#21ba2b", 150);
    instructionsGroup.addButton(play_button, "#21ba2b", handlePlayEvent);
    instructionsGroup.setScale(0.55);
    instructionsGroup.setXPosition(300);
    instructionsGroup.setYPosition(600);
    endMenu.addElement(instructionsGroup.getContainer());

    var store_button = preloader.getResult("store_button")
    var storeGroup = new ButtonGroup(store_button.width + 30, 30, "#21ba2b", 150);
    storeGroup.addButton(store_button, "#21ba2b", handleStoresEvent);
    storeGroup.setScale(0.55);
    storeGroup.setXPosition(750);
    storeGroup.setYPosition(600);
    endMenu.addElement(storeGroup.getContainer());
    
    var scoreText = new createjs.Text("Score: " + score, "bold 24px Arial", "white");
    scoreText.textBaseline = "middle";
    scoreText.textAlign = "center";
    scoreText.x = canvas.width / 2;
    scoreText.y = canvas.height - 275;
    endMenu.addElement(scoreText);

    stage.update();
}

function gameWin() {

    clearInterval(timerRefreshIntervalID);
    createjs.Sound.stop("game_soundtrack1");
    createjs.Sound.play("game_over");
    winMenu = new Menu();
    var winText = new createjs.Text("MISSION ACCOMPLISHED", "bold 36px Arial", "white");
    winText.textBaseline = "middle";
    winText.textAlign = "center";
    winText.x = canvas.width / 2;
    winText.y = canvas.height / 2;
    winMenu.addElement(winText);

    gameOverTextRefreshIntervalID = setInterval(toggleText, 1000);

    function toggleText() {
        if (winText.alpha === 1) {
            winText.alpha = 0;
        }
        else {
            winText.alpha = 1;
        }

        stage.update();
    }
    winMenu.setVisible(true);


    var play_button = preloader.getResult("play_button")
    var instructionsGroup = new ButtonGroup(play_button.width + 30, 30, "#21ba2b", 150);
    instructionsGroup.addButton(play_button, "#21ba2b", handlePlayEvent);
    instructionsGroup.setScale(0.55);
    instructionsGroup.setXPosition(300);
    instructionsGroup.setYPosition(600);
    winMenu.addElement(instructionsGroup.getContainer());

    var store_button = preloader.getResult("store_button")
    var storeGroup = new ButtonGroup(store_button.width + 30, 30, "#21ba2b", 150);
    storeGroup.addButton(store_button, "#21ba2b", handleStoresEvent);
    storeGroup.setScale(0.55);
    storeGroup.setXPosition(700);
    storeGroup.setYPosition(600);
    winMenu.addElement(storeGroup.getContainer());

    var scoreText = new createjs.Text("Score: " + score, "bold 24px Arial", "white");
    scoreText.textBaseline = "middle";
    scoreText.textAlign = "center";
    scoreText.x = canvas.width / 2;
    scoreText.y = canvas.height - 275;
    winMenu.addElement(scoreText);
    
    stage.update();
}

function handleMenuEvent() {
    if (currentGameState === GameStates.GAMEOVER) {
        endMenu.setVisible(false);
    }
    else if (currentGameState === GameStates.GAMEWIN) {
        winMenu.setVisible(false);
    }
    currentGameState = GameStates.MAIN_MENU;
    buildStartMenu();
}
function handleStoresEvent() {
    if (currentGameState === GameStates.GAMEOVER) {
        endMenu.setVisible(false);
    }
    else if (currentGameState === GameStates.GAMEWIN) {
        winMenu.setVisible(false);
    }
    currentGameState = GameStates.STORE;
    build_StoreMenu();
}