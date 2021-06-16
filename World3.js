import * as THREE from './resources/threejs/r128/build/three.module.js';
import cannonDebugger from "./resources/cannon-es-debugger/dist/cannon-es-debugger.js"
import * as CANNON from './resources/cannon-es/dist/cannon-es.js'
import * as CHARACTER from "./js/Character.js"
import * as CAMERA from "./js/ThirdPersonCamera.js";
import * as POKEMON from "./js/Pokemon.js"
import * as SKYBOX from "./js/skybox.js";
import * as HILL from "./js/hill.js";
import * as LEVEL3 from "./js/level3.js";


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
        const far = 1600;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(25, 30, 25);


        //adds directional light to scene.
        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.LightEnable(light);
        this.scene.add(light);

        //add hemisphere light to scene.
        this.addHemisphereLight(0xB1E1FF, 0xB97A20)

        this.StartPos = new CANNON.Vec3(2950, -100, -2900);

        this.mapWidth = 384
        this.mapHeight = 192
        this.mapCamera = new THREE.OrthographicCamera(
            this.mapWidth*2,		// Left
            -this.mapWidth*2,		// Right
            -this.mapHeight*2,		// Top
            this.mapHeight*2,	// Bottom
            1,         // Near
            1000);

        this.mapCamera.up = new THREE.Vector3(0,0,-1);
        this.mapCamera.lookAt( new THREE.Vector3(0,-1,0) );

        this.addGround();
        this.addSkybox();
        this.music();
        this.level3();


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

    level3(){
        const CharParams = {
            camera: this.camera,
            scene: this.scene,
            world: this.world,
            bodies: this.bodies,
            meshes: this.meshes,
            yPosGround : this.yPosGround,
        }
        this.level3 = new LEVEL3.Level3(CharParams);
        this.level3.level3Layout();
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
        //Ground.castShadow = false;
        //Ground.receiveShadow = true;
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

            var w = window.innerWidth, h = window.innerHeight;


            // full display
            this.renderer.setViewport( 0, 0, w, h );
            this.renderer.setScissor(0, 0, w, h);
            this.renderer.setScissorTest(true);
            this.renderer.render(this.scene, this.camera);

            // minimap (overhead orthogonal camera)


            if (this.Character){
                this.renderer.setViewport( 50, 50, this.mapWidth, this.mapHeight);
                this.renderer.setScissor(50, 50, this.mapWidth,this.mapHeight);
                this.renderer.setScissorTest(true);
                this.mapCamera.position.y =800;
                this.renderer.render(this.scene, this.mapCamera);
            }


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

        //Top left
        for (let i = 0; i < 10; i++) {
            let x = THREE.MathUtils.randFloat(2500, 3700)
            let z = THREE.MathUtils.randFloat(2500, 3500)
            positions.push(new THREE.Vector3(x, this.yPosGround, z))
        }

        //Middle right
        for (let i = 0; i < 10; i++) {
            let x = THREE.MathUtils.randFloat(-2500, -3700)
            let z = THREE.MathUtils.randFloat(1200, 2300)
            positions.push(new THREE.Vector3(x, this.yPosGround, z))
        }

        //Bottom right
        for (let i = 0; i < 10; i++) {
            let x = THREE.MathUtils.randFloat(-2500, -3700)
            let z = THREE.MathUtils.randFloat(-2500, -3500)
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
            startPos: this.StartPos,
            rBodies: this.removeBodies,
            rMeshes: this.removeMeshes,
            canvas:this.canvas,
            mapCamera: this.mapCamera
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
            this.CAM.Update(timeElapsedS)
        }

    }



    music() {
        const listener = new THREE.AudioListener();
        this.camera.add(listener);

        const sound = new THREE.Audio(listener);

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('resources/sounds/level3.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.3);
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
    }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new World();
});

