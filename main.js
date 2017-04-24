
var preloader, canvas, stage;

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
        { id: "menu_music", src: "Assets/menu_music.mp3"}
    ]);
}

function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", run);
    createjs.Ticker.addEventListener(stage);
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
    buttonGroup.addButton(play_button, "#21ba2b");
    buttonGroup.addButton(instructions_button, "#21ba2b");
    buttonGroup.addButton(store_button, "#21ba2b");
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