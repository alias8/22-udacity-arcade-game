class ScoreBoard {
    constructor() {
        this._reachedWaterCount = new paper.PointText(new paper.Point(30, 550));
        this._reachedWaterCount.fontSize = 20;
        this.gemsCollectedCount = new paper.PointText(new paper.Point(30, 580));
        this.gemsCollectedCount.fontSize = 20;
    }
    update() {
        this._reachedWaterCount.content = 'Times Reached Water: ' + PLAYER._reachedWaterCount;
        this.gemsCollectedCount.content = 'Gems Collected: ' + PLAYER._gemsCollected;
    }
    render() {
        this._reachedWaterCount.bringToFront();
        this.gemsCollectedCount.bringToFront();
    }
}