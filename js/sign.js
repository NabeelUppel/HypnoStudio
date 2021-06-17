import * as THREE from '../resources/threejs/r128/build/three.module.js';
import {OrbitControls} from '../resources/threejs/r128/examples/jsm/controls/OrbitControls.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";
import {Body} from "../resources/cannon-es/dist/cannon-es.js";


let Ground, groundBody;
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let pathSize;
let pathX,pathY,pathZ;
let meshes = [];
let bodies = [];
let SphereShape, sphereBody;

export class Sign{
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
    createSign() {

    }

}