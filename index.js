import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import nebulaTexture from './nebula.jpg';
import starsTexture from "./stars.jpg";

// Constants
const COLORS = {
    white: 0xffffff,
    blue: 0x0000ff,
    yellow: 0xffff00,
};

const TEXTURES = {
    nebula: nebulaTexture,
    stars: starsTexture,
};

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const gui = new dat.GUI();
const options = {
    sphereColor: COLORS.blue,
    wireframe: false,
    speed: 0.01,
};

// Functions
function init() {
    setupRenderer();
    setupCamera();
    setupTextures();
    setupLights();
    setupGUI();
    createObjects();
    animate();
}

function setupRenderer() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
}

function setupCamera() {
    camera.position.z = 5;
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
}

function setupTextures() {
    scene.background = new THREE.CubeTextureLoader().load([
        TEXTURES.nebula,
        TEXTURES.nebula,
        TEXTURES.stars,
        TEXTURES.stars,
        TEXTURES.stars,
        TEXTURES.stars
    ]);
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(COLORS.white);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(COLORS.white, 1);
    directionalLight.position.set(-8, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const spotlight = new THREE.SpotLight(COLORS.white);
    spotlight.position.set(-100, 100, 0);
    spotlight.castShadow = true;
    scene.add(spotlight);
}

function setupGUI() {
    const guiContainer = document.createElement('div');
    guiContainer.classList.add('gui-container');
    document.body.appendChild(guiContainer);
    guiContainer.appendChild(gui.domElement);
}

function createObjects() {
    const cube = createCube();
    const cube2 = createCube(3, 3, 3, TEXTURES.nebula);
    const sphere = createSphere();
    const plane = createPlane();
    scene.add(cube, cube2, sphere, plane);
}

function createCube(x = 0, y = 0, z = 0, texture = TEXTURES.stars) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(texture) });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    return cube;
}

function createSphere() {
    const geometry = new THREE.SphereGeometry(2, 25, 25);
    const material = new THREE.MeshBasicMaterial({ color: options.sphereColor, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(-4, 4, 4);
    sphere.castShadow = true;
    return sphere;
}

function createPlane() {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshLambertMaterial({ color: COLORS.white, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.y = -2;
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    return plane;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    const sphere = scene.getObjectByName('sphere');
    if (sphere) {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        sphere.position.y = 4 * Math.sin(options.speed);
    }
}

init();
