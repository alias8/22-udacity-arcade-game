
var Entity = (function () {
    /** @lends Entity# */

    /**
 * The super class to Player, Enemy, Gem, and Rock. Suitable for all future classes that move across the canvas.
 * @constructs Entity
 */
    function Entity() { // public properties to be inherited and possibly overwritten
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
     * Called in subclasses immediately after calling Entity constructor. Converts public accessible properties of Entity such as
       sprite, svg, stopped to private properties accessible only through the internal(this) prefix. 
     */
    Entity.prototype.convertPropertiesToPrivate = function () {
        var internal = this.getInternal();
        for (var name in this) {
            if (this.hasOwnProperty(name)) {
                var value = this[name];
                internal(this)[name] = value; // add private property
                delete this[name]; // remove public property
            }
        }
    }


    /**
    * Render entity to canvas. Called during each frame. 
    */
    Entity.prototype.render = function () {
        var internal = this.getInternal ();
        internal(this).sprite.visible = true;
        internal(this).svg.visible = false;
        internal(this).rectangle.visible = false;
        internal(this).sprite.bounds.selected = false;
        internal(this).svg.bounds.selected = false;
        internal(this).rectangle.bounds.selected = false;
        ENTITIESLAYER.bringToFront();
    }

    /**
 * Update position of entity when direction and seconds since last update are known.
 * @param {number} dt - the time passed in seconds since the last frame event.
 * @param {array} direction - array of xy coordinates. The components of the unit vector of the direction to move. 
     * [1, 0] means move right, 
     * [-1, 0] means move left,
     * [0, 1] means move down,
     * [0, -1] means move up
 */
    Entity.prototype.update = function (dt, direction) {
        var internal = this.getInternal();
        if (!internal(this).stopped) {
            var newTopLeftX = internal(this).rectangle.bounds.topLeft.x + internal(this).speed * dt * direction[0];
            var newTopLeftY = internal(this).rectangle.bounds.topLeft.y + internal(this).speed * dt * direction[1];
            Entity.prototype.moveEntity.call(this, newTopLeftX, newTopLeftY);
        }
    }

    /**
* Update position of entity directly, used on entity construction and during move command of player during last pixels. 
* @param {number} newTopLeftX - x coordinate of topLeft bounding box (default size is 101x171 pixels).
* @param {number} newTopLeftY - y coordinate of topLeft bounding box (default size is 101x171 pixels).
*/
    Entity.prototype.moveEntity = function (newTopLeftX, newTopLeftY) {
        var internal = this.getInternal();
        internal(this).rectangle.position = new paper.Point(newTopLeftX + internal(this).rectangle.bounds.width / 2, newTopLeftY + internal(this).rectangle.bounds.height / 2);
        internal(this).sprite.position = new paper.Point(internal(this).rectangle.bounds.topLeft.x + internal(this).sprite.width / 2 + internal(this).spriteAdjustX, internal(this).rectangle.bounds.topLeft.y + internal(this).sprite.height / 2 + internal(this).spriteAdjustY);
        internal(this).svg.position = new paper.Point(internal(this).rectangle.bounds.topLeft.x + internal(this).svg.bounds.width / 2 + internal(this).svgAdjustX, internal(this).rectangle.bounds.topLeft.y + internal(this).svg.bounds.height / 2 + internal(this).svgAdjustY);
    }


    /**
* Remove Entity from its ObjectArray and remove sprites from canvas. Object should no longer be reachable after this function is called. 
*/
    Entity.prototype.removeItem = function () {
        var internal = this.getInternal();
        var index = this.getObjectArray().indexOf(this);
        this.getObjectArray().splice(index, 1);
        internal(this).rectangle.remove();
        internal(this).sprite.remove();
        internal(this).svg.remove();
    }

    return Entity;
})();