/** @global */
var ALLENEMIES;
/** @global */
var PLAYER;
/** @global */
var SCOREBOARD;
/** @global */
var ALLGEMS;
/** @global */
var ALLROCKS;

/** @global */
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    PLAYER._handleInput(allowedKeys[e.keyCode]);
});

/** @global */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}