var Gem = function () {
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

Gem.prototype.getObjectArray = function () {
    return allGems;
}

Gem.prototype.update = function (dt) {
    if (this.rectangle.bounds.topLeft.y >= this.endY) this.stopped = true;
    Entity.prototype.update.call(this, dt, [0, 1]);
}

Gem.prototype.render = function () {
    Entity.prototype.render.call(this);
}

Gem.prototype.checkCollisions = function () {
    if (this.svg.intersects(player.svg)) {
        Entity.prototype.removeItem.call(this);
        player.gemsCollected++;
    }
}