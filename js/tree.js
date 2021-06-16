import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";
import {Body} from "../resources/cannon-es/dist/cannon-es.js";



let Ground, groundBody;
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let meshes = [];
let bodies = [];
let SphereShape, sphereBody;


export class Tree{
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
        this.firstLoop = params.firstLoop;
        this.secondLoop = params.secondLoop;
        this.zAdd = params.zAdd;
        this.xAdd = params.xAdd;
    }

    function
    shrubBody;
    bush() {
        const group = new THREE.Group();

        const geom = new THREE.SphereGeometry( 2, 30, 30 );
        const rndInt = Math.floor(Math.random() * 3) + 1;
        let mat;
        if(rndInt === 1){
            mat = mat = new THREE.MeshLambertMaterial( {color: "#228C22"} );
        }
        else if(rndInt === 2){
            mat = mat = new THREE.MeshLambertMaterial( {color: "#345f02"} );
        }
        else{
            mat = mat = new THREE.MeshLambertMaterial( {color: "#5faf04"} );
        }

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

    function
    squareBody;
    createBush() {
        const group = new THREE.Group();

        const geom = new THREE.SphereGeometry( 1, 30, 30 );

        const rndInt = Math.floor(Math.random() * 2) + 1;
        let mat;
        if(rndInt === 1){
            mat = mat = new THREE.MeshLambertMaterial( {color: "#228C22"} );
        }
        else{
            mat = mat = new THREE.MeshLambertMaterial( {color: "#345f02"} );
        }


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


        const shape = new CANNON.Box(new CANNON.Vec3(30, 30, 30));
        this.roundBody = new CANNON.Body({mass: 20000});
        this.roundBody.addShape(shape);
        this.roundBody.position.set(this.x, this.y, this.z);
        if(this.r === 1){
            this.roundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
        }
        this.world.addBody(this.roundBody);
        this.bodies.push(this.roundBody);

        return group;
    }


    function
    createTree() {
       /* const shape = new CANNON.Box(new CANNON.Vec3(20, 150, 20));
        this.treeBody = new CANNON.Body();
        this.treeBody.type = Body.STATIC;
        this.treeBody.mass = 0;
        this.treeBody.updateMassProperties();
        this.treeBody.addShape(shape);
        this.treeBody.position.set(this.x, this.y,this.z);
        this.treeBody.userData = {name: "TREE"}
        this.world.addBody(this.treeBody);
        this.bodies.push(this.treeBody);
        */
        const t = new THREE.Group();
        //Tree trunk
        // load bark texture, set wrap mode to repeat
        const rndInt = Math.floor(Math.random() * 3) + 1;
        let texture;
        if(rndInt === 1){
            texture = new THREE.TextureLoader().load("./resources/images/tree_bark.jpg");
        }
        else if(rndInt === 2){
            texture = new THREE.TextureLoader().load("./resources/images/tree_bark2.jpg");
        }
        else{
            texture = new THREE.TextureLoader().load("./resources/images/tree_bark3.jpg");
        }
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);

        const geometry = new THREE.CylinderGeometry(1.25, 1.25, 20, 32);
        const material = new THREE.MeshPhongMaterial({map: texture});
        const cylinder = new THREE.Mesh(geometry, material);
        t.add(cylinder);

        //add leaves part of tree
        let bushes = this.bush();
        t.add(bushes);
        t.position.set(this.x,this.y,this.z);
        t.castShadow = false;
        return t;
    }

    function
    createTrees(){
        const t = new THREE.Group();
        let xAdditional = 0;
        for(let j = 0; j< this.firstLoop; j++){
            let zAdditional = 0;
            for(let i = 0; i<this.secondLoop;i++){
                let randomX = Math.floor(Math.random() * 40);
                let randomZ = Math.floor(Math.random() * 50);
                let tree = this.createTree();
                tree.position.set(xAdditional + randomX,15 ,zAdditional+randomZ);
                tree.scale.set(10, 10, 10);
                t.add(tree)
                //this.meshes.push(tree);
                zAdditional += this.zAdd;
            }
            xAdditional += this.xAdd;
        }
        t.position.set(this.x,this.y ,this.z);
        this.scene.add(t);
    }




}