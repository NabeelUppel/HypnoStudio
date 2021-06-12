import * as THREE from '../resources/threejs/r128/build/three.module.js';
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

export class Hill{
    constructor(params) {
        this.Init(params);
    }

    //Get values for world.
    Init(params){
        this.scene = params.scene;
        this.camera = params.camera;
        this.bodies = params.bodies;
        this.meshes = params.meshes;
        this.world = params.world;
        this.yPosGround = params.yPosGround;
    }

    //Function to create hill in the middle of level 1.
    //Creates four semi-spheres 2 for each side of the hill. One is the outer layer and one is the inner layer for each side.
    function
    createHill() {

        //Group used to make buliding objects in the scene easier to manage.
        const temp = new THREE.Group();

        //Add physics for object as well as make it a static object so that it can't be moved.
        const groundShape = new CANNON.Box(new CANNON.Vec3(1000, 400, 50));
        this.groundBody = new CANNON.Body();
        this.groundBody.type = Body.STATIC;
        this.groundBody.mass = 0;
        this.groundBody.updateMassProperties();
        this.groundBody.addShape(groundShape)
        //this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.groundBody.position.set(0, this.yPosGround, 400);
        this.world.addBody(this.groundBody);
        this.bodies.push(this.groundBody);


        //Create geometry for hill as well as the material for the hill.
        const hillGeometry = new THREE.SphereBufferGeometry(1000, 8, 6, 0, Math.PI, 0, 0.5 * Math.PI);
        const hillMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('resources/images/grasslight-small.jpg'),
            side: THREE.DoubleSide,
        });
        let hill = new THREE.Mesh(hillGeometry, hillMaterial);
        hill.position.set(0, this.yPosGround, -10);
        temp.add(hill);

        const innerHillGeometry = new THREE.CircleBufferGeometry(1000, 15, 0, Math.PI, 0, 0.5 * Math.PI);
        const innerHillMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('resources/images/backgrounddetailed6.jpg'),
            side: THREE.DoubleSide,
        });
        let hill2 = new THREE.Mesh(innerHillGeometry, innerHillMaterial);
        hill2.position.set(0, this.yPosGround, -10);
        temp.add(hill2)
        this.scene.add(temp);
        this.meshes.push(temp);


        const temp2 = new THREE.Group();

           const groundShape2 = new CANNON.Box(new CANNON.Vec3(1000, 400, 150));
           this.groundBody = new CANNON.Body();
           this.groundBody.type = Body.STATIC;
           this.groundBody.mass = 0;
           this.groundBody.updateMassProperties();
           this.groundBody.addShape(groundShape2)
           this.groundBody.position.set(0,this.yPosGround , -20);
           this.world.addBody(this.groundBody);
           this.bodies.push(this.groundBody);

           const hillGeometry2 = new THREE.SphereBufferGeometry(1000, 8, 6, 0, Math.PI, 0, -0.5 * Math.PI);
           const hillMaterial2 = new THREE.MeshPhongMaterial({
               map : new THREE.TextureLoader().load('resources/images/grasslight-small.jpg'),
               side: THREE.DoubleSide,
           });

           let hill3 = new THREE.Mesh(hillGeometry2, hillMaterial2);
           hill3.position.set(0, this.yPosGround, 145);
           temp2.add(hill3);

           const innerHillGeometry2 = new THREE.CircleBufferGeometry(1000, 15, 0, Math.PI, 0, -0.5*Math.PI);
           const innerHillMaterial2 = new THREE.MeshPhongMaterial({
               map : new THREE.TextureLoader().load('resources/images/backgrounddetailed6.jpg'),
               side: THREE.DoubleSide,
           });
           let hill4 = new THREE.Mesh(innerHillGeometry2, innerHillMaterial2);
           hill4.position.set(0, this.yPosGround, 145);
           temp2.add(hill4)
           this.scene.add(temp2);
           this.meshes.push(temp2);

        const boxGeometry = new THREE.BoxGeometry(1400, 300, 500);
        const boxMaterial = new THREE.MeshPhongMaterial({
            map : new THREE.TextureLoader().load('resources/images/backgrounddetailed6.jpg'),
            side: THREE.DoubleSide,
        });

        let box = new THREE.Mesh(boxGeometry,boxMaterial);
        box.position.set(0, 600, 200);

        this.scene.add(box)
       }

    }