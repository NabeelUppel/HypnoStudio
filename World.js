import * as THREE from './resources/threejs/r128/build/three.module.js';
import {OrbitControls} from './resources/threejs/r128/examples/jsm/controls/OrbitControls.js';
import cannonDebugger from "./resources/cannon-es-debugger/dist/cannon-es-debugger.js"
import * as CANNON from './resources/cannon-es/dist/cannon-es.js'
import * as CHARACTER from "./js/Character.js"
import * as CAMERA from "./js/ThirdPersonCamera.js";
import * as POKEMON from "./js/Pokemon.js"
import * as SKYBOX from "./js/skybox.js";
import * as PATH from "./js/paths.js";
import * as SHRUB from "./js/shrub.js";
import * as TREE from "./js/tree.js";
import * as MUSHROOM from "./js/mushroom.js";
import * as HILL from "./js/hill.js";
import * as FENCE from "./js/fence.js";


(function () {
    let script = document.createElement('script');
    script.onload = function () {
        let stats = new Stats();
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };
    script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
    document.head.appendChild(script);
})()

class World {

    constructor() {
        this._Declare();
        this.InitCANNON();
        this.InitTHREE();
        this.debug = new cannonDebugger(this.scene, this.world.bodies);
    }

    //Declare Variables that is needed.
    _Declare() {
        this.clock = new THREE.Clock();
        this.meshes = [];
        this.bodies = [];
        this.removeBodies = [];
        this.removeMeshes = [];
        this.timeStep = 1 / 60;
        this.yPosGround = -100;
        //used for character model and animations.
        this._mixers = [];
        this._previousRAF = null;
    }

    //Initialise ThreeJS, Set up canvas, camera, scene and renderer.
    //Sets up the basic world.
    InitTHREE() {
        //Canvas and Renderer Setup.
        this.canvas = document.querySelector('#c');

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            //antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        //Scene Setup
        this.scene = new THREE.Scene();
        const loader = new THREE.TextureLoader();
        this.scene.background = loader.load('./resources/images/skybox/rainbow_rt.png');


        this.mapCamera = new THREE.OrthographicCamera(-1000, 1000, 1000, -1000, 1, 1000);
        this.mapCamera.position.y = 500;
        this.scene.add(this.mapCamera);


        //Camera Setup
        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1;
        const far = 7000;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(25, 30, 25);

        //Camera Controller. Disabled by default. Hold "C" down to use.
        this.orbitalControls()

        //adds directional light to scene.
        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.LightEnable(light);
        this.scene.add(light);

        //add hemisphere ligth to scene.
        this.addHemisphereLight(0xB1E1FF, 0xB97A20)


        this.addGround();
        //this.addSkybox();
        this.addHill();
        this.paths();
        this.Shrub();
        this.Tree();
        this.Mushroom();
        this.Fence();


        //Load animated Model
        this.LoadAnimatedModel();

        //Render the initial scene. Will be recursively called thereafter.
        this.Render();
    }

    //Initialise CannonJS (Physics) including setting up the gravity and other resources.
    InitCANNON() {

        this.world = new CANNON.World();
        this.world.gravity.set(0, -200, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.broadphase.useBoundingBoxes = true;
        this.world.solver.iterations = 10;
        this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
        this.world.defaultContactMaterial.contactEquationRegularizationTime = 4;

    }


    //Function used to set up orbital controls that allows the user to pan  the scene.
    orbitalControls() {
        this.OrbitalControls = new OrbitControls(this.camera, this.canvas);
        this.OrbitalControls.maxPolarAngle = Math.PI / 2
        this.OrbitalControls.update();
        this.OrbitalControls.enableKeys = false;
        this.OrbitalControls.enabled = false;
    }

    //Enable different properties for the light.
    LightEnable(light) {
        light.position.set(20, 100, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
    }

    //Adds HemisphereLight.
    addHemisphereLight(skyColor, groundColor) {
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        this.scene.add(light);
    }

    //Add Ground.
    addGround() {
        const planeSize = 8000;

        let textureDiffuseUrl = 'resources/images/grasslight-small.jpg'
        let textureDiffuse = THREE.ImageUtils.loadTexture(textureDiffuseUrl);
        textureDiffuse.wrapS = THREE.RepeatWrapping;
        textureDiffuse.wrapT = THREE.RepeatWrapping;
        textureDiffuse.repeat.x = 10
        textureDiffuse.repeat.y = 10
        textureDiffuse.anisotropy = 16;

        let textureNormalUrl = 'resources/images/grasslight-small-nm.jpg'
        let textureNormal = THREE.ImageUtils.loadTexture(textureNormalUrl);
        textureNormal.wrapS = THREE.RepeatWrapping;
        textureNormal.wrapT = THREE.RepeatWrapping;
        textureNormal.repeat.x = 10
        textureNormal.repeat.y = 10
        textureNormal.anisotropy = 16;


        const groundShape = new CANNON.Plane();
        let groundBody = new CANNON.Body();
        groundBody.type = CANNON.Body.STATIC;
        groundBody.mass = 0;
        groundBody.updateMassProperties();
        groundBody.addShape(groundShape)
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.position.set(0, this.yPosGround, 0);
        groundBody.userData = {name: "GROUND"}
        this.world.addBody(groundBody);
        this.bodies.push(groundBody);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, 1, 1);
        const planeMat = new THREE.MeshPhongMaterial({
            map: textureDiffuse,
            //normalMap	: textureNormal,
            side: THREE.DoubleSide,
        });

        let Ground = new THREE.Mesh(planeGeo, planeMat);
        Ground.castShadow = false;
        Ground.receiveShadow = true;
        Ground.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
        this.scene.add(Ground);
        this.meshes.push(Ground);
    }

    //Checks to see if the window has changed size.
    resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    //The actual renderer function.
    Render() {
        //If the windows needs resizing, it will resize it.
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }


        requestAnimationFrame((t) => {
            //t is the time that the scene will be animated in seconds.
            if (this._previousRAF === null) {
                this._previousRAF = t;
            }

            //Recursively Call this method.
            this.Render();

            //actually render the scene.

            this.renderer.render(this.scene, this.camera);

            //physics and other updates done in this function.
            this.Step(t - this._previousRAF);

            this._previousRAF = t;
        });

    }

    //Function that keeps the meshes and physic bodies in-sync
    updateMeshPositions() {
        for (let i = 0; i !== this.meshes.length; i++) {
            this.meshes[i].position.copy(this.bodies[i].position)
            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
        }
    }

    //Function that removes physic bodies and meshes from scenes if necessary
    removeObjects() {
        for (let i = 0; i < this.removeBodies.length; i++) {
            this.world.removeBody(this.removeBodies[i]);
            this.scene.remove(this.removeMeshes[i]);
            this.removeBodies.splice(i, 1)
            this.removeMeshes.splice(i, 1)
        }
    }

    //Loads Pokemon to scene including physic bodies.
    addPokemon() {
        //Positions where pokemon will appear.
        let positions = []


        //TOP RIGHT
        for (let i = 0; i < 10; i++) {
            let x = THREE.MathUtils.randFloat(-1800, -2800)
            let z = THREE.MathUtils.randFloat(1900, 2700)
            positions.push(new THREE.Vector3(x, this.yPosGround, z))
        }

        //BLUE BOTTOM RIGHT
        for (let i = 0; i < 20; i++) {
            let x = THREE.MathUtils.randFloat(-1500, -2900)
            let z = THREE.MathUtils.randFloat(-2100, -2900)
            positions.push(new THREE.Vector3(x, this.yPosGround, z))
        }


        //STARTING
        for (let i = 0; i < 10; i++) {
            let x = THREE.MathUtils.randFloat(2000, 2900)
            let z = THREE.MathUtils.randFloat(-2100, -3000)
            positions.push(new THREE.Vector3(x, this.yPosGround, z))
        }

        //BLUE TOP LEFT
        for (let i = 0; i < 10; i++) {
            let x = THREE.MathUtils.randFloat(2000, 3000)
            let z = THREE.MathUtils.randFloat(150, 1000)
            positions.push(new THREE.Vector3(x, this.yPosGround, z))
        }

        //If Position is on player dont spawn pokemon there.
        var playerPosition = new THREE.Vector3(2700, this.yPosGround, -2700);
        const index = positions.indexOf(playerPosition)
        if (index > -1) {
            positions.splice(index, 1)
        }
        positions = [...new Set(positions)]


        //pass position and other params to as a dict to the pokemon class.
        const Params = {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            positions: positions,
        }
        this.PokemonLoader = new POKEMON.Pokemon(Params)
    }

    //Add Animated Models to the scene such as the character and the third person camera.
    LoadAnimatedModel() {
        //Add Pokemon
        this.addPokemon();

        const pokemonList = this.PokemonLoader.List;
        //Params to be passed to the character class.
        const CharParams = {
            renderer: this.renderer,
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            meshes: this.meshes,
            bodies: this.bodies,
            pokemon: pokemonList,

            rBodies: this.removeBodies,
            rMeshes: this.removeMeshes
        }
        this.Character = new CHARACTER.Character(CharParams);

        //Setup third person camera class.
        if (this.Character) {
            const CamParams = {
                camera: this.camera,
                character: this.Character
            }
            this.CAM = new CAMERA.ThirdPersonCamera(CamParams);
        }

    }

    //Physic Update Function.
    Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        //Update Character Animations.
        if (this._mixers) {
            this._mixers.map(m => m.update(timeElapsedS));
        }

        //Update Character Controls.
        if (this.Character) {
            this.Character.Update(timeElapsedS);
            this.PokemonLoader.update()
        }


        //Allow the physic world function to step forward in time.
        this.world.step(1 / 60);

        //Update/remove objects from world and scene.
        this.updateMeshPositions();
        this.removeObjects();

        //Update the third person camera.
        if (this.Character) {
            if (!this.OrbitalControls.enabled) {
                this.CAM.Update(timeElapsedS)
            }
        } else {
            this.OrbitalControls.enabled = true;
        }


        //Allows for the orbital controls to be used on "C" key down.
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case "KeyC": // c
                    this.OrbitalControls.enabled = true;
                    break
                case "KeyP":
            }
        })
        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case "KeyC": // c
                    this.OrbitalControls.enabled = false;
                    break;
            }
        })

    }


    Fence() {
        let xAdd = 0;
        for (let i = 0; i < 6; ++i) {
            let charParams = this.makeFence(2300 + xAdd, this.yPosGround, -2050, 1);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }

        let zAdd = 0;
        for (let i = 0; i < 13; ++i) {
            let charParams = this.makeFence(2070, this.yPosGround, -2000 + zAdd, 2);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }


        xAdd = 0;
        for (let i = 0; i < 6; ++i) {
            let charParams = this.makeFence(2130 + xAdd, this.yPosGround, 10, 0);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }


        xAdd = 0;
        for (let i = 0; i < 18; ++i) {
            let charParams = this.makeFence(-700 + xAdd, this.yPosGround, -2050, 1);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }


        zAdd = 0;
        for (let i = 0; i < 13; ++i) {
            let charParams = this.makeFence(1900, this.yPosGround, -1800 + zAdd, 3);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }


        xAdd = 0;
        for (let i = 0; i < 6; ++i) {
            let charParams = this.makeFence(900 + xAdd, this.yPosGround, 0, 0);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }


        zAdd = 0;
        for (let i = 0; i < 13; ++i) {
            let charParams = this.makeFence(-900, this.yPosGround, -2050 + zAdd, 2);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }


        xAdd = 0;
        for (let i = 0; i < 6; ++i) {
            let charParams = this.makeFence(2276 + xAdd, this.yPosGround, 1300, 1);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }

        zAdd = 0;
        for (let i = 0; i < 5; ++i) {
            let charParams = this.makeFence(2050, this.yPosGround, 1350 + zAdd, 2);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }

        xAdd = 0;
        for (let i = 0; i < 23; ++i) {
            let charParams = this.makeFence(-1300 + xAdd, this.yPosGround, 2100, 1);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }

        zAdd = 0;
        for (let i = 0; i < 5; ++i) {
            let charParams = this.makeFence(-1550, this.yPosGround, 2080 + zAdd, 2);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }


        xAdd = 0;
        for (let i = 0; i < 13; ++i) {
            let charParams = this.makeFence(-800 + xAdd, this.yPosGround, 1400, 1);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }

        zAdd = 0;
        for (let i = 0; i < 6; ++i) {
            let charParams = this.makeFence(1000, this.yPosGround, 450 + zAdd, 2);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }

        zAdd = 0;
        for (let i = 0; i < 6; ++i) {
            let charParams = this.makeFence(-1000, this.yPosGround, 450 + zAdd, 2);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }

        zAdd = 0;
        for (let i = 0; i < 22; ++i) {
            let charParams = this.makeFence(-2000, this.yPosGround, -2000 + zAdd, 2);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            zAdd += 150;
        }

        xAdd = 0;
        for (let i = 0; i < 6; ++i) {
            let charParams = this.makeFence(-2800 + xAdd, this.yPosGround, 1300, 1);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }

        xAdd = 0;
        for (let i = 0; i < 6; ++i) {
            let charParams = this.makeFence(-2800 + xAdd, this.yPosGround, -2050, 1);
            this.fence = new FENCE.Fence(charParams);
            let fence = this.fence.createFence();
            this.scene.add(fence);
            this.meshes.push(fence);
            xAdd += 150;
        }

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

    paths() {
        this.addPath(100, 2000, 2000, this.yPosGround, -1000, 0, 0);
        this.addPath(100, 2000, 800, this.yPosGround, -2300, 1, 0);
        this.addPath(100, 700, 1700, this.yPosGround, 1700, 0, 0);
        this.addPath(100, 3300, 0, this.yPosGround, 2000, 1, 0);
        this.addPath(100, 3600, -1900, this.yPosGround, -300, 0, 0);
        this.addPath(300, 3500, -200, this.yPosGround, 250, 1, 0);
    }

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

    Ball(x, y, z) {
        const radius = 50;
        let shape = new CANNON.Sphere(radius);
        const sphereBody = new CANNON.Body({mass: 60000});
        sphereBody.addShape(shape);
        sphereBody.position.set(x, y, z);
        this.world.addBody(sphereBody);
        this.bodies.push(sphereBody);


        const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
        const material = new THREE.MeshPhongMaterial({color: "#711a1a"});
        const SphereShape = new THREE.Mesh(sphereGeometry, material);
        SphereShape.position.set(x, y, z);
        SphereShape.castShadow = true;
        this.scene.add(SphereShape);
        this.meshes.push(SphereShape);
    }

    Shrub() {
        //Code repeated 4 times to make 4 walls around the map so that player is unable to escape.
        let charParams = this.makeShrubs(3100, this.yPosGround+97 , 100, 0);
        this.shrub = new SHRUB.Shrub(charParams);
        let shrub = this.shrub.createShrub();
        shrub.scale.set(10, 10, 2200);
        this.scene.add(shrub);
        this.meshes.push(shrub);

        charParams = this.makeShrubs(-3050, this.yPosGround +97, 100, 0);
        this.shrub = new SHRUB.Shrub(charParams);
        shrub = this.shrub.createShrub();
        shrub.scale.set(10, 10, 2200);
        this.scene.add(shrub);
        this.meshes.push(shrub);

        charParams = this.makeShrubs(0, this.yPosGround+97 , 3000, 1);
        this.shrub = new SHRUB.Shrub(charParams);
        shrub = this.shrub.createShrub();
        shrub.scale.set(10, 10, 2200);
        this.scene.add(shrub);
        this.meshes.push(shrub);

        charParams = this.makeShrubs(0, this.yPosGround+97 , -3000, 1);
        this.shrub = new SHRUB.Shrub(charParams);
        shrub = this.shrub.createShrub();
        shrub.scale.set(10, 10, 2200);
        this.scene.add(shrub);
        this.meshes.push(shrub);

        //this.makeShrubs(300,400,this.yPosGround);
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

    Tree() {

        let charParams = this.makeTrees(2200, this.yPosGround + 15, -1900, 14, 3, 180, 50);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();
        charParams = this.makeTrees(2200, this.yPosGround + 15, -1600, 3, 17, 90, 120);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();
        charParams = this.makeTrees(2500, this.yPosGround + 15, -600, 10, 3, 180, 50);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();

        charParams = this.makeTrees(1000, this.yPosGround + 15, -1900, 14, 3, 180, 50);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();
        charParams = this.makeTrees(1700, this.yPosGround + 15, -1600, 2, 17, 90, 120);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();
        charParams = this.makeTrees(1000, this.yPosGround + 15, -300, 12, 2, 180, 50);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();

        charParams = this.makeTrees(-50, this.yPosGround + 15, -1900, 14, 2, 160, 90);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();
        charParams = this.makeTrees(-50, this.yPosGround + 15, -1900, 2, 6, 160, 90);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();


        charParams = this.makeTrees(2100, this.yPosGround + 15, 1400, 10, 2, 300, 90);
        this.tree = new TREE.Tree(charParams);
        this.tree.createTrees();
        charParams = this.makeTrees(-1500, this.yPosGround + 15, 2100, 25, 2, 160, 180);
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

    Mushroom() {
        let charParams = this.makeMushroom(1100, this.yPosGround + 15, 100, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        let mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(10, 10, 10);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);
        charParams = this.makeMushroom(1100, this.yPosGround + 15, 400, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(10, 10, 10);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);

        charParams = this.makeMushroom(-1100, this.yPosGround + 15, 100, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(10, 10, 10);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);
        charParams = this.makeMushroom(-1100, this.yPosGround + 15, 400, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(10, 10, 10);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);

        charParams = this.makeMushroom(3084, this.yPosGround + 15, 1300, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(10, 10, 10);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);

        charParams = this.makeMushroom(-3000, this.yPosGround + 15, -2950, 0);
        this.mushroom = new MUSHROOM.Mushroom(charParams);
        mushroom = this.mushroom.createMushroom();
        mushroom.scale.set(10, 10, 10);
        this.scene.add(mushroom);
        this.meshes.push(mushroom);

        let xAdditional = 0;
        for (let j = 0; j < 2; j++) {
            let zAdditional = 0;
            for (let i = 0; i < 14; i++) {
                let randomX = Math.floor(Math.random() * 100);
                let randomZ = Math.floor(Math.random() * 100);
                let charParams = this.makeMushroom(-2600 + xAdditional + randomX, this.yPosGround + 20, -1500 + zAdditional + randomZ, 0);
                this.mushroom = new MUSHROOM.Mushroom(charParams);
                let mushroom = this.mushroom.createMushroom();
                mushroom.scale.set(40, 40, 40);
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

    music() {
        const listener = new THREE.AudioListener();
        this.camera.add(listener);

        const sound = new THREE.Audio(listener);

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('resources/sounds/Magic-Clock-Shop_Looping.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            sound.play();
        });
    }


    addSkybox() {
        const CharParams = {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes
        }
        this.skybox = new SKYBOX.Skybox(CharParams);
        this.skybox.createSkybox();
    }

    addHill() {
        const CharParams = {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            yPosGround: this.yPosGround
        }
        this.hill = new HILL.Hill(CharParams);
        this.hill.createHill();

        /*  const temp = new THREE.Group();

          const groundShape = new CANNON.Box(new CANNON.Vec3(1000, 400, 50));
          this.groundBody = new CANNON.Body();
          this.groundBody.type = Body.STATIC;
          this.groundBody.mass = 0;
          this.groundBody.updateMassProperties();
          this.groundBody.addShape(groundShape)
          //this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
          this.groundBody.position.set(0,this.yPosGround , 900);
          this.world.addBody(this.groundBody);
          this.bodies.push(this.groundBody);

          const hillGeometry = new THREE.SphereBufferGeometry(1000, 8, 6, 0, Math.PI, 0, 0.5 * Math.PI);
          const hillMaterial = new THREE.MeshPhongMaterial({
              map : new THREE.TextureLoader().load('resources/images/grasslight-small.jpg'),
              side: THREE.DoubleSide,
          });
          let hill = new THREE.Mesh(hillGeometry, hillMaterial);
          hill.position.set(0, this.yPosGround, 100);
          temp.add(hill);

          const innerHillGeometry = new THREE.CircleBufferGeometry(1000, 15, 0, Math.PI, 0, 0.5*Math.PI);
          const innerHillMaterial = new THREE.MeshPhongMaterial({
              map : new THREE.TextureLoader().load('resources/images/backgrounddetailed6.jpg'),
              side: THREE.DoubleSide,
          });
          let hill2 = new THREE.Mesh(innerHillGeometry, innerHillMaterial);
          hill2.position.set(0, this.yPosGround, 100);
          temp.add(hill2)
          this.scene.add(temp);
          this.meshes.push(temp);

  */


        /* const CharParams = {
             camera: this.camera,
             scene: this.scene,
             world:this.world,
             bodies: this.bodies,
             meshes: this.meshes
         }
         //this.terrain = new TERRAIN.Terrain(CharParams);
         //this.terrain.createTerrain();*/


    }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new World();
});

