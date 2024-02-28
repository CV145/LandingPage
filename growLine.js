
// Scene
const scene = new THREE.Scene();

// Camera 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;           // Look from slightly in front
camera.lookAt(0, 0, 0);          // Target the center of the scene

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function growLine(start, end, seconds) {
    // Scale down the start and end points for easier visualization
    start.divideScalar(10);
    end.divideScalar(10);

    // Create a geometry for the line
    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(2 * 3); // Two points with three coordinates each (x, y, z)
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Set initial positions
    geometry.attributes.position.setXYZ(0, start.x, start.y, start.z);
    geometry.attributes.position.setXYZ(1, start.x, start.y, start.z);

    // Create material for the line
    var material = new THREE.LineBasicMaterial({ color: 0xffffff });

    // Create the line object
    var line = new THREE.Line(geometry, material);
    scene.add(line); // Assuming you have a scene variable defined

    // Calculate the vector for the line
    var vector = new THREE.Vector3().subVectors(end, start);

    // Variable to keep track of elapsed time
    var elapsedTime = 0;

    // Define animation function
    function animate() {
        if (elapsedTime < seconds) {
            elapsedTime += 1 / 60; // Assuming 60fps
            var t = elapsedTime / seconds; // Calculate the interpolation factor
            var interpolatedPosition = new THREE.Vector3().lerpVectors(start, end, t); // Interpolate position
            geometry.attributes.position.setXYZ(1, interpolatedPosition.x, interpolatedPosition.y, interpolatedPosition.z); // Move end point
            geometry.attributes.position.needsUpdate = true; // Update positions
            renderer.render(scene, camera); // Assuming you have renderer and camera defined
            requestAnimationFrame(animate); // Request next frame
        }
    }

    // Start the animation
    animate();
}






var start = new THREE.Vector3(-4, 7, 0);
var end = new THREE.Vector3(1, 1, 0);
var seconds = 1;
growLine(start, end, seconds);

