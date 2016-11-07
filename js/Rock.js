/**
 * Represents falling rocks to be avoided by the Player.
 * @extends Gem
 * @constructor 
 */
function Rock() {
    Gem.call(this); // call super constructor.
    this.sprite = paper.project.layers['Resources Layer'].children['images/Rock.png'].clone();
    this.svg = paper.project.layers['Resources Layer'].children['images/rock.svg'].clone();
    this.rectangle.name = 'rock rectangle';
    entitiesLayer.addChild(this.svg);
    entitiesLayer.addChild (this.sprite);
    entitiesLayer.addChild(this.rectangle);

    this.speed = 200;
    this.counterAdjustment = 0;
    this.circleWipeMs = 5000;
    this.circleWipeMsAccum = 0;
    this.groupName = 'circle wipe group ' + getRandomIntInclusive(1, 1000000);
   
    this.sprite.scale(0.85, 0.85);
    this.svg.scale(0.80, 0.80);
    this.spriteAdjustX = 0;
    this.spriteAdjustY = 15;
    this.svgAdjustX = 12;
    this.svgAdjustY = 87;
    this.wipeCircleAdjustX = 0;
    this.wipeCircleAdjustY = 17;
}
Rock.prototype = Object.create(Gem.prototype);
Rock.prototype.constructor = Rock;

/**
 * Returns ALLROCKS, the global array storing all current Rock Entities
 * @returns {} 
 */
Rock.prototype.getObjectArray = function () {
    return ALLROCKS;
}

Rock.prototype.update = function (dt, count) {
    if (this.rectangle.bounds.topLeft.y >= this.endY) {
        this.stopped = true;
    }
    Entity.prototype.update.call(this, dt, [0, 1]);
    if(this.stopped) this.drawCircle (dt);
}

Rock.prototype.render = function () {
    Entity.prototype.render.call(this);
}

/**
 * Checks for collision between this SVG and Player SVG.
 * @returns {} 
 */
Rock.prototype.checkCollisions = function () {
    if (this.svg.intersects(PLAYER.svg)) {
        PLAYER.alive = false;
    }
}

/**
 * A visualisation of the time remaaining before the rock is removed from the canvas.
 * @param {number} dt - seconds since last frame 
 * @returns {} 
 */
Rock.prototype.drawCircle = function (dt) {
    try {
        this.circleWipeMsAccum += dt * 1000;
        var percentageRevolution = Math.abs(1 - this.circleWipeMsAccum / this.circleWipeMs);
        if (percentageRevolution > 0) {
            var previous = paper.project.layers['Entities Layer'].children[this.groupName];
            if (previous) previous.remove();
            var radians = percentageRevolution * 2 * Math.PI;
            var radius = 50;
            var center = { x: this.sprite.position.x + this.wipeCircleAdjustX, y: this.sprite.position.y + this.wipeCircleAdjustY };
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

            var wipeGroup = new Group(arc, this.sprite);
            wipeGroup.name = this.groupName;
            wipeGroup.clipped = true;
            entitiesLayer.addChild(wipeGroup);

            entitiesLayer.bringToFront();
            if (this.circleWipeMsAccum >= this.circleWipeMs) {
                var layers = paper.project.layers;
                paper.project.layers['Entities Layer'].children[this.groupName].remove();
                Entity.prototype.removeItem.call(this);

            }
        }
    } catch (arcError) {
        console.log('arc too small, rock object removed');
        Entity.prototype.removeItem.call(this);
    } 

}