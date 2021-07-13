import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// console.log(THREE.PerspectiveCamera);

//Texture
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

//Debugger
const gui = new dat.GUI();

//Cursor
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

//Scene
const scene = new THREE.Scene();

//Objects
//Particles
// const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const particleGeometry = new THREE.BufferGeometry();
const count = 20000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; ++i) {
	positions[i] = (Math.random() - 0.5) * 10;
	colors[i] = Math.random();
}

particleGeometry.setAttribute(
	"position",
	new THREE.BufferAttribute(positions, 3)
);

particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
	size: 0.1,
	sizeAttenuation: true,
	// color: "#ff88cc",
	transparent: true,
	alphaMap: particleTexture,
	// alphaTest: 0.001,
	// depthTest: false,
	depthWrite: false,
	blending: THREE.AdditiveBlending,
	vertexColors: true,
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

//Lights

//sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	//Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	//Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	//Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

//Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	1,
	100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
// camera.lookAt(mesh.position);
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	// canvas: canvas
	canvas,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// //Clock
const clock = new THREE.Clock();

//Animation
const tick = () => {
	//clock sec
	const elapsedTime = clock.getElapsedTime();

	//Update particles
	// particles.rotation.y = elapsedTime * 0.2;
	// particles.position.y = -elapsedTime * 0.02;
	for (let i = 0; i < count; ++i) {
		const i3 = i * 3; //i3 toh varible ka name h or kuch nhi
		const x = particleGeometry.attributes.position.array[i3 + 0];
		particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
	}

	particleGeometry.attributes.position.needsUpdate = true;

	//Update Objects

	//Update controls
	controls.update();

	//Renderer
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
