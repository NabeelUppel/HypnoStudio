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

export class Path{
    constructor(params) {
        this.Init(params);
    }

    Init(params){
        this.scene = params.scene;
        this.camera = params.camera;
        this.bodies = params.bodies;
        this.meshes = params.meshes;
        this.world = params.world;
        this.pathSizeWidth = params.pathSizeWidth;
        this.pathSizeLength = params.pathSizeLength;
        this.pathX = params.pathX;
        this.pathY = params.pathY;
        this.pathZ = params.pathZ;
        this.pathRotate = params.pathRotate;
        this.pathType = params.pathType;
    }

    function
    createPath() {
        let textureDiffuseUrl = 0;
        if(this.pathType ===0){
            textureDiffuseUrl	= 'resources/images/dirtpath.jpg';
        }
        else{
            textureDiffuseUrl	= 'resources/images/dirtpathTunnel.jpg';
        }
        let textureDiffuse	= THREE.ImageUtils.loadTexture(textureDiffuseUrl);
        textureDiffuse.wrapS	= THREE.RepeatWrapping;
        textureDiffuse.wrapT	= THREE.RepeatWrapping;
        textureDiffuse.repeat.x= 10
        textureDiffuse.repeat.y= 10
        textureDiffuse.anisotropy = 16;


        const groundShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        this.groundBody = new CANNON.Body();
        this.groundBody.type = Body.STATIC;
        this.groundBody.mass = 0;
        this.groundBody.updateMassProperties();
        this.groundBody.addShape(groundShape)
        this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.groundBody.position.set(this.pathX, this.pathY, this.pathZ);


        this.world.addBody(this.groundBody);
        this.bodies.push(this.groundBody);
        let planeGeo = 0;
        switch(this.pathRotate) {
            case 0:
                planeGeo = new THREE.BoxGeometry(this.pathSizeLength, this.pathSizeWidth, 1, 1,1,1);
                break;
            case 1:
                planeGeo = new THREE.BoxGeometry(this.pathSizeWidth, this.pathSizeLength, 1, 1,1,1);
                break;
        }

        //const planeGeo = new THREE.BoxGeometry(this.pathSizeLength, this.pathSizeWidth, 1, 1,1,1);
        const planeMat = new THREE.MeshPhongMaterial({
            map		: textureDiffuse,
            side: THREE.DoubleSide,
        });

        let Ground = new THREE.Mesh(planeGeo, planeMat);
        Ground.castShadow = false;
        Ground.receiveShadow = true;


        this.scene.add(Ground);
        this.meshes.push(Ground);
    }

}