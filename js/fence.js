import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";
import {Body, Vec3} from "../resources/cannon-es/dist/cannon-es.js";


let Ground, groundBody;
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let meshes = [];
let bodies = [];
let SphereShape, sphereBody;


export class Fence {
    constructor(params) {
        this.Init(params);
    }

    Init(params) {
        this.scene = params.scene;
        this.camera = params.camera;
        this.bodies = params.bodies;
        this.meshes = params.meshes;
        this.world = params.world;
        this.x = params.x;
        this.y = params.y;
        this.z = params.z;
        this.r = params.r;
    }


    function
    createFence() {

        /*This class creates fences which are used to block the player off from out of bounds areas.
        There are three if statements which are used to determine which way the fence should face in the world.*/
        const shape = new CANNON.Box(new CANNON.Vec3(130, 60, 20));
        this.fenceBody = new CANNON.Body();
        this.fenceBody.type = Body.STATIC;
        this.fenceBody.mass = 0;
        this.fenceBody.updateMassProperties();
        this.fenceBody.addShape(shape,new Vec3(90, 0, 0));
        if(this.r === 1){
            this.fenceBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI);
        }

        if(this.r === 2){
            this.fenceBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI/2);
        }

        if(this.r === 3){
            this.fenceBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI/2);
        }


        this.fenceBody.position.set(this.x, this.y, this.z);
        this.fenceBody.userData = {name: "FENCE"}
        this.world.addBody(this.fenceBody);
        this.bodies.push(this.fenceBody);

        const f = new THREE.Group();

        const texture = new THREE.TextureLoader().load("./resources/images/fence2.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;


        const geometry = new THREE.BoxGeometry(1.5, 5, 0.5);
        const material = new THREE.MeshPhongMaterial({map: texture});

        const texture2 = new THREE.TextureLoader().load("./resources/images/fenceTop.jpg");
        texture2.wrapS = THREE.RepeatWrapping;
        texture2.wrapT = THREE.RepeatWrapping;

        const geom = new THREE.BoxGeometry(1.1, 1.1, 0.45);
        const mat = new THREE.MeshPhongMaterial({map: texture2});

        for (var i = 0; i < 10; i = i + 2) {
            const rect = new THREE.Mesh(geometry, material);
            rect.position.set(i, 2.5, 0);

            const tri = new THREE.Mesh(geom, mat);
            tri.position.set(i + 0.03, 4.95, 0);
            tri.rotateZ(-15);

            f.add(rect);
            f.add(tri);
        }

        const g = new THREE.BoxGeometry(11, 0.75, 0.5);
        const m = new THREE.MeshPhongMaterial({color: '#D0944D'});

        for (var l = 1.25; l < 4; l = l + 2.25) {
            const back = new THREE.Mesh(g, m);
            back.position.set(4, l, -0.5);
            f.add(back);
        }
        f.position.set(0, 0, 0);
        f.scale.set(25,10,25);
        f.castShadow = false;
        return f;
    }

}