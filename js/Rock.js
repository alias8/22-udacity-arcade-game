/**
 * Represents falling rocks to be avoided by the Player.
 * @extends Entity
 */
class Rock extends Entity {
    /**
     * @constructor 
     * @returns {} 
     */
    constructor() {
        super();
        this._sprite = paper.project.layers['Resources Layer'].children['images/Rock.png'].clone();
        this._svg = paper.project.layers['Resources Layer'].children['images/rock.svg'].clone();
        this._boundingRectangle.name = 'rock rectangle';
        entitiesLayer.addChild(this._svg);
        entitiesLayer.addChild(this._sprite);
        entitiesLayer.addChild(this._boundingRectangle);

        this._speed = 200;
        this._circleWipeMs = 5000;
        this._circleWipeMsAccum = 0;
        this._groupName = 'circle wipe group ' + getRandomIntInclusive(1, 1000000);

        this._sprite.scale(0.85, 0.85);
        this._svg.scale(0.80, 0.80);
        this._spriteAdjustX = 0;
        this._spriteAdjustY = 15;
        this._svgAdjustX = 12;
        this._svgAdjustY = 87;
        this._wipeCircleAdjustX = 0;
        this._wipeCircleAdjustY = 17;
    }

    update(dt) {
        if (this._boundingRectangle.bounds.topLeft.y >= this._endY) {
            this._stopped = true;
        }
        Entity.prototype.update.call(this, dt, [0, 1]);
        if (this._stopped) this.drawCircle(dt);
    }

    render() {
        super.render();
    }
    /**
     * Checks for collision between this SVG and Player SVG.
     * @returns {} 
     */
    checkCollisions() {
        if (this._svg.intersects(PLAYER._svg)) {
            PLAYER._alive = false;
        }
    }
    /**
     * Returns ALLROCKS, the global array storing all current Rock Entities
     * @returns {} 
     */
    getObjectArray() {
        return ALLROCKS;
    }
    /**
     * A visualisation of the time remaaining before the rock is removed from the canvas.
     * @param {number} dt - seconds since last frame 
     * @returns {} 
     */
    drawCircle(dt) {
        this._circleWipeMsAccum += dt * 1000;
        var percentageRevolution = Math.abs(1 - this._circleWipeMsAccum / this._circleWipeMs);
        if (percentageRevolution > 0) {
            var previous = paper.project.layers['Entities Layer'].children[this._groupName];
            if (previous) previous.remove();
            var radians = percentageRevolution * 2 * Math.PI;
            var radius = 50;
            var center = { x: this._sprite.position.x + this._wipeCircleAdjustX, y: this._sprite.position.y + this._wipeCircleAdjustY };
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

            var wipeGroup = new Group(arc, this._sprite);
            wipeGroup.name = this._groupName;
            wipeGroup.clipped = true;
            entitiesLayer.addChild(wipeGroup);

            entitiesLayer.bringToFront();
            if (this._circleWipeMsAccum >= this._circleWipeMs) {
                paper.project.layers['Entities Layer'].children[this._groupName].remove();
                Entity.prototype.removeItem.call(this);

            }
        }
    }

}