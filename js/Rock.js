var Rock = (function () {
    var map = new WeakMap();
    var internal = function (object) {
        if (!map.has(object))
            map.set(object, {});
        return map.get(object);
    }

    function Rock() {
        Entity.call(this); // call super constructor.
        Entity.prototype.convertPropertiesToPrivate.call(this); // copy public members from parent to private container of this class
        internal(this).sprite = paper.project.layers['Resources Layer'].children['images/Rock.png'].clone();
        internal(this).svg = paper.project.layers['Resources Layer'].children['images/rock.svg'].clone();
        ENTITIESLAYER.addChild(internal(this).svg);
        ENTITIESLAYER.addChild(internal(this).sprite);
        ENTITIESLAYER.addChild(internal(this).rectangle);

        internal(this).speed = 200;
        internal(this).counterAdjustment = 0;
        internal(this).circleWipeMs = 5000;
        internal(this).circleWipeMsAccum = 0;
        internal(this).groupName = 'circle wipe group ' + getRandomIntInclusive(1, 1000000);

        internal(this).sprite.scale(0.85, 0.85);
        internal(this).svg.scale(0.80, 0.80);
        internal(this).spriteAdjustX = 0;
        internal(this).spriteAdjustY = 15;
        internal(this).svgAdjustX = 12;
        internal(this).svgAdjustY = 87;
        internal(this).wipeCircleAdjustX = 0;
        internal(this).wipeCircleAdjustY = 17;

        internal(this).startX = getRandomIntInclusive(0, 4) * 101;
        internal(this).startY = -100;
        Entity.prototype.moveEntity.call(this, internal(this).startX, internal(this).startY);
        internal(this).endY = getRandomIntInclusive(0, 3) * 83;
    }
    Rock.prototype = Object.create(Entity.prototype);
    Rock.prototype.constructor = Rock;

    Rock.prototype.getObjectArray = function () {
        return ALLROCKS;
    }

    Rock.prototype.getInternal = function () {
        return internal;
    }

    Rock.prototype.update = function (dt) {
        if (internal(this).rectangle.bounds.topLeft.y >= internal(this).endY) {
            internal(this).stopped = true;
        }
        Entity.prototype.update.call(this, dt, [0, 1]);
        if (internal(this).stopped) this.drawCircle(dt);
    }

    Rock.prototype.render = function () {
        Entity.prototype.render.call(this);
    }

    Rock.prototype.checkCollisions = function () {
        if (internal(this).svg.intersects(PLAYER.svg)) {
            PLAYER.alive = false;
        }
    }

    Rock.prototype.drawCircle = function (dt) {
        internal(this).circleWipeMsAccum += dt * 1000;
        var percentageRevolution = Math.abs(1 - internal(this).circleWipeMsAccum / internal(this).circleWipeMs);
        if (percentageRevolution > 0) {
            var previous = paper.project.layers['Entities Layer'].children[internal(this).groupName];
            if (previous) previous.remove();
            var radians = percentageRevolution * 2 * Math.PI;
            var radius = 50;
            var center = { x: internal(this).sprite.position.x + internal(this).wipeCircleAdjustX, y: internal(this).sprite.position.y + internal(this).wipeCircleAdjustY };
            var from = [radius + center.x, 0 + center.y];
            var through = [radius * Math.cos(-radians / 2) + center.x, radius * Math.sin(-radians / 2) * -1 + center.y];
            var to = [radius * Math.cos(-radians) + center.x, radius * Math.sin(-radians) * -1 + center.y];
            var arc = new Path.Arc({
                from: from,
                through: through,
                to: to,
                strokeColor: 'white'
            });
            arc.scale(0.9, 0.9);
            arc.add(new paper.Point(center.x, center.y));
            arc.closed = true;
            arc.fillColor = 'white';
            arc.opacity = 0.5;
            arc.rotate(-90, new paper.Point(center.x, center.y));
            arc.name = 'circle wipe';
            arc.visible = true;
            arc.bounds.selected = false;

            var wipeGroup = new Group(arc, internal(this).sprite);
            wipeGroup.name = internal(this).groupName;
            wipeGroup.clipped = true;
            ENTITIESLAYER.addChild(wipeGroup);

            ENTITIESLAYER.bringToFront();
            if (internal(this).circleWipeMsAccum >= internal(this).circleWipeMs) {
                paper.project.layers['Entities Layer'].children[internal(this).groupName].remove();
                Entity.prototype.removeItem.call(this);

            }
        }
    }
    return Rock;
})();