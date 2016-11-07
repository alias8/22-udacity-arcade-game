/**
 * The super class to Player, Enemy, Gem, and Rock. Suitable for all future classes that move across the canvas.
 * This class requires each Entity to have a image sprite and image svg loaded in Resources.js
 * @abstract
 * @constructor
 */
function Entity() {
    this.sprite = undefined;
    this.svg = undefined;
    this.rectangle = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(101, 171));
    this.rectangle.fillColor = 'red';
    this.rectangle.opacity = 0.3;
    
    this.stopped = false;
    this.svgAdjustX = 0;
    this.svgAdjustY = 0;
    this.spriteAdjustX = 0;
    this.spriteAdjustY = 0;
}

/**
 * Render the Entity to the canvas.
 * @returns {}.
 */
Entity.prototype.render = function () {
    this.sprite.visible = true;
    this.svg.visible = false;
    this.rectangle.visible = false;
    this.sprite.bounds.selected = false;
    this.svg.bounds.selected = false;
    this.rectangle.bounds.selected = false;
    entitiesLayer.bringToFront();
}

/**
 * Update position of entity bounding rectangle when direction and seconds since last update are known.
 * [1, 0] means move right, 
 * [-1, 0] means move left,
 * [0, 1] means move down,
 * [0, -1] means move up
 * @param {number} dt - the time passed in seconds since the last frame event.
 * @param {array} direction - array of xy coordinates. The components of the unit vector of the direction to move. 
 * @returns {}
 */
Entity.prototype.update = function (dt, direction) {
    if (!this.stopped) {
        var newTopLeftX = this.rectangle.bounds.topLeft.x + this.speed * dt * direction[0];
        var newTopLeftY = this.rectangle.bounds.topLeft.y + this.speed * dt * direction[1];
        Entity.prototype.moveEntity.call(this, newTopLeftX, newTopLeftY);
    }
}

/**
 * Update the position of the bounding rectangle directly, byassing the update(dt, direction) method.
 * @param {number} newTopLeftX - The x value of the top left corner of the bounding rectangle, in global coordinates.
 * @param {number} newTopLeftY - The y value of the top left corner of the bounding rectangle, in global coordinates.
 * @returns {}.
 */
Entity.prototype.moveEntity = function (newTopLeftX, newTopLeftY) {
    this.rectangle.position = new paper.Point(newTopLeftX + this.rectangle.bounds.width/2, newTopLeftY + this.rectangle.bounds.height/2);
    this.sprite.position = new paper.Point(this.rectangle.bounds.topLeft.x + this.sprite.width/2 + this.spriteAdjustX, this.rectangle.bounds.topLeft.y + this.sprite.height/2 + this.spriteAdjustY);
    this.svg.position = new paper.Point(this.rectangle.bounds.topLeft.x + this.svg.bounds.width / 2 + this.svgAdjustX, this.rectangle.bounds.topLeft.y + this.svg.bounds.height/2 + this.svgAdjustY);
}

/**
 * Remove the Entity from canvas and remove from its global objectArray.
 * @returns {}.
 */
Entity.prototype.removeItem = function () {
    var index = this.getObjectArray().indexOf(this);
    this.getObjectArray().splice(index, 1);
    this.rectangle.remove();
    this.sprite.remove();
    this.svg.remove();
}

/**
 * Override in subclasses to return appropriate global objectArray. 
 * @abstract 
 * @private
 * @returns {Array}
 */
Entity.prototype.getObjectArray = function() {

}
/**
 * Override in subclasses to check for collision between Entity SVG and Player SVG.
 * @abstract 
 * @returns {}
 */
Entity.prototype.checkCollisions = function() {

}