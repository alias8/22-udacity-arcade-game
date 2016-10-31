/**
 * Represents a Gem.
 * @constructor
 * @param {string} pug - The title of the book.
 * @param {string} dog - The author of the book.
 */

var Gem = (function () {
    var map = new WeakMap();
    var internal = function (object) {
        if (!map.has(object))
            map.set(object, {});
        return map.get(object);
    }


    function Gem() {
        Entity.call(this); // call super constructor.
        Entity.prototype.convertPropertiesToPrivate.call(this); // copy public members from parent to private container of this class
        internal(this).sprite = paper.project.layers['Resources Layer'].children['images/gem-green.png'].clone();
        internal(this).svg = paper.project.layers['Resources Layer'].children['images/gem.svg'].clone();
        ENTITIESLAYER.addChild(internal(this).svg);
        ENTITIESLAYER.addChild(internal(this).sprite);

        internal(this).speed = 50;

        internal(this).sprite.scale(0.7, 0.7);
        internal(this).svg.scale(0.7, 0.7);
        internal(this).spriteAdjustX = 0;
        internal(this).spriteAdjustY = 20;
        internal(this).svgAdjustX = 18;
        internal(this).svgAdjustY = 85;

        internal(this).startX = getRandomIntInclusive(0, 4) * 101;
        internal(this).startY = -100;
        Entity.prototype.moveEntity.call(this, internal(this).startX, internal(this).startY);
        internal(this).endY = getRandomIntInclusive(0, 3) * 83;
    }
    Gem.prototype = Object.create(Entity.prototype);
    Gem.prototype.constructor = Gem;

    Gem.prototype.getObjectArray = function () {
        return ALLGEMS;
    }

    Gem.prototype.getInternal = function () {
        return internal;
    }

    Gem.prototype.update = function (dt) {
        if (internal(this).rectangle.bounds.topLeft.y >= internal(this).endY) internal(this).stopped = true;
        Entity.prototype.update.call(this, dt, [0, 1]);
    }

    Gem.prototype.render = function () {
        Entity.prototype.render.call(this);
    }

    Gem.prototype.checkCollisions = function () {
        if (internal(this).svg.intersects(PLAYER.getSVG())) {
            Entity.prototype.removeItem.call(this);
            PLAYER.incrementGemCollected ();
        }
    }
    return Gem;
})();