import * as THREE from '../resources/threejs/r128/build/three.module.js';
import {FBXLoader} from '../resources/threejs/r128/examples/jsm/loaders/FBXLoader.js';
import * as CANNON from '../resources/cannon-es/dist/cannon-es.js'
import {Pokedex} from "./Pokedex.js"


export class Pokemon {
    constructor(params) {
        this.Init(params)
        this.LoadModels();
    }

    get Bodies(){
        if (this.pBodies){
            return this.pBodies;
        }
    }
    get Meshes(){
        if(this.pMeshes){
            return this.pMeshes;
        }
    }
    get List(){
        if(this.PokemonList){
            return this.PokemonList
        }
    }
    get Task(){
        return this.TaskList
    }
    Init(params) {
        this.pMeshes = [];
        this.pBodies = [];
        this.pNames = [];
        this.PokemonList = {};


        this.scene = params.scene;
        this.world = params.world;
        this.camera = params.camera;

        this.Positions = params.positions;

        this.PokemonModels = ["Venusaur",
            "Flareon",
            "Dewgong",
            "Machamp",
            "Seel",
            "Farfetchd",
            "Nidoking",
            "Squirtle",
            "Mew",
            "Marowak",
            "Jolteon",
            "Mewtwo",
            "Abra",
            "Porygon",
            "Machoke",
            "Gyarados",
            "NidoranFemale",
            "Eevee",
            "Slowbro",
            "MrMime",
            "Omastar",
            "Rhydon",
            "Metapod",
            "Pinsir",
            "Dodrio",
            "Butterfree",
            "Hitmonchan",
            "Ivysaur",
            "Blastoise",
            "Omanyte",
            "Machop",
            "Scyther",
            "Bulbasaur",
            "Nidorino",
            "Sandslash",
            "Doduo",
            "Arcanine",
            "Nidoqueen",
            "Pikachu",
            "Magikarp",
            "Cubone",
            "NidoranMale",
            "Alakazam",
            "Nidorina",
            "Kadabra",
            "Gengar",
            "Charmeleon",
            "Vaporeon",
            "Wartortle",
            "Slowpoke",
            "Charizard",
            "Charmander",
            "Zapdos"
        ];
        this.AdjustedModels = ["Gengar",
            "Charmeleon",
            "Vaporeon",
            "Wartortle",
            "Slowpoke",
            "Articuno",
            "Dragonite",
            "Charizard",
            "Charmander",
            "Zapdos"];
        this.PFunctions = {
            Articuno: function (fbx) {
                fbx.position.y+=3
                fbx.rotation.set(Math.PI / 6, 0, 0)

            },
            Charizard: function (fbx) {
                fbx.traverse((c) => {
                    if (c instanceof THREE.Mesh) {
                        c.material[4] = new THREE.MeshLambertMaterial({color: "orange"})
                    }
                });
            },
            Charmander: function (fbx) {
                fbx.traverse((c) => {
                    if (c instanceof THREE.Mesh) {
                        c.material[3] = new THREE.MeshLambertMaterial({color: "orange"})
                    }
                });
            },
            Charmeleon: function (fbx) {
                fbx.traverse((c) => {
                    if (c instanceof THREE.Mesh) {
                        c.material[4] = new THREE.MeshLambertMaterial({color: "orange"})
                    }
                });
            },
            Dragonite: function (fbx) {
                fbx.rotation.set(-Math.PI / 2, 0, 0)
            },
            Gengar: function (fbx) {

                fbx.children.splice(2)
            },
            Wartortle: function (fbx) {
                fbx.traverse((c) => {
                    if (c.type === "Bone") {
                        if (c.name === "Tail1") {
                            c.rotation.y += Math.PI / 3;
                        }
                    }
                });
            },
            Vaporeon: function (fbx) {
                fbx.traverse((c) => {
                    if (c.type === "Bone") {
                        if (c.name === "Tail3" || c.name === "Tail4" || c.name === "Tail5" || c.name === "Tail6") {
                            c.rotation.y -= Math.PI / 6;
                        }
                    }
                });
            },
            Slowpoke: function (fbx) {
                fbx.traverse((c) => {
                    if (c.type === "Bone") {
                        if (c.name === "Tail3" || c.name === "Tail4" || c.name === "Tail5" || c.name === "Tail6" || c.name === "Tail7") {
                            c.rotation.y -= Math.PI / 6;
                        }
                    }
                });
            },
            Zapdos: function (fbx){
                fbx.position.y+=1.5
            }
        }
        this.RarityTiers=
            {
                1: ['Dewgong', 'Seel', 'Machoke', 'NidoranFemale',  'Doduo',  'Magikarp', 'NidoranMale'],
                2: ['Slowbro', 'Metapod', 'Dodrio','Cubone','Machop','Pikachu', 'Nidorino', 'Nidorina'],
                3: ['Butterfree', 'Arcanine', 'Sandslash','MrMime','Nidoking', 'Kadabra','Pinsir', 'Scyther','Machamp',  'Rhydon','Nidoqueen','Slowpoke'],
                4: ['Eevee','Squirtle','Marowak', 'Omastar', 'Bulbasaur','Farfetchd','Abra','Gengar','Charmander'],
                5: ['Hitmonchan', 'Porygon', 'Ivysaur', 'Charmeleon', 'Wartortle','Flareon','Gyarados'],
                6: [ 'Omanyte', 'Charizard','Venusaur', 'Blastoise',  'Alakazam', 'Vaporeon'],
                7: ['Mew', 'Jolteon', 'Mewtwo','Zapdos']
            }
    }


    LoadModels() {



        this.manager = new THREE.LoadingManager();
        this.manager.onLoad = () => {
            this.PokemonList["Names"] = this.pNames;
            this.PokemonList["Bodies"] = this.pBodies;
            this.PokemonList["Meshes"] = this.pMeshes;
            this.TaskList = this.CreateTaskList()
            this.update();
        };


        const _OnLoad = (name, fbx, pos) => {
            let randDegree = THREE.MathUtils.randInt(-10,10)
            fbx.scale.setScalar(0.5);
            fbx.position.copy(pos)
            fbx.rotation.y+= randDegree

            if(name in this.PFunctions){
                this.PFunctions[name](fbx)
            }

            let box = new THREE.Box3().setFromObject(fbx);
            const size = new THREE.Vector3();
            box.getSize(size)
            const width = size.x
            const height = size.y
            const depth = size.z

            let Shape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,depth/2))

            const heavyMaterial = new CANNON.Material('heavy');
            const Body = new CANNON.Body({
                mass: 100,
                position: pos,
                material: heavyMaterial
            });
            Body.addShape(Shape, new CANNON.Vec3(0, height / 2,0 ));
            Body.type = CANNON.Body.STATIC;

            this.pMeshes.push(fbx);
            this.pBodies.push(Body);
            this.pNames.push(name);

            this.world.addBody(Body);
            this.scene.add(fbx);
        };

        const loader = new FBXLoader(this.manager);
        loader.setPath("./resources/models/Pokemon/Perfect/");
        let R1 = THREE.MathUtils.randInt(1, 100)
        for (let i = 0; i <this.Positions.length ; i++) {
            let Rarity = 1

            if(i%2===0){
                Rarity=2
            }

            if(i <= 25){
                Rarity = THREE.MathUtils.randInt(3, 4)
            }


            if(R1>=75 &&i<28){
                Rarity =  THREE.MathUtils.randInt(5, 6)
                R1 = THREE.MathUtils.randInt(1, 100)
            }

            if(R1>=95){
                Rarity = 7
                R1 = 1
            }
            let Models = this.RarityTiers[Rarity]
            let randPokemon = Models[Math.floor(Math.random() * Models.length)];
            let position = this.Positions[i];
            loader.load(randPokemon+".fbx", (a) => {
                _OnLoad(randPokemon, a, position,i);
            });
        }

    }

    PokemonFunctions() {
        /*this.PFunctions = {
            Aritcuno: function (fbx) {
                fbx.scale.setScalar(0.1);
                fbx.rotation.set(Math.PI / 4, 0, 0)
                fbx.position.y+=1.5

            },
            Charizard: function (fbx) {
                fbx.scale.setScalar(0.1);
                fbx.traverse((c) => {
                    if (c instanceof THREE.Mesh) {
                        c.material[4] = new THREE.MeshLambertMaterial({color: "orange"})
                    }
                });
            },
            Charmander: function (fbx) {
                fbx.scale.setScalar(0.1);
                fbx.traverse((c) => {
                    if (c instanceof THREE.Mesh) {
                        c.material[3] = new THREE.MeshLambertMaterial({color: "orange"})
                    }
                });
            },
            Charmeleon: function (fbx) {
                fbx.scale.setScalar(0.1);
                fbx.traverse((c) => {
                    if (c instanceof THREE.Mesh) {
                        c.material[4] = new THREE.MeshLambertMaterial({color: "orange"})
                    }
                });
            },
            Dragonite: function (fbx) {
                fbx.scale.setScalar(0.1);
                fbx.rotation.set(-Math.PI / 2, 0, 0)
            },
            Gengar: function (fbx) {
                fbx.children.splice(2)
            },
            Wartortle: function (fbx) {
                fbx.traverse((c) => {
                    if (c.type === "Bone") {
                        if (c.name === "Tail1") {
                            c.rotation.y += Math.PI / 3;
                        }
                    }
                });
            },
            Vaporeon: function (fbx) {
                fbx.traverse((c) => {
                    if (c.type === "Bone") {
                        if (c.name === "Tail3" || c.name === "Tail4" || c.name === "Tail5" || c.name === "Tail6") {
                            c.rotation.y -= Math.PI / 6;
                        }
                    }
                });
            },
            Slowpoke: function (fbx) {
                fbx.traverse((c) => {
                    if (c.type === "Bone") {
                        if (c.name === "Tail3" || c.name === "Tail4" || c.name === "Tail5" || c.name === "Tail6" || c.name === "Tail7") {
                            c.rotation.y -= Math.PI / 6;
                        }
                    }
                });
            },
            Zapdos: function (fbx){
                fbx.scale.setScalar(0.1);
                fbx.position.y+=1.5
            }
        }*/

    }

    update(){
        if(!this.PokemonList.Meshes || !this.PokemonList.Bodies){
            return;
        }
        const meshes = this.PokemonList.Meshes;
        const bodies = this.PokemonList.Bodies;
        for (let i = 0; i <bodies.length ; i++) {
            meshes[i].position.copy(bodies[i].position)
        }
    }

    CreateTaskList(){
        let px = new Pokedex()
        let Spawned = this.pNames.slice(0)

        for (let i = 0; i <15 ; i++) {
            popRandom(Spawned)
        }
        return Spawned


        function popRandom (array) {
            let i = (Math.random() * array.length) | 0
            return array.splice(i, 1)
        }

    }
}


/*
Adjustments


*/