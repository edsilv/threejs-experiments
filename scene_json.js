var container, stats;

var camera, scene, renderer;

var group, text;

var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var finalRotationY;

var objects = {
    kissers: {
        model: 'models/kissers.json',
        texture: 'images/kissers.png',
        cameraX: 0,
        cameraY: 0,
        cameraZ: 4.5,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        ambientLightColor: 0xc2c1be,
        directionalLight1Color: 0xc2c1be,
        directionalLight1Intensity: 0.65,
        directionalLight2Color: 0x002958,
        directionalLight2Intensity: 0.4,
        shininess: 1,
        shading: THREE.SmoothShading
    }
}

var currentObject = objects.kissers;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

    camera.position.x = currentObject.cameraX;
    camera.position.y = currentObject.cameraY;
    camera.position.z = currentObject.cameraZ;

    scene = new THREE.Scene();

    //scene.fog = new THREE.FogExp2(0xefd1b5, 0.05);

    // lights

    light = new THREE.DirectionalLight(currentObject.directionalLight1Color, currentObject.directionalLight1Intensity);
    light.position.set(1, 1, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(currentObject.directionalLight2Color, currentObject.directionalLight2Intensity);
    light.position.set(-1, -1, -1);
    scene.add(light);

    light = new THREE.AmbientLight(currentObject.ambientLightColor);
    scene.add(light);

    // texture - texture must not be in same folder or there is an error.
    var texture = THREE.ImageUtils.loadTexture(currentObject.texture, {}, function(){
            // use to test when image gets loaded if it does
            render();
        },
        function(){
            alert('error')
        });

    material = new THREE.MeshPhongMaterial({ map: texture, shininess: currentObject.shininess, shading: currentObject.shading });

    group = new THREE.Object3D();

    // load mesh
    var loader = new THREE.JSONLoader();
    loader.load(currentObject.model, modelLoadedCallback);

    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    window.addEventListener('resize', onWindowResize, false);
}

function modelLoadedCallback(geometry) {
    mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    scene.add(group);

    group.translateX(currentObject.translateX);
    group.translateY(currentObject.translateY);
    group.translateZ(currentObject.translateZ);

    group.rotateX(currentObject.rotateX);
    group.rotateY(currentObject.rotateY);
    group.rotateZ(currentObject.rotateZ);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;
    }
}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;

        mouseY = event.touches[ 0 ].pageY - windowHalfY;
        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;

    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {

    // horizontal rotation
    group.rotation.y += (targetRotationX - group.rotation.y) * 0.1;

    // vertical rotation
    finalRotationY = (targetRotationY - group.rotation.x);

    if (group.rotation.x <= 1 && group.rotation.x >= -1) {
        group.rotation.x += finalRotationY * 0.1;
    }
    if (group.rotation.x > 1) {
        group.rotation.x = 1
    } else if (group.rotation.x < -1) {
        group.rotation.x = -1
    }

    renderer.render(scene, camera);
}