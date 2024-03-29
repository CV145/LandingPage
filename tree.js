
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
renderer.setClearColor(0x3b2b27); // Example: A shade of orange


scene.scale.set(calculateScaleFactor(), calculateScaleFactor(), 1);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Apply scaling
    scene.scale.set(calculateScaleFactor(), calculateScaleFactor(), 1);
}

window.addEventListener('resize', onWindowResize);



function calculateScaleFactor() {
    const aspect = window.innerWidth / window.innerHeight;
    const minDimension = Math.min(window.innerWidth, window.innerHeight); // Use the smaller dimension
    const scaleFactor = minDimension / 800;  // Adjust the divisor (600) as needed
    return scaleFactor;
}



function createBranch(startX, startY, length, angle) {

    const geometry = new THREE.BufferGeometry();
    const endX = startX + length * Math.cos(angle);
    const endY = startY + length * Math.sin(angle);
    const positions = new Float32Array([startX, startY, 0, startX, startY + 0.01 * length, 0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const dpr = window.devicePixelRatio || 1; // Get the DPR
    const desiredLineWidth = 2; // Your desired line width in CSS pixels
    const actualLineWidth = desiredLineWidth * dpr;

    var material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: actualLineWidth
    });
    const branch = new THREE.Line(geometry, material);
    scene.add(branch);

    growLine(new THREE.Vector3(startX, startY, 0),
        new THREE.Vector3(endX, endY, 0),
        1, // Animation duration in seconds
        function () { // onComplete for sequential growth
            if (elapsedTime() < 6) { // Modify condition
                createBranch(endX, endY, length * 0.7, angle + Math.PI / 5);
                createBranch(endX, endY, length * 0.7, angle - Math.PI / 5);
            }
        });
}

function elapsedTime() {
    if (!startTime) {
        startTime = Date.now();
    }
    return (Date.now() - startTime) / 1000; // Time in seconds
}

// Initial call - ensure startTime is reset
startTime = null;
createBranch(0, -300, 200, Math.PI / 2);
growCircle(0, 26, 30, 1.5, 5);
growCircle(-22, 20, 30, 1.5, 5);
growCircle(-31, 12, 30, 1.5, 5);
growCircle(-30, -7, 30, 1.5, 5);
growCircle(-20, 13, 30, 1.5, 5);
growCircle(-5, 17, 30, 1.5, 5);
growCircle(20, 13, 30, 1.5, 5);
growCircle(30, -7, 30, 1.5, 5);
growCircle(31, 12, 30, 1.5, 5);
growCircle(22, 20, 30, 1.5, 5);
growCircle(30, -7, 30, 1.5, 5);
growCircle(5, 17, 30, 1.5, 5);

camera.position.z = 50; // Position camera to view the tree

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();


function growCircle(x, y, radius, duration, delay) {
    const geometry = new THREE.CircleGeometry(0.1, 32); // Start with the desired radius
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const circleMesh = new THREE.Mesh(geometry, material);
    circleMesh.position.set(x, y, 0);

    const hoverExpansion = 2; // How much to expand on hover

    circleMesh.addEventListener('mouseover', () => {
        circleMesh.scale.multiplyScalar(hoverExpansion);
    });
    circleMesh.addEventListener('mouseout', () => {
        circleMesh.scale.divideScalar(hoverExpansion);
    });

    circleMesh.isCircle = true;

    scene.add(circleMesh);

    let startTime = null;
    let initialRadius = 0; // Set initial radius to 0

    function update() {
        const elapsedTime = (Date.now() - startTime) / 1000;
        let t = (elapsedTime - delay) / duration; // Subtract delay from elapsedTime
        t = Math.max(t, 0); // Ensure t is at least 0

        const currentRadius = initialRadius + t * (radius - initialRadius);
        circleMesh.scale.set(currentRadius, currentRadius, 1);

        if (t < 1) {
            requestAnimationFrame(update);
        }
    }

    setTimeout(() => {
        startTime = Date.now(); // Start the animation after the delay
        update();
    }, delay);
}


/*
Issue - Animation is tied to system frame rate
*/


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
    scene.add(line);

    material.linewidth = 18;

    // Calculate the vector for the line
    var vector = new THREE.Vector3().subVectors(end, start);

    // Variable to keep track of start time
    var startTime = performance.now();

    // Define animation function
    function animate(currentTime) {
        // Calculate elapsed time
        var elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds

        if (elapsedTime < seconds) {
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
    requestAnimationFrame(animate);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    // Filter for circles only (assuming circles have a 'isCircle' property):
    const circleIntersects = intersects.filter(obj => obj.object.isCircle);

    if (circleIntersects.length > 0) {
        const hoveredCircle = circleIntersects[0].object;
        hoveredCircle.scale.multiplyScalar(hoverExpansion);
        renderer.render(scene, camera); // Manually update the scene
    } else {
        // Reset scales of all circles (avoid multiple circles staying expanded)
        scene.children.forEach(obj => {
            if (obj.isCircle) {
                obj.scale.divideScalar(hoverExpansion);
                renderer.render(scene, camera);
            }
        });
    }
}
window.addEventListener('mousemove', onMouseMove);