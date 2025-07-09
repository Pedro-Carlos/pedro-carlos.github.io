// Using createComplexPin from objects/pin.js instead


/**
 * Creates a physics-enabled rope between two pin objects using RopeImpostor.
 * @param {BABYLON.TransformNode} pinA - The first pin pivot node to connect.
 * @param {BABYLON.TransformNode} pinB - The second pin pivot node to connect.
 * @param {BABYLON.Scene} scene - The Babylon.js scene.
 * @param {object} [options] - Optional parameters for the rope.
 * @param {BABYLON.Color3} [options.color] - Color of the rope.
 * @returns {BABYLON.Mesh} The created rope mesh with physics.
 */
function connectPinsWithRope(pinA, pinB, scene, options = {}) {
    const color = options.color || new BABYLON.Color3(0.8, 0.1, 0.1); // Default reddish color

    // Get the actual pin meshes (which have physics impostors) from the pivot nodes
    const pinMeshA = pinA.pinMesh || pinA;
    const pinMeshB = pinB.pinMesh || pinB;

    // Ensure pins have physics impostors
    if (!pinMeshA.physicsImpostor) {
        console.warn(`Pin ${pinA.name} does not have a physics impostor. Rope will not attach correctly.`);
        pinMeshA.physicsImpostor = new BABYLON.PhysicsImpostor(pinMeshA, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    }
    if (!pinMeshB.physicsImpostor) {
        console.warn(`Pin ${pinB.name} does not have a physics impostor. Rope will not attach correctly.`);
        pinMeshB.physicsImpostor = new BABYLON.PhysicsImpostor(pinMeshB, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
    }

    const pinAPosition = pinMeshA.getAbsolutePosition();
    const pinBPosition = pinMeshB.getAbsolutePosition();

    // To attach the rope to the middle of the pin
    pinAPosition.y = pinAPosition.y - 0.2;
    pinBPosition.y = pinBPosition.y - 0.2;

    // Define the number of segments for the rope
    const ropeSegments = 15; // More segments = smoother curve, more computation
    const ropePathPoints = [];

    // Calculate points along the path from pin to pin
    for (let j = 0; j <= ropeSegments; j++) {
        const t = j / ropeSegments; // Interpolation factor (0 to 1)
        // Interpolate between the pins
        ropePathPoints.push(BABYLON.Vector3.Lerp(pinAPosition, pinBPosition, t));
    }

    // Create the visual line mesh for the rope using the calculated points
    const ropeName = `rope_${pinA.name}_to_${pinB.name}`;
    const ropeMesh = BABYLON.MeshBuilder.CreateLines(ropeName, {
        points: ropePathPoints,
        updatable: true
    }, scene);
    ropeMesh.color = color;

    // Apply RopeImpostor physics
    // fixedPoints: 3 means fix the start (index 0) and end (last index) vertices
    ropeMesh.physicsImpostor = new BABYLON.PhysicsImpostor(ropeMesh, BABYLON.PhysicsImpostor.RopeImpostor, {
        mass: 0.1, // Give the rope some mass
        fixedPoints: 3,
        // Optional: Adjust friction/restitution if needed
        friction: 0.2,
        restitution: 0.1
    }, scene);
    
    // Adjust physics properties for stability and appearance
    ropeMesh.physicsImpostor.velocityIterations = 10; // Default is usually okay
    ropeMesh.physicsImpostor.positionIterations = 10; // Default is usually okay
    ropeMesh.physicsImpostor.stiffness = 0.8; // Controls how much the rope resists stretching

    // Store references for compatibility with existing code
    ropeMesh.pinA = pinA;
    ropeMesh.pinB = pinB;

    return ropeMesh;
}

