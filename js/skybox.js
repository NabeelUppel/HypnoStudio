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

    //Creates skybox using meshbasic material as it is not impacted by light. world is placed inside this cube.

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

        var material = new THREE.MeshFaceMaterial(cubeMaterials);
        var cube = new THREE.Mesh(geometry,material);
        this.scene.add(cube)
        //this.meshes.push(cube);
    }

}

