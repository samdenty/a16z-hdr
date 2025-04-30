import "./styles.css";
import * as THREE from "three";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);
camera.position.y = -0.2;
camera.position.z = 2.2;

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
});

renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const texture = new THREE.TextureLoader().load("background.png");
texture.colorSpace = THREE.SRGBColorSpace;
scene.background = texture;

const contrastLight = new THREE.PointLight("#8a4f13", 5, 10, 1);
contrastLight.position.set(0, 0, -0.3);
scene.add(contrastLight);

const highlight = new THREE.PointLight("#eccc91", 3, 10, 1);
highlight.position.set(0, 0, -0.2);
scene.add(highlight);

const light = new THREE.PointLight("#eccc91", 100, 6, 3.1);
light.position.set(0, 0, 2.57);
scene.add(light);

document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

(async () => {
	const gtlf: any = await new Promise((resolve) =>
		loader.load("/a16z_medallion.glb", resolve),
	);
	scene.add(gtlf.scene);

	let mouseX = 0;
	let mouseY = 0;

	window.addEventListener("mousemove", (e) => {
		mouseX = (e.clientX / window.innerWidth) * 2 - 1;
		mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
	});

	let angle = 0;
	const radius = 0.3;

	function updateLightPositions() {
		angle += 0.02;
		const x = mouseX + Math.cos(angle) * radius;
		const y = mouseY + Math.sin(angle) * radius;
		light.position.x = x;
		light.position.y = y;
		highlight.position.x = x;
		highlight.position.y = y;
		contrastLight.position.x = x;
		contrastLight.position.y = y;

		gtlf.scene.rotation.x = x / 4;
		gtlf.scene.rotation.y = y / 4;
	}

	setInterval(updateLightPositions, 16);

	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}

	animate();

	requestAnimationFrame(() => {
		// Create HDR toggle checkbox
		const hdrToggle = document.createElement("div");
		hdrToggle.style.cssText = `
              position: fixed;
              top: 74px;
              left: 10px;
              cursor: pointer;
              z-index: 100;
              color: #fff;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 12px;
              background: rgba(0,0,0,0.65);
              border: 1px solid #fff;
              padding: 6px 10px;
              border-radius: 3px;
              display: flex;
              align-items: center;
              gap: 6px;
      `;

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.id = "hdr-toggle";
		checkbox.style.cssText = `
              cursor: pointer;
              margin: 0;
      `;
		checkbox.checked = true;

		const label = document.createElement("label");
		label.htmlFor = "hdr-toggle";
		label.textContent = "Toggle HDR";
		label.style.cssText = `
              cursor: pointer;
              user-select: none;
      `;

		checkbox.addEventListener("change", function () {
			document.body.classList.toggle("disable-hdr", !this.checked);
		});

		hdrToggle.appendChild(checkbox);
		hdrToggle.appendChild(label);
		document.body.appendChild(hdrToggle);
	});
})();
