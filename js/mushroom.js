import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";
import {Body} from "../resources/cannon-es/dist/cannon-es.js";


let Ground, groundBody;
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let meshes = [];
let bodies = [];
let SphereShape, sphereBody;


export class Mushroom{
    constructor(params) {
        this.Init(params);
    }

    Init(params){
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
    squareBody;
    createMushroom() {
        const shape = new CANNON.Box(new CANNON.Vec3(20, 40, 20));
        this.shroomBody = new CANNON.Body();
        this.shroomBody.type = Body.STATIC;
        this.shroomBody.mass = 0;
        this.shroomBody.updateMassProperties();
        this.shroomBody.addShape(shape);
        this.shroomBody.position.set(this.x, this.y, this.z);
        this.world.addBody(this.shroomBody);
        this.bodies.push(this.shroomBody);

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

}