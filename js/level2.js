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


export class Level2 {
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
    level2Layout(){
        this.paths();
        this.Fence();
        this.Shrubs();
        this.House();
        this.Hill();
        this.Tree();
        this.Mushroom();
        this.Sound();

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
                sound.setRefDistance(200); //The distance for how far you can go before the sound gets softer.
                sound.setLoop(true);
                sound.setVolume(0.5);
                sound.play();
            });

            //Create box that covers area where the sound should be. Make the box opaque so that you can't see it
            //Add sound to object so that when you in close to the object sound will play.
            const sphere = new THREE.BoxGeometry( 2000, 0.1,2000);
            const material = new THREE.MeshPhongMaterial( { color: 0xff2200,transparent: true, opacity : 0  } );
            const mesh = new THREE.Mesh( sphere, material );
            mesh.position.set(0, -99, 0);
            this.scene.add( mesh );
            mesh.add(sound);
    }

    //Function to access mushrooms class and add the mushrooms to the scene in certain locations.
    Mushroom() {
        let charParams = this.makeMushroom(3200, this.yPosGround + 10, 3200, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        let mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(5, 5, 5);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);

        charParams = this.makeMushroom(3500, this.yPosGround + 10, 3500, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(5, 5, 5);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);

        charParams = this.makeMushroom(3700, this.yPosGround + 10, 3700, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(5, 5, 5);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);

        charParams = this.makeMushroom(3600, this.yPosGround + 10, 3800, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(5, 5, 5);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);
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

        let charParams = this.makeTrees(300, this.yPosGround + 15, 1000, 2, 10, 180, 150);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();


        charParams = this.makeTrees(-320, this.yPosGround + 15, 1000, 2, 10, 180, 150);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();

        charParams = this.makeTrees(-2320, this.yPosGround + 15, -2400, 10, 10, 210, 200);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();

        charParams = this.makeTrees(320, this.yPosGround + 15, -2400, 10, 10, 210, 200);
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
        let charParams = this.makeHouse(700, this.yPosGround + 50, 600, 0);
        this.house = new HOUSE.House(charParams);
        let house = this.house.smallBlueHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

        charParams = this.makeHouse(450, this.yPosGround + 50, 600, 0);
        this.house = new HOUSE.House(charParams);
        house = this.house.smallBlueHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

        charParams = this.makeHouse(-500, this.yPosGround + 50, 600, 0);
        this.house = new HOUSE.House(charParams);
        house = this.house.smallBlueHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

        charParams = this.makeHouse(-250, this.yPosGround + 50, 600, 0);
        this.house = new HOUSE.House(charParams);
        house = this.house.smallBlueHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

        charParams = this.makeHouse(700, this.yPosGround + 50, -350, 0);
        this.house = new HOUSE.House(charParams);
        house = this.house.smallOrangeHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

        charParams = this.makeHouse(450, this.yPosGround + 50, -350, 0);
        this.house = new HOUSE.House(charParams);
        house = this.house.smallOrangeHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

        charParams = this.makeHouse(-500, this.yPosGround + 50, -350, 0);
        this.house = new HOUSE.House(charParams);
        house = this.house.smallOrangeHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

        charParams = this.makeHouse(-250, this.yPosGround + 50, -350, 0);
        this.house = new HOUSE.House(charParams);
        house = this.house.smallOrangeHouse();
        house.scale.set(10, 10, 10);
        this.scene.add(house);
        this.meshes.push(house);

    }

    //Function to access paths class and add the paths to the scene in certain locations.
    function
    paths(){
        this.addPath(200, 2000, 1800, this.yPosGround, 0, 1, 0);
        this.addPath(200, 4500, 2800, this.yPosGround, 0, 0, 0);

        this.addPath(200, 2000, -1800, this.yPosGround, 0, 1, 0);
        this.addPath(200, 4500, -2800, this.yPosGround, 0, 0, 0);

        this.addPath(200, 5000, 0, this.yPosGround, 3000, 1, 0);
        this.addPath(200, 5000, 0, this.yPosGround, -3000, 1, 0);

        this.addPath(200, 2500, 0, this.yPosGround, 1800, 0, 0);
        this.addPath(200, 2500, 0, this.yPosGround, -1800, 0, 0);
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
        //Fences alongside the 2 left and right paths from spawn
        this.FenceHorizontal(12,1,1040,100);
        this.FenceHorizontal(12,1,-2450,100);
        this.FenceHorizontal(12,0,800,-100);
        this.FenceHorizontal(12,0,-2650,-100);

        //Fences alongside the 2 front and back paths from spawn
        this.FenceVertical(14,2,100,700);
        this.FenceVertical(14,3,-100,900);
        this.FenceVertical(14,2,100,-2800);
        this.FenceVertical(14,3,-100,-2600);


        //Fences alongside the right side of map.
        this.FenceVertical(13,2,-2700,145);
        this.FenceVertical(13,2,-2700,-2130);
        this.FenceVertical(28,3,-2900,-1930);

        //Fences alongside the left side of map.
        this.FenceVertical(13,3,2660,350);
        this.FenceVertical(13,3,2660,-1930);
        this.FenceVertical(28,2,2900,-2130);

        //Fences alongside the top side of map.
        this.FenceHorizontal(15,0,100,2900);
        this.FenceHorizontal(15,0,-2450,2900);
        this.FenceHorizontal(32,1,-2250,3100);

        //Fences alongside the bottom side of map.
        this.FenceHorizontal(15,0,100,-2800);
        this.FenceHorizontal(15,0,-2450,-2800);
        this.FenceHorizontal(32,1,-2250,-3100);

        //Fences connecting back and left of spawn
        this.FenceHorizontal(4,0,150,-600);
        this.FenceVertical(3,2,800,-600);

        //Fences connecting front and left of spawn
        this.FenceHorizontal(4,0,150,700);
        this.FenceVertical(3,2,800,150);

        //Fences connecting back and right of spawn
        this.FenceHorizontal(4,0,-750,-600);
        this.FenceVertical(3,2,-750,-600);

        //Fences connecting front and right of spawn
        this.FenceHorizontal(4,0,-750,700);
        this.FenceVertical(3,2,-750,150);

        //Fences covering top right corner
        this.FenceVertical(4,2,-2450,3150);
        this.FenceVertical(4,2,-2450,2240);
        this.FenceHorizontal(1,0,-2650,2190);
        this.FenceHorizontal(6,0,-3850,2170);

        //Fences covering top left corner
        this.FenceVertical(4,2,2450,3150);
        this.FenceVertical(4,2,2450,2240);
        this.FenceHorizontal(1,0,2450,2190);
        this.FenceHorizontal(6,0,2900,2170);

        //Fences covering bottom right corner
        this.FenceVertical(4,2,-2450,-3750);
        this.FenceVertical(4,2,-2450,-2850);
        this.FenceHorizontal(1,0,-2650,-2190);
        this.FenceHorizontal(6,0,-3850,-2170);

        //Fences covering bottom left corner
        this.FenceVertical(4,2,2450,-3750);
        this.FenceVertical(4,2,2450,-2850);
        this.FenceHorizontal(1,0,2450,-2190);
        this.FenceHorizontal(6,0,2900,-2170);
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
        this.addHill(1500,1500);
        this.addHill(-1500,1500);
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