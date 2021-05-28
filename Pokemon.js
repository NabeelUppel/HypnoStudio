import * as THREE from './resources/threejs/r128/build/three.module.js';
import {FBXLoader} from './resources/threejs/r128/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from './resources/cannon-es/dist/cannon-es.js'

import {GLTFLoader} from './resources/threejs/r128/examples/jsm/loaders/GLTFLoader.js';

export class Pokemon {
    constructor(params) {
        this.Init(params)
        this.LoadModel();
    }

    Init(params) {
        this.scene = params.scene;
        this.world = params.world;
        this.camera = params.camera;
        this.bodies = params.bodies;
        this.meshes = params.meshes;
        this.PokemonList = [];
    }


    LoadModel() {
        const _OnLoad = () => {

        };
        this.manager = new THREE.LoadingManager();
        const loader = new FBXLoader();
        loader.setPath("resources/models/Pokemon/AdjustmentsNeeded/");
        const url = "Parasect.fbx"
        loader.load(url, (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse((c)=>{
                if(c.type === "Bone") {

                }
            });
            this.scene.add(fbx);
        });


    }
}


/*
Adjustments

Aritcuno:
fbx.scale.setScalar(0.1);
fbx.rotation.set(Math.PI/4,0,0)
fbx.position.set(0,1.5,0)

Zapdos:
fbx.scale.setScalar(0.1);
fbx.position.set(0,1.5,0)


Charizard
 fbx.scale.setScalar(0.1);
fbx.traverse((c)=>{
if(c instanceof THREE.Mesh){
c.material[4]= new THREE.MeshLambertMaterial( { color: "orange" })
}
});

Charmander
 fbx.scale.setScalar(0.1);
fbx.traverse((c)=>{
if(c instanceof THREE.Mesh){
c.material[3]= new THREE.MeshLambertMaterial( { color: "orange" })
}
});

Charmeleon
 fbx.scale.setScalar(0.1);
fbx.traverse((c)=>{
if(c instanceof THREE.Mesh){
c.material[4]= new THREE.MeshLambertMaterial( { color: "orange" })
}
});

Dragonite
fbx.scale.setScalar(0.1);
fbx.rotation.set(-Math.PI/2,0,0)

Gengar:
fbx.children.splice(2)

Wartortle:
fbx.traverse((c)=>{
if(c.type === "Bone"){
if (c.name==="Tail1" ){
c.rotation.y+=Math.PI/3;
}
}
});

Vaporeon:
fbx.traverse((c)=>{
if(c.type === "Bone"){
if (c.name==="Tail3"|| c.name==="Tail4" || c.name==="Tail5" || c.name==="Tail6" ){
c.rotation.y-=Math.PI/6;
}
}
});

SlowPoke:
 if(c.type === "Bone") {
if (c.name === "Tail3" || c.name === "Tail4" || c.name === "Tail5" || c.name === "Tail6" || c.name === "Tail7") {
c.rotation.y -= Math.PI / 6;
}
}



*/