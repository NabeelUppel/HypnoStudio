import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";
import {Body, Vec3} from "../resources/cannon-es/dist/cannon-es.js";

export class Sign {
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
        this.town = params.town;

    }


    function
    createSign() {

        /*This class creates a sign which indicates the name of the town.
        There are three if statements which are used to determine which way the sign should face in the world.*/
        const shape = new CANNON.Box(new CANNON.Vec3(30, 60, 20));
        this.signBody = new CANNON.Body();
        this.signBody.type = Body.STATIC;
        this.signBody.mass = 0;
        this.signBody.updateMassProperties();
        this.signBody.addShape(shape,new Vec3(20, 0, 0));
        if(this.r === 1){
            this.signBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI);
        }

        if(this.r === 2){
            this.signBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI/2);
        }

        if(this.r === 3){
            this.signBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI/2);
        }


        this.signBody.position.set(this.x, this.y, this.z);
        this.signBody.userData = {name: "SIGN"}
        this.world.addBody(this.signBody);
        this.bodies.push(this.signBody);



        const group = new THREE.Group();


        // Create cube render target
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );

        // Create cube camera
        const cubeCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget );
        //group.add( cubeCamera );
        this.scene.add(cubeCamera);

        const chromeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: cubeCamera.renderTarget.texture } );

        const geometry = new THREE.CylinderGeometry( 0.25,0.25,8, 32 );
        const material = new THREE.MeshLambertMaterial ({
            color: "#C0C0C0",
            envMap: this.scene.background, // must be the background of scene
            combine: THREE.MixOperation,
            reflectivity: .5
        })

        let x = 0

        for (let i = 0; i < 2; i++) {
            const cylinder = new THREE.Mesh( geometry, chromeMaterial );
            cylinder.position.set(i + x,4,0);
            group.add( cylinder );


            x = 3;

        }


        const texture2 = new THREE.TextureLoader().load( "./resources/images/"+ this.town+".png" );
        texture2.wrapS = THREE.RepeatWrapping;
        texture2.wrapT = THREE.RepeatWrapping;
        texture2.repeat.set( 1, 1 );

        let m = new THREE.MeshBasicMaterial({ map: texture2 });

        const Geo = new THREE.BoxGeometry(7, 2, 0.5, 10, 10);
        const CubeShape1 = new THREE.Mesh(Geo, m);
        CubeShape1.position.set(2,8,0);
        CubeShape1.castShadow = true;
        group.add(CubeShape1);

        group.scale.set(12,12,12);
        this.scene.add(group);
        this.meshes.push(group);

    }

}