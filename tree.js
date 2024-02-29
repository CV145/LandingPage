
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createBranch(startX, startY, length, angle) {
    const geometry = new THREE.BufferGeometry();
    const endX = startX + length * Math.cos(angle);
    const endY = startY + length * Math.sin(angle);
    const positions = new Float32Array([startX, startY, 0, startX, startY + 0.01 * length, 0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const branch = new THREE.Line(geometry, material);
    scene.add(branch);

    growLine(new THREE.Vector3(startX, startY, 0),
        new THREE.Vector3(endX, endY, 0),
        1, // Animation duration in seconds
        function () { // onComplete for sequential growth
            if (length > 10) {
                createBranch(endX, endY, length * 0.7, angle + Math.PI / 5);
                createBranch(endX, endY, length * 0.7, angle - Math.PI / 5);
            }
        });
}

// Initial call to start the tree
createBranch(0, 0, 100, 0);

camera.position.z = 300; // Position camera to view the tree

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();


function growLine(start, end, seconds, onComplete) {
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
    var material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 8 });

    // Create the line object
    var line = new THREE.Line(geometry, material);
    scene.add(line); // Assuming you have a scene variable defined

    material.linewidth = 18;

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
        } else {
            // Animation complete, execute the onComplete callback
            if (onComplete) {
                onComplete();
            }
        }
    }

    // Start the animation
    animate();
}