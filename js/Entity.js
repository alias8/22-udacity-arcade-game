/**
 * The super class to Player, Enemy, Gem, and Rock. Suitable for all future classes that move across the canvas.
 * This class requires each Entity to have a image sprite and image svg loaded in Resources.js
 * @abstract
 * @author James Kirk <jameskirk8@gmail.com>
 */

class Entity {
    /**
     * Create an entity. This is an abstract class, all items in game should be subclasses of Entity.
     * @constructor
     */
    constructor() {
        this._sprite = undefined;
        this._svg = undefined;
        this._boundingRectangle = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(101, 171));
        this._boundingRectangle.fillColor = 'red';
        this._boundingRectangle.opacity = 0.3;

        this._stopped = false;
        this._svgAdjustX = 0;
        this._svgAdjustY = 0;
        this._spriteAdjustX = 0;
        this._spriteAdjustY = 0;
    }
    /**
     * Render the Entity to the canvas.
     * @returns {}.
     */
    render() {
        this._sprite.visible = true;
        this._svg.visible = false;
        this._boundingRectangle.visible = false;
        this._sprite.bounds.selected = false;
        this._svg.bounds.selected = false;
        this._boundingRectangle.bounds.selected = false;
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
    update(dt, direction) {
        if (!this._stopped) {
            var newTopLeftX = this._boundingRectangle.bounds.topLeft.x + this._speed * dt * direction[0];
            var newTopLeftY = this._boundingRectangle.bounds.topLeft.y + this._speed * dt * direction[1];
            this.moveEntity(newTopLeftX, newTopLeftY);
        }
    }
    /**
     * Update the position of the bounding rectangle directly, byassing the update(dt, direction) method.
     * @param {number} newTopLeftX - The x value of the top left corner of the bounding rectangle, in global coordinates.
     * @param {number} newTopLeftY - The y value of the top left corner of the bounding rectangle, in global coordinates.
     * @returns {}.
     */
    moveEntity(newTopLeftX, newTopLeftY) {
        this._boundingRectangle.position = new paper.Point(newTopLeftX + this._boundingRectangle.bounds.width / 2, newTopLeftY + this._boundingRectangle.bounds.height / 2);
        this._sprite.position = new paper.Point(this._boundingRectangle.bounds.topLeft.x + this._sprite.width / 2 + this._spriteAdjustX, this._boundingRectangle.bounds.topLeft.y + this._sprite.height / 2 + this._spriteAdjustY);
        this._svg.position = new paper.Point(this._boundingRectangle.bounds.topLeft.x + this._svg.bounds.width / 2 + this._svgAdjustX, this._boundingRectangle.bounds.topLeft.y + this._svg.bounds.height / 2 + this._svgAdjustY);
    }
    /**
     * Remove the Entity from canvas and remove from its global objectArray.
     * @returns {}.
     */
    removeItem() {
        var index = this.getObjectArray().indexOf(this);
        this.getObjectArray().splice(index, 1);
        this._boundingRectangle.remove();
        this._sprite.remove();
        this._svg.remove();
    }
    /**
     * Override in subclasses to return appropriate global objectArray. 
     * @abstract 
     * @private
     * @returns {Array}
     */
    getObjectArray() {

    }
    /**
     * Override in subclasses to check for collision between Entity SVG and Player SVG.
     * @abstract 
     * @returns {}
     */
    checkCollisions() {

    }
}