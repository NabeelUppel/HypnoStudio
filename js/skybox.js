import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";


let Ground, groundBody;
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let meshes = [];
let bodies = [];
let SphereShape, sphereBody;

export class Skybox{
    constructor(params) {
        this.Init(params);
    }

    Init(params){
        this.scene = params.scene;
        this.camera = params.camera;
        this.bodies = params.bodies;
        this.meshes = params.meshes;
        this.world = params.world;
    }

    function
    createSkybox() {
        var geometry = new THREE.BoxGeometry(15000,15000,15000);
        var cubeMaterials = [
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('resources/images/skybox/rainbow_ft.png'), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('resources/images/skybox/rainbow_bk.png'), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('resources/images/skybox/rainbow_up.png'), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('resources/images/skybox/rainbow_dn.png'), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('resources/images/skybox/rainbow_rt.png'), side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('resources/images/skybox/rainbow_lf.png'), side: THREE.DoubleSide}),
        ];

        //const skyboxShape = new CANNON.Box(new CANNON.Vec3(7500,7500,7500));
        //let skyboxBody = new CANNON.Body({mass: 0});
        //skyboxBody.addShape(skyboxShape)
        //skyboxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        //skyboxBody.position.set(0, 0, 0);
        //skyboxBody.userData = {name: "skybox"};
        //this.world.addBody(skyboxBody);
        //this.bodies.push(skyboxBody);


        var material = new THREE.MeshFaceMaterial(cubeMaterials);
        var cube = new THREE.Mesh(geometry,material);
        this.scene.add(cube)
        //this.meshes.push(cube);
    }

}

