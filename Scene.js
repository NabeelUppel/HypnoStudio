import * as THREE from './resources/threejs/r128/build/three.module.js';
import {OrbitControls} from './resources/threejs/r128/examples/jsm/controls/OrbitControls.js';
import {FBXLoader} from './resources/threejs/r128/examples/jsm/loaders/FBXLoader.js';

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
let treeBody, bushBody, shroomBody, shrubBody, roundBody, squareBody;


function main() {
    initCannon();
    initThree();
    //BOX POSITIONS NOT SIZE
    //Box(0,1,0);
    Display(0,1,0);
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
    renderer = new THREE.WebGLRenderer({canvas});
    scene = new THREE.Scene();

    const fov = 45;
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

function sign(town,x,y,z){
    const group = new THREE.Group();



    const geometry = new THREE.CylinderGeometry( 0.25,0.25,8, 32 );
    const material = new THREE.MeshLambertMaterial ({
        color: "#C0C0C0",
        envMap: scene.background, // must be the background of scene
        combine: THREE.MixOperation,
        reflectivity: .5
    })

    x = 0

    for (var i = 0; i < 2; i++) {
        const cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.set(i + x,4,0);
        group.add( cylinder );
        x = 3;

    }


    const texture2 = new THREE.TextureLoader().load( "./resources/images/"+ town+".png" );
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set( 1, 1 );

    var m = new THREE.MeshBasicMaterial({ map: texture2 });
    
    const Geo = new THREE.BoxGeometry(7, 2, 0.5, 10, 10);
    const CubeShape1 = new THREE.Mesh(Geo, m);
    CubeShape1.position.set(2,8,0);
    CubeShape1.castShadow = true;
    group.add(CubeShape1);


    return(group);
}

function lampPost(x,y,z){

    const group = new THREE.Group();

    const texture0 = new THREE.TextureLoader().load( "./resources/images/fence.jpg" );
    texture0.wrapS = THREE.RepeatWrapping;
    texture0.wrapT = THREE.RepeatWrapping;
    texture0.repeat.set( 2, 1 );

    const cubeGeo = new THREE.BoxGeometry(1, 9, 1, 10, 10);
    const material = new THREE.MeshPhongMaterial({map: texture0, side: THREE.DoubleSide});
    //const material = new THREE.MeshLambertMaterial({color: "#8e8d8d"});
    CubeShape = new THREE.Mesh(cubeGeo, material);
    CubeShape.position.setY(4.5);
    CubeShape.castShadow = true;

    group.add(CubeShape);

    const Geo = new THREE.BoxGeometry(6, 1, 0.5, 10, 10);
    const CubeShape1 = new THREE.Mesh(Geo, material);
    CubeShape1.position.set(-2,8,0);
    CubeShape1.castShadow = true;
    group.add(CubeShape1);

    const Geometry = new THREE.BoxGeometry(3, 0.5, 0.5, 10, 10);
    const CubeShape2 = new THREE.Mesh(Geometry, material);
    CubeShape2.position.set(-1.2,6.5,0);
    CubeShape2.rotateZ(-4);
    CubeShape2.castShadow = true;
    group.add(CubeShape2);

    const texture = new THREE.TextureLoader().load( "./resources/images/lantern.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );



    const g = new THREE.CylinderGeometry( 0.75,0.5,1.5,4 );
    const m = new THREE.MeshLambertMaterial({color: "#8e8d8d"});
    //const m = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
    const cylinder = new THREE.Mesh( g, m );
    cylinder.position.set(-4,5,0)
    group.add( cylinder );

    const g2 = new THREE.CylinderGeometry( 0.1,0.75,1,4 );
    const m2 = new THREE.MeshLambertMaterial({color: "#000000"});

    const cylinder2 = new THREE.Mesh( g2, m2 );
    cylinder2.position.set(-4,6.25,0)

    group.add( cylinder2 );

    const g3 = new THREE.CylinderGeometry( 0.65,0.75,0.2,4 );
    const m3 = new THREE.MeshLambertMaterial({color: "#000000"});
    const cylinder3 = new THREE.Mesh( g3, m3 );
    cylinder3.position.set(-4,4.2,0)
    group.add( cylinder3 );


    const texture2 = new THREE.TextureLoader().load( "./resources/images/rope2.jpg" );
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set( 2, 2 );



    const g4 = new THREE.CylinderGeometry( 0.15,0.15,2,32 );
    const m4 = new THREE.MeshLambertMaterial({color: "#b5651d"});
    //const m4 = new THREE.MeshPhongMaterial({map: texture2, side: THREE.DoubleSide});
    const cylinder4 = new THREE.Mesh( g4, m4 );
    cylinder4.position.set(-4,7,0)
    group.add( cylinder4 );


    return group;

}

function shrub(x,y,z) {

    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    shrubBody = new CANNON.Body({mass: 2});
    shrubBody.addShape(shape);
    shrubBody.position.set(x, y, z);
    shrubBody.userData = {name: "SHRUB"}
    world.addBody(shrubBody);
    bodies.push(shrubBody);

    const geom = new THREE.SphereGeometry( 1, 30, 30 );
    const mat = new THREE.MeshLambertMaterial( {color: "#228C22"} );
    const group = new THREE.Group();
    for (var i = -2; i < 3; i++) {
        const sphere = new THREE.Mesh( geom, mat );
        sphere.rotateY(30);
        sphere.position.set(i,y,0.9)
        sphere.scale.set(0.5,0.5,1);
        group.add( sphere );

    }
    const group2 = new THREE.Group();

    for (var i = -2; i < 3; i++) {
        const sphere = new THREE.Mesh( geom, mat );
        sphere.rotateY(30);
        sphere.position.set(i,y,-0.5)
        sphere.scale.set(0.5,0.5,1);
        group2.add( sphere );

    }

    const group3 = new THREE.Group();

    for (var i = -2; i < 3; i++) {
        const sphere = new THREE.Mesh( geom, mat );
        sphere.rotateY(30);
        sphere.position.set(i,y,-1)
        sphere.scale.set(0.5,0.5,1);
        group3.add( sphere );

    }
    const group4 = new THREE.Group();

    for (var i = -2; i < 3; i++) {
        const sphere = new THREE.Mesh( geom, mat );
        sphere.rotateY(30);
        sphere.position.set(i,y,-0.00000000001)
        sphere.scale.set(0.5,0.5,1);
        group4.add( sphere );

    }


    const final = new THREE.Group();

    final.add(group);
    final.add(group2);
    final.add(group3);
    final.add(group4);

    return final;
}

function squareShrub(x,y,z){
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    squareBody = new CANNON.Body({mass: 2});
    squareBody.addShape(shape);
    squareBody.position.set(x, y, z);
    squareBody.userData = {name: "SQUARESHRUB"}
    world.addBody(squareBody);
    bodies.push(squareBody);

    const temp = new THREE.Group();


    var shrubs = shrub(x,y,z);
    shrubs.position.setY(0);
    temp.add(shrubs);

    var shrubs2 = shrub(x,y,z);
    shrubs2.position.setY(1);
    temp.add(shrubs2);

    var shrubs3 = shrub(x,y,z);
    shrubs.position.setY(2);
    temp.add(shrubs3);


    return temp;

}

function bush(x,y,z){
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    bushBody = new CANNON.Body({mass: 2});
    bushBody.addShape(shape);
    bushBody.position.set(x, y, z);
    bushBody.userData = {name: "BUSH"}
    world.addBody(bushBody);
    bodies.push(bushBody);
    const group = new THREE.Group();

    const geom = new THREE.SphereGeometry( 2, 30, 30 );
    const mat = new THREE.MeshLambertMaterial( {color: "#228C22"} );

    const sphere1 = new THREE.Mesh( geom, mat );
    sphere1.position.set(0,10,1)
    group.add( sphere1 );

    const sphere2 = new THREE.Mesh( geom, mat );
    sphere2.position.set(2.5,9.5,-0.5)
    group.add( sphere2 );

    const sphere3 = new THREE.Mesh( geom, mat );
    sphere3.position.set(-2,9.3,-1)
    group.add( sphere3 );

    const sphere4 = new THREE.Mesh( geom, mat );
    sphere4.position.set(-1,11.5,-0.7)
    group.add( sphere4 );

    const sphere5 = new THREE.Mesh( geom, mat );
    sphere5.position.set(1.5,12,-2)
    group.add( sphere5 );

    const sphere6 = new THREE.Mesh( geom, mat );
    sphere6.position.set(0,10,-3)
    group.add( sphere6 );

    const sphere7 = new THREE.Mesh( geom, mat );
    sphere7.position.set(2.5,9.2,-2.65)
    group.add( sphere7 );

    group.position.setZ(1.5);

    return group;
}

function roundBush(x,y,z){
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    roundBody = new CANNON.Body({mass: 2});
    roundBody.addShape(shape);
    roundBody.position.set(x, y, z);
    roundBody.userData = {name: "ROUNDBUSH"}
    world.addBody(roundBody);
    bodies.push(roundBody);

    const group = new THREE.Group();

    const geom = new THREE.SphereGeometry( 1, 30, 30 );
    const mat = new THREE.MeshLambertMaterial( {color: "#228C22"} );

    const sphere1 = new THREE.Mesh( geom, mat );
    sphere1.position.set(0,10,1);
    group.add( sphere1 );

    const sphere2 = new THREE.Mesh( geom, mat );
    sphere2.position.set(1.25,9.75,-0.25);
    group.add( sphere2 );

    const sphere3 = new THREE.Mesh( geom, mat );
    sphere3.position.set(-1,9.65,-0.5);
    group.add( sphere3 );

    const sphere4 = new THREE.Mesh( geom, mat );
    sphere4.position.set(-0.5,10.75,-0.35);
    group.add( sphere4 );

    const sphere5 = new THREE.Mesh( geom, mat );
    sphere5.position.set(0.75,11,-1)
    group.add( sphere5 );

    const sphere6 = new THREE.Mesh( geom, mat );
    sphere6.position.set(0,10,-1.5)
    group.add( sphere6 );

    const sphere7 = new THREE.Mesh( geom, mat );
    sphere7.position.set(1.25,9.2,-1.325)
    group.add( sphere7 );

    group.position.setZ(0.75);

    return group;
}

function Tree(x,y,z){
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    treeBody = new CANNON.Body({mass: 2});
    treeBody.addShape(shape);
    treeBody.position.set(x, y, z);
    treeBody.userData = {name: "TREE"}
    world.addBody(treeBody);
    bodies.push(treeBody);

    const t = new THREE.Group();
    //Tree trunk
    // load bark texture, set wrap mode to repeat
    const texture = new THREE.TextureLoader().load("./resources/images/tree_bark.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    const geometry = new THREE.CylinderGeometry(1.25, 1.25, 20, 32);
    const material = new THREE.MeshPhongMaterial({map: texture});
    const cylinder = new THREE.Mesh(geometry, material);
    t.add(cylinder);

    //add leaves part of tree
    var bushes = bush();
    t.add(bushes);


    return t;
}

function mushroom(x, y, z){
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    shroomBody = new CANNON.Body({mass: 2});
    shroomBody.addShape(shape);
    shroomBody.position.set(x, y, z);
    shroomBody.userData = {name: "MUSHROOM"}
    world.addBody(shroomBody);
    bodies.push(shroomBody);

    var shroom = new THREE.Group();

    const g = new THREE.CylinderGeometry( 1,  0.75, 3 );
    const m = new THREE.MeshPhongMaterial({color: "#FFFFFF"});
    const cylinder = new THREE.Mesh( g, m );
    shroom.add( cylinder );

    const texture = new THREE.TextureLoader().load( "./resources/images/shroom.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );

    const geom = new THREE.SphereGeometry(2,30,30, Math.PI/2,  Math.PI, 0, Math.PI)
    const mat = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});

    const halfSphere = new THREE.Mesh( geom, mat );

    halfSphere.rotateZ(-4.66);
    //halfSphere.rotateY(10);
    shroom.add(halfSphere);

    const geometry = new THREE.CircleGeometry( 2, 30 );
    const material = new THREE.MeshBasicMaterial( { color: "#FF0000" } );
    const circle = new THREE.Mesh( geometry, material );
    circle.rotateX(29.85);
    shroom.add( circle );

    shroom.position.set(10,2,1);

    return shroom;

}

function house(x,y,z){
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    boxBody = new CANNON.Body({mass: 2});
    boxBody.addShape(shape);
    boxBody.position.set(x, y, z);
    boxBody.userData = {name: "House"}
    world.addBody(boxBody);
    bodies.push(boxBody);

    var h = new THREE.Group();


    const cubeGeo = new THREE.BoxGeometry(2, 15, 0.5, 10, 10);
    const material = new THREE.MeshBasicMaterial({color: "#8e8d8d"});
    const CubeShape0 = new THREE.Mesh(cubeGeo, material);
    CubeShape0.rotateY(10);
    CubeShape0.position.setX(0.35);
    CubeShape0.position.setZ(-0.35);
    h.add(CubeShape0);

    const texture = new THREE.TextureLoader().load( "./resources/images/house2.PNG" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );

    const geo = new THREE.BoxGeometry(15, 15, 0.5, 10, 10);
    const mat = new THREE.MeshBasicMaterial({map: texture});
    const CubeShape1 = new THREE.Mesh(geo, mat);
    CubeShape1.rotateY(29.85);
    CubeShape1.position.setX(1);
    CubeShape1.position.setZ(-8.3);
    h.add(CubeShape1);

    const CubeShape2 = new THREE.Mesh(cubeGeo, material);
    CubeShape2.rotateY(-10);
    CubeShape2.position.setX(0.25);
    CubeShape2.position.setZ(-16.15);
    h.add(CubeShape2);


    const CubeShape3 = new THREE.Mesh(geo, mat);
    CubeShape3.position.setX(-7.8);
    CubeShape3.position.setZ(0.2);
    h.add(CubeShape3);

    const CubeShape4 = new THREE.Mesh(geo, mat);
    CubeShape4.position.setX(-7.8);
    CubeShape4.position.setZ(-16.61);
    h.add(CubeShape4);


    const CubeShape5 = new THREE.Mesh(cubeGeo, material);
    CubeShape5.rotateY(-10);
    CubeShape5.position.setX(-16);
    CubeShape5.position.setZ(-0.35);

    h.add(CubeShape5);

    const CubeShape6 = new THREE.Mesh(cubeGeo, material);
    CubeShape6.rotateY(10);
    CubeShape6.position.setX(-16);
    CubeShape6.position.setZ(-16.1);
    h.add(CubeShape6);

    const CubeShape7 = new THREE.Mesh(geo, mat);
    CubeShape7.rotateY(29.85);
    CubeShape7.position.setX(-16.75);
    CubeShape7.position.setZ(-8.2);
    h.add(CubeShape7);

    const ge = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
    const ma = new THREE.MeshLambertMaterial({color: "#8e8d8d"});

    const CubeShape8 = new THREE.Mesh(ge, ma);
    CubeShape8.position.set(-7.75,7.5,-8);

    h.add(CubeShape8);

    const CubeShape9 = new THREE.Mesh(ge, ma);
    CubeShape9.position.set(-7.75,7.95,-8);
    CubeShape9.scale.set(0.9,0.9,0.9);
    h.add(CubeShape9);


    const CubeShape10 = new THREE.Mesh(ge, ma);
    CubeShape10.position.set(-7.75,8.3,-8);
    CubeShape10.scale.set(0.8,0.8,0.8);
    h.add(CubeShape10);


    const CubeShape11 = new THREE.Mesh(ge, ma);
    CubeShape11.position.set(-7.75,8.65,-8);
    CubeShape11.scale.set(0.7,0.7,0.7);
    h.add(CubeShape11);

    return h;
}

function Display(x, y, z) {

    var signage = sign('pallet',x,y,z);
    scene.add(signage);

    /*

    var post = lampPost(x,y,z);
    scene.add(post);

     */

    /*

    var tree = Tree(x,y,z);
    tree.position.setX(5);

    var house_obj = house(x,y,z);

    var shroom = mushroom(x,y,z);

    var g3 =roundBush();
    g3.position.set(15,-9,1);

    var shrubs = squareShrub(x,y,z);
    shrubs.position.setX(-20);

    scene.add(house_obj);
    scene.add(tree);
    scene.add(shroom);
    scene.add(g3);
    scene.add(shrubs);

     */


}


function Box(x, y, z) {
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    boxBody = new CANNON.Body({mass: 2});
    boxBody.addShape(shape);
    boxBody.position.set(x, y, z);
    boxBody.userData = {name: "CUBE"}
    world.addBody(boxBody);
    bodies.push(boxBody);

    const cubeGeo = new THREE.BoxGeometry(1, 1, 1, 10, 10);
    const material = new THREE.MeshLambertMaterial({color: "#8e8d8d"});
    CubeShape = new THREE.Mesh(cubeGeo, material);
    CubeShape.castShadow = true;
    camera.lookAt(CubeShape.position)
    meshes.push(CubeShape);
    scene.add(CubeShape);
}

function Ball(x, y, z) {
    const radius = 1;
    let shape = new CANNON.Sphere(radius);
    sphereBody = new CANNON.Body({mass: 5});
    sphereBody.addShape(shape);
    sphereBody.position.set(x, y, z);
    world.addBody(sphereBody);
    bodies.push(sphereBody);


    const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = new THREE.MeshPhongMaterial({color: "#711a1a"});
    SphereShape = new THREE.Mesh(sphereGeometry, material);
    SphereShape.castShadow = true;
    scene.add(SphereShape);
    meshes.push(SphereShape);
}

function AddGround() {
    const planeSize = 800;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./resources/images/ground.png');
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



main();

