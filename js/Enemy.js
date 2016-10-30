function Enemy() {
    Entity.call(this); // call super constructor.
    console.log ('enemy constructor called');
    this.svg = paper.project.layers['Resources Layer'].children['images/enemy-bug.svg'].clone();
    this.sprite = paper.project.layers['Resources Layer'].children['images/enemy-bug.png'].clone();
    entitiesLayer.addChild(this.svg);
    entitiesLayer.addChild(this.sprite);
    entitiesLayer.addChild(this.rectangle);

    this.sprite.scale(1, 1);
    this.svg.scale(1, 1);
    this.spriteAdjustX = 0;
    this.spriteAdjustY = 30;
    this.svgAdjustX = 2;
    this.svgAdjustY = 88;

    this.startX = -100;
    this.startY = getRandomIntInclusive(0, 3) * 83;
    this.moveEntity(this.startX, this.startY);
    this.endX = paper.view.viewSize.width;
    this.speed = getRandomIntInclusive(1, 4) * 100;
};
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.checkCollisions = function () {
    if (this.svg.intersects(PLAYER.svg)) {
        PLAYER.alive = false;
    }
}

Enemy.prototype.getObjectArray = function () {
    return ALLENEMIES;
}

Enemy.prototype.update = function (dt) {
    if (this.rectangle.bounds.topLeft.x >= paper.view.viewSize.width) {
        Entity.prototype.removeItem.call(this);
    }
    Entity.prototype.update.call(this, dt, [1, 0]);
};

Enemy.prototype.render = function () {
    Entity.prototype.render.call(this);

};