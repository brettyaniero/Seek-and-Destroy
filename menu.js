/**
 * @Menu.js 
 * The Menu object can be used to create a new instance
 * of a menu, which can then be drawn to the canvas.
 *
 */

function Menu() {
    var menuContainer = new createjs.Container();
    var menuMusic = "";

    this.addElement = function (element) {
        menuContainer.addChild(element);
    };

    this.removeElement = function (element) {
        menuContainer.removeChild(element);
    }

    this.setVisible = function (value) {
        if (value) {
            stage.addChild(menuContainer);
        }
        else {
            stage.removeChild(menuContainer);
            createjs.Sound.stop(menuMusic);
        }
    };

    this.playMusic = function (musicID) {
        menuMusic = musicID;
        createjs.Sound.play(menuMusic);
    }
}