var ScoreBoard = (function () {
    var map = new WeakMap();
    var internal = function (object) {
        if (!map.has(object))
            map.set(object, {});
        return map.get(object);
    }

    function ScoreBoard() {
        internal(this).reachedWaterCount = new paper.PointText(new paper.Point(30, 550));
        internal(this).reachedWaterCount.fontSize = 20;
        internal(this).gemsCollectedCount = new paper.PointText(new paper.Point(30, 580));
        internal(this).gemsCollectedCount.fontSize = 20;
    }

    ScoreBoard.prototype.update = function () {
        internal(this).reachedWaterCount.content = 'Times Reached Water: ' + PLAYER.getReachedWaterCount();
        internal(this).gemsCollectedCount.content = 'Gems Collected: ' + PLAYER.getGemsCollectedCount();
    }

    ScoreBoard.prototype.render = function () {
        internal(this).reachedWaterCount.bringToFront();
        internal(this).gemsCollectedCount.bringToFront();
    }

    return ScoreBoard;
})();

