/**
 * Represents gems to be collected by the Player.
 * @extends Entity
 */
class Gem extends Entity {
    /**
     * @constructor 
     * @returns {}
     */
    constructor() {
        super();
        this._sprite = paper.project.layers['Resources Layer'].children['images/gem-green.png'].clone();
        this._svg = paper.project.layers['Resources Layer'].children['images/gem.svg'].clone();
        entitiesLayer.addChild(this._svg);
        entitiesLayer.addChild(this._sprite);

        this._speed = 50;

        this._sprite.scale(0.7, 0.7);
        this._svg.scale(0.7, 0.7);
        this._spriteAdjustX = 0;
        this._spriteAdjustY = 20;
        this._svgAdjustX = 18;
        this._svgAdjustY = 85;

        this._startX = getRandomIntInclusive(0, 4) * 101;
        this._startY = -100;
        this.moveEntity(this._startX, this._startY);
        this._endY = getRandomIntInclusive(0, 3) * 83;
    }

    update(dt) {
        if (this._boundingRectangle.bounds.topLeft.y >= this._endY) this._stopped = true;
        super.update(dt, [0, 1]);
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
            Entity.prototype.removeItem.call(this);
            PLAYER._gemsCollected++;
        }
    }
    /**
     * Returns ALLGEMS, the global array storing all current Gem Entities
     * @returns {Array} 
     */
    getObjectArray() {
        return ALLGEMS;
    }
}