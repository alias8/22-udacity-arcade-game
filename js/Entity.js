/**
 * The super class to Player, Enemy, Gem, and Rock. Suitable for all future classes that move across the canvas.
 * 
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
var Entity = (function () {

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

    Entity.prototype.update = function (dt, direction) {
        var internal = this.getInternal();
        if (!internal(this).stopped) {
            var newTopLeftX = internal(this).rectangle.bounds.topLeft.x + internal(this).speed * dt * direction[0];
            var newTopLeftY = internal(this).rectangle.bounds.topLeft.y + internal(this).speed * dt * direction[1];
            Entity.prototype.moveEntity.call(this, newTopLeftX, newTopLeftY);
        }
    }

    Entity.prototype.moveEntity = function (newTopLeftX, newTopLeftY) {
        var internal = this.getInternal();
        internal(this).rectangle.position = new paper.Point(newTopLeftX + internal(this).rectangle.bounds.width / 2, newTopLeftY + internal(this).rectangle.bounds.height / 2);
        internal(this).sprite.position = new paper.Point(internal(this).rectangle.bounds.topLeft.x + internal(this).sprite.width / 2 + internal(this).spriteAdjustX, internal(this).rectangle.bounds.topLeft.y + internal(this).sprite.height / 2 + internal(this).spriteAdjustY);
        internal(this).svg.position = new paper.Point(internal(this).rectangle.bounds.topLeft.x + internal(this).svg.bounds.width / 2 + internal(this).svgAdjustX, internal(this).rectangle.bounds.topLeft.y + internal(this).svg.bounds.height / 2 + internal(this).svgAdjustY);
    }

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