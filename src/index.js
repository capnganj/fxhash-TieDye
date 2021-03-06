//CAPNGANJ Kaleidoscopics fxhash generative token
//April -> May, 2022

//imports
import { Features } from './Features';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


//1) - generate fxhash features - global driving parameters
//new featuresClass
let feet = new Features();
window.$fxhashData = feet;

// FX Features
window.$fxhashFeatures = {
  "d": feet.xyz,
  "t": feet.t.tag,
  "n": feet.n.tag,
  "rf": feet.rf.rtag + feet.rf.ftag,
  "x": feet.x.tag,
  "y": feet.y.tag,
  "z": feet.z.tag
};
console.log(window.$fxhashFeatures);
console.log(feet);

//vars related to fxhash preview call
//previewed tracks whether preview has been called
let previewed = false;

//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
//console.log("fxhash features", window.$fxhashFeatures);


//2) Initialize three.js scene and start the render loop
//all data driving geometry and materials and whatever else should be generated in step 2

//scene & camera
let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "fxCanvas";
document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 0, 5);


// controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 1.0;
controls.enableRotate = false;
controls.enablePan = true;
//controls.autoRotate = true;
controls.maxDistance = 7;
controls.minDistance = 0.1;


//shader uniforms!
let uniforms = {
  //used by both vertex and fragment
  time: { value: 1.0 },

  //vertex only

  //fragment only
  Randomise_Fractal: { value: [feet.rf.rvalue, feet.rf.fvalue]},
  x1: { value: feet.x.value },
  y1: { value: feet.y.value },
  z1: { value: feet.z.value },
  t: { value: feet.t.value },
  NUM_SIDES: { value: feet.n.value }
};

//plane geometry
const pln = new THREE.PlaneGeometry(15, 15);

//placeholder material for testing
//const material2 = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

//first shot at a shader material
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
});

//add mesh to scene <3
const mesh = new THREE.Mesh(pln, material);
mesh.rotateZ(Math.PI/2);
scene.add(mesh);


//set up resize listener and let it rip!
window.addEventListener('resize', onWindowResize);
animate();


// threejs animation stuff
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}


function animate() {

  requestAnimationFrame(animate);

  //uniforms['time'].value = performance.now() / 1000;

  //set the x|y|z uniform along a sine wave
  let seconds = performance.now() / 10000;
  if (feet.xyz == "x") {
    uniforms['x1'].value = feet.map(Math.cos(seconds), -1, 1, 1.05, 1.15);
  } else if(feet.xyz == "y") {
    uniforms['y1'].value = feet.map(Math.cos(seconds), -1, 1, 1.02, 1.08);
  } else {
    uniforms['z1'].value = feet.map(Math.cos(seconds), -1, 1, 0.95, 1.05);
  }

  

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();

}


function render() {

  renderer.render(scene, camera);

  if (previewed == false) {
    fxpreview();
    //download();
    previewed = true;
  }

}

function download() {
  var link = document.createElement('a');
  link.download = 'Kaleidoscopics.png';
  link.href = document.getElementById('fxCanvas').toDataURL()
  link.click();
}
