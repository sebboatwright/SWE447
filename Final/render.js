import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GUI} from '../Common/dat.gui.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';

function main() {
  const canvas = document.querySelector('#webgl-canvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  // Orbit Controls
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 3, 0);
  controls.update();

  // New Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  // Object Loaders
  const objLoader = new OBJLoader();

  // GUI
  const gui = new GUI();


  // OBJECTS
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Floor
  var floor = new Plane(floor, '../Final/textures/carpet_texture.png');
  floor.rotation.x = Math.PI * -.5;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling
  var ceil = new Plane(ceil, 'textures/wallpaper_texture.png');
  ceil.rotation.x = Math.PI * -.5;
  ceil.translateZ(9.5);
  ceil.receiveShadow = true;
  scene.add(ceil);

  const ceilFolder = gui.addFolder('Ceiling');
  var ceilVis = {
    toggleCeilVis: function() {
      ceil.traverse(function(child){
        if (child.visible == true) {
          child.visible = false;
        } else {
          child.visible = true;
        }
      });
    }
  };

  ceilFolder.add(ceilVis, 'toggleCeilVis').name('Visibility');

  // Walls
  var wall1 = new Plane(wall1, 'textures/wallpaper_texture.png');
  wall1.rotation.x = Math.PI * -.5;
  wall1.scale.set(.5, 1, 1);
  wall1.translateX(10.25);
  wall1.translateZ(4.75);
  wall1.rotateY(Math.PI / 2);
  wall1.receiveShadow = true;
  scene.add(wall1);

  var wall2 = new Plane(wall2, 'textures/wallpaper_texture.png');
  wall2.rotation.x = Math.PI * -.5;
  wall2.scale.set(.5, 1, 1);
  wall2.translateX(-10.25);
  wall2.translateZ(4.75);
  wall2.rotateY(Math.PI / 2);
  wall2.receiveShadow = true;
  scene.add(wall2);

  var wall3 = new Plane(wall3, 'textures/wallpaper_texture.png');
  wall3.rotation.x = Math.PI * -.5;
  wall3.scale.set(.5, 1.05, 1);
  wall3.translateY(10.25);
  wall3.translateZ(4.75);
  wall3.rotateZ(Math.PI / 2);
  wall3.rotateY(Math.PI / 2)
  wall3.receiveShadow = true;
  scene.add(wall3);

  // Couch
  //////////////////////////////////////////////////////////////////////////////////
  var couchMat = new THREE.MeshPhongMaterial({color: 0x656EA6});
  objLoader.load('../3D-Models/couch_1.obj', function(couchGeo) {
    couchGeo.scale.set(1.5, 1.5, 1.5);
    couchGeo.position.set(-3.5, 1, -5.75);
    couchGeo.rotateY(Math.PI / -2.5);

    addShadows(couchGeo, couchGeo.child, couchMat);

    const couchFolder = gui.addFolder('Couch');
    couchFolder.add(couchGeo.position, 'x', -7.5, 7.5, 0.01).name('Translate X');
    couchFolder.add(couchGeo.position, 'z', -7.5, 7.5, 0.01).name('Translate Z');
    couchFolder.add(couchGeo.rotation, 'y', 0, Math.PI * 2).name('Rotate');

    scene.add(couchGeo);
  });


  // Side Table
  //////////////////////////////////////////////////////////////////////////////////
  var sideTableMat = new THREE.MeshPhongMaterial({color: 0x5C493B});
  objLoader.load('../3D-Models/side_table_1.obj', function(sideTableGeo) {
    sideTableGeo.scale.set(.03, .02, .03);
    sideTableGeo.position.set(-7.25, -.25, -4);
    sideTableGeo.rotateY(Math.PI / 8.5);

    addShadows(sideTableGeo, sideTableGeo.child, sideTableMat);

    scene.add(sideTableGeo);

    const sideTableFolder = gui.addFolder('Side Table');
    sideTableFolder.add(sideTableGeo.position, 'x', -8, 8, 0.01).name('Translate X');
    sideTableFolder.add(sideTableGeo.position, 'z', -8, 8, 0.01).name('Translate Z');
    sideTableFolder.add(sideTableGeo.rotation, 'y', 0, Math.PI * 2).name('Rotate');
  });

  
  // Table Lamp
  //////////////////////////////////////////////////////////////////////////////////
  const tableLampGroup = new THREE.Group();

  var tableLampMat = new THREE.MeshPhongMaterial({color: 0x656EA6});
  objLoader.load('../3D-Models/tablelamp_1.obj', function(tableLampGeo) {
    tableLampGeo.scale.set(1.5, 1, 1.5);
    tableLampGeo.position.set(-7.25, 2.5, -4);

    addShadows(tableLampGeo, tableLampGeo.child, tableLampMat);

    tableLampGroup.add(tableLampGeo);
  });

  // Table Lamp Light Bulb
  const tableBulbMat = new THREE.MeshPhongMaterial({
    emissive: 0xFFFFFF,
    color: 0x000000
  });

  objLoader.load('../3D-Models/lightbulb_2.obj', function(tableBulbGeo) {
    tableBulbGeo.scale.set(1.5, 1.5, 1.5);
    tableBulbGeo.position.set(-7.25, 2.25, -4);

    tableBulbGeo.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = tableBulbMat;
      } 
    });

    tableLampGroup.add(tableBulbGeo);
  });

  // Table Lamp Light
  const tableLampColor = 0xFFE096;
  const tableLampIntensity = 1;
  const tableLampLight = new THREE.PointLight(tableLampColor, tableLampIntensity, 10, 2);

  tableLampLight.position.set(-7.25, 3, -4);

  tableLampLight.shadow.mapSize.width = 512;
  tableLampLight.shadow.mapSize.height = 512;
  tableLampLight.shadow.camera.near = 0.5;
  tableLampLight.shadow.camera.far = 500;
  tableLampLight.castShadow = true;

  tableLampGroup.add(tableLampLight);

  /*
  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper(tableLampLight, sphereSize);
  scene.add(pointLightHelper);
  */

  scene.add(tableLampGroup);

  const tableLampFolder = gui.addFolder('Table Lamp');
  tableLampFolder.add(tableLampGroup.position, 'x', -1.75, 16.25, 0.01).name('Translate X');
  tableLampFolder.add(tableLampGroup.position, 'y', -.65, .5, 0.01).name('Translate Y');
  tableLampFolder.add(tableLampGroup.position, 'z', -1.75, 16.25, 0.01).name('Translate Z');


  // Comfy Chair
  //////////////////////////////////////////////////////////////////////////////////
  var comfyChairMat = new THREE.MeshPhongMaterial({color: 0x656EA6});
  objLoader.load('../3D-Models/comfychair_1.obj', function(comfyChairGeo) {
    comfyChairGeo.scale.set(1.5, 1.5, 1.5);
    comfyChairGeo.position.set(7, 1, -5);
    comfyChairGeo.rotateY((5 * Math.PI) / 4);

    addShadows(comfyChairGeo, comfyChairGeo.child, comfyChairMat);

    const comfyChairFolder = gui.addFolder('Comfy Chair');
    comfyChairFolder.add(comfyChairGeo.position, 'x', -7.5, 7.5, 0.01).name('Translate X');
    comfyChairFolder.add(comfyChairGeo.position, 'z', -7.5, 7.5, 0.01).name('Translate Z');
    comfyChairFolder.add(comfyChairGeo.rotation, 'y', 0, Math.PI * 2).name('Rotate');

    scene.add(comfyChairGeo);
  });


  // Coffee Table
  //////////////////////////////////////////////////////////////////////////////////
  var coffeeTableMat = new THREE.MeshPhongMaterial({color: 0x5C493B});
  objLoader.load('../3D-Models/coffeetable_1.obj', function(coffeeTableGeo) {
    coffeeTableGeo.scale.set(1.5, 1.5, 2);
    coffeeTableGeo.position.set(1.5, .5, -2);
    coffeeTableGeo.rotateY( Math.PI / 2.1);

    addShadows(coffeeTableGeo, coffeeTableGeo.child, coffeeTableMat);

    const coffeeTableFolder = gui.addFolder('Coffee Table');
    coffeeTableFolder.add(coffeeTableGeo.position, 'x', -6.1, 6.25, 0.01).name('Translate X');
    coffeeTableFolder.add(coffeeTableGeo.position, 'z', -6.1, 6.25, 0.01).name('Translate Z');
    coffeeTableFolder.add(coffeeTableGeo.rotation, 'y', 0, Math.PI * 2).name('Rotate');

    scene.add(coffeeTableGeo);
  });


  // Dining Table
  //////////////////////////////////////////////////////////////////////////////////
  var tableMat = new THREE.MeshPhongMaterial({color: 0x5C493B});
  objLoader.load('../3D-Models/table_1.obj', function(tableGeo) {
    tableGeo.scale.set(2.5, 1.5, 2.5);
    tableGeo.position.set(-3, .5, 6);
    tableGeo.rotateY( Math.PI / -2.1);

    addShadows(tableGeo, tableGeo.child, tableMat);

    const tableFolder = gui.addFolder('Dining Table');
    tableFolder.add(tableGeo.position, 'x', -5.3, 5.3, 0.01).name('Translate X');
    tableFolder.add(tableGeo.position, 'z', -5.3, 5.3, 0.01).name('Translate Z');
    tableFolder.add(tableGeo.rotation, 'y', 0, Math.PI * 2).name('Rotate');

    scene.add(tableGeo);
  });


  // Dining Chairs
  //////////////////////////////////////////////////////////////////////////////////
  // Chair 1
  var chair1Mat = new THREE.MeshPhongMaterial({color: 0x5C493B});
  objLoader.load('../3D-Models/diningchair_1.obj', function(chair1Geo) {
    chair1Geo.scale.set(1.5, 1.5, 1.5);
    chair1Geo.position.set(-4.25, 1.5, 4);
    chair1Geo.rotateY(( 11 * Math.PI) / -7);

    addShadows(chair1Geo, chair1Geo.child, chair1Mat);

    const chair1Folder = gui.addFolder('Dining Chair: 1');
    chair1Folder.add(chair1Geo.position, 'x', -8.5, 8.5, 0.01).name('Translate X');
    chair1Folder.add(chair1Geo.position, 'z', -8.5, 8.5, 0.01).name('Translate Z');
    chair1Folder.add(chair1Geo.rotation, 'y', 0, Math.PI * 2).name('Rotate');

    scene.add(chair1Geo);
  });

  // Chair 2
  var chair2Mat = new THREE.MeshPhongMaterial({color: 0x5C493B});
  objLoader.load('../3D-Models/diningchair_1.obj', function(chair2Geo) {
    chair2Geo.scale.set(1.5, 1.5, 1.5);
    chair2Geo.position.set(-1, 1.5, 8.5);
    chair2Geo.rotateY(Math.PI / -3);

    addShadows(chair2Geo, chair2Geo.child, chair2Mat);

    const chair2Folder = gui.addFolder('Dining Chair: 2');
    chair2Folder.add(chair2Geo.position, 'x', -8.5, 8.5, 0.01).name('Translate X');
    chair2Folder.add(chair2Geo.position, 'z', -8.5, 8.5, 0.01).name('Translate Z');
    chair2Folder.add(chair2Geo.rotation, 'y', 0, Math.PI * 2).name('Rotate');

    scene.add(chair2Geo);
  });


  // Ceiling Lamp
  //////////////////////////////////////////////////////////////////////////////////
  const ceilLampGroup = new THREE.Group();

  objLoader.load('../3D-Models/ceilinglamp_1.obj', function(ceilLampGeo) {
    ceilLampGeo.scale.set(2.5, 2.5, 2.5);
    ceilLampGeo.position.set(0, 8.4, 0);

    ceilLampGeo.traverse(function(child) {
      child.receiveShadow = true;
      child.castShadow = true;
      child.shadowDarkness = .8;
      child.needsUpdate = true;
    });

    ceilLampGroup.add(ceilLampGeo);
  });

  // Ceiling Lamp Bulb
  const bulbMat = new THREE.MeshPhongMaterial({
    emissive: 0xFFFFFF,
    color: 0x000000
  });

  objLoader.load('../3D-Models/lightbulb_1.obj', function(ceilBulbGeo) {
    ceilBulbGeo.position.set(0, 8.4, 0);
    ceilBulbGeo.scale.set(2.5, 2.5, 2.5);

    ceilBulbGeo.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = bulbMat;
      }
    });

    ceilLampGroup.add(ceilBulbGeo);
  });

  // Ceiling Lamp Light
  const ceilLightColor = 0xFFE8B3;
  const ceilLightIntensity = 1;
  const ceilLight = new THREE.SpotLight(ceilLightColor, ceilLightIntensity);

  ceilLight.shadow.mapSize.width = 512;
  ceilLight.shadow.mapSize.height = 512;
  ceilLight.shadow.camera.near = 0.5;
  ceilLight.shadow.camera.far = 500;
  ceilLight.castShadow = true;
  ceilLight.penumbra = .75;
  ceilLight.angle = (Math.PI / 2.75);
  ceilLight.position.set(0, 8, 0);
  ceilLight.target.position.set(0, 0, 0);

  ceilLampGroup.add(ceilLight);
  ceilLampGroup.add(ceilLight.target);

  /*
  const spotLightHelper = new THREE.SpotLightHelper(ceilLampGroup.children[0]);
  scene.add(spotLightHelper);
  */

  scene.add(ceilLampGroup);

  const ceilLampFolder = gui.addFolder('Ceiling Lamp');
  ceilLampFolder.add(ceilLampGroup.position, 'x', -8.45, 8.45, 0.01);
  ceilLampFolder.add(ceilLampGroup.position, 'z', -8.45, 8.45, 0.01);


  
  // LIGHTS
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Ambient Light
  {
    const ambientLight = new THREE.AmbientLight(0x404040);
    ambientLight.intensity = 2;
    scene.add(ambientLight);
  }

  // Spotlight
  {
    const color = 0xFFE8B3;
    const intensity = .25;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(0, 1, 0);
    light.target.position.set(0, 10, 0);

    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    light.castShadow = true;
    light.penumbra = .99;
    light.angle = (Math.PI / 2);

    scene.add(light)
    scene.add(light.target);
  }



  // RENDERING
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Resize
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // Render
  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera)
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();



// OBJECT FUNCTIONS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Plane
function Plane(mesh, source) {
  const planeSize = 20;

  const loader = new THREE.TextureLoader();
  const texture = loader.load(source);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 10;
  texture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.BoxGeometry(planeSize, planeSize, .5);
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  mesh = new THREE.Mesh(planeGeo, planeMat);

  return mesh;
}

// Shadows
function addShadows(mesh, meshChild, meshMat) {
  mesh.traverse(function(meshChild) {
    if (meshChild instanceof THREE.Mesh) {
      meshChild.material = meshMat;
    }

    meshChild.castShadow = true;
    meshChild.receiveShadow = true;
    meshChild.shadowDarkness = .8;
    meshChild.needsUpdate = true;
  });

  return mesh;
}