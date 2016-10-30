function ScoreBoard() {
    this.reachedWaterCount = new paper.PointText(new paper.Point(30, 550));
    this.reachedWaterCount.fontSize = 20;
    this.gemsCollectedCount = new paper.PointText(new paper.Point(30, 580));
    this.gemsCollectedCount.fontSize = 20;
}

ScoreBoard.prototype.update = function () {
    this.reachedWaterCount.content = 'Times Reached Water: ' + PLAYER.reachedWaterCount;
    //this.reachedWaterCount.content = 'Times Reached Water: ' + PLAYER.reachedWaterCountGetter;
    //var test = PLAYER.reachedWaterCount;
    this.gemsCollectedCount.content = 'Gems Collected: ' + PLAYER.gemsCollected;
}

ScoreBoard.prototype.render = function () {
    this.reachedWaterCount.bringToFront();
    this.gemsCollectedCount.bringToFront();
}