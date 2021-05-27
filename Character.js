import * as THREE from './resources/threejs/r128/build/three.module.js';
import {FBXLoader} from './resources/threejs/r128/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from './resources/cannon-es/dist/cannon-es.js'

class BasicCharacterControllerProxy {
    constructor(animations) {
        this._animations = animations;
    }

    get animations() {
        return this._animations;
    }
}


export class Character {
    constructor(params) {
        this.Init(params)
    }

    get Position() {
        return this.position;
    }

    get Rotation() {
        if (!this.Character) {
            return new THREE.Quaternion();
        }
        return this.Character.quaternion;
    }

    Init(params) {
        this.scene = params.scene;
        this.world = params.world;
        this.camera = params.camera;
        this.bodies = params.bodies;
        this.meshes = params.meshes
        this.allAnimations = {}


        let proxy = new BasicCharacterControllerProxy(this.allAnimations)
        this.stateMachine = new CharacterFSM(proxy)
        this.position = new THREE.Vector3();

        this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this.acceleration = new THREE.Vector3(1, 0.25, 500);
       // this.velocity = new THREE.Vector3(0, 0, 0);
        this.jumpHeight = 10;



        // Moves the camera to the cannon.js object position and adds velocity to the object if the run key is down
        this.inputVelocity = new THREE.Vector3()
        this.euler = new THREE.Euler()


        this.LoadModel();
        this.input = new CharacterController();

    }

    LoadModel() {
        const loader = new FBXLoader();
        loader.setPath("./resources/models/Maximo/AJ/")
        loader.load("aj.fbx", (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true;
                c.receiveShadow = true;
            });

            //Physic
            let box = new THREE.Box3().setFromObject(fbx);
            const size = new THREE.Vector3();
            box.getSize(size)
            const height = size.y
            const depth = size.z

            this.Character = fbx;

            const heavyMaterial = new CANNON.Material('heavy');
            const characterShape = new CANNON.Cylinder(depth , depth, height, 8)
            this.CharacterBody = new CANNON.Body({
                mass: 80,
                position: new CANNON.Vec3(0, 0, 0),
                material: heavyMaterial
            });
            this.CharacterBody.addShape(characterShape, new CANNON.Vec3(0, height / 2, ));
            this.CharacterBody.angularDamping = 1;
            this.CharacterBody.linearDamping = 0.99;

            this.world.addBody(this.CharacterBody);
            this.scene.add(this.Character);
            this.mixer = new THREE.AnimationMixer(this.Character);
            this.manager = new THREE.LoadingManager();
            this.manager.onLoad = () => {
                this.stateMachine.SetState('idle');
            };


            const _OnLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.allAnimations[animName] = {
                    clip: clip,
                    action: action,
                };
            };

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
        });


    }


    Update(timeInSeconds) {
        if (!this.Character || !this.CharacterBody || !this.stateMachine._currentState) {
            return
        }
        this.stateMachine.Update(timeInSeconds, this.input);

        let angle = -this.Character.rotation.y + Math.PI * 0.5;
        let jumpInitialHeight = null;

        let speed = 0.25;
        const _Q = new THREE.Quaternion();



        if (this.CharacterBody.position.y < 1) {
            jumpInitialHeight = this.CharacterBody.position.y
        }

        if (this.input.CharacterMotions.run) {
            speed *= 4
        }

        if (this.input.CharacterMotions.jump) {
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

        if (this.input.CharacterMotions.forward) {
            this.CharacterBody.position.x += Math.cos(angle) * speed;
            this.CharacterBody.position.z += Math.sin(angle) * speed;
        }

        if (this.input.CharacterMotions.backward) {
            this.CharacterBody.position.x -= Math.cos(angle) * speed;
            this.CharacterBody.position.z -= Math.sin(angle) * speed;
        }

        if (this.input.CharacterMotions.left) {
            this.Character.rotation.y+=speed*timeInSeconds*2;
            _Q.copy(this.Character.quaternion);

        }
        if (this.input.CharacterMotions.right) {
            this.Character.rotation.y-=speed*timeInSeconds*2;
            _Q.copy(this.Character.quaternion);
        }

        this.CharacterBody.quaternion.copy(_Q);
        this.Character.position.copy(this.CharacterBody.position);

        this.position.copy(this.CharacterBody.position);


        if (this.mixer) {
            this.mixer.update(timeInSeconds);
        }
    }
}


class CharacterController {
    constructor() {
        this.Init()
    }

    Init() {
        this.CharacterMotions = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            run: false,
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
            case "KeyQ": // SHIFT
                this.CharacterMotions.run = true;
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
            case "KeyQ": // SHIFT
                this.CharacterMotions.run = false;
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

