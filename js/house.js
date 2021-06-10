import * as THREE from '../resources/threejs/r128/build/three.module.js';
import * as CANNON from "../resources/cannon-es/dist/cannon-es.js";
import {Body, Vec3} from "../resources/cannon-es/dist/cannon-es.js";

export class House {
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
    CubeShape;

    biggerOrangeHouse() {
        const shape = new CANNON.Box(new CANNON.Vec3(100, 100, 100));
        this.boxBody = new CANNON.Body();
        this.boxBody.type = Body.STATIC;
        this.boxBody.mass = 0;
        this.boxBody.updateMassProperties();
        this.boxBody.addShape(shape,new Vec3(-90, 0, -90));
        this.boxBody.position.set(this.x, this.y, this.z);
        this.boxBody.userData = {name: "HOUSE"}
        this.world.addBody(this.boxBody);
        this.bodies.push(this.boxBody);

        const h = new THREE.Group();

        //Texture Loading
        const roofTexture1 = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/orange-roof.jpg");
        const animatedWall = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/long red brick.png");
        const windowsAndDoor = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/house2.PNG");
        const windows = new THREE.TextureLoader().load('objects/pokemon_style_house/textures/windows only.png')

        //corner piece1
        const cubeGeo = new THREE.BoxGeometry(2, 15, 0.5, 10, 10);
        const material = new THREE.MeshBasicMaterial({map: animatedWall});
        let CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(10);
        CubeShape.position.setX(0.35);
        CubeShape.position.setZ(-0.35);
        h.add(CubeShape);

        //corner piece2
        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(-10);
        CubeShape.position.setX(-16);
        CubeShape.position.setZ(-0.35);
        h.add(CubeShape);

        //corner piece3
        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(-10);
        CubeShape.position.setX(0.25);
        CubeShape.position.setZ(-16.15);
        h.add(CubeShape);

        //corner piece4
        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(10);
        CubeShape.position.setX(-16);
        CubeShape.position.setZ(-16.1);
        h.add(CubeShape);

        const cubeGeo2 = new THREE.BoxGeometry(2, 6, 0.5, 10, 10);
        //corner piece1 top
        CubeShape = new THREE.Mesh(cubeGeo2, material);
        CubeShape.rotateY(10);
        CubeShape.position.set(0.35, 11, -0.35);
        h.add(CubeShape);

        //corner piece2 top
        CubeShape = new THREE.Mesh(cubeGeo2, material);
        CubeShape.rotateY(-10);
        CubeShape.position.set(-16, 11, -0.35);
        h.add(CubeShape);

        //corner piece3 top
        CubeShape = new THREE.Mesh(cubeGeo2, material);
        CubeShape.rotateY(-10);
        CubeShape.position.set(0.25, 11, -16.15);
        h.add(CubeShape);

        //corner piece4 top
        CubeShape = new THREE.Mesh(cubeGeo2, material);
        CubeShape.rotateY(10);
        CubeShape.position.set(-16, 11, -16.1);
        h.add(CubeShape);

        //walls First Level
        const wallGeo = new THREE.BoxGeometry(15, 15, 0.5, 10, 10);
        const wallMat = new THREE.MeshBasicMaterial({map: windowsAndDoor});

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.rotateY(29.85);
        CubeShape.position.setX(1);
        CubeShape.position.setZ(-8.3);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.position.setX(-7.8);
        CubeShape.position.setZ(0.2);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.position.setX(-7.8);
        CubeShape.position.setZ(-16.61);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.rotateY(29.85);
        CubeShape.position.setX(-16.75);
        CubeShape.position.setZ(-8.2);
        h.add(CubeShape);

        //walls Second Level
        const wallGeo2 = new THREE.BoxGeometry(15, 6, 0.5, 10, 10);
        const wallMat2 = new THREE.MeshBasicMaterial({map: windows});

        CubeShape = new THREE.Mesh(wallGeo2, wallMat2);
        CubeShape.rotateY(29.85);
        CubeShape.position.set(1, 11, -8.3);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo2, wallMat2);
        CubeShape.position.set(-7.8, 11, 0.2);
        //CubeShape.position.setZ(0.2);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo2, wallMat2);
        CubeShape.position.set(-7.8, 11, -16.61);
        //CubeShape.position.setZ(-16.61);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo2, wallMat2);
        CubeShape.rotateY(29.85);
        CubeShape.position.set(-16.75, 11, -8.2);
        //CubeShape.position.setZ(-8.2);
        h.add(CubeShape);

        //middle layer
        const middleGeo1 = new THREE.BoxGeometry(18, 0.5, 18, 10, 10);
        const middleMat1 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(middleGeo1, middleMat1);
        CubeShape.position.set(-7.75, 7.75, -8);
        h.add(CubeShape);

        //roof layer 1
        const roofGeo1 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat1 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo1, roofMat1);
        CubeShape.position.set(-7.75, 14, -8);
        h.add(CubeShape);

        //roof layer 2
        const roofGeo2 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat2 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo2, roofMat2);
        CubeShape.position.set(-7.75, 14.5, -8);
        CubeShape.scale.set(0.9, 0.9, 0.9);
        h.add(CubeShape);

        //roof layer 3
        const roofGeo3 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat3 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo3, roofMat3);
        CubeShape.position.set(-7.75, 15, -8);
        CubeShape.scale.set(0.8, 0.8, 0.8);
        h.add(CubeShape);

        //roof Pyramid
        const roofGeo5 = new THREE.CylinderGeometry(0, 9, 4, 4, 10)
        const roofMaterials = [];
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));
        CubeShape = new THREE.Mesh(roofGeo5, roofMaterials);
        CubeShape.rotateY(Math.PI / 4);
        CubeShape.position.set(-7.75, 17, -8);
        CubeShape.scale.set(1, 1, 1);
        h.add(CubeShape);

        return (h)
    }


    function

    biggerBlueHouse() {
        const shape = new CANNON.Box(new CANNON.Vec3(100, 100, 100));
        this.boxBody = new CANNON.Body();
        this.boxBody.type = Body.STATIC;
        this.boxBody.mass = 0;
        this.boxBody.updateMassProperties();
        this.boxBody.addShape(shape,new Vec3(-90, 0, -90));
        this.boxBody.position.set(this.x, this.y, this.z);
        this.boxBody.userData = {name: "HOUSE"}
        this.world.addBody(this.boxBody);
        this.bodies.push(this.boxBody);

        const h = new THREE.Group();

        //Texture Loading
        const roofTexture1 = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/Blue Roof.png");
        const animatedWall = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/Main_baseColor.png");
        const windowsAndDoor = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/house2.PNG");
        const windows = new THREE.TextureLoader().load('objects/pokemon_style_house/textures/windows only.png')

        //corner piece1

        const cubeGeo = new THREE.BoxGeometry(2, 15, 0.5, 10, 10);
        const material = new THREE.MeshBasicMaterial({map: animatedWall});
        let CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(10);
        CubeShape.position.setX(0.35);
        CubeShape.position.setZ(-0.35);
        h.add(CubeShape);

        //corner piece2
        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(-10);
        CubeShape.position.setX(-16);
        CubeShape.position.setZ(-0.35);
        h.add(CubeShape);

        //corner piece3
        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(-10);
        CubeShape.position.setX(0.25);
        CubeShape.position.setZ(-16.15);
        h.add(CubeShape);

        //corner piece4
        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(10);
        CubeShape.position.setX(-16);
        CubeShape.position.setZ(-16.1);
        h.add(CubeShape);

        const cubeGeo2 = new THREE.BoxGeometry(2, 6, 0.5, 10, 10);
        //corner piece1 top
        CubeShape = new THREE.Mesh(cubeGeo2, material);
        CubeShape.rotateY(10);
        CubeShape.position.set(0.35, 11, -0.35);
        h.add(CubeShape);

        //corner piece2 top
        CubeShape = new THREE.Mesh(cubeGeo2, material);
        CubeShape.rotateY(-10);
        CubeShape.position.set(-16, 11, -0.35);
        h.add(CubeShape);

        //corner piece3 top
        CubeShape = new THREE.Mesh(cubeGeo2, material);
        CubeShape.rotateY(-10);
        CubeShape.position.set(0.25, 11, -16.15);
        h.add(CubeShape);

        //corner piece4 top
        CubeShape = new THREE.Mesh(cubeGeo2, material);
        CubeShape.rotateY(10);
        CubeShape.position.set(-16, 11, -16.1);
        h.add(CubeShape);

        //walls First Level
        const wallGeo = new THREE.BoxGeometry(15, 15, 0.5, 10, 10);
        const wallMat = new THREE.MeshBasicMaterial({map: windowsAndDoor});

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.rotateY(29.85);
        CubeShape.position.setX(1);
        CubeShape.position.setZ(-8.3);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.position.setX(-7.8);
        CubeShape.position.setZ(0.2);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.position.setX(-7.8);
        CubeShape.position.setZ(-16.61);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.rotateY(29.85);
        CubeShape.position.setX(-16.75);
        CubeShape.position.setZ(-8.2);
        h.add(CubeShape);

        //walls Second Level
        const wallGeo2 = new THREE.BoxGeometry(15, 6, 0.5, 10, 10);
        const wallMat2 = new THREE.MeshBasicMaterial({map: windows});

        CubeShape = new THREE.Mesh(wallGeo2, wallMat2);
        CubeShape.rotateY(29.85);
        CubeShape.position.set(1, 11, -8.3);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo2, wallMat2);
        CubeShape.position.set(-7.8, 11, 0.2);
        //CubeShape.position.setZ(0.2);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo2, wallMat2);
        CubeShape.position.set(-7.8, 11, -16.61);
        //CubeShape.position.setZ(-16.61);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo2, wallMat2);
        CubeShape.rotateY(29.85);
        CubeShape.position.set(-16.75, 11, -8.2);
        //CubeShape.position.setZ(-8.2);
        h.add(CubeShape);

        //middle layer
        const middleGeo1 = new THREE.BoxGeometry(18, 0.5, 18, 10, 10);
        const middleMat1 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(middleGeo1, middleMat1);
        CubeShape.position.set(-7.75, 7.75, -8);
        h.add(CubeShape);

        //roof layer 1
        const roofGeo1 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat1 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo1, roofMat1);
        CubeShape.position.set(-7.75, 14, -8);
        h.add(CubeShape);

        //roof layer 2
        const roofGeo2 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat2 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo2, roofMat2);
        CubeShape.position.set(-7.75, 14.5, -8);
        CubeShape.scale.set(0.9, 0.9, 0.9);
        h.add(CubeShape);

        //roof layer 3
        const roofGeo3 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat3 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo3, roofMat3);
        CubeShape.position.set(-7.75, 15, -8);
        CubeShape.scale.set(0.8, 0.8, 0.8);
        h.add(CubeShape);

        //roof Pyramid
        const roofGeo5 = new THREE.CylinderGeometry(0, 9, 4, 4, 10)
        const roofMaterials = [];
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));
        CubeShape = new THREE.Mesh(roofGeo5, roofMaterials);
        CubeShape.rotateY(Math.PI / 4);
        CubeShape.position.set(-7.75, 17, -8);
        CubeShape.scale.set(1, 1, 1);
        h.add(CubeShape);

        return (h);
    }

    function

    smallOrangeHouse() {
        const shape = new CANNON.Box(new CANNON.Vec3(100, 100, 100));
        this.boxBody = new CANNON.Body();
        this.boxBody.type = Body.STATIC;
        this.boxBody.mass = 0;
        this.boxBody.updateMassProperties();
        this.boxBody.addShape(shape,new Vec3(-90, 0, -90));
        this.boxBody.position.set(this.x, this.y, this.z);
        this.boxBody.userData = {name: "HOUSE"}
        this.world.addBody(this.boxBody);
        this.bodies.push(this.boxBody);

        const h = new THREE.Group();

        //Texture Loading
        const roofTexture1 = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/orange-roof.jpg");
        const animatedWall = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/long red brick.png");
        const windows = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/house2.PNG");

        //corner pieces
        const cubeGeo = new THREE.BoxGeometry(2, 15, 0.5, 10, 10);
        const material = new THREE.MeshBasicMaterial({map: animatedWall});
        let CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(10);
        CubeShape.position.setX(0.35);
        CubeShape.position.setZ(-0.35);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(-10);
        CubeShape.position.setX(0.25);
        CubeShape.position.setZ(-16.15);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(-10);
        CubeShape.position.setX(-16);
        CubeShape.position.setZ(-0.35);
        h.add(CubeShape)

        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(10);
        CubeShape.position.setX(-16);
        CubeShape.position.setZ(-16.1);
        h.add(CubeShape);

        //walls
        const wallGeo = new THREE.BoxGeometry(15, 15, 0.5, 10, 10);
        const wallMat = new THREE.MeshBasicMaterial({map: windows});
        const CubeShape1 = new THREE.Mesh(wallGeo, wallMat);
        CubeShape1.rotateY(29.85);
        CubeShape1.position.setX(1);
        CubeShape1.position.setZ(-8.3);
        h.add(CubeShape1);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.position.setX(-7.8);
        CubeShape.position.setZ(0.2);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.position.setX(-7.8);
        CubeShape.position.setZ(-16.61);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.rotateY(29.85);
        CubeShape.position.setX(-16.75);
        CubeShape.position.setZ(-8.2);
        h.add(CubeShape);

        //roof layer 1
        const roofGeo1 = new THREE.BoxGeometry(19, 0.5, 18, 10, 10);
        const roofMat1 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo1, roofMat1);
        CubeShape.position.set(-7.75, 7.5, -8);
        h.add(CubeShape);

        //roof layer 2
        const roofGeo2 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat2 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo2, roofMat2);
        CubeShape.position.set(-7.75, 7.95, -8);
        CubeShape.scale.set(0.9, 0.9, 0.9);
        h.add(CubeShape);

        //roof layer 3
        const roofGeo3 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat3 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo3, roofMat3);
        CubeShape.position.set(-7.75, 8.3, -8);
        CubeShape.scale.set(0.8, 0.8, 0.8);
        h.add(CubeShape);

        //roof layer 4
        const roofGeo4 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat4 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo4, roofMat4);
        CubeShape.position.set(-7.75, 8.65, -8);
        CubeShape.scale.set(0.7, 0.7, 0.7);
        h.add(CubeShape);

        //roof Pyramid
        const roofGeo5 = new THREE.CylinderGeometry(0, 8, 4, 4, 10)
        const roofMaterials = [];
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));

        CubeShape = new THREE.Mesh(roofGeo5, roofMaterials);
        CubeShape.rotateY(Math.PI / 4);
        CubeShape.position.set(-7.75, 11, -8);
        CubeShape.scale.set(1, 1, 1);
        h.add(CubeShape);

        return (h);
    }

    function

    smallBlueHouse() {
        const shape = new CANNON.Box(new CANNON.Vec3(100, 100, 100));
        this.boxBody = new CANNON.Body();
        this.boxBody.type = Body.STATIC;
        this.boxBody.mass = 0;
        this.boxBody.updateMassProperties();
        this.boxBody.addShape(shape,new Vec3(-90, 0, -90));
        this.boxBody.position.set(this.x, this.y, this.z);
        this.boxBody.userData = {name: "HOUSE"}
        this.world.addBody(this.boxBody);
        this.bodies.push(this.boxBody);

        const h = new THREE.Group();

        //Texture Loading
        const roofTexture1 = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/Blue Roof.png");
        const animatedWall = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/Main_baseColor.png");
        const windows = new THREE.TextureLoader().load("objects/pokemon_style_house/textures/house2.PNG");

        //corner pieces
        const cubeGeo = new THREE.BoxGeometry(2, 15, 0.5, 10, 10);
        const material = new THREE.MeshBasicMaterial({map: animatedWall});
        let CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(10);
        CubeShape.position.setX(0.35);
        CubeShape.position.setZ(-0.35);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(-10);
        CubeShape.position.setX(0.25);
        CubeShape.position.setZ(-16.15);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(-10);
        CubeShape.position.setX(-16);
        CubeShape.position.setZ(-0.35);
        h.add(CubeShape)

        CubeShape = new THREE.Mesh(cubeGeo, material);
        CubeShape.rotateY(10);
        CubeShape.position.setX(-16);
        CubeShape.position.setZ(-16.1);
        h.add(CubeShape);

        //walls
        const wallGeo = new THREE.BoxGeometry(15, 15, 0.5, 10, 10);
        const wallMat = new THREE.MeshBasicMaterial({map: windows});
        const CubeShape1 = new THREE.Mesh(wallGeo, wallMat);
        CubeShape1.rotateY(29.85);
        CubeShape1.position.setX(1);
        CubeShape1.position.setZ(-8.3);
        h.add(CubeShape1);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.position.setX(-7.8);
        CubeShape.position.setZ(0.2);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.position.setX(-7.8);
        CubeShape.position.setZ(-16.61);
        h.add(CubeShape);

        CubeShape = new THREE.Mesh(wallGeo, wallMat);
        CubeShape.rotateY(29.85);
        CubeShape.position.setX(-16.75);
        CubeShape.position.setZ(-8.2);
        h.add(CubeShape);

        //roof layer 1
        const roofGeo1 = new THREE.BoxGeometry(19, 0.5, 18, 10, 10);
        const roofMat1 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo1, roofMat1);
        CubeShape.position.set(-7.75, 7.5, -8);
        h.add(CubeShape);

        //roof layer 2
        const roofGeo2 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat2 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo2, roofMat2);
        CubeShape.position.set(-7.75, 7.95, -8);
        CubeShape.scale.set(0.9, 0.9, 0.9);
        h.add(CubeShape);

        //roof layer 3
        const roofGeo3 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat3 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo3, roofMat3);
        CubeShape.position.set(-7.75, 8.3, -8);
        CubeShape.scale.set(0.8, 0.8, 0.8);
        h.add(CubeShape);

        //roof layer 4
        const roofGeo4 = new THREE.BoxGeometry(19, 0.75, 18, 10, 10);
        const roofMat4 = new THREE.MeshLambertMaterial({map: roofTexture1});
        CubeShape = new THREE.Mesh(roofGeo4, roofMat4);
        CubeShape.position.set(-7.75, 8.65, -8);
        CubeShape.scale.set(0.7, 0.7, 0.7);
        h.add(CubeShape);

        //roof Pyramid
        const roofGeo5 = new THREE.CylinderGeometry(0, 8, 4, 4, 10)
        const roofMaterials = [];
        roofMaterials.push(new THREE.MeshLambertMaterial({map: roofTexture1}));

        CubeShape = new THREE.Mesh(roofGeo5, roofMaterials);
        CubeShape.rotateY(Math.PI / 4);
        CubeShape.position.set(-7.75, 11, -8);
        CubeShape.scale.set(1, 1, 1);
        h.add(CubeShape);

        return (h);
    }
}

