var Entity = function () {
    this.sprite = undefined;
    this.svg = undefined;
    this.rectangle = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(101, 171));
    this.rectangle.fillColor = 'red';
    this.rectangle.opacity = 0.3;
    
    this.stopped = false;
    this.svgAdjustX = 0;
    this.svgAdjustY = 0;
    this.spriteAdjustX = 0;
    this.spriteAdjustY = 0;
}

Entity.prototype.render = function () {
    this.sprite.visible = true;
    this.svg.visible = false;
    this.rectangle.visible = false;
    this.sprite.bounds.selected = false;
    this.svg.bounds.selected = false;
    this.rectangle.bounds.selected = false;
    entitiesLayer.bringToFront();
}

Entity.prototype.update = function (dt, direction) {
    if (!this.stopped) {
        var newTopLeftX = this.rectangle.bounds.topLeft.x + this.speed * dt * direction[0];
        var newTopLeftY = this.rectangle.bounds.topLeft.y + this.speed * dt * direction[1];
        Entity.prototype.moveEntity.call(this, newTopLeftX, newTopLeftY);
    }
}

Entity.prototype.moveEntity = function (newTopLeftX, newTopLeftY) {
    this.rectangle.position = new paper.Point(newTopLeftX + this.rectangle.bounds.width/2, newTopLeftY + this.rectangle.bounds.height/2);
    this.sprite.position = new paper.Point(this.rectangle.bounds.topLeft.x + this.sprite.width/2 + this.spriteAdjustX, this.rectangle.bounds.topLeft.y + this.sprite.height/2 + this.spriteAdjustY);
    this.svg.position = new paper.Point(this.rectangle.bounds.topLeft.x + this.svg.bounds.width / 2 + this.svgAdjustX, this.rectangle.bounds.topLeft.y + this.svg.bounds.height/2 + this.svgAdjustY);
}

Entity.prototype.removeItem = function () {
    var index = this.getObjectArray().indexOf(this);
    this.getObjectArray().splice(index, 1);
    this.rectangle.remove();
    this.sprite.remove();
    this.svg.remove();
}