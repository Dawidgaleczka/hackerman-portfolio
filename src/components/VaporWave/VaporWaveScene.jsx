import * as THREE from "three";
import { useEffect } from "react";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

const TEXTURES = {
    grid: "/textures/grid.png",
    displacement: "/textures/displacement.png",
    metalness: "/textures/metalness.png",
};

const VaporWaveScene = ({ canvasRef, sceneRef, cameraRef, rendererRef }) => {
    useEffect(() => {
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.Fog("#000000", 1, 2.5);

        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(TEXTURES.grid),
            displacementMap: textureLoader.load(TEXTURES.displacement),
            metalnessMap: textureLoader.load(TEXTURES.metalness),
            displacementScale: 0,
            metalness: 0,
            roughness: 0.5,
        });

        const createPlane = (z) => {
            const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 2, 24, 24), material);
            plane.rotation.x = -Math.PI * 0.5;
            plane.position.set(0, 0, z);
            scene.add(plane);
            return plane;
        };

        const plane1 = createPlane(0.15);
        const plane2 = createPlane(-1.85);

        const ambientLight = new THREE.AmbientLight("#00FF00", 1.5);
        scene.add(ambientLight);

        const sizes = { width: window.innerWidth, height: window.innerHeight };
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 20);
        camera.position.set(0, 0.56, -0.2);
        camera.rotation.x = -Math.PI / 2;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        const effectComposer = new EffectComposer(renderer);
        effectComposer.addPass(new RenderPass(scene, camera));
        effectComposer.addPass(new ShaderPass(RGBShiftShader));
        effectComposer.addPass(new ShaderPass(GammaCorrectionShader));

        window.addEventListener("resize", () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            effectComposer.setSize(sizes.width, sizes.height);
        });

        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY - window.innerHeight;
            if (scrollY < 0) return;
            const scrollProgress = Math.min(scrollY / window.innerHeight, 2);
            const planeWidth = 0.1 + Math.min(scrollProgress, 1) * 0.9;
            plane1.geometry = new THREE.PlaneGeometry(planeWidth, 2, 24, 24);
            plane2.geometry = new THREE.PlaneGeometry(planeWidth, 2, 24, 24);
            ambientLight.intensity = 1.5 + scrollProgress * 3.5;
            material.metalness = scrollProgress * 0.96;
            material.displacementScale = scrollProgress * 0.4;
            camera.position.y = 0.56 - scrollProgress * 0.5;
            camera.rotation.x = -Math.PI / 2 + scrollProgress * (Math.PI / 2);
            camera.position.z = 0.05 + scrollProgress * 1.05;
            renderer.domElement.style.opacity = Math.min(scrollProgress, 1);
        });

        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            plane1.position.z = (elapsedTime * 0.15) % 2;
            plane2.position.z = ((elapsedTime * 0.15) % 2) - 2;
            effectComposer.render();
        };
        animate();
    }, []);

    return <canvas ref={canvasRef} className="webgl" />;
};

export default VaporWaveScene;
