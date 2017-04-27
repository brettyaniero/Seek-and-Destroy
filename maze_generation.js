
/**
 * Generates a maze made up of rectangle shapes using a recursive
 * backtracker algorithm.
 * 
 * @param {any} width  how wide the grid should be 
 * @param {any} height how high the grid should be
 */

function generateMaze(width, height, startUnit) {
    // Metrics to be used in algorithm calculations
    var unitWidth = stage.canvas.width / width;
    var unitHeight = stage.canvas.height / height;
    var uncheckedUnits = width * height;

    // Container to store the path shape objects that are created
    var pathContainer = new createjs.Container();

    // The stack to be used for storing points as the algorithm
    // generates the maze
    var gridStack = [];

    // The stack to be used to store units that have already been visited
    var visitedUnits = [];

    // Begin maze generation algorithm
    var currentUnit = startUnit;
    gridStack.push(startUnit);

    while (uncheckedUnits > 0) {
        var openPaths = [];

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
        if ((currentUnit + width) < width * height) {
            if (visitedUnits.indexOf(currentUnit + width) < 0)
                openPaths.push(currentUnit + width);
        }

        // Get length of open paths array and store into variable
        var paths = openPaths.length;

        if (paths > 0) {
            visitedUnits.push(currentUnit);

            // Choose random index of path
            var index = Math.floor(Math.random() * paths);

            // Change current unit to the new unit
            currentUnit = openPaths[index];

            uncheckedUnits -= 1;
            gridStack.push(openPaths[index]);
        }
        // If there are no available paths, pop a value off the stack
        // and continue the loop
        else {
            currentUnit = gridStack.pop();

            continue;
        }
    }

    alert("Visited units: " + visitedUnits.length);
}
