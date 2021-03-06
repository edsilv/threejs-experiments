var container, stats;

var camera, controls, scene, renderer;

var useAxisHelper = false;
var useBoundingBoxHelper = false;

var objects = {
    violin: {
        obj: 'obj/violin2.obj',
        mtl: 'obj/violin2.mtl',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 1,
        translateX: 0,
        translateY: -0.3,
        translateZ: 0,
        rotateX: -1.57,
        rotateY: 0,
        rotateZ: 0,
        bgColor: 0x000000
    },
    aphrodite: {
        obj: 'obj/aphrodite-2-edit.obj',
        mtl: 'obj/aphrodite-2-edit.mtl',
        cameraX: 0,
        cameraY: 0,
        cameraZ: -50,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        bgColor: 0x000000
    },
    niall: {
        obj: 'obj/niall.obj',
        mtl: 'obj/niall.mtl',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 1,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: -1.57,
        rotateY: 0,
        rotateZ: 0,
        bgColor: 0x000000
    },
    columbus: {
        obj: 'obj/columbus.obj',
        mtl: 'obj/columbus.mtl',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 1,
        translateX: 0,
        translateY: -0.2,
        translateZ: 0,
        rotateX: -1.57,
        rotateY: 0,
        rotateZ: -1.57,
        bgColor: 0x000000
    },
    ted: {
        obj: 'obj/ted2.obj',
        mtl: 'obj/ted2.mtl',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 1.2,
        translateX: 0,
        translateY: -0.05,
        translateZ: 0,
        rotateX: -1.57,
        rotateY: 0,
        rotateZ: 0,
        bgColor: 0x000000
    },
    kissers: {
        obj: 'obj/kissers3.obj',
        mtl: 'obj/kissers3.mtl',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 10,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        bgColor: 0x86878C
    },
    bird: {
        obj: 'obj/bird.obj',
        mtl: 'obj/bird.mtl',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        bgColor: 0x2E373D
    },
    thekiss: {
        obj: 'obj/thekiss.obj',
        mtl: 'obj/thekiss.mtl',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 3,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0//,
        //bgColor: 0x42413e
    }
};

var currentObj = objects.thekiss;

$(function() {
    init();
    render();
});

function init() {

    container = $('#container')[0];

    // camera

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = currentObj.cameraX;
    camera.position.y = currentObj.cameraY;
    camera.position.z = currentObj.cameraZ;

    //controls

    controls = new THREE.OrbitControls(camera);
    controls.minDistance = 1;
    controls.maxDistance = 5;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI/2;
    controls.enableDamping = false; // https://github.com/mrdoob/three.js/issues/5369
    controls.damping = 0.25;
    controls.addEventListener('change', render);

    // scene

    scene = new THREE.Scene();

    if (useAxisHelper){
        var axisHelper = new THREE.AxisHelper();
        scene.add(axisHelper);
    }

    var ambient = new THREE.AmbientLight();
    ambient.color.setHex(0xFFFFFF);
    scene.add(ambient);

    // model

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var $loadingBar = $('.loading .bar');
            var fullWidth = $loadingBar.parent().width();
            var width = fullWidth * (xhr.loaded / xhr.total * 1);
            $loadingBar.width(width);
            if (width === fullWidth) {
                $('.loading').hide();
            }

            console.log(xhr.loaded / xhr.total * 100);
        }
    };

    var onError = function (xhr) {
    };

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var loader = new THREE.OBJMTLLoader();

    loader.load(currentObj.obj, currentObj.mtl, function (object) {

        scene.add(object);

        if (useBoundingBoxHelper){
            var helper = new THREE.BoundingBoxHelper(object, 0xff0000);
            helper.update();
            scene.add(helper);
        }

        object.translateX(currentObj.translateX);
        object.translateY(currentObj.translateY);
        object.translateZ(currentObj.translateZ);

        object.rotateX(currentObj.rotateX);
        object.rotateY(currentObj.rotateY);
        object.rotateZ(currentObj.rotateZ);

    }, onProgress, onError);

    renderer = new THREE.WebGLRenderer({ alpha: true });

    // if the object has a bg color, use that.
    if (currentObj.bgColor){
        renderer.setClearColor(currentObj.bgColor);
    } else {
        // otherwise, make the bg transparent.
        renderer.setClearColor( 0x000000, 0 );
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    onWindowResize();

    animate();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    $('.loading').css({
        left: (window.innerWidth / 2) - ($('.loading').width() / 2),
        top: (window.innerHeight / 2) - ($('.loading').height() / 2)
    });

    render();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}