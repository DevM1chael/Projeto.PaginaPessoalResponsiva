let scene, camera, renderer, group;

function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function initThreeScene(containerId) {
    if (!isWebGLAvailable()) {
        console.warn("WebGL is not supported by this browser.");
        return false;
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found');
        return false;
    }

    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
        console.error("Failed to initialize WebGLRenderer", e);
        return false;
    }
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.DodecahedronGeometry(2, 0); 

    const material = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 0.7,
        roughness: 0.3,
        wireframe: true,
        wireframeLinewidth: 1.5,
    });
    const dodecahedron = new THREE.Mesh(geometry, material);
    group.add(dodecahedron);

    const pointsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.05,
        sizeAttenuation: true
    });
    const points = new THREE.Points(geometry, pointsMaterial);
    group.add(points);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xD4AF37, 0.8);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    window.addEventListener('resize', onWindowResize, false);
    animate();

    return group;
}

function onWindowResize() {
    const container = document.getElementById('webgl-container');
    if (container && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (renderer) {
        renderer.render(scene, camera);
    }
}

export { initThreeScene };
