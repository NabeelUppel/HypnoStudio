import * as THREE from './resources/threejs/r128/build/three.module.js';
import {OrbitControls} from './resources/threejs/r128/examples/jsm/controls/OrbitControls.js';
import * as CANNON from './resources/cannon-es/dist/cannon-es.js'


class World {
    constructor() {
        this._Declare();
        this.InitCANNON();
        this.InitTHREE();
    }

    _Declare() {
        this.clock = new THREE.Clock();
        this.mixers = [];
        this.meshes = [];
        this.bodies = [];
        this.timeStep = 1/60;

    }


    InitTHREE() {
        this.canvas = document.querySelector('#c');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.scene = new THREE.Scene();


        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(25, 10, 25);

        this.orbitalControls()

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.LightEnable(light);
        this.scene.add(light);

        this.addHemisphereLight(0xB1E1FF, 0xB97A20)



        this.addGround();

        this._previousRAF = null;


        this.Render();
    }


    InitCANNON() {

        this.world = new CANNON.World();
        this.world.gravity.set(0, -200, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.broadphase.useBoundingBoxes = true;
        this.world.solver.iterations = 10;
        this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
        this.world.defaultContactMaterial.contactEquationRegularizationTime = 4;

    }

    Ball(x, y, z) {
        const radius = 1;
        let shape = new CANNON.Sphere(radius);
        const sphereBody = new CANNON.Body({mass: 5});
        sphereBody.addShape(shape);
        sphereBody.position.set(x, y, z);
        this.world.addBody(sphereBody);
        this.bodies.push(sphereBody);


        const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
        const material = new THREE.MeshPhongMaterial({color: "#711a1a"});
        const SphereShape = new THREE.Mesh(sphereGeometry, material);
        SphereShape.castShadow = true;
        this.scene.add(SphereShape);
        this.meshes.push(SphereShape);
    }

    orbitalControls() {
        this.OrbitalControls = new OrbitControls(this.camera, this.canvas);
        this.OrbitalControls.maxPolarAngle = Math.PI / 2
        this.OrbitalControls.update();
        this.OrbitalControls.enableKeys = false;
        this.OrbitalControls.enabled =false;
    }

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

    addGround() {
        const planeSize = 800;
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./resources/images/ground.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);


        const groundShape = new CANNON.Plane();
        let groundBody = new CANNON.Body({mass: 0});
        groundBody.addShape(groundShape)
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        groundBody.position.set(0, 0, 0);
        groundBody.userData = {name: "GROUND"}
        this.world.addBody(groundBody);
        this.bodies.push(groundBody);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, 1, 1);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });

        let Ground = new THREE.Mesh(planeGeo, planeMat);
        Ground.castShadow = false;
        Ground.receiveShadow = true;
        Ground.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
        this.scene.add(Ground);
        this.meshes.push(Ground);
    }


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

    addHemisphereLight(skyColor, groundColor) {
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        this.scene.add(light);
    }

    Render() {
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }


        requestAnimationFrame((t) => {
            if (this._previousRAF === null) {
                this._previousRAF = t;
            }

            this.Render();
            this.renderer.render(this.scene, this.camera);
            this.Step(t - this._previousRAF);


            this._previousRAF = t;
        });

    }

    Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        if (this._mixers) {
            this._mixers.map(m => m.update(timeElapsedS));
        }


        this.world.step(1/60);
        this.updateMeshPositions();


        this.OrbitalControls.enabled = true;


    }

    updateMeshPositions() {
        for (let i = 0; i !== this.meshes.length; i++) {
            this.meshes[i].position.copy(this.bodies[i].position)
            this.meshes[i].quaternion.copy(this.bodies[i].quaternion);
        }
    }


}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new World();
});

