
let scene, camera, renderer;
const branchEndpoints = []; // Array to store branch endpoints
// Using GSAP for animation 
const animationTween = gsap.to({ growthFactor: 1 }, { duration: 2, ease: 'power2.out' });

function init() {
    scene = new THREE.Scene();
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-50 * aspectRatio, 50 * aspectRatio, 50, -50, 1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Draw the hanging line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 50, 0),
        new THREE.Vector3(0, 20, 0)
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White line
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    // Tree Generation 
    const branchMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    generateBranch(new THREE.Vector3(0, 30, 0), 30, -Math.PI / 2, 4, 0);
}


function animate() {
    requestAnimationFrame(animate);

    if (animationTween.isActive()) {
        scene.traverse(object => {
            if (object.isLine) object.geometry.needsUpdate = true;
        });
    }

    renderer.render(scene, camera);
}


const branchMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: 2 });

// Recursive Branch Generation Function
function generateBranch(startPoint, length, angle, thickness, recursionDepth = 0, growthFactor = 0) {
    const endPoint = startPoint.clone().add(
        new THREE.Vector3(length * Math.cos(angle), length * Math.sin(angle), 0)
    );

    const branchGeometry = new THREE.BufferGeometry().setFromPoints([
        startPoint,
        endPoint.clone().multiplyScalar(growthFactor) // Apply growthFactor
    ]);
    const branchMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, linewidth: thickness });
    const branch = new THREE.Line(branchGeometry, branchMaterial);
    scene.add(branch);

    if (recursionDepth < 4) { // Adjust the limit as needed
        const angleSpread = Math.PI / 5; // Controls angle variation
        for (let i = 0; i < 2; i++) {
            const branchAngleOffset = angleSpread * (i - 0.5); // Center around main angle
            const newAngle = angle + branchAngleOffset;
            const newLength = length * 0.8 * (0.7 + Math.random() * 0.3); // Length with randomness
            const newThickness = thickness * 0.8;

            generateBranch(endPoint.clone(), newLength, newAngle, newThickness, recursionDepth + 1, growthFactor);
        }
    }
}





init();
animate();