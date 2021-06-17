import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";


let Ground, groundBody;
let world, timeStep = 1 / 60;
let camera, scene, renderer, canvas, controls;
let meshes = [];
let bodies = [];
let SphereShape, sphereBody;

export class Terrain{
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
    createTerrain() {
            var groundGeo = new THREE.BoxGeometry(200,200,200,100,100,100);
        const positions = groundGeo.attributes.position.array;
        let x,y,z,index;
        x = y = z = index = 2;
        for ( let i = 0, l = groundGeo.attributes.position.count; i < l; i ++ ) {
            let vertex = groundGeo.attributes.position;
            x = vertex.getX(i);
            y = vertex.getY(i);
            z = vertex.z
            let value = noise.simplex3(x/100,y/100,1);
            z = Math.abs(value)*9;
            positions[index] = -z;
            index += 3;
        }

        let textureDiffuseUrl	= 'resources/images/grasslight-small.jpg'
        let textureDiffuse	= THREE.ImageUtils.loadTexture(textureDiffuseUrl);
        textureDiffuse.wrapS	= THREE.RepeatWrapping;
        textureDiffuse.wrapT	= THREE.RepeatWrapping;
        textureDiffuse.repeat.x= 10
        textureDiffuse.repeat.y= 10
        textureDiffuse.anisotropy = 16;

        let textureNormalUrl	= 'resources/images/grasslight-small-nm.jpg'
        let textureNormal	= THREE.ImageUtils.loadTexture(textureNormalUrl);
        textureNormal.wrapS	= THREE.RepeatWrapping;
        textureNormal.wrapT	= THREE.RepeatWrapping;
        textureNormal.repeat.x	= 10
        textureNormal.repeat.y	= 10
        textureNormal.anisotropy= 16;

        const planeMat = new THREE.MeshPhongMaterial({
            map		: textureDiffuse,
            normalMap	: textureNormal,
            side: THREE.DoubleSide,
        });

        let Ground = new THREE.Mesh(groundGeo, planeMat);
        Ground.rotateX(Math.PI/2)
        this.scene.add(Ground);
        Ground.position.set(0,-100,0);

    }

}