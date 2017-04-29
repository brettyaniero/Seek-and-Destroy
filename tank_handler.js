
/**
 * Spawns an enemy tank at a randomized location in the maze.
 *
 * @param {any} width how many units wide the maze is
 * @param {any} height how many units high the maze is
 */

function randomizeEnemyTank(width, height) {
    var unitWidth = stage.canvas.width / width;
    var unitHeight = stage.canvas.height / height;
    var targetUnit = Math.floor(Math.random() * (width * height));
    var targetUnitRow = (targetUnit > width) ? Math.ceil(targetUnit / width) - 1 : 0;
    var targetUnitColumn = (targetUnit % width != 0) ? targetUnit % width - 1 : width - 1;

    var enemy = preloader.getResult("enemy");
    var enemyTank = new createjs.Bitmap(enemy);
    enemyTank.regX = enemy.width / 2;
    enemyTank.x = targetUnitColumn * unitWidth + unitWidth / 2;
    enemyTank.regY = enemy.height / 2;
    enemyTank.y = targetUnitRow * unitHeight + unitHeight / 2;
    stage.addChild(enemyTank);
}
