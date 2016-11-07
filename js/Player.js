/**
 * Represents player to be controlled with arrow keys.
 * @extends Entity
 * @constructor 
 */
function Player() {
    Entity.call(this); // call super constructor.
    this.svg = paper.project.layers['Resources Layer'].children['images/char-boy.svg'].clone();
    this.sprite = paper.project.layers['Resources Layer'].children['images/char-boy.png'].clone();
    entitiesLayer.addChild(this.svg);
    entitiesLayer.addChild(this.sprite);
    entitiesLayer.addChild(this.rectangle);
    this.positionText = new paper.PointText(new paper.Point(15, 15));
    this.positionText.visible = false;

    this.alive = true;
    this.deathSpeed = 0.02;
    this.reachedWaterCount = 0;
    this.gemsCollected = 0;
    this.speed = 1500;
    this.stopped = true;

    this.sprite.scale(0.9, 0.9);
    this.svg.scale(0.9, 0.9);
    this.svgAdjustX = 19;
    this.svgAdjustY = 86;
    this.spriteAdjustY = 22;

    this.moveHorizontal = 101;
    this.moveVertical = 83;
    this.startX = 2 * 101;
    this.startY = this.moveVertical*4;
    this.moveEntity (this.startX, this.startY);
    this.endX = this.rectangle.bounds.topLeft.x;
    this.endY = this.rectangle.bounds.topLeft.y;

}
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function (dt) {
    if (this.sprite.opacity <= 0) {
        this.alive = true;
        this.moveEntity(this.startX, this.startY);
        this.endX = this.rectangle.bounds.topLeft.x;
        this.endY = this.rectangle.bounds.topLeft.y;
        this.sprite.opacity = 1;
    }
    var withinPixels = this.speed * dt;
    if (this.rectangle.bounds.topLeft.y + withinPixels <= this.endY) { // big down
        Entity.prototype.update.call(this, dt, [0, 1]);
    } else if (this.rectangle.bounds.topLeft.y - withinPixels >= this.endY) { // big up
        Entity.prototype.update.call(this, dt, [0, -1]);
    } else if (this.rectangle.bounds.topLeft.x + withinPixels <= this.endX) { // big right
        Entity.prototype.update.call(this, dt, [1, 0]);
    } else if (this.rectangle.bounds.topLeft.x - withinPixels >= this.endX) { // big left
        Entity.prototype.update.call(this, dt, [-1, 0]);
    } else if (0 < Math.abs(this.rectangle.bounds.topLeft.y - this.endY) && Math.abs(this.rectangle.bounds.topLeft.y - this.endY) < withinPixels) { // small y to move
        // small y to move. we test for greater than zero to prevent something like this:
        // big right called several times, we expect last move until we get to endX to be done inside "small x to move" part, but we need to prevent "small y to move" part being used
        this.moveEntity(this.endX, this.endY);
        this.stopped = true;
    } else if (0 < Math.abs(this.rectangle.bounds.topLeft.x - this.endX) && Math.abs(this.rectangle.bounds.topLeft.x - this.endX) < withinPixels) { // small x to move
        this.moveEntity(this.endX, this.endY);
        this.stopped = true;
    } else { // for start and when PLAYER dies
        this.moveEntity(this.endX, this.endY);
        this.stopped = true;
    }
}

Player.prototype.render = function () {
    Entity.prototype.render.call(this);

    this.positionText.content =
        'TL: (' + this.rectangle.bounds.topLeft.x.toFixed(2) + ', ' + this.rectangle.bounds.topLeft.y.toFixed(2) + ')' +
        'TR: (' + this.rectangle.bounds.topRight.x.toFixed(2) + ', ' + this.rectangle.bounds.topRight.y.toFixed(2) + ')' +
        'BL: (' + this.rectangle.bounds.bottomLeft.x.toFixed(2) + ', ' + this.rectangle.bounds.bottomLeft.y.toFixed(2) + ')' +
        'BR: (' + this.rectangle.bounds.bottomRight.x.toFixed(2) + ', ' + this.rectangle.bounds.bottomRight.y.toFixed(2) + ')';

    if (!this.alive) {
        this.sprite.opacity -= this.deathSpeed;
    }
};

/**
 * Tests for collision with adjacent rocks before moving one square.
 * @param {string} key - represents the up/down/left/right arrow keys
 * @private
 * @returns {} 
 */
Player.prototype.handleInput = function (key) {
    if (this.stopped) {
        var tempSvg = this.svg.clone();
        var moveAllowed = true;
        switch (key) {
            case 'left':
                tempSvg.position = new paper.Point(this.svg.position.x - this.moveHorizontal, this.svg.position.y);
                ALLROCKS.forEach(function (rock) {
                    if (rock.svg.contains (tempSvg.position)) moveAllowed = false;
                });
                if (moveAllowed) {
                    (this.rectangle.bounds.topLeft.x - this.moveHorizontal < 0) ? this.endX -= 0 : this.endX -= this.moveHorizontal;
                    this.stopped = false;
                }
                break;
            case 'right':
                tempSvg.position = new paper.Point(this.svg.position.x + this.moveHorizontal, this.svg.position.y);
                ALLROCKS.forEach(function (rock) {
                    if (rock.svg.contains(tempSvg.position)) moveAllowed = false;
                });
                if (moveAllowed) {
                    (this.rectangle.bounds.topRight.x + this.moveHorizontal > paper.view.viewSize.width) ? this.endX += 0 : this.endX += this.moveHorizontal;
                    this.stopped = false;
                }
                break;
            case 'up':
                tempSvg.position = new paper.Point(this.svg.position.x, this.svg.position.y - this.moveVertical);
                ALLROCKS.forEach(function (rock) {
                    if (rock.svg.contains(tempSvg.position)) moveAllowed = false;
                });
                if (moveAllowed) {
                    if (this.rectangle.bounds.topLeft.y - this.moveVertical < 0) {
                        this.reachWaterPoint();
                    } else {
                        this.endY -= this.moveVertical;
                        this.stopped = false;
                    }
                }
                break;
            case 'down':
                tempSvg.position = new paper.Point(this.svg.position.x, this.svg.position.y + this.moveVertical);
                ALLROCKS.forEach(function (rock) {
                    if (rock.svg.contains(tempSvg.position)) moveAllowed = false;
                });
                if (moveAllowed) {
                    (this.rectangle.bounds.bottomLeft.y + this.moveVertical > paper.view.viewSize.height) ? this.endY += 0 : this.endY += this.moveVertical;
                    this.stopped = false;
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
Player.prototype.reachWaterPoint = function () {
    this.reachedWaterCount += 1;
    this.moveEntity(this.startX, this.startY);
    this.endX = this.rectangle.bounds.topLeft.x;
    this.endY = this.rectangle.bounds.topLeft.y;
    this.stopped = true;
}

/**
 * Not implemented.
 * @returns {}
 */
Player.prototype.checkCollisions = function() {

}