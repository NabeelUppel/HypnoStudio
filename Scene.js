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
    simpleHouseBase(0,5,0);
    simpleHouseBase(10,5,0);
    simpleHouseBase(-10,5,0);
    simpleHouseBase(10,5,10);
    simpleHouseBase(0,5,10);
    simpleHouseBase(-10,5,10);
    //Ball(0,0,0);

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

function simpleHouseBase(x, y, z) {
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    boxBody = new CANNON.Body({mass: 0});
    boxBody.addShape(shape);
    boxBody.position.set(x, y, z);
    boxBody.userData = {name: "HOUSE"}
    world.addBody(boxBody);
    bodies.push(boxBody);

    const cubeGeo = new THREE.BoxGeometry(10, 10, 10, 10, 10);

    const houseMaterials = [];
    const texture = new THREE.TextureLoader().load('resources/objects/pokemon_style_house/textures/Brick_baseColor.png');
    houseMaterials.push( new THREE.MeshBasicMaterial( { map: texture} ) );
    houseMaterials.push( new THREE.MeshBasicMaterial( { map: texture} ) );
    const roofTexture = new THREE.TextureLoader().load('resources/objects/pokemon_style_house/textures/Blue Roof.png');
    houseMaterials.push( new THREE.MeshBasicMaterial( { map: roofTexture} ) );
    houseMaterials.push( new THREE.MeshBasicMaterial( { map: texture} ) );
    houseMaterials.push( new THREE.MeshBasicMaterial( { map: texture} ) );
    houseMaterials.push( new THREE.MeshBasicMaterial( { map: texture} ) );

    CubeShape = new THREE.Mesh(cubeGeo, houseMaterials);
    CubeShape.castShadow = true;

    camera.lookAt(CubeShape.position)
    meshes.push(CubeShape);
    scene.add(CubeShape);

}



function Ball(x, y, z) {
    const radius = 1;
    let shape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({mass: 0});
    sphereBody.addShape(shape);
    sphereBody.position.set(x, y, z);
    world.addBody(sphereBody);
    bodies.push(sphereBody);


    const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = new THREE.MeshPhongMaterial({color: "#711a1a"});
    SphereShape = new THREE.Mesh(sphereGeometry, material);
    SphereShape.castShadow = true;
    camera.lookAt(SphereShape.position)
    scene.add(SphereShape);
    meshes.push(SphereShape);
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

//House

function HouseMod(x,y,z){

    // default materials
    const materials_default = {
        base: new THREE.MeshStandardMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        }),
        tri: new THREE.MeshStandardMaterial({
            color: 0xaf0000,
            side: THREE.DoubleSide
        }),
        roof: new THREE.MeshStandardMaterial({
            color: 0x202020,
            side: THREE.DoubleSide
        })
    };

    // create a triangle part of the house
    const HouseTriangle = function(materials){
        materials = materials || materials_default;
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -1, 0, 0,
            0.5, 1.5, 0,
            2, 0, 0
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals(); // compute vertex normals
        geometry.addGroup(0, 3, 0); // just one group
        return new THREE.Mesh(
            geometry,
            materials.tri);
    };

    // create and return a house
    HouseMod.create = function(materials){
        materials = materials || materials_default;
        // main house group
        const house = new THREE.Group();

        // base of house is just a BOX
        const base = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 4), materials.base);
        house.add(base);

        // house triangle parts
        const tri1 = HouseTriangle(materials);
        tri1.position.set(-0.5, 1 , 2);
        house.add(tri1);
        const tri2 = HouseTriangle(materials);
        tri2.position.set(-0.5, 1 , -2);
        house.add(tri2);

        // roof
        const roof1 = new THREE.Mesh(
            new THREE.PlaneGeometry(2.84, 4.5),
            materials.roof);
        roof1.position.set(-1, 1.51, 0);
        roof1.rotation.set(Math.PI * 0.5, Math.PI * 0.25, 0);
        house.add(roof1);
        const roof2 = new THREE.Mesh(
            new THREE.PlaneGeometry(2.84, 4.5),
            materials.roof);
        roof2.position.set(1, 1.51, 0);
        roof2.rotation.set(Math.PI * 0.5, Math.PI * -0.25, 0);
        house.add(roof2);

        // house should cast a shadow
        house.castShadow = true;
        house.receiveShadow = false;
        return house;
    };

}





const loader = new GLTFLoader();

/*loader.load( 'resources/objects/pokemon_style_house/houseObjectImported.gltf', function ( gltf ) {

    camera.lookAt( gltf.scene )

    scene.add( gltf.scene );
    mesh.push( gltf.scene );
    }, undefined, function ( error ) {

    console.error( error );

} );*/


main();

