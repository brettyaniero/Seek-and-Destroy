
function ButtonGroup(buttonWidth, verticalPadding, hoverColor) {
    var buttonGroupContainer = new createjs.Container();
    var buttonCount = 0;

    this.addButton = function (textImage, outlineColor) {
        // Create button outline
        var buttonOutline = new createjs.Shape();
        buttonOutline.graphics.setStrokeStyle(5);
        buttonOutline.graphics.beginStroke(outlineColor).drawRect(0, 0, buttonWidth, textImage.height + verticalPadding);

        // Set hit area of button for hover event
        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(0, 0, buttonWidth, textImage.height + verticalPadding);
        buttonOutline.hitArea = hit;

        buttonOutline.on("mouseover", function (event) {
            event.target.graphics.clear();
            event.target.graphics.setStrokeStyle(5);
            event.target.graphics.beginStroke(outlineColor).beginFill(hoverColor).drawRect(0, 0, buttonWidth, textImage.height + verticalPadding);
        });
        buttonOutline.on("mouseout", function (event) {
            event.target.graphics.clear();
            event.target.graphics.setStrokeStyle(5);
            event.target.graphics.beginStroke(outlineColor).drawRect(0, 0, buttonWidth, textImage.height + verticalPadding);
        });

        // Create button
        var buttonContainer = new createjs.Container();
        var text = new createjs.Bitmap(textImage);
        text.regX = textImage.width / 2;
        text.regY = textImage.height / 2;
        text.x = buttonWidth / 2;
        text.y = (textImage.height + verticalPadding) / 2;

        // Add completed button to the container
        buttonContainer.addChild(buttonOutline, text);

        if (buttonCount > 0) {
            buttonContainer.y += 150 * buttonCount;
        }

        buttonGroupContainer.addChild(buttonContainer);
        buttonCount += 1;
    };

    this.setScale = function (scale) {
        buttonGroupContainer.scaleX = scale;
        buttonGroupContainer.scaleY = scale;
    }

    this.setXPosition = function (x) {
        buttonGroupContainer.regX = buttonWidth / 2;
        buttonGroupContainer.x = x;
    }

    this.setYPosition = function (y) {
        buttonGroupContainer.y = y;
    }

    this.getContainer = function () {
        return buttonGroupContainer;
    }
}
