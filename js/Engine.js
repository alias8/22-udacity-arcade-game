var initialised = false;

function init() {
    // todo: write readme and proper comments for bigger functions, then submit
    console.log('init called!');
    allEnemies = [];
    player = new Player();
    scoreBoard = new ScoreBoard();
    allGems = [];
    allRocks = [];

    var rowImages = [
        'images/water-block.png',
        'images/stone-block.png',
        'images/stone-block.png',
        'images/stone-block.png',
        'images/stone-block.png',
        'images/grass-block.png',
        'images/grass-block.png'
    ];
    var numRows = rowImages.length;
    var numCols = 5;
    var backgroundLayer = new Layer();
    backgroundLayer.name = 'Background Layer';
    backgroundLayer.sendToBack();
    backgroundLayer.visible = true;
    for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numCols; col++) {
            var image = paper.project.layers['Resources Layer'].children[rowImages[row]].clone();
            backgroundLayer.addChild(image);
            image.position = new Point(col * 101 + 101 / 2, row * 83 + 36);
            image.bringToFront();
            image.visible = true;
        }
    }

    for (var i = 0; i < 1; i++) {
        allEnemies.push(new Enemy());
    }

    for (var i = 0; i < 1; i++) {
        allGems.push(new Gem());
    }

    for (var i = 0; i < 1; i++) {
        allRocks.push(new Rock());
    }

    initialised = true;

}




function update(event) {
    var dt = event.delta;
    var count = event.count;
    dt = 0.015; // delte this line when program finished
    updateEntities(dt, count);
    addNewEnemies();
    addNewGems();
    addNewRocks ();
    checkCollisions();
}

function updateEntities(dt, count) {
    allEnemies.forEach(function (enemy) {
        enemy.update(dt);
    });
    player.update(dt);
    scoreBoard.update();
    allGems.forEach(function (gem) {
        gem.update(dt);
    });
    allRocks.forEach(function (rock) {
        rock.update(dt, count);
    });

}

function addNewEnemies() {
    if (allEnemies.length < 3) allEnemies.push(new Enemy());
}

function addNewGems() {
    if (allGems.length < 1) allGems.push(new Gem());
}

function addNewRocks() {
    if (allRocks.length < 2) allRocks.push(new Rock());
}

function checkCollisions() {
    allEnemies.forEach(function (enemy) {
        enemy.checkCollisions();
    });
    allGems.forEach(function (gem) {
        gem.checkCollisions();
    });
    allRocks.forEach(function (rock) {
        rock.checkCollisions();
    });
}

function render() {
    renderEntities();
    entitiesLayer.bringToFront();
    
}

function renderEntities() {
    allEnemies.forEach(function (enemy) {
        enemy.render();
    });

    player.render();
    scoreBoard.render();
    allGems.forEach(function (gem) {
        gem.render();
    });
    allRocks.forEach(function (rock) {
        rock.render();
    });
}

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        32: 'space'
    };
    document.handleDebugInput(allowedKeys[e.keyCode]);
});

document.handleDebugInput = function (key) {
    if (key === 'space') {
        debugger;
        var a1 = project.activeLayer.children;
        var a2 = a1['test raster'];
        var a3 = a1['should not be found'];
        var b = 2;
    }
}








