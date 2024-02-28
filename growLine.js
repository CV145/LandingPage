
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
    var material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 8 });

    // Create the line object
    var line = new THREE.Line(geometry, material);
    scene.add(line); // Assuming you have a scene variable defined

    material.linewidth = 8;

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
var end = new THREE.Vector3(0, 13, 0);
var seconds = 1;

growLine(start, end, seconds, function () {
    // Callback function to be executed after growLine animation completes
    generate2Branches(0, end.y * 10, 3 * Math.PI / 2, 3, false, 5);
    //buildTree(scene, 0, 10, 10, 0.5, 3, Math.PI / 4, 0.7, 3);
});


function buildTree(scene, x, y, trunkLength, trunkThickness, numBranches, branchAngle, branchLengthFactor, branchDepth) {
    // Base case: If branch depth is 0, stop recursion
    if (branchDepth === 0) {
        return;
    }

    // Draw and animate the trunk line
    var trunkEnd = new THREE.Vector3(x, y - trunkLength, 0);
    growLine(new THREE.Vector3(x, y, 0), trunkEnd, 1, scene, trunkThickness);

    // Generate random angles for branches
    var angles = [];
    for (var i = 0; i < numBranches; i++) {
        angles.push((i / numBranches) * branchAngle - (branchAngle / 2)); // Random angle in range [-branchAngle/2, branchAngle/2]
    }

    // Generate branches
    for (var i = 0; i < numBranches; i++) {
        var angle = angles[i];
        var branchEndX = x + Math.cos(angle) * trunkLength * branchLengthFactor;
        var branchEndY = y - trunkLength * branchLengthFactor;
        var branchLength = trunkLength * branchLengthFactor;
        var branchThickness = trunkThickness * 0.7; // Adjust thickness as desired
        buildTree(scene, branchEndX, branchEndY, branchLength, branchThickness, numBranches, branchAngle, branchLengthFactor, branchDepth - 1);
    }
}


function generate2Branches(x, y, angle, depth, isEndpoint, length) {
    // Base case: If depth is 0 or isEndpoint is true, stop recursion
    if (depth === 0 || isEndpoint) {
        return;
    }

    // Define the angle between the branches with slight variation
    var angleVariation = (Math.random() - 0.5) * Math.PI / 6; // Angle variation range [-PI/12, PI/12]
    var angleBetweenBranches = Math.PI / 2 + angleVariation;

    // Calculate slight variations in branch lengths
    var lengthVariation = length * 0.5; // 50% variation
    var branchLength1 = length + (Math.random() - 0.5) * lengthVariation;
    var branchLength2 = length + (Math.random() - 0.5) * lengthVariation;

    // Calculate endpoints for two branches with slightly tilted angles and different lengths
    var branch1End = new THREE.Vector3(x + Math.cos(angle + angleBetweenBranches / 2) * branchLength1, y + Math.sin(angle + angleBetweenBranches / 2) * branchLength1, 0);
    var branch2End = new THREE.Vector3(x + Math.cos(angle - angleBetweenBranches / 2) * branchLength2, y + Math.sin(angle - angleBetweenBranches / 2) * branchLength2, 0);

    // Draw and animate the lines
    growLine(new THREE.Vector3(x, y, 0), branch1End, 1);
    growLine(new THREE.Vector3(x, y, 0), branch2End, 1);

    // Schedule the next generation of branches after the animation finishes
    setTimeout(function () {
        // Recursive call for the next generation of branches
        generate2Branches(branch1End.x * 10, branch1End.y * 10, angle + angleVariation, depth - 1, depth - 1 === 0, length);
        generate2Branches(branch2End.x * 10, branch2End.y * 10, angle - angleVariation, depth - 1, depth - 1 === 0, length);
    }, 1000); // Adjust the delay as needed
}



