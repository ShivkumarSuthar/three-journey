import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import nebula from './nebula.jpg';
import stars from "./stars.jpg";
//creating scene
const scene = new THREE.Scene();

//creting camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) //FOV. ratio, near, far

//creative renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true;

// setting up the bgColor
// renderer.setClearColor(0XFFEA00)

//texture loader
const texture = new THREE.TextureLoader();
scene.background = texture.load(stars)

//cubeTexture loader
const cubeTexture = new THREE.CubeTextureLoader();
scene.background = cubeTexture.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars
])

//geometry for axehelper 
const axeHelper = new THREE.AxesHelper(5)
scene.add(axeHelper)

//Geometry for cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00,
    map:texture.load(stars) 
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube)

//Geometry for another cube
const geometry2=new THREE.BoxGeometry(3,3,3);
const material2=new THREE.MeshBasicMaterial({
    // color:0x00ff00,
map:texture.load(nebula)
});
const cube2=new THREE.Mesh(geometry2,material2);
scene.add(cube2)
cube2.position.set(0,3,-5)

//geometry for sphere
const sphereGeometry = new THREE.SphereGeometry(2, 25, 25)
const sphereMaterial = new THREE.MeshBasicMaterial( // using different mess materials basic,standard and many more..
    {
        color: 0xe3ff,
        wireframe: true,

    })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-4, 4, 4) //changing position
sphere.castShadow = true;
scene.add(sphere)

//dat-gui
const gui = new dat.GUI();
const options = {
    sphereColor: 0x0000ff,
    wireframe: false,
    speed: 0.01
};


//choosing color for spheres
gui.addColor(options, 'sphereColor').onChange((color) => {
    // Convert color to hexadecimal format if it's a string
    if (typeof color === 'string') {
        color = color.replace('#', '0x');
        color = parseInt(color, 16);
    }
    sphere.material.color.set(color);
});

//chossing wireframes
gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
})

let time = 0;
const speed = 0.02;
// const amplitude =2;



//changing speed using dat-gui
gui.add(options, 'speed', 0, 0.01)

//Geometry for planeGeometry
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshLambertMaterial(
    {
        color: 0xffffff,
        side: THREE.DoubleSide
    });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane)
plane.receiveShadow = true;
//grid helper
const gridHelper = new THREE.GridHelper(20);
plane.rotation.x = Math.PI / 2 // Rotate the grid to be horizontal
scene.add(gridHelper);

//controls 
const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.z = 5;
// camera.position.set(0,2,5);
orbit.update()


//adding ambient light
const ambientLight = new THREE.AmbientLight(0XFFFFFF);
// scene.add(ambientLight)

//adding direction light
const directionalLight = new THREE.DirectionalLight(0XFFFFFF, 1);
scene.add(directionalLight)
directionalLight.position.set(-8, 10, 10)
directionalLight.castShadow = true;

//driectional light camera helper
const directionLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionLightCameraHelper)

//directional light helper
const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalHelper)

//spotlight 
const spotlight = new THREE.SpotLight(0xfffffff);
spotlight.position.set(-100, 100, 0)
scene.add(spotlight)
spotlight.castShadow = true;
//spotlight helper
const spotLightHelper = new THREE.SpotLightHelper(spotlight)
// scene.add(spotLightHelper)

//adding fog 
scene.fog = new THREE.Fog(0XFFFFFF, 0, 50)



function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Update sphere's position for bouncing effect
    time += options.speed;
    sphere.position.y = 4 * Math.sin(time);

}

animate();