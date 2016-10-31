var Player = (function () {
    var map = new WeakMap();
    var internal = function (object) {
        if (!map.has(object))
            map.set(object, {});
        return map.get(object);
    }

    function Player() {
        Entity.call(this); // call super constructor.
        Entity.prototype.convertPropertiesToPrivate.call(this); // copy public members from parent to private container of this class

        internal(this).svg = paper.project.layers['Resources Layer'].children['images/char-boy.svg'].clone();
        internal(this).sprite = paper.project.layers['Resources Layer'].children['images/char-boy.png'].clone();
        ENTITIESLAYER.addChild(internal(this).svg);
        ENTITIESLAYER.addChild(internal(this).sprite);
        ENTITIESLAYER.addChild(internal(this).rectangle);
        internal(this).positionText = new paper.PointText(new paper.Point(15, 15));
        internal(this).positionText.visible = false;

        internal(this).alive = true;
        internal(this).deathSpeed = 0.02;
        internal(this).reachedWaterCount = 0;
        internal(this).gemsCollected = 0;
        internal(this).speed = 1500;
        internal(this).stopped = true;

        internal(this).sprite.scale(0.9, 0.9);
        internal(this).svg.scale(0.9, 0.9);
        internal(this).svgAdjustX = 19;
        internal(this).svgAdjustY = 86;
        internal(this).spriteAdjustX = 0;
        internal(this).spriteAdjustY = 22;

        internal(this).moveHorizontal = 101;
        internal(this).moveVertical = 83;
        internal(this).startX = 2 * 101;
        internal(this).startY = internal(this).moveVertical * 4;
        Entity.prototype.moveEntity.call(this, internal(this).startX, internal(this).startY);
        internal(this).endX = internal(this).rectangle.bounds.topLeft.x;
        internal(this).endY = internal(this).rectangle.bounds.topLeft.y;
    }
    Player.prototype = Object.create(Entity.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.getInternal = function () {
        return internal;
    }

    Player.prototype.getSVG = function () {
        return internal(this).svg;
    }

    Player.prototype.killPlayer = function () {
        internal (this).alive = false;
    }

    Player.prototype.incrementGemCollected = function () {
        internal (this).gemsCollected++;
    }
    
    Player.prototype.update = function (dt) {
        if (internal(this).sprite.opacity <= 0) {
            internal(this).alive = true;
            Entity.prototype.moveEntity.call(this, internal(this).startX, internal(this).startY);
            internal(this).endX = internal(this).rectangle.bounds.topLeft.x;
            internal(this).endY = internal(this).rectangle.bounds.topLeft.y;
            internal(this).sprite.opacity = 1;
        }
        var withinPixels = internal(this).speed * dt;
        if (internal(this).rectangle.bounds.topLeft.y + withinPixels <= internal(this).endY) { // big down
            Entity.prototype.update.call(this, dt, [0, 1]);
        } else if (internal(this).rectangle.bounds.topLeft.y - withinPixels >= internal(this).endY) { // big up
            Entity.prototype.update.call(this, dt, [0, -1]);
        } else if (internal(this).rectangle.bounds.topLeft.x + withinPixels <= internal(this).endX) { // big right
            Entity.prototype.update.call(this, dt, [1, 0]);
        } else if (internal(this).rectangle.bounds.topLeft.x - withinPixels >= internal(this).endX) { // big left
            Entity.prototype.update.call(this, dt, [-1, 0]);
        } else if (0 < Math.abs(internal(this).rectangle.bounds.topLeft.y - internal(this).endY) && Math.abs(internal(this).rectangle.bounds.topLeft.y - internal(this).endY) < withinPixels) { // small y to move
            // small y to move. we test for greater than zero to prevent something like this:
            // big right called several times, we expect last move until we get to endX to be done inside "small x to move" part, but we need to prevent "small y to move" part being used
            Entity.prototype.moveEntity.call(this, internal(this).endX, internal(this).endY);
            internal(this).stopped = true;
        } else if (0 < Math.abs(internal(this).rectangle.bounds.topLeft.x - internal(this).endX) && Math.abs(internal(this).rectangle.bounds.topLeft.x - internal(this).endX) < withinPixels) { // small x to move
            Entity.prototype.moveEntity.call(this, internal(this).endX, internal(this).endY);
            internal(this).stopped = true;
        } else { // for start and when PLAYER dies
            Entity.prototype.moveEntity.call(this, internal(this).endX, internal(this).endY);
            internal(this).stopped = true;
        }
    }

    Player.prototype.render = function () {
        Entity.prototype.render.call(this);

        internal(this).positionText.content =
            'TL: (' + internal(this).rectangle.bounds.topLeft.x.toFixed(2) + ', ' + internal(this).rectangle.bounds.topLeft.y.toFixed(2) + ')' +
            'TR: (' + internal(this).rectangle.bounds.topRight.x.toFixed(2) + ', ' + internal(this).rectangle.bounds.topRight.y.toFixed(2) + ')' +
            'BL: (' + internal(this).rectangle.bounds.bottomLeft.x.toFixed(2) + ', ' + internal(this).rectangle.bounds.bottomLeft.y.toFixed(2) + ')' +
            'BR: (' + internal(this).rectangle.bounds.bottomRight.x.toFixed(2) + ', ' + internal(this).rectangle.bounds.bottomRight.y.toFixed(2) + ')';

        if (!internal(this).alive) {
            internal(this).sprite.opacity -= internal(this).deathSpeed;
        }
    };

    Player.prototype.handleInput = function (key) {
        if (internal(this).stopped) {
            var tempSvg = internal(this).svg.clone();
            var moveAllowed = true;
            switch (key) {
                case 'left':
                    tempSvg.position = new paper.Point(internal(this).svg.position.x - internal(this).moveHorizontal, internal(this).svg.position.y);
                    ALLROCKS.forEach(function (rock) {
                        if (rock.svg.contains(tempSvg.position)) moveAllowed = false;
                    });
                    if (moveAllowed) {
                        (internal(this).rectangle.bounds.topLeft.x - internal(this).moveHorizontal < 0) ? internal(this).endX -= 0 : internal(this).endX -= internal(this).moveHorizontal;
                        internal(this).stopped = false;
                    }
                    break;
                case 'right':
                    tempSvg.position = new paper.Point(internal(this).svg.position.x + internal(this).moveHorizontal, internal(this).svg.position.y);
                    ALLROCKS.forEach(function (rock) {
                        if (rock.svg.contains(tempSvg.position)) moveAllowed = false;
                    });
                    if (moveAllowed) {
                        (internal(this).rectangle.bounds.topRight.x + internal(this).moveHorizontal > paper.view.viewSize.width) ? internal(this).endX += 0 : internal(this).endX += internal(this).moveHorizontal;
                        internal(this).stopped = false;
                    }
                    break;
                case 'up':
                    tempSvg.position = new paper.Point(internal(this).svg.position.x, internal(this).svg.position.y - internal(this).moveVertical);
                    ALLROCKS.forEach(function (rock) {
                        if (rock.svg.contains(tempSvg.position)) moveAllowed = false;
                    });
                    if (moveAllowed) {
                        if (internal(this).rectangle.bounds.topLeft.y - internal(this).moveVertical < 0) {
                            internal(this).reachWaterPoint();
                        } else {
                            internal(this).endY -= internal(this).moveVertical;
                            internal(this).stopped = false;
                        }
                    }
                    break;
                case 'down':
                    tempSvg.position = new paper.Point(internal(this).svg.position.x, internal(this).svg.position.y + internal(this).moveVertical);
                    ALLROCKS.forEach(function (rock) {
                        if (rock.svg.contains(tempSvg.position)) moveAllowed = false;
                    });
                    if (moveAllowed) {
                        (internal(this).rectangle.bounds.bottomLeft.y + internal(this).moveVertical > paper.view.viewSize.height) ? internal(this).endY += 0 : internal(this).endY += internal(this).moveVertical;
                        internal(this).stopped = false;
                    }
                    break;
            }
            tempSvg.remove();
        }

    }

    Player.prototype.reachWaterPoint = function () {
        internal(this).reachedWaterCount += 1;
        internal(this).moveEntity(internal(this).startX, internal(this).startY);
        internal(this).endX = internal(this).rectangle.bounds.topLeft.x;
        internal(this).endY = internal(this).rectangle.bounds.topLeft.y;
        internal(this).stopped = true;
    }

    return Player;
})();
