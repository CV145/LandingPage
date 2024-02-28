
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


var start = new THREE.Vector3(0, 15, 0);
var end = new THREE.Vector3(0, 10, 0);
var seconds = 2;

growLine(start, end, seconds, function () {
    // Callback function to be executed after growLine animation completes
    generate2Branches(0, end.y * 10, 3 * Math.PI / 2, 3, false, 5);
});



function generate2Branches(x, y, angle, depth, isEndpoint, length) {
    // Base case: If depth is 0 or isEndpoint is true, stop recursion
    if (depth === 0 || isEndpoint) {
        return;
    }

    // Define the angle between the branches
    var angleBetweenBranches = Math.PI / 2; // Adjust this angle as desired

    // Calculate endpoints for two branches
    var branch1End = new THREE.Vector3(x + Math.cos(angle + angleBetweenBranches / 2) * length, y + Math.sin(angle + angleBetweenBranches / 2) * length, 0);
    var branch2End = new THREE.Vector3(x + Math.cos(angle - angleBetweenBranches / 2) * length, y + Math.sin(angle - angleBetweenBranches / 2) * length, 0);

    // Draw and animate the lines
    growLine(new THREE.Vector3(x, y, 0), branch1End, 1);
    growLine(new THREE.Vector3(x, y, 0), branch2End, 1);

    // Schedule the next generation of branches after the animation finishes
    setTimeout(function () {
        // Recursive call for the next generation of branches
        generate2Branches(branch1End.x, branch1End.y, angle - Math.PI / 8, depth - 1, depth - 1 === 0, length);
        generate2Branches(branch2End.x, branch2End.y, angle + Math.PI / 8, depth - 1, depth - 1 === 0, length);
    }, 1000); // Adjust the delay as needed
}

