/**
 * Represents bugs to be avoided by the Player.
 * @extends Entity
 */
class Enemy extends Entity{
    constructor() {
        super();
        console.log('enemy constructor called');
        this._svg = paper.project.layers['Resources Layer'].children['images/enemy-bug.svg'].clone();
        this._sprite = paper.project.layers['Resources Layer'].children['images/enemy-bug.png'].clone();
        entitiesLayer.addChild(this._svg);
        entitiesLayer.addChild(this._sprite);
        entitiesLayer.addChild(this._boundingRectangle);

        this._sprite.scale(1, 1);
        this._svg.scale(1, 1);
        this._spriteAdjustX = 0;
        this._spriteAdjustY = 30;
        this._svgAdjustX = 2;
        this._svgAdjustY = 88;

        this._startX = -100;
        this._startY = getRandomIntInclusive(0, 3) * 83;
        this.moveEntity(this._startX, this._startY);
        this._endX = paper.view.viewSize.width;
        this._speed = getRandomIntInclusive(1, 4) * 100;
    }

    update(dt) {
        if (this._boundingRectangle.bounds.topLeft.x >= paper.view.viewSize.width) {
            Entity.prototype.removeItem.call(this);
        }
        Entity.prototype.update.call(this, dt, [1, 0]);
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
     * Returns global ALLENEMIES array.
     * @returns {Array<Enemy>} 
     */
    getObjectArray() {
        return ALLENEMIES;
    }

};