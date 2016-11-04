/**
 * Represents player to be controlled with arrow keys.
 * @extends Entity
 */

class Player extends Entity {
    /**
     * Create a player
     * @constructor 
     */
    constructor() {
        super();
        this._svg = paper.project.layers['Resources Layer'].children['images/char-boy.svg'].clone();
        this._sprite = paper.project.layers['Resources Layer'].children['images/char-boy.png'].clone();
        entitiesLayer.addChild(this._svg);
        entitiesLayer.addChild(this._sprite);
        entitiesLayer.addChild(this._boundingRectangle);
        this._positionText = new paper.PointText(new paper.Point(15, 15));
        this._positionText.visible = false;

        this._alive = true;
        this._deathSpeed = 0.02;
        this._reachedWaterCount = 0;
        this._gemsCollected = 0;
        this._speed = 1500;
        this._stopped = true;

        this._sprite.scale(0.9, 0.9);
        this._svg.scale(0.9, 0.9);
        this._svgAdjustX = 19;
        this._svgAdjustY = 86;
        this._spriteAdjustY = 22;

        this._moveHorizontal = 101;
        this._moveVertical = 83;
        this._startX = 2 * 101;
        this._startY = this._moveVertical * 4; // 352
        this.moveEntity(this._startX, this._startY);
        this._endX = this._boundingRectangle.bounds.topLeft.x;
        this._endY = this._boundingRectangle.bounds.topLeft.y;
    }

    update(dt) {
        if (this._sprite.opacity <= 0) {
            this._alive = true;
            this.moveEntity(this._startX, this._startY);
            this._endX = this._boundingRectangle.bounds.topLeft.x;
            this._endY = this._boundingRectangle.bounds.topLeft.y;
            this._sprite.opacity = 1;
        }
        var withinPixels = this._speed * dt;
        if (this._boundingRectangle.bounds.topLeft.y + withinPixels <= this._endY) { // big down
            super.update(dt, [0, 1]);
        } else if (this._boundingRectangle.bounds.topLeft.y - withinPixels >= this._endY) { // big up
            super.update(dt, [0, -1]);
        } else if (this._boundingRectangle.bounds.topLeft.x + withinPixels <= this._endX) { // big right
            super.update(dt, [1, 0]);
        } else if (this._boundingRectangle.bounds.topLeft.x - withinPixels >= this._endX) { // big left
            super.update(dt, [-1, 0]);
        } else if (0 < Math.abs(this._boundingRectangle.bounds.topLeft.y - this._endY) && Math.abs(this._boundingRectangle.bounds.topLeft.y - this._endY) < withinPixels) { // small y to move
            // small y to move. we test for greater than zero to prevent something like this:
            // big right called several times, we expect last move until we get to endX to be done inside "small x to move" part, but we need to prevent "small y to move" part being used
            this.moveEntity(this._endX, this._endY);
            this._stopped = true;
        } else if (0 < Math.abs(this._boundingRectangle.bounds.topLeft.x - this._endX) && Math.abs(this._boundingRectangle.bounds.topLeft.x - this._endX) < withinPixels) { // small x to move
            this.moveEntity(this._endX, this._endY);
            this._stopped = true;
        } else { // for start and when PLAYER dies
            this.moveEntity(this._endX, this._endY);
            this._stopped = true;
        }
    }

    render() {
        super.render();
        this._positionText.content =
            'TL: (' + this._boundingRectangle.bounds.topLeft.x.toFixed(2) + ', ' + this._boundingRectangle.bounds.topLeft.y.toFixed(2) + ')' +
            'TR: (' + this._boundingRectangle.bounds.topRight.x.toFixed(2) + ', ' + this._boundingRectangle.bounds.topRight.y.toFixed(2) + ')' +
            'BL: (' + this._boundingRectangle.bounds.bottomLeft.x.toFixed(2) + ', ' + this._boundingRectangle.bounds.bottomLeft.y.toFixed(2) + ')' +
            'BR: (' + this._boundingRectangle.bounds.bottomRight.x.toFixed(2) + ', ' + this._boundingRectangle.bounds.bottomRight.y.toFixed(2) + ')';
        if (!this._alive) {
            this._sprite.opacity -= this._deathSpeed;
        }
    }
    /**
     * Tests for collision with adjacent rocks before moving one square.
     * @param {string} key - represents the up/down/left/right arrow keys
     * @private
     * @returns {} 
     */
    _handleInput(key) {
        if (this._stopped) {
            var tempSvg = this._svg.clone();
            var moveAllowed = true;
            switch (key) {
                case 'left':
                    tempSvg.position = new paper.Point(this._svg.position.x - this._moveHorizontal, this._svg.position.y);
                    ALLROCKS.forEach(function (rock) {
                        if (rock._svg.contains(tempSvg.position)) moveAllowed = false;
                    });
                    if (moveAllowed) {
                        (this._boundingRectangle.bounds.topLeft.x - this._moveHorizontal < 0) ? this._endX -= 0 : this._endX -= this._moveHorizontal;
                        this._stopped = false;
                    }
                    break;
                case 'right':
                    tempSvg.position = new paper.Point(this._svg.position.x + this._moveHorizontal, this._svg.position.y);
                    ALLROCKS.forEach(function (rock) {
                        if (rock._svg.contains(tempSvg.position)) moveAllowed = false;
                    });
                    if (moveAllowed) {
                        (this._boundingRectangle.bounds.topRight.x + this._moveHorizontal > paper.view.viewSize.width) ? this._endX += 0 : this._endX += this._moveHorizontal;
                        this._stopped = false;
                    }
                    break;
                case 'up':
                    tempSvg.position = new paper.Point(this._svg.position.x, this._svg.position.y - this._moveVertical);
                    ALLROCKS.forEach(function (rock) {
                        if (rock._svg.contains(tempSvg.position)) moveAllowed = false;
                    });
                    if (moveAllowed) {
                        if (this._boundingRectangle.bounds.topLeft.y - this._moveVertical < 0) {
                            this._reachWaterPoint();
                        } else {
                            this._endY -= this._moveVertical;
                            this._stopped = false;
                        }
                    }
                    break;
                case 'down':
                    tempSvg.position = new paper.Point(this._svg.position.x, this._svg.position.y + this._moveVertical);
                    ALLROCKS.forEach(function (rock) {
                        if (rock._svg.contains(tempSvg.position)) moveAllowed = false;
                    });
                    if (moveAllowed) {
                        (this._boundingRectangle.bounds.bottomLeft.y + this._moveVertical > paper.view.viewSize.height) ? this._endY += 0 : this._endY += this._moveVertical;
                        this._stopped = false;
                    }
                    break;
            }
            tempSvg.remove();
        }

    }

    /**
     * Called when Player reaches water.
     * @private 
     * @returns {} 
     */
    _reachWaterPoint() {
        this._reachedWaterCount += 1;
        this.moveEntity(this._startX, this._startY);
        this._endX = this._boundingRectangle.bounds.topLeft.x;
        this._endY = this._boundingRectangle.bounds.topLeft.y;
        this._stopped = true;
    }

    /**
     * Not implemented.
     * @returns {}
     */
    checkCollisions() {

    }
}