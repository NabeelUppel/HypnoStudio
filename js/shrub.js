import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";
import {Body, Vec3} from "../resources/cannon-es/dist/cannon-es.js";


let Ground, groundBody;
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let meshes = [];
let bodies = [];
let SphereShape, sphereBody;


export class Shrub{
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

    //Function to build the geometry of a shrub which can be seen around the world as a means of blocking the player off from the outside world.
    shrubBody;
    shrub(x,y,z) {

        let i;

        const geom = new THREE.SphereGeometry( 1, 30, 30 );
        const mat = new THREE.MeshLambertMaterial( {color: "#0f4c0f"} );
        const group = new THREE.Group();
        for (i = -2; i < 3; i++) {
            const sphere = new THREE.Mesh( geom, mat );
            sphere.rotateY(30);
            sphere.position.set(i,y,0.9)
            sphere.scale.set(0.5,0.5,1);
            group.add( sphere );

        }
        const group2 = new THREE.Group();

        for (i = -2; i < 3; i++) {
            const sphere = new THREE.Mesh( geom, mat );
            sphere.rotateY(30);
            sphere.position.set(i,y,-0.5)
            sphere.scale.set(0.5,0.5,1);
            group2.add( sphere );

        }

        const group3 = new THREE.Group();

        for (i = -2; i < 3; i++) {
            const sphere = new THREE.Mesh( geom, mat );
            sphere.rotateY(30);
            sphere.position.set(i,y,-1)
            sphere.scale.set(0.5,0.5,1);
            group3.add( sphere );

        }
        const group4 = new THREE.Group();

        for (i = -2; i < 3; i++) {
            const sphere = new THREE.Mesh( geom, mat );
            sphere.rotateY(30);
            sphere.position.set(i,y,-0.00000000001)
            sphere.scale.set(0.5,0.5,0.8);
            group4.add( sphere );

        }


        const final = new THREE.Group();

        final.add(group);
        final.add(group2);
        final.add(group3);
        final.add(group4);

        return final;
    }
    function
    squareBody;
    createShrub() {
        const temp = new THREE.Group();


        var shrubs = this.shrub(this.x,this.y,this.z);
        shrubs.position.setY(0);
        temp.add(shrubs);

        var shrubs2 = this.shrub(this.x,this.y,this.z);
        shrubs2.position.setY(1);
        temp.add(shrubs2);

        var shrubs3 = this.shrub(this.x,this.y,this.z);
        shrubs.position.setY(2);
        temp.add(shrubs3);
        temp.position.setX(-20);
        temp.rotateX(150);
        const shape = new CANNON.Box(new CANNON.Vec3(35, 20, 4020));
        this.squareBody = new CANNON.Body();
        this.squareBody.type = Body.STATIC;
        this.squareBody.mass = 0;
        this.squareBody.updateMassProperties();
        this.squareBody.addShape(shape,new Vec3(0, -50, 0));
        this.squareBody.position.set(this.x, this.y, this.z);
        if(this.r === 1){
            this.squareBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
        }
        this.world.addBody(this.squareBody);
        this.bodies.push(this.squareBody);

        return temp;
    }

}