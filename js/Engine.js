var initialised = false;

function init() {
    console.log('init called!');
    ALLENEMIES = [];
    PLAYER = new Player();
    SCOREBOARD = new ScoreBoard();
    ALLGEMS = [];
    ALLROCKS = [];

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
        ALLENEMIES.push(new Enemy());
    }

    for (var i = 0; i < 1; i++) {
        ALLGEMS.push(new Gem());
    }

    for (var i = 0; i < 1; i++) {
        ALLROCKS.push(new Rock());
    }

    initialised = true;

}

function update(event) {
    var dt = event.delta;
    var count = event.count;
    //dt = 0.015; // delte this line when program finished
    updateEntities(dt, count);
    addNewEnemies();
    addNewGems();
    addNewRocks ();
    checkCollisions();
}

function updateEntities(dt, count) {
    ALLENEMIES.forEach(function (enemy) {
        enemy.update(dt);
    });
    PLAYER.update(dt);
    SCOREBOARD.update();
    ALLGEMS.forEach(function (gem) {
        gem.update(dt);
    });
    ALLROCKS.forEach(function (rock) {
        rock.update(dt, count);
    });

}

function addNewEnemies() {
    if (ALLENEMIES.length < 3) ALLENEMIES.push(new Enemy());
}

function addNewGems() {
    if (ALLGEMS.length < 1) ALLGEMS.push(new Gem());
}

function addNewRocks() {
    if (ALLROCKS.length < 2) ALLROCKS.push(new Rock());
}

function checkCollisions() {
    ALLENEMIES.forEach(function (enemy) {
        enemy.checkCollisions();
    });
    ALLGEMS.forEach(function (gem) {
        gem.checkCollisions();
    });
    ALLROCKS.forEach(function (rock) {
        rock.checkCollisions();
    });
}

function render() {
    renderEntities();
    entitiesLayer.bringToFront();
    
}

function renderEntities() {
    ALLENEMIES.forEach(function (enemy) {
        enemy.render();
    });

    PLAYER.render();
    SCOREBOARD.render();
    ALLGEMS.forEach(function (gem) {
        gem.render();
    });
    ALLROCKS.forEach(function (rock) {
        rock.render();
    });
}