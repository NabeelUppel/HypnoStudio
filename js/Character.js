import * as THREE from '../resources/threejs/r128/build/three.module.js';
import {FBXLoader} from '../resources/threejs/r128/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from '../resources/cannon-es/dist/cannon-es.js'
import {Pokedex} from "./Pokedex.js"


/*
* The Character uses a FBX model with animations.
* Model downloaded from: Mixamo.com
* Based on a tutorial by SimonDev found on Youtube.
*
* Basic Outline of the class:
* The Character is loaded using the three js FBX Loader. The animations is done in a similar way except that it uses a loading manager.
* The Cannon JS body is then add to  the loaded model.
* A Finite State Machine is used to for character animations.
* When the model is loaded the FSM is set to the idle state.
* Each Animation has its own FSM State. This is done so that not animation is done at the same time.

*/

//Proxy class to allow animations to be passed from one class to another.
class BasicCharacterControllerProxy {
    constructor(animations) {
        this._animations = animations;
    }

    get animations() {
        return this._animations;
    }
}



//Character class. Main Character class.
export class Character {
    constructor(params) {
        this.Init(params)
    }

    //Getter Functions
    get Position() {
        return this.position;
    }

    get Rotation() {
        if (!this.Character) {
            return new THREE.Quaternion();
        }
        return this.Character.quaternion;
    }

    get Caught(){
        return this.caught
    }

    //Initialise Function.
    Init(params) {

        this.scene = params.scene;
        this.world = params.world;
        this.renderer = params.renderer;
        this.camera = params.camera;
        this.startPos = params.startPos;
        //used for bodies and meshes that need to be synced together
        this.meshes = params.meshes;
        this.bodies = params.bodies;
        this.canvas = params.canvas;

        //used for bodies and meshes that need to be removed.
        this.rBodies = params.rBodies;
        this.rMeshes = params.rMeshes;

        //List of all Pokemon Available to be caught.
        //Dictionary of three arrays: names, bodies and meshes.
        this.pokemon = params.pokemon;

        //Array of names of the caught pokemon.
        this.caught = []

        //used to store animations that are loaded.
        this.allAnimations = {};

        this.pokedex = new Pokedex()

        //Initialise
        let proxy = new BasicCharacterControllerProxy(this.allAnimations)
        this.stateMachine = new CharacterFSM(proxy)
        this.position = new THREE.Vector3();

        this.raycaster = new THREE.Raycaster();
        this.jumpHeight = 10;


        //Mouse event listeners.
        document.addEventListener("dblclick", (e)=> this._onDoubleClick(e), false)
        document.addEventListener("mousemove", (e)=> this._onMouseMove(e), false)

        //Load Model.
        this.LoadModel();
        this.input = new CharacterController(params, this.CharacterBody);

    }

    LoadModel() {
        this.manager = new THREE.LoadingManager();
        this.manager.onLoad = () => {
            const loadingScreen = document.getElementById( 'loading-screen' );
            loadingScreen.classList.add( 'fade-out' );

            // optional: remove loader from DOM via event listener
            loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
        };

        function onTransitionEnd( event ) {
            const element = event.target;
            element.remove();
        }

        const loader = new FBXLoader(this.manager);
        loader.setPath("./resources/models/Maximo/AJ/")
        loader.load("aj.fbx", (fbx) => {
            //Scale Down Model
            fbx.scale.setScalar(0.3);
            //traverse model and allow it to cast and receive shadows
            fbx.traverse(c => {
                if (c.type === "Bone") {
                    if (c.name === "RightHand") {
                        this.RightHand = c;
                    }
                }
                c.castShadow = true;
                c.receiveShadow = true;
            });

            this.Character = fbx;


            //Add Physics
            let box = new THREE.Box3().setFromObject(fbx);
            const size = new THREE.Vector3();
            box.getSize(size)
            const height = size.y
            const depth = size.z

            const heavyMaterial = new CANNON.Material('heavy');

            //Cylindrical Shape
            const characterShape = new CANNON.Cylinder(depth , depth, height, 8)
            this.CharacterBody = new CANNON.Body({
                mass: 80,
                position: this.startPos,
                material: heavyMaterial
            });
            this.CharacterBody.addShape(characterShape, new CANNON.Vec3(0, height / 2, ));
            this.CharacterBody.angularDamping = 1;
            this.CharacterBody.linearDamping = 0.99;

            //Add it to the scene and world.
            this.world.addBody(this.CharacterBody);
            this.scene.add(this.Character);

            //Animations
            this.mixer = new THREE.AnimationMixer(this.Character);
            this.manager = new THREE.LoadingManager();

            //After all animations are done loading set the state to the idle state.
            this.manager.onLoad = () => {
                this.stateMachine.SetState('idle');
            };


            //function to store the animations.
            const _OnLoad = (animName, anim) => {
                let clip = anim.animations[0];
                if(animName === "throw"){
                    clip = THREE.AnimationUtils.subclip(clip,clip.name, 55,200)
                }
                const action = this.mixer.clipAction(clip);

                this.allAnimations[animName] = {
                    clip: clip,
                    action: action,
                };
            };


            //Load all animations files.
            const loader = new FBXLoader(this.manager);
            loader.setPath("./resources/models/Maximo/AJ/");
            loader.load('Walk.fbx', (a) => {
                _OnLoad('walk', a);
            });
            loader.load('Run.fbx', (a) => {
                _OnLoad('run', a);
            });
            loader.load('Idle.fbx', (a) => {
                _OnLoad('idle', a);
            });
            loader.load('Jump.fbx', (a) => {
                _OnLoad('jump', a);
            });
            loader.load('RunJump.fbx', (a) => {
                _OnLoad('run_jump', a);
            });
            loader.load('Throw.fbx', (a) => {
                _OnLoad('throw', a);
            });
        });
    }

    //Character Movement Function.
    Update(timeInSeconds) {
        if (!this.Character || !this.CharacterBody || !this.stateMachine._currentState || !this.input) {
            return
        }

        //Update FSM based on key press.
        this.stateMachine.Update(timeInSeconds, this.input);

        //Rotation Angle of the Model.
        let angle = -this.Character.rotation.y + Math.PI * 0.5;

        //initialise
        let jumpInitialHeight = null;
        const _Q = new THREE.Quaternion();

        //Speed of movement.
        let speed = 2;
        let rSpeed = speed/3;

        //Used to see if the model is standing on another object.
        if (this.CharacterBody.position.y < 1) {
            jumpInitialHeight = this.CharacterBody.position.y
        }

        if(this.input.CharacterMotions.throw){
            this.input.CharacterMotions.throw = false;
        }


        //Increase Speed if the run key is pressed.
        if (this.input.CharacterMotions.run) {
            speed *= 4;
            rSpeed*=2;
        }

        //Jump.
        //If the character is running or walking add a  little forward/backward displacement.
        //Otherwise jump up without other displacements.
        if (this.input.CharacterMotions.jump) {
            const listener = new THREE.AudioListener();
            this.camera.add(listener);
            const sound = new THREE.Audio(listener);
            const audioLoader = new THREE.AudioLoader();
            audioLoader.load('resources/sounds/jumpSound.wav', function (buffer) {
                sound.setBuffer(buffer);
                sound.setVolume(0.3);
                sound.play();
            });

            if (this.CharacterBody.position.y <= jumpInitialHeight + 2.5) {
                if (this.stateMachine._currentState.Name === 'jump') {
                    this.CharacterBody.position.y += 5;
                } else if (this.stateMachine._currentState.Name === 'run_jump') {
                    this.CharacterBody.position.y += 5;
                    this.CharacterBody.position.x += Math.cos(angle) * speed * 1.2;
                    this.CharacterBody.position.z += Math.sin(angle) * speed * 1.2;
                } else if (this.stateMachine._currentState.Name === 'walk_jump') {
                    this.CharacterBody.position.y += 5;
                    this.CharacterBody.position.x += Math.cos(angle) * speed * 1.001;
                    this.CharacterBody.position.z += Math.sin(angle) * speed * 1.001;
                }


            }
            this.input.CharacterMotions.jump = false;
        }
        if (this.input.CharacterMotions.caught) {
            console.log("CAUGHT:",this.caught)
            this.input.CharacterMotions.caught = false;
        }

        //Forward.
        //Move the CharacterBody forward based on what direction it's facing
        if (this.input.CharacterMotions.forward) {
            this.CharacterBody.position.x += Math.cos(angle) * speed;
            this.CharacterBody.position.z += Math.sin(angle) * speed;
        }

        //Backward.
        //Move the CharacterBody backward based on what direction it's facing
        if (this.input.CharacterMotions.backward) {
            this.CharacterBody.position.x -= Math.cos(angle) * speed;
            this.CharacterBody.position.z -= Math.sin(angle) * speed;
        }


        //Left
        //Rotate the CharacterBody left at a fixed speed.
        if (this.input.CharacterMotions.left) {
            this.Character.rotation.y+=rSpeed*timeInSeconds*2;
            _Q.copy(this.Character.quaternion);
        }

        //Right
        //Rotate the CharacterBody right at a fixed speed.
        if (this.input.CharacterMotions.right) {
            this.Character.rotation.y-=rSpeed*timeInSeconds*2;
            _Q.copy(this.Character.quaternion);
        }

        //Sync the CharacterBody with the Character Model.
        this.CharacterBody.quaternion.copy(_Q);
        this.Character.position.copy(this.CharacterBody.position);

        this.position.copy(this.CharacterBody.position);


        //Update Animations.
        if (this.mixer) {
            this.mixer.update(timeInSeconds);
        }
    }


    _onMouseMove(event){
        if(!this.pokemon || !this.CharacterBody){
            return
        }
        const mouse = {
            x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
        }

        this.handPos = new THREE.Vector3()
        this.bodyPos = this.CharacterBody.position;
        this.RightHand.getWorldPosition(this.handPos)
        this.raycaster.setFromCamera( mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.pokemon.Meshes,true);
        let target = null;
        this.dir=null;

        if(intersects.length>0){
            target = intersects[0];
            const vector = target.point;
            const dir = vector.sub(this.handPos).normalize()
            let ray = new THREE.Ray(this.handPos,  dir);
            this.dir = ray.direction;
            this.lookat = dir;
        }

    }
    _onDoubleClick(event){
        if(this.dir!==null){
            //this.Character.lookAt(this.lookat);
            this.input.CharacterMotions.throw = true;
            if(this.ballBody && this.ballMesh){
                let meshIndex = this.rMeshes.indexOf(this.ballMesh)
                let bodyIndex = this.rBodies.indexOf(this.ballBody)
                if(meshIndex===-1 && bodyIndex===-1){
                    this.rBodies.push(this.ballBody);
                    this.rMeshes.push(this.ballMesh);
                }
            }
            this.PokeBall(this.dir)
        }

        this.dir =null;
    }

    PokeBall(direction){
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./resources/images/pokeball.jpg');

        let material = new THREE.MeshPhongMaterial( {
            map: texture,
            side: THREE.DoubleSide
        } );

        let ballShape = new CANNON.Sphere(3);
        let ballGeometry = new THREE.SphereGeometry(ballShape.radius, 64, 64);

        this.ballBody = new CANNON.Body({
            mass: 1,
            position: this.handPos
        });

        this.ballBody.addShape(ballShape);

        this.ballMesh = new THREE.Mesh( ballGeometry, material );

        this.world.addBody(this.ballBody);
        this.scene.add(this.ballMesh);

        let shootVel = 1000
        this.ballBody.velocity.set(
            direction.x * shootVel*2,
            direction.y * shootVel,
            direction.z * shootVel*2
        )

        this.bodies.push(this.ballBody);
        this.meshes.push(this.ballMesh);

        this.ballBody.addEventListener("collide", (e)=>this.collisionCheck(e))
    }
    collisionCheck (e){
        let pBodies = this.pokemon.Bodies;
        let pMeshes = this.pokemon.Meshes;
        let pNames = this.pokemon.Names;
        let index = pBodies.indexOf(e.body);
        if (index>-1){
            let name = pNames[index];
            if(this.isCaught(name)){

                const listener = new THREE.AudioListener();
                this.camera.add(listener);
                const sound = new THREE.Audio(listener);
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load('resources/sounds/pokemonCaught.mp3', function (buffer) {
                    sound.setBuffer(buffer);
                    sound.setVolume(0.3);
                    sound.play();
                });
                this.addText("You Caught "+name+"!")

                let body = pBodies[index];
                let mesh = pMeshes[index];
                this.caught.push(name);
                this.rBodies.push(this.ballBody);
                this.rMeshes.push(this.ballMesh);
                this.rBodies.push(body);
                this.rMeshes.push(mesh);
            }else{
                console.log("Escaped")
                this.addText(name+" Escaped!")
            }


        }
        this.rBodies.push(this.ballBody);
        this.rMeshes.push(this.ballMesh);
    }


    isCaught(PokemonName){
        let R1 = THREE.MathUtils.randInt(0, 255)
        let rate = this.pokedex.getRate(PokemonName)
        return rate*2 >= R1/2.5;
    }
    addText(Text){

        const elem = document.getElementById("text-label");
        if(elem != null){
            elem.parentNode.removeChild(elem);
        }

        let replace = {"NidoranMale":"Nidoran♂" ,  "NidoranFemale":"Nidoran♀", "Farfetchd":"Farfetch'd", "MrMime":"Mr. Mime"};
        let replaceList=["NidoranMale","NidoranFemale","Farfetchd","MrMime"]

        for (let i = 0; i <replaceList.length ; i++) {
            if(Text.includes(replaceList[i])){
                console.log(Text)
                Text.replace(replaceList[i], replace[replaceList[i]])
                break
            }
        }


        let new_canvas=document.createElement('canvas')
        let ctx = new_canvas.getContext("2d")
        ctx.font="40px Tahoma, sans-serif"
        var width = ctx.measureText(Text).width
        let text2=document.createElement('div')
        text2.style.position = 'absolute';
        text2.id= 'text-label';
        text2.style.width = width+"px";
        text2.style.height = 200+"px";
        text2.innerHTML = Text;
        text2.style.top = 300 + 'px';
        text2.style.left = (this.canvas.width-width)/2+'px';
        text2.style.fontSize=40+'px'
        text2.style.color='#ffffff'
        text2.style.fontFamily="Tahoma, sans-serif"
        text2.unselectable="on"
        document.body.appendChild(text2)
        this.removeText()
    }
    removeText(){
        setTimeout(() => {
            const elem = document.getElementById("text-label");
            if(elem != null){
                elem.parentNode.removeChild(elem);
            }
        }, 5000);
    }
}


class CharacterController {
    constructor() {
        this.Init();
    }

    Init() {
        this.CharacterMotions = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            run: false,
            throw:false,
            caught:false
        };
        document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }


    _onKeyDown(event) {
        switch (event.code) {
            case "KeyW": // w
                this.CharacterMotions.forward = true;
                break;
            case "KeyA": // a
                this.CharacterMotions.left = true;
                break;
            case "KeyS": // s
                this.CharacterMotions.backward = true;
                break;
            case "KeyD": // d
                this.CharacterMotions.right = true;
                break;
            case "Space": // SPACE
                this.CharacterMotions.jump = true;
                break;
            case "ShiftLeft": // SHIFT
                this.CharacterMotions.run = true;
                break;
            case "KeyP": // d
                this.CharacterMotions.caught = true;
                break;
        }
    }

    _onKeyUp(event) {
        switch (event.code) {
            case "KeyW": // w
                this.CharacterMotions.forward = false;
                break;
            case "KeyA": // a
                this.CharacterMotions.left = false;
                break;
            case "KeyS": // s
                this.CharacterMotions.backward = false;
                break;
            case "KeyD": // d
                this.CharacterMotions.right = false;
                break;
            case "Space": // SPACE
                //this.CharacterMotions.jump = false;
                break;
            case "ShiftLeft": // SHIFT
                this.CharacterMotions.run = false;
                break;
            case "KeyP": // d
                this.CharacterMotions.caught = true;
                break;

        }
    }

}


class FiniteStateMachine {
    constructor() {
        this._states = {};
        this._currentState = null;
    }

    AddState(name, type) {
        this._states[name] = type;
    }

    SetState(name) {
        const prevState = this._currentState;

        if (prevState) {
            if (prevState.Name === name) {
                return;
            }
            prevState.Exit();
        }

        const state = new this._states[name](this);

        this._currentState = state;
        state.Enter(prevState);
    }

    Update(timeElapsed, input) {
        if (this._currentState) {
            this._currentState.Update(timeElapsed, input);
        }
    }
}

class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
        super();
        this._proxy = proxy;
        this._Init();
    }

    _Init() {
        this.AddState('idle', IdleState);
        this.AddState('walk', WalkState);
        this.AddState('run', RunState);
        this.AddState('jump', JumpState);
        this.AddState('run_jump', RunningJumpState);
        this.AddState('walk_jump', WalkingJumpState);
        this.AddState('throw', ThrowState);
    }
}

class State {
    constructor(parent) {
        this._parent = parent;
    }

    Enter() {
    }

    Exit() {
    }

    Update() {
    }
}

class RunState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'run';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['run'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.enabled = true;

            if (prevState.Name === 'walk') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else if (prevState.Name === 'run_jump') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration + 2;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {
    }

    Update(timeElapsed, input) {
        if (input.CharacterMotions.forward || input.CharacterMotions.backward) {
            if (!input.CharacterMotions.run) {
                this._parent.SetState('walk');
            }

            if (input.CharacterMotions.jump) {
                this._parent.SetState('run_jump');
            }

            return;
        }


        this._parent.SetState('idle');
    }
}

class IdleState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'idle';
    }

    Enter(prevState) {
        const idleAction = this._parent._proxy._animations['idle'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.5, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }

    Exit() {
    }

    Update(_, input) {
        if (input.CharacterMotions.forward || input.CharacterMotions.backward) {
            this._parent.SetState('walk');
        } else if (input.CharacterMotions.jump) {
            this._parent.SetState('jump');
        } else if(input.CharacterMotions.throw){
            this._parent.SetState('throw');
        }
    }
}

class WalkState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'walk';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['walk'].action;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.enabled = true;

            if (prevState.Name === 'run') {
                const ratio = curAction.getClip().duration / prevAction.getClip().duration;
                curAction.time = prevAction.time * ratio;
            } else {
                curAction.time = 0.0;

                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
            }

            curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {
    }

    Update(timeElapsed, input) {
        if (input.CharacterMotions.forward || input.CharacterMotions.backward) {
            if (input.CharacterMotions.run) {
                this._parent.SetState('run');
            }

            if (input.CharacterMotions.jump) {
                this._parent.SetState('walk_jump');

            }

            return;
        }


        this._parent.SetState('idle');
    }
}

class JumpState extends State {
    constructor(parent) {
        super(parent);

        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'jump';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['jump'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.reset();
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.1, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('idle');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['jump'].action;
        action.getMixer().removeEventListener('finished', this._FinishedCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {
    }
}

class RunningJumpState extends State {
    constructor(parent) {
        super(parent);

        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'run_jump';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['run_jump'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.reset();
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.2, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('run');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['run_jump'].action;

        action.getMixer().removeEventListener('finished', this._FinishedCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {
    }
}

class WalkingJumpState extends State {
    constructor(parent) {
        super(parent);

        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'run_jump';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['run_jump'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.reset();
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.2, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('walk');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['run_jump'].action;

        action.getMixer().removeEventListener('finished', this._FinishedCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {
    }
}

class ThrowState extends State {
    constructor(parent) {
        super(parent);

        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'throw';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['throw'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;

            curAction.reset();
            curAction.setLoop(THREE.LoopOnce, 1);
            curAction.clampWhenFinished = true;

            //curAction.crossFadeFrom(prevAction, 0.5, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('idle');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['throw'].action;
        action.getMixer().removeEventListener('finished', this._FinishedCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {


    }
}
