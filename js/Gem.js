/**
 * Represents gems to be collected by the Player.
 * @extends Entity
 * @constructor 
 */
function Gem() {
    Entity.call(this); // call super constructor.
    this.sprite = paper.project.layers['Resources Layer'].children['images/gem-green.png'].clone();
    this.svg = paper.project.layers['Resources Layer'].children['images/gem.svg'].clone();
    entitiesLayer.addChild(this.svg);
    entitiesLayer.addChild(this.sprite);

    this.speed = 50;

    this.sprite.scale(0.7, 0.7);
    this.svg.scale(0.7, 0.7);
    this.spriteAdjustX = 0;
    this.spriteAdjustY = 20;
    this.svgAdjustX = 18;
    this.svgAdjustY = 85;
   
    this.startX = getRandomIntInclusive(0, 4) * 101;
    this.startY = -100;
    this.moveEntity(this.startX, this.startY);
    this.endY = getRandomIntInclusive(0, 3) * 83;
}
Gem.prototype = Object.create(Entity.prototype);
Gem.prototype.constructor = Gem;

/**
 * Returns ALLGEMS, the global array storing all current Gem Entities
 * @returns {Array} 
 */
Gem.prototype.getObjectArray = function () {
    return ALLGEMS;
}

Gem.prototype.update = function (dt) {
    if (this.rectangle.bounds.topLeft.y >= this.endY) this.stopped = true;
    Entity.prototype.update.call(this, dt, [0, 1]);
}

Gem.prototype.render = function () {
    Entity.prototype.render.call(this);
}

/**
 * Checks for collision between this SVG and Player SVG.
 * @returns {} 
 */
Gem.prototype.checkCollisions = function () {
    if (this.svg.intersects(PLAYER.svg)) {
        Entity.prototype.removeItem.call(this);
        PLAYER.gemsCollected++;
    }
}