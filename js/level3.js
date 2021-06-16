import * as THREE from '../resources/threejs/r128/build/three.module.js';
import {OrbitControls} from '../resources/threejs/r128/examples/jsm/controls/OrbitControls.js';
import cannonDebugger from "../resources/cannon-es-debugger/dist/cannon-es-debugger.js"
import * as CANNON from '../resources/cannon-es/dist/cannon-es.js'
import * as CHARACTER from "./Character.js"
import * as CAMERA from "./ThirdPersonCamera.js";
import * as POKEMON from "./Pokemon.js"
import * as SKYBOX from "./skybox.js";
import * as PATH from "./paths.js";
import * as SHRUB from "./shrub.js";
import * as TREE from "./tree.js";
import * as MUSHROOM from "./mushroom.js";
import * as HILL from "./hill.js";
import * as FENCE from "./fence.js";
import * as HOUSE from "./house.js";
import * as LAMPPOST from "./lampPost.js";
import * as SIGN from "./sign.js";


export class Level3 {
    constructor(params) {
        this.Init(params);
    }

    Init(params) {
        this.scene = params.scene;
        this.camera = params.camera;
        this.bodies = params.bodies;
        this.meshes = params.meshes;
        this.world = params.world;
        this.yPosGround = params.yPosGround;
    }

    //Function which calls other functions which contain objects that are in the world.
    function
    level3Layout(){
        this.paths();
        this.Fence();
        this.Shrubs();
        this.House();
        this.Hill();
        this.Tree();
        this.Mushroom();
        this.Sound();
        this.lampPost();
        this.sign();

    }

    //Ambient sounds near villages.
     Sound(){
         const listener = new THREE.AudioListener();
         this.camera.add( listener );

         //Creates a positional audio which only plays music in certain locations.
         const sound = new THREE.PositionalAudio( listener );


         const audioLoader = new THREE.AudioLoader();
         audioLoader.load( 'resources/sounds/townAmbience.mp3', function( buffer ) {
             sound.setBuffer( buffer );
             sound.setRefDistance(200);
             sound.setLoop(true);
             sound.setVolume(0.5);
             sound.play();
         });


         //Create box that covers area where the sound should be. Make the box opaque so that you can't see it
         //Add sound to object so that when you in close to the object sound will play.
         const sphere = new THREE.BoxGeometry( 2000, 0.1,2000);
         const material = new THREE.MeshPhongMaterial( { color: 0xff2200,transparent: true, opacity : 0  } );
         const mesh = new THREE.Mesh( sphere, material );
         mesh.position.set(3100, -99, -2700);
         this.scene.add( mesh );
         mesh.add(sound);

         const listener2 = new THREE.AudioListener();
         this.camera.add( listener2 );

         //Creates a positional audio which only plays music in certain locations.
         const sound2 = new THREE.PositionalAudio( listener2 );

         //Create box that covers area where the sound should be. Make the box opaque so that you can't see it
         //Add sound to object so that when you in close to the object sound will play.
         const audioLoader2 = new THREE.AudioLoader();
         audioLoader2.load( 'resources/sounds/townAmbience.mp3', function( buffer ) {
             sound2.setBuffer( buffer );
             sound2.setRefDistance(200);
             sound2.setLoop(true);
             sound2.setVolume(0.5);
             sound2.play();
         });

         const sphere2 = new THREE.BoxGeometry( 2000, 0.1,2000);
         const material2 = new THREE.MeshPhongMaterial( { color: 0xff2200,transparent: true, opacity : 0  } );
         const mesh2 = new THREE.Mesh( sphere2, material2 );
         mesh2.position.set(-3100, -99, 2700);
         this.scene.add( mesh2 );
         mesh2.add(sound2);

     }

    //Function to place several lampposts into the scene.
    lampPost(){
        this.makeLampPost(3000,-100,-1700,2);
    }

    makeLampPost(x,y,z,r){
        const CharParams = {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            x: x,
            y: y,
            z: z,
            r: r,
        }
        this.lampPost = new LAMPPOST.Lamp(CharParams);
        this.lampPost.createLamp();
    }

    //Function to place several signs into the scene.
    sign(){
        this.makeSign(3200,-100,-1900,1,"twinleaf");
        this.makeSign(-3200,-100,2600,1,"newbark");
    }

    makeSign(x,y,z,r,town){
        const CharParams = {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            x: x,
            y: y,
            z: z,
            r: r,
            town: town,
        }
        this.sign = new SIGN.Sign(CharParams);
        this.sign.createSign();
    }

    //Function to access mushrooms class and add the mushrooms to the scene in certain locations.
    Mushroom() {
        let xAdditional = 0;
        for (let j = 0; j < 10; j++) {
            let zAdditional = 0;
            for (let i = 0; i < 5; i++) {
                let randomX = Math.floor(Math.random() * 100);
                let randomZ = Math.floor(Math.random() * 100);
                let charParams = this.makeMushroom(200 + xAdditional + randomX, this.yPosGround + 20, -100 + zAdditional + randomZ, 0);
                this.mushroom = new MUSHROOM.Mushroom(charParams);
                let mushroom = this.mushroom.createMushroom();
                mushroom.scale.set(14, 14, 14);
                this.scene.add(mushroom);
                this.meshes.push(mushroom);
                zAdditional += 180;
            }
            xAdditional += 250;
        }
    }

    makeMushroom(x, y, z, r) {
        return {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            x: x,
            y: y,
            z: z,
            r: r
        }
    }

    //Function to access trees class and add the trees to the scene in certain locations.
    Tree() {

        let charParams = this.makeTrees(-2500, this.yPosGround + 15, -1600, 15, 6, 200, 390);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();

        charParams = this.makeTrees(-2300, this.yPosGround + 15, 1600, 6, 6, 200, 390);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();

        charParams = this.makeTrees(-2700, this.yPosGround + 15, 0, 6, 6, 200, 480);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();

    }

    makeTrees(x, y, z, f, s, zAdd, xAdd) {
        return {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            x: x,
            y: y,
            z: z,
            firstLoop: f,
            secondLoop: s,
            zAdd: zAdd,
            xAdd: xAdd

        }
    }

    makeHouse(x, y, z, r) {
        return {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            x: x,
            y: y,
            z: z,
            r: r,
        }
    }

    //Function to access House class and add the houses to the scene in certain locations.
    House() {
        let zAdd = 0
        for(let i = 0; i < 5;++i){
            let charParams = this.makeHouse(3800, this.yPosGround + 50, -2000+zAdd, 0);
            this.house = new HOUSE.House(charParams);
            let house = this.house.smallBlueHouse();
            house.scale.set(10, 10, 10);
            this.scene.add(house);
            this.meshes.push(house);
            zAdd = zAdd-400;
        }

        let charParams = this.makeHouse(3300, this.yPosGround + 50, -3600, 0);
        this.house = new HOUSE.House(charParams);
        let house = this.house.biggerBlueHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

        zAdd = 0
        for(let i = 0; i < 4;++i){
            let charParams = this.makeHouse(-3700, this.yPosGround + 50, 3700+zAdd, 0);
            this.house = new HOUSE.House(charParams);
            let house = this.house.smallOrangeHouse();
            house.scale.set(10, 10, 10);
            this.scene.add(house);
            this.meshes.push(house);
            zAdd = zAdd-400;
        }

        let xAdd = 0
        for(let i = 0; i < 3;++i){
            let charParams = this.makeHouse(-2600+xAdd, this.yPosGround + 50, 3700, 0);
            this.house = new HOUSE.House(charParams);
            let house = this.house.smallOrangeHouse();
            house.scale.set(10, 10, 10);
            this.scene.add(house);
            this.meshes.push(house);
            xAdd = xAdd-400;
        }
}

    //Function to access paths class and add the paths to the scene in certain locations.
    function
    paths(){
        this.addPath(200, 1000, 3000, this.yPosGround, -2500, 0, 0);
        this.addPath(200, 4000, 1100, this.yPosGround, -1950, 1, 0);
        this.addPath(200, 1000, -800, this.yPosGround, -2500, 0, 0);
        this.addPath(200, 1500, -1600, this.yPosGround, -2900, 1, 0);
        this.addPath(200, 2000, -3000, this.yPosGround, -1250, 0, 0);
        this.addPath(200, 6200, 0, this.yPosGround, -350, 1, 0);
        this.addPath(400, 2600, 2900, this.yPosGround, 900, 0, 0);
        this.addPath(200, 3200, 0, this.yPosGround, 1300, 0, 0);
        this.addPath(200, 2500, -1200, this.yPosGround, 1350, 1, 0);
        this.addPath(200, 5200, 100, this.yPosGround, 3000, 1, 0);
    }

    function
    addPath(pLength, pWidth, pX, pY, pZ, pR, pT) {

        const CharParams = {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            pathSizeWidth: pWidth,
            pathSizeLength: pLength,
            pathX: pX,
            pathY: pY,
            pathZ: pZ,
            pathRotate: pR,
            pathType: pT
        }
        this.path = new PATH.Path(CharParams);
        this.path.createPath();
    }

    makeFence(x, y, z, r) {

        return {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            x: x,
            y: y,
            z: z,
            r: r
        }
    }

    //Function to access Fence class and add the fences to the scene in certain locations.
    Fence() {
        this.FenceVertical(11,3,2850,-3600);
        this.FenceHorizontal(44,1,-2625,-1800);
        this.FenceHorizontal(23,0,-675,-2100);
        this.FenceVertical(6,3,-900,-2550);
        this.FenceVertical(11,3,-700,-3600);
        this.FenceHorizontal(4,1,-3650,-1800);
        this.FenceVertical(8,2,-2875,-1800);
        this.FenceVertical(10,3,-3160,-1600);
        this.FenceHorizontal(39,1,-2650,-500);
        this.FenceVertical(26,2,3110,-1750);
        this.FenceVertical(20,3,2660,0);
        this.FenceHorizontal(20,1,-2975,-220);
        this.FenceHorizontal(16,1,340,-220);
        this.FenceHorizontal(16,1,350,2900);
        this.FenceHorizontal(4,1,3370,2220);
        this.FenceVertical(20,2,100,-200);
        this.FenceVertical(9,3,-100,0);
        this.FenceVertical(9,3,-100,1670);
        this.FenceHorizontal(15,1,-2230,1430);
        this.FenceHorizontal(24,0,-3810,1230);
        this.FenceHorizontal(15,1,-2230,2890);
        this.FenceVertical(9,2,-2440,1470);
    }

    //Create fences of a certain length in the horizontal direction.
    FenceHorizontal(amountFences,FenceRotation,xPos,zPos){
        let xAdd = 0;
        for (let i = 0; i < amountFences; ++i) {
            let charParams = this.makeFence(xPos + xAdd, this.yPosGround, zPos, FenceRotation);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }
    }
    //Create fences of a certain length in the vertical direction.
    FenceVertical(amountFences,FenceRotation,xPos,zPos){
        let zAdd = 0;
        for (let i = 0; i < amountFences; ++i) {
            let charParams = this.makeFence(xPos, this.yPosGround, zPos + zAdd, FenceRotation);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }
    }

    //Functions to access Shrubs class and add shrubs to the scene.
    Shrubs(){
        //Code repeated 4 times to make 4 walls around the map so that player is unable to escape.
        let charParams = this.makeShrubs(3900, this.yPosGround+92, 100, 0);
        this.shrub = new SHRUB.Shrub(charParams);
        let shrub = this.shrub.createShrub();
        shrub.scale.set(10, 10, 3000);
        this.scene.add(shrub);
        this.meshes.push(shrub);

        charParams = this.makeShrubs(-3900, this.yPosGround +92, 100, 0);
        this.shrub = new SHRUB.Shrub(charParams);
        shrub = this.shrub.createShrub();
        shrub.scale.set(10, 10, 3000);
        this.scene.add(shrub);
        this.meshes.push(shrub);

        charParams = this.makeShrubs(0, this.yPosGround+92 , 3850, 1);
        this.shrub = new SHRUB.Shrub(charParams);
        shrub = this.shrub.createShrub();
        shrub.scale.set(10, 10, 3000);
        this.scene.add(shrub);
        this.meshes.push(shrub);

        charParams = this.makeShrubs(0, this.yPosGround+92 , -3850, 1);
        this.shrub = new SHRUB.Shrub(charParams);
        shrub = this.shrub.createShrub();
        shrub.scale.set(10, 10, 3000);
        this.scene.add(shrub);
        this.meshes.push(shrub);
    }

    makeShrubs(x, y, z, r) {
        return {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            x: x,
            y: y,
            z: z,
            r: r
        }
    }
    //Function to access Shrubs class and add shrubs to the scene.
    Hill(){
        this.addHill(1800,-3000);
        this.addHill(200,-3000);
        this.addHill(1500,1600);
    }

    addHill(x,z) {
        const CharParams = {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            yPosGround: this.yPosGround,
            x: x,
            z: z,
        }
        this.hill = new HILL.Hill(CharParams);
        this.hill.fullHill();
    }



}