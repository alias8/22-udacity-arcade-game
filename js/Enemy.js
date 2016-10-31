var Enemy = (function () {
    var map = new WeakMap();
    var internal = function (object) {
        if (!map.has(object))
            map.set(object, {});
        return map.get(object);
    }

    function Enemy() {
        Entity.call(this); // call super constructor.
        Entity.prototype.convertPropertiesToPrivate.call(this); // copy public members from parent to private container of this class
        console.log('enemy constructor called');
        internal(this).svg = paper.project.layers['Resources Layer'].children['images/enemy-bug.svg'].clone();
        internal(this).sprite = paper.project.layers['Resources Layer'].children['images/enemy-bug.png'].clone();
        ENTITIESLAYER.addChild(internal(this).svg);
        ENTITIESLAYER.addChild(internal(this).sprite);
        ENTITIESLAYER.addChild(internal(this).rectangle);

        internal(this).sprite.scale(1, 1);
        internal(this).svg.scale(1, 1);
        internal(this).spriteAdjustX = 0;
        internal(this).spriteAdjustY = 30;
        internal(this).svgAdjustX = 2;
        internal(this).svgAdjustY = 88;

        internal(this).startX = -100;
        internal(this).startY = getRandomIntInclusive(0, 3) * 83;
        Entity.prototype.moveEntity.call(this, internal(this).startX, internal(this).startY);
        internal(this).endX = paper.view.viewSize.width;
        internal(this).speed = getRandomIntInclusive(1, 4) * 100;
    };
    Enemy.prototype = Object.create(Entity.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.checkCollisions = function () {
        if (internal(this).svg.intersects(PLAYER.getSVG())) {
            PLAYER.killPlayer();
        }
    }

    Enemy.prototype.getInternal = function () {
        return internal;
    }

    Enemy.prototype.getObjectArray = function () {
        return ALLENEMIES;
    }

    Enemy.prototype.update = function (dt) {
        if (internal(this).rectangle.bounds.topLeft.x >= paper.view.viewSize.width) {
            Entity.prototype.removeItem.call(this);
        }
        Entity.prototype.update.call(this, dt, [1, 0]);
    };

    Enemy.prototype.render = function () {
        Entity.prototype.render.call(this);

    };

    return Enemy;
})();