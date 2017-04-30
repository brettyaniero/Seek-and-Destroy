// JavaScript source code

var storeMenu;


function build_StoreMenu() {

    var title = preloader.getResult("store_button");
    var title_image = new createjs.Bitmap(title);
    title_image.scaleX = 1;
    title_image.scaleY = 1;
    title_image.x = 375;
    title_image.y = 10;

    var watch = preloader.getResult("stopwatch");
    var watch_image = new createjs.Bitmap(watch);
    watch_image.scaleX = 0.2;
    watch_image.scaleY = 0.2;
    watch_image.y = 140;
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
    var buy = preloader.getResult("buy");

    var storeGroup = new ButtonGroup(play_button.width + 30, 30, "#21ba2b");
    storeGroup.addButton(play_button, "#21ba2b", handlePlayEvent);
    storeGroup.setScale(0.55);
    storeGroup.setXPosition(stage.canvas.width / 2);
    storeGroup.setYPosition(600);

    var buyGroup = new ButtonGroup(buy.width + 30, 30, "#21ba2b",380);
    buyGroup.addButton(buy, "#21ba2b", handleTimeBonusEvent);
    buyGroup.addButton(buy, "#21ba2b", handleSpeedBonusEvent);
    buyGroup.addButton(buy, "#21ba2b", handleFlashlightBonusEvent);
    buyGroup.setScale(0.4);
    buyGroup.setXPosition(900);
    buyGroup.setYPosition(200);

    var line = new createjs.Graphics();
    line.beginFill("#2AF620").drawRect(0, 0, 1000, 3);
    var line1 = new createjs.Shape(line);
    line1.x = 0;
    line1.y = 115;

    var line2 = line1.clone(true)
    line2.x = 0;
    line2.y = 275;

    var line3 = line1.clone(true)
    line3.x = 0;
    line3.y = 435;

    description1 = new createjs.Text("Time Bonus\n\nIncreases the amount of time you have by\n\n10 seconds for each purchase.", "18px courier", "#2AF620");
    description1.textAlign = "left";
    description1.x = 185;
    description1.y = 175;

    description2 = new createjs.Text("Speed Boost\n\nIncreases the speed of the tank", "18px courier", "#2AF620");
    description2.textAlign = "left";
    description2.x = 185;
    description2.y = 335;

    description3 = new createjs.Text("Flashlight Size Increase\n\nIncreases the size of the flashlight", "18px courier", "#2AF620");
    description3.textAlign = "left";
    description3.x = 185;
    description3.y = 480;

    storeMenu = new Menu();
    //storeMenu.playMusic("menu_music");
    storeMenu.addElement(title_image);
    storeMenu.addElement(watch_image);
    storeMenu.addElement(arrow_image);
    storeMenu.addElement(spot_image);
    storeMenu.addElement(line1);
    storeMenu.addElement(line2);
    storeMenu.addElement(line3);
    storeMenu.addElement(description1);
    storeMenu.addElement(description2);
    storeMenu.addElement(description3);
    storeMenu.addElement(storeGroup.getContainer());
    storeMenu.addElement(buyGroup.getContainer());

    storeMenu.setVisible(true);
}

function handleTimeBonusEvent() {
    if( score >= 1)
        timePerLevel += 10
    score -= 1;
   // else()
}

function handleSpeedBonusEvent() {
    if( score >= 1)
        TANK_SPEED = 3;
    ROTATION_SPEED = 3;
    score -= 1;
   // else()
}

function handleFlashlightBonusEvent() {
    if (score >= 1)
        spotlightRadius = 120;
    score -= 1;
   // else()
}

