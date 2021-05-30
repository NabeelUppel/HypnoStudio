function fence(x,y,z){
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    fenceBody = new CANNON.Body({mass: 2});
    fenceBody.addShape(shape);
    fenceBody.position.set(x, y, z);
    fenceBody.userData = {name: "FENCE"}
    world.addBody(fenceBody);
    bodies.push(fenceBody);

    const f = new THREE.Group();

    const texture = new THREE.TextureLoader().load( "./resources/images/fence2.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;


    const geometry = new THREE.BoxGeometry(1.5,5,0.5);
    const material = new THREE.MeshPhongMaterial({map: texture});

    const texture2 = new THREE.TextureLoader().load( "./resources/images/fenceTop.jpg" );
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;

    const geom = new THREE.BoxGeometry(1.1,1.1,0.45);
    const mat = new THREE.MeshPhongMaterial({map: texture2});

    for( var i = 0; i < 10; i = i+2){
        const rect = new THREE.Mesh(geometry,material);
        rect.position.set(i ,2.5,0);

        const tri = new THREE.Mesh(geom, mat);
        tri.position.set(i+0.03,4.95,0);
        tri.rotateZ(-15);

        f.add(rect);
        f.add(tri);
    }

    const g = new THREE.BoxGeometry(11,0.75,0.5);
    const m = new THREE.MeshPhongMaterial({color: '#D0944D'});

    for(var l = 1.25; l < 4; l = l +2.25){
        const back = new THREE.Mesh(g, m);
        back.position.set(4,l,-0.5);
        f.add(back);
    }


    return f;
}