import * as THREE from './resources/threejs/r128/build/three.module.js';
import {OrbitControls} from './resources/threejs/r128/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from './resources/threejs/r128/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from './resources/threejs/r128/examples/jsm/loaders/GLTFLoader.js';


let pressed = {};
let clock = new THREE.Clock();
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let Ground, groundBody;
let CubeShape, boxBody;
let SphereShape, sphereBody;
let jump = false;
let meshes = [];
let bodies = [];
let allAnimations = {}
let mixer
let character
let keyboard = new THREEx.KeyboardState()


function main() {
    initCannon();
    initThree();
    //BOX POSITIONS NOT SIZE
    SmallHouse(0,0,0);

    //HouseMod(0,0,0)
    animate();
}


function initCannon() {

    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.broadphase.useBoundingBoxes = true;
    world.solver.iterations = 10;
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRegularizationTime = 4;

}


function initThree() {
    canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    scene = new THREE.Scene();

    const fov = 90;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 35);
    camera.lookAt(scene.position)
    orbitalControls();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    LightEnable(light);
    scene.add(light);

    addHemisphereLight(0xB1E1FF, 0xB97A20)

    AddGround();
}

function LightEnable(light) {
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
}

function orbitalControls() {
    controls = new OrbitControls(camera, canvas);
    controls.maxPolarAngle = Math.PI / 2
    controls.target.set(0, 5, 0);
    controls.update();
    controls.enableKeys = false;
}

/*function Object(x, y, z) {
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    boxBody = new CANNON.Body({mass: 0});
    boxBody.addShape(shape);
    boxBody.position.set(x, y, z);
    boxBody.userData = {name: "HOUSE"}
    world.addBody(boxBody);
    bodies.push(boxBody);

    var house_obj = house();
    scene.add(house_obj);
}*/

function SmallHouse(x, y, z){
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    boxBody = new CANNON.Body({mass: 2});
    boxBody.addShape(shape);
    boxBody.position.set(x, y, z);
    boxBody.userData = {name: "HOUSE"}
    world.addBody(boxBody);
    bodies.push(boxBody);

    const h = new THREE.Group();

    //Texture Loading
    const cornerTexture = new THREE.TextureLoader().load( "resources/objects/pokemon_style_house/textures/Brick_baseColor.png" );
    const wallTexture = new THREE.TextureLoader().load( "resources/objects/pokemon_style_house/textures/Brick_baseColor.png" );
    const roofTexture1  = new THREE.TextureLoader().load("resources/objects/pokemon_style_house/textures/Blue Roof.png");
    const animatedWall = new THREE.TextureLoader().load("resources/objects/pokemon_style_house/textures/Main_baseColor.png");
    const windows = new THREE.TextureLoader().load("resources/objects/pokemon_style_house/textures/house2.PNG");

    //corner pieces
    cornerTexture.wrapS = THREE.RepeatWrapping;
    cornerTexture.wrapT = THREE.RepeatWrapping;
    cornerTexture.repeat.set( 1,3 );

    const cubeGeo = new THREE.BoxGeometry(2, 15, 0.5, 10, 10);
    const material = new THREE.MeshBasicMaterial({map: animatedWall});
    CubeShape = new THREE.Mesh(cubeGeo, material);
    CubeShape.rotateY(10);
    CubeShape.position.setX(0.35);
    CubeShape.position.setZ(-0.35);
    h.add(CubeShape);

    //walls
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set( 1, 1 );

    const geo = new THREE.BoxGeometry(15, 15, 0.5, 10, 10);
    const mat = new THREE.MeshBasicMaterial({map: windows});
    const CubeShape1 = new THREE.Mesh(geo, mat);
    CubeShape1.rotateY(29.85);
    CubeShape1.position.setX(1);
    CubeShape1.position.setZ(-8.3);
    h.add(CubeShape1);

    //one corner piece
    const g = new THREE.BoxGeometry(2, 15, 0.5, 10, 10);
    const m = new THREE.MeshBasicMaterial({map: animatedWall});
    CubeShape = new THREE.Mesh(g, m);
    CubeShape.rotateY(-10);
    CubeShape.position.setX(0.25);
    CubeShape.position.setZ(-16.15);
    h.add(CubeShape);

    const CubeShape2 = new THREE.Mesh(geo, mat);
    CubeShape2.position.setX(-7.8);
    CubeShape2.position.setZ(0.2);
    h.add(CubeShape2);

    const CubeShape3 = new THREE.Mesh(geo, mat);
    CubeShape3.position.setX(-7.8);
    CubeShape3.position.setZ(-16.61);
    h.add(CubeShape3);

    CubeShape = new THREE.Mesh(cubeGeo, material);
    CubeShape.rotateY(-10);
    CubeShape.position.setX(-16);
    CubeShape.position.setZ(-0.35);
    h.add(CubeShape);

    CubeShape = new THREE.Mesh(cubeGeo, material);
    CubeShape.rotateY(10);
    CubeShape.position.setX(-16);
    CubeShape.position.setZ(-16.1);
    h.add(CubeShape);

    const CubeShape4 = new THREE.Mesh(geo, mat);
    CubeShape4.rotateY(29.85);
    CubeShape4.position.setX(-16.75);
    CubeShape4.position.setZ(-8.2);
    h.add(CubeShape4);

    const ge = new THREE.BoxGeometry(19, 0.5, 18, 10, 10);
    const ma = new THREE.MeshLambertMaterial({map: roofTexture1 });
    CubeShape = new THREE.Mesh(ge, ma);
    CubeShape.position.set(-7.75,7.5,-8);
    h.add(CubeShape);

    const gee = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
    const maa = new THREE.MeshLambertMaterial({map: roofTexture1});
    CubeShape = new THREE.Mesh(gee, maa);
    CubeShape.position.set(-7.75,7.95,-8);
    CubeShape.scale.set(0.9,0.9,0.9);
    h.add(CubeShape);

    const geee = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
    const maaa = new THREE.MeshLambertMaterial({map: roofTexture1});
    CubeShape = new THREE.Mesh(geee, maaa);
    CubeShape.position.set(-7.75,8.3,-8);
    CubeShape.scale.set(0.8,0.8,0.8);
    h.add(CubeShape);

    const geeee = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
    const maaaa = new THREE.MeshLambertMaterial({map: roofTexture1});
    CubeShape = new THREE.Mesh(geeee, maaaa);
    CubeShape.position.set(-7.75,8.65,-8);
    CubeShape.scale.set(0.7,0.7,0.7);
    h.add(CubeShape);

    const geeeee = new THREE.CylinderGeometry(0, 8, 4, 4, 10)
    const roofMaterials = [];
    roofMaterials.push( new THREE.MeshLambertMaterial( { map: roofTexture1} ) );
    roofMaterials.push( new THREE.MeshLambertMaterial( { map: roofTexture1} ) );
    roofMaterials.push( new THREE.MeshLambertMaterial( { map: roofTexture1} ) );
    roofMaterials.push( new THREE.MeshLambertMaterial( { map: roofTexture1} ) );

    CubeShape = new THREE.Mesh(geeeee, roofMaterials);
    CubeShape.rotateY(Math.PI/4);
    CubeShape.position.set(-7.75,11,-8);
    CubeShape.scale.set(1,1,1);
    h.add(CubeShape);

    scene.add(h);
}

function AddGround() {
    const planeSize = 10000;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('resources/objects/pokemon_style_house/textures/pavement.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);


    const groundShape = new CANNON.Plane();
    groundBody = new CANNON.Body({mass: 0});
    groundBody.addShape(groundShape)
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.set(0, 0, 0);
    groundBody.userData = {name: "GROUND"}
    world.add(groundBody);
    bodies.push(groundBody);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, 1, 1);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });

    Ground = new THREE.Mesh(planeGeo, planeMat);
    Ground.castShadow = false;
    Ground.receiveShadow = true;
    Ground.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    scene.add(Ground);
    meshes.push(Ground);
}


function render() {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);

}

function updatePhysics() {

    // Step the physics world
    world.step(timeStep);
    updateMeshPositions();
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function addHemisphereLight(skyColor, groundColor) {
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}

function updateMeshPositions() {
    for (let i = 0; i !== meshes.length; i++) {
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }
}

function animate() {

    requestAnimationFrame(animate);
    updatePhysics();
    render();
}


const loader = new GLTFLoader();


main();