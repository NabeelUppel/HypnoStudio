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
        if(this.TaskList){
            return this.TaskList
        }
    }
    Init(params) {
        this.pMeshes = [];
        this.pBodies = [];
        this.pNames = [];
        this.TaskList =[];
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
                1: ['Dewgong', 'Seel', 'Machoke', 'NidoranFemale',  'Doduo',  'Magikarp', 'NidoranMale','Slowbro', 'Metapod', 'Dodrio','Cubone','Machop','Pikachu', 'Nidorino', 'Nidorina'],
                2: ['Butterfree', 'Arcanine', 'Sandslash','MrMime','Nidoking', 'Kadabra','Pinsir', 'Scyther','Machamp',  'Rhydon','Nidoqueen','Slowpoke'],
                3: ['Eevee','Squirtle','Marowak', 'Omastar', 'Bulbasaur','Farfetchd','Abra','Gengar','Charmander'],
                4: ['Hitmonchan', 'Porygon', 'Ivysaur', 'Charmeleon', 'Wartortle','Flareon','Gyarados'],
                5: [ 'Omanyte', 'Charizard','Venusaur', 'Blastoise',  'Alakazam', 'Vaporeon'],
                6: ['Mew', 'Jolteon', 'Mewtwo','Zapdos']
            }
    }


    LoadModels() {

        this.manager = new THREE.LoadingManager();
        this.manager.onLoad = () => {
            this.PokemonList["Names"] = this.pNames;
            this.PokemonList["Bodies"] = this.pBodies;
            this.PokemonList["Meshes"] = this.pMeshes;
            this.createTable()
            this.update();
        };


        const _OnLoad = (name, fbx, pos, num) => {
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

            if(num%2===0){
               this.TaskList.push(name);
            }

            this.world.addBody(Body);
            this.scene.add(fbx);
        };

        const loader = new FBXLoader(this.manager);
        loader.setPath("./resources/models/Pokemon/Perfect/");
        let R1 = THREE.MathUtils.randInt(1, 100)
        for (let i = 0; i <this.Positions.length ; i++) {
            let Rarity = 1

            if(i%2===0){
                Rarity = 2
            }

            if(i%4===0){
                Rarity =  THREE.MathUtils.randInt(3, 6)
            }

            if(R1>=95){
                Rarity = 6
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

    createTable(){
        let replace = {"NidoranMale":"Nidoran♂" ,  "NidoranFemale":"Nidoran♀", "Farfetchd":"Farfetch'd", "MrMime":"Mr. Mime"};
        let replaceList=["NidoranMale","NidoranFemale","Farfetchd","MrMime"]

        let pdx= new Pokedex()
        let cellList=[]
        let rowList= []
        let div = document.createElement("div");
        let table = document.createElement("table");
        let title = document.createElement("h3")
        title.innerHTML="Task List"
        title.style.textAlign="center"
        title.style.fontSize="40px"
        title.style.color="white"
        table.style.marginBottom="10px"
        title.style.fontFamily="Tahoma, sans-serif"
        div.style.top = 200 + 'px';
        div.style.left = 25 + 'px';
        div.style.position="absolute"
        div.style.display = "block";
        div.id = "TaskList"
        div.style.borderRadius="25px"
        div.style.backgroundColor="rgba(0,0,0, 0.5)"
        for (let i = 0; i <15 ; i++) {
            let name = this.TaskList[i]
            let cell = document.createElement("td");
            cell.style.textAlign = "center"
            cell.style.padding="0px"
            cell.className = this.TaskList[i]
            let figure = document.createElement("figure");

            let caption = document.createElement("figcaption");
            caption.style.fontFamily="Tahoma, sans-serif"
            for (let i = 0; i <replaceList.length ; i++) {
                if(name.includes(replaceList[i])){
                    name = name.replace(replaceList[i], replace[replaceList[i]])
                    break
                }
            }
            caption.innerHTML = name
            caption.style.fontSize="20px"
            caption.style.color="white"

            let img = document.createElement("img");

            img.src = "resources/images/pokemonIcons/"+pdx.getID(this.TaskList[i]).toString()+".png"
            img.setAttribute("height", "70");
            img.setAttribute("width", "70");

            let a = document.createElement("a");
            a.appendChild(img)
            figure.appendChild(a)
            figure.appendChild(caption)
            cell.appendChild(figure)
            cellList.push(cell)
        }

        for (let i = 0; i <5 ; i++) {
            rowList.push(document.createElement("tr"))
        }

        for (let i = 0; i <15 ; i++) {
            let row= rowList[i%5]
            row.appendChild(cellList[i])
        }

        for (let i = 0; i <5 ; i++) {
            table.appendChild(rowList[i])
        }
        table.style.borderSpacing="0"
        table.style.borderCollapse="collapse"
        div.appendChild(title)
        div.appendChild(table)
        document.body.appendChild(div)
    }
}
