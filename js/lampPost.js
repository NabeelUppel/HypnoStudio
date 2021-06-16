import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";
import {Body, Vec3} from "../resources/cannon-es/dist/cannon-es.js";


let Ground, groundBody;
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let meshes = [];
let bodies = [];
let SphereShape, sphereBody;


export class Lamp {
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
    createLamp() {

        /*This class creates a lamp post which are used as a different source of lighting.
        There are three if statements which are used to determine which way the lamp post should face in the world.*/
        const shape = new CANNON.Box(new CANNON.Vec3(13, 80, 2));
        this.lampBody = new CANNON.Body();
        this.lampBody.type = Body.STATIC;
        this.lampBody.mass = 0;
        this.lampBody.updateMassProperties();
        this.lampBody.addShape(shape,new Vec3(9, 0, 0));
        if(this.r === 1){
            this.lampBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI);
        }

        if(this.r === 2){
            this.lampBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI/2);
        }

        if(this.r === 3){
            this.lampBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI/2);
        }


        this.lampBody.position.set(this.x, this.y, this.z);
        this.lampBody.userData = {name: "LAMP"}
        this.world.addBody(this.lampBody);
        this.bodies.push(this.lampBody);


        const group = new THREE.Group();

        const texture0 = new THREE.TextureLoader().load( "./resources/images/fence2.jpg" );
        texture0.wrapS = THREE.RepeatWrapping;
        texture0.wrapT = THREE.RepeatWrapping;
        texture0.repeat.set( 2, 1 );

        const cubeGeo = new THREE.BoxGeometry(1, 9, 1, 10, 10);
        const material = new THREE.MeshPhongMaterial({map: texture0, side: THREE.DoubleSide});
        //const material = new THREE.MeshLambertMaterial({color: "#8e8d8d"});
        this.CubeShape = new THREE.Mesh(cubeGeo, material);
        this.CubeShape.position.setY(4.5);
        this.CubeShape.castShadow = true;

        group.add(this.CubeShape);

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

        group.scale.set(12,15,12);
        this.scene.add(group);
        this.meshes.push(group);
    }

}