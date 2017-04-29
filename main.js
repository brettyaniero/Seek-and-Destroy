
var preloader;
var canvas;
var stage;

var GameStates = {
    MAIN_MENU: 0
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
        { id: "enemy", src: "Assets/enemy.png" }
    ]);
}

function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", run);
    buildStartMenu();
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

    var buttonGroup = new ButtonGroup(instructions_button.width + 30, 30, "#21ba2b");
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

function build_StoreMenu() {

    var title = preloader.getResult("store_button");
    var title_image = new createjs.Bitmap(title);
    title_image.scaleX = 1;
    title_image.scaleY = 1;
    title_image.x = 375;

    var watch = preloader.getResult("stopwatch");
    var watch_image = new createjs.Bitmap(watch);
    watch_image.scaleX = 0.3;
    watch_image.scaleY = 0.3;
    watch_image.y = 125;
    watch_image.x = 25;


    var arrow = preloader.getResult("speed_arrow");
    var arrow_image = new createjs.Bitmap(arrow);
    arrow_image.scaleX = 0.2;
    arrow_image.scaleY = 0.2;
    arrow_image.y = 300;
    arrow_image.x = 25;

    var big_spot = preloader.getResult("big_spotlight");
    var spot_image = new createjs.Bitmap(big_spot);
    spot_image.scaleX = 0.7;
    spot_image.scaleY = 0.7;
    spot_image.y = 450;
    spot_image.x = 25;

    var play_button = preloader.getResult("play_button");

    var storeGroup = new ButtonGroup(play_button.width + 30, 30, "#21ba2b");
    storeGroup.addButton(play_button, "#21ba2b", handlePlayEvent);
    storeGroup.setScale(0.55);
    storeGroup.setXPosition(stage.canvas.width / 2);
    storeGroup.setYPosition(600);


    storeMenu = new Menu();
    //storeMenu.playMusic("menu_music");
    storeMenu.addElement(title_image);
    storeMenu.addElement(watch_image);
    storeMenu.addElement(arrow_image);
    storeMenu.addElement(spot_image);
    storeMenu.addElement(storeGroup.getContainer());

    storeMenu.setVisible(true);
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
    startMenu.setVisible(false);
    var background = new createjs.Shape();
    background.graphics.beginFill("#2AF620").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    stage.addChild(background);
    generateMaze(9, 8, 50);
    randomizeEnemyTank(9, 8);
}

function handleInstructionsEvent() {

}

function handleStoreEvent() {
    startMenu.setVisible(false);
    build_StoreMenu();
}