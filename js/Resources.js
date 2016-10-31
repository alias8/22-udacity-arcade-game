/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function () {
    var readyCallbacks = [];
    function load(urlOrArr) {
        console.log ('load called');
        if (urlOrArr instanceof Array) {

            urlOrArr.forEach(function (url) {
                _load(url);
            });
        } else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        RESOURCESLAYER.activate();
        if (url.endsWith('.png')) {
            var image = new paper.Raster(url);
            image.onLoad = function () {
                console.log(url + ' has loaded');
                image.name = url;
                image.visible = false;
                if (isReady()) {
                    readyCallbacks.forEach(function (func) { func(); });
                }
            };
        }
        if (url.endsWith('.svg')) {
            paper.project.importSVG(url, {
                expandShapes: false,
                onLoad: function (svgParent) {
                    console.log(url + ' has loaded');
                    var path = svgParent.children.svg_element.children[0];
                    path.name = url;
                    path.visible = false;
                    RESOURCESLAYER.addChild(path);
                    svgParent.remove();
                    if (isReady()) {
                        readyCallbacks.forEach(function (func) { func(); });
                    }
                }
            });
        }
    }

    function isReady() {
        var layers = paper.project.layers['Resources Layer'].children;
        var ready = true;
        images.forEach(function (imageName) {
            if (layers[imageName] === undefined) {
                ready = false;
            }
        });
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.Resources = {
        load: load,
        onReady: onReady,
        isReady: isReady
    };

})();

paper.install(window);
var RESOURCESLAYER;
var ENTITIESLAYER;
window.onload = function () {
    console.log ('window loaded');
    paper.setup('myCanvas');
    paper.view.viewSize.width = 505;
    paper.view.viewSize.height = 606;

    RESOURCESLAYER = new paper.Layer();
    RESOURCESLAYER.bringToFront ();
    ENTITIESLAYER = new paper.Layer ();
    RESOURCESLAYER.name = 'Resources Layer';
    ENTITIESLAYER.name = 'Entities Layer';

    Resources.load(images);
    Resources.onReady(init);

    view.onFrame = function (event) {
        if (initialised) {
            update(event);
            render();
        }
    }

}

var images = [
'images/stone-block.png',
'images/water-block.png',
'images/grass-block.png',
'images/enemy-bug.png',
'images/char-boy.png',
'images/gem-green.png',
'images/enemy-bug.svg',
'images/char-boy.svg',
'images/gem.svg',
'images/Rock.png',
'images/rock.svg'
];



