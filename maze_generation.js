
/**
 * Generates a maze made up of rectangle shapes using a recursive
 * backtracker algorithm.
 * 
 * @param {any} width     how wide the grid should be 
 * @param {any} height    how high the grid should be
 * @param {any} startUnit where the algorithm should start the maze
 */

function generateMaze(width, height, startUnit) {
    // Metrics to be used in algorithm calculations
    var unitWidth = stage.canvas.width / width;
    var unitHeight = stage.canvas.height / height;
    var uncheckedUnits = width * height - 1;

    // Container to store the path shape objects that are created
    var pathContainer = new createjs.Container();

    // The stack to be used for storing points as the algorithm
    // generates the maze
    var gridStack = [];

    // The stack to be used to store units that have already been visited
    var visitedUnits = [];

    // Begin maze generation algorithm
    var currentUnit = startUnit;

    // Draw start square
    var startRow = (currentUnit > width) ? Math.ceil(currentUnit / width) - 1: 0;
    var startColumn = (currentUnit % width != 0) ? currentUnit % width  - 1: width - 1;
    var startSquare = new createjs.Shape();
    startSquare.graphics.beginStroke("black").beginFill("black").drawRect(0, 0, unitWidth, unitHeight);
    startSquare.x = startColumn * unitWidth;
    startSquare.y = startRow * unitHeight;
    pathContainer.addChild(startSquare);

    gridStack.push(startUnit);

    while (uncheckedUnits > 0) {
        var openPaths = [];
        var row = (currentUnit > width) ? Math.ceil(currentUnit / width)  - 1: 0;
        var column = (currentUnit % width != 0) ? currentUnit % width - 1: width - 1;

        // Check unit to left (if there is one)
        if (currentUnit > 1 && ((currentUnit - 1) % 7) != 0) {
            if (visitedUnits.indexOf(currentUnit - 1) < 0)
                openPaths.push(currentUnit - 1);
        }
        // Check unit to right (if there is one)
        if (currentUnit % width != 0) {
            if (visitedUnits.indexOf(currentUnit + 1) < 0)
                openPaths.push(currentUnit + 1);
        }
        // Check unit above (if there is one)
        if ((currentUnit - width > 0)) {
            if (visitedUnits.indexOf(currentUnit - width) < 0)
                openPaths.push(currentUnit - width);
        }
        // Check unit below (if there is one)
        if ((currentUnit + width) <= width * height) {
            if (visitedUnits.indexOf(currentUnit + width) < 0)
                openPaths.push(currentUnit + width);
        }

        // Get length of open paths array and store into variable
        var paths = openPaths.length;

        if (paths > 0) {
            visitedUnits.push(currentUnit);
            gridStack.push(currentUnit);

            // Choose random index of path
            var index = Math.floor(Math.random() * paths);

            // Change current unit to the new unit
            currentUnit = openPaths[index];
            var newRow = (currentUnit > width) ? Math.ceil(currentUnit / width) - 1 : 0;
            var newColumn = (currentUnit % width != 0) ? currentUnit % width - 1 : width - 1;

            var path = new createjs.Shape();

            // Check if position has moved horizontally
            if (newColumn != column) {
                // Check if position has moved to the left
                if (column - newColumn === 1) {
                    path.graphics.beginStroke("black").beginFill("black").drawRect(0, 0, unitWidth, 2 / 3 * unitHeight);
                    path.regY = (2 / 3 * unitHeight) / 2;
                    path.y = newRow * unitHeight + unitHeight / 2;
                    path.x = newColumn * unitWidth + (unitWidth - (2 / 3 * unitWidth)) / 2;
                    pathContainer.addChild(path);
                }
                // Check if position has moved to the right
                else if (column - newColumn === -1) {
                    path.graphics.beginStroke("black").beginFill("black").drawRect(0, 0, unitWidth, 2 / 3 * unitHeight);
                    path.regY = (2 / 3 * unitHeight) / 2;
                    path.y = newRow * unitHeight + unitHeight / 2;
                    path.x = column * unitWidth + ((unitWidth - (2 / 3 * unitWidth)) / 2) + (2 / 3 * unitWidth);
                    pathContainer.addChild(path);
                }
            }
            // Check if position has moved vertically
            else if (newRow != row) {
                 // Check if position has moved up
                if (newRow - row === -1) {
                    path.graphics.beginStroke("black").beginFill("black").drawRect(0, 0, unitWidth * 2 / 3, unitHeight);
                    path.regX = (unitWidth * 2 / 3) / 2;
                    path.x = newColumn * unitWidth + unitWidth / 2;
                    path.y = newRow * unitHeight + (2/3 * unitHeight) / 4;
                    pathContainer.addChild(path);
                }
                // Check if position has moved down
                else if (newRow - row === 1) {
                    path.graphics.beginStroke("black").beginFill("black").drawRect(0, 0, unitWidth * 2 / 3, unitHeight);
                    
                    path.regX = (unitWidth * 2 / 3) / 2;
                    path.x = newColumn * unitWidth + unitWidth / 2;
                    path.y = row * unitHeight + (2 / 3 * unitHeight) + (2 / 3 * unitHeight) / 4;
                    pathContainer.addChild(path);
                }
            }

            uncheckedUnits -= 1;
        }
        // If there are no available paths, pop a value off the stack
        // and continue the loop
        else {
            visitedUnits.push(currentUnit);
            currentUnit = gridStack.pop();
        }
    }

    stage.addChild(pathContainer);
}
