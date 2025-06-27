function createPinsAndStrings(scene, count, corkboardInfo, photoInfo) {
    // Ensure Ammo.js plugin is enabled
    if (!scene.getPhysicsEngine()?.getPhysicsPlugin().name.includes("Ammo")) {
        console.warn("AmmoJSPlugin is required for soft body ropes. Strings will not be created.");
        return { pins: [], strings: [], updateStrings: () => {} };
    }

    const pins = [];
    const ropes = []; // Changed from strings to ropes

    // Material for the pins
    const pinMaterial = new BABYLON.StandardMaterial("pinMaterial", scene);
    pinMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red pins
    pinMaterial.specularColor = new BABYLON.Color3(0.5, 0.2, 0.2);

    // Get photo group
    const photoGroup = photoInfo.group;

    const corkboardWidth = corkboardInfo.width;
    const corkboardHeight = corkboardInfo.height;
    const corkboardDepthOffset = -corkboardInfo.depth / 2;
    const pinHeight = 0.2;

    // --- Create the central pin below the photo ---
    const photoPinSpacing = 0.2; // Spacing below the photo
    const photoCenterAbsolute = photoGroup.getAbsolutePosition(); // Get current world center of the photo

    // Calculate initial position for the photoPin
    const initialPhotoPinPosition = new BABYLON.Vector3(
        photoCenterAbsolute.x,
        photoCenterAbsolute.y - (photoInfo.height / 2) - photoPinSpacing ,
        corkboardDepthOffset - pinHeight / 2 - 0.01 // Consistent Z with other pins
    );

    // Create the central "photo pin" using the new function
    const photoPin = createPin(scene, "photoPin", initialPhotoPinPosition, pinMaterial);
    pins.push(photoPin); // Add to the main pins array


    // Calculate photo bounds relative to the center (assuming photo group starts at 0,0)
    const photoMinX = -photoInfo.width / 2;
    const photoMaxX = photoInfo.width / 2;
    const photoMinY = -photoInfo.height / 2;
    const photoMaxY = photoInfo.height / 2;

    for (let i = 0; i < count; i++) {
        // --- Pin Creation (mostly unchanged) ---
        let randomX, randomY, isInsidePhoto;
        do {
             randomX = (Math.random() - 0.5) * (corkboardWidth * 0.9);
             randomY = -corkboardHeight / 4 + (Math.random() - 0.5) * (corkboardHeight * 0.45); // Pins from middle to bottom
             // Check if the generated position is inside the photo area
             isInsidePhoto = (randomX >= photoMinX && randomX <= photoMaxX &&
                              randomY >= photoMinY  && randomY <= photoMaxY);
        } while (isInsidePhoto); // Keep trying until the position is outside the photo

        const pinPosition = new BABYLON.Vector3(randomX, randomY, corkboardDepthOffset - pinHeight / 2 - 0.01);

        // Create pin using the new function
        const pin = createPin(scene, `pin_${i}`, pinPosition, pinMaterial);
        pins.push(pin);

        // --- Create Rope using RopeImpostor ---
        const pinAttachPoint = pin.position.clone(); // Use the current pin's position
        const photoPinTargetPoint = photoPin.position.clone(); // Target the photoPin's position

        // Define the number of segments for the rope
        const ropeSegments = 15; // More segments = smoother curve, more computation
        const ropePathPoints = [];

        // Calculate points along the path from pin to anchor
        for (let j = 0; j <= ropeSegments; j++) {
            const t = j / ropeSegments; // Interpolation factor (0 to 1)
            // Interpolate between the pin and the photoPin
            ropePathPoints.push(BABYLON.Vector3.Lerp(pinAttachPoint, photoPinTargetPoint, t));
        }


        // Create the visual line mesh for the rope using the calculated points
        const ropeMesh = BABYLON.MeshBuilder.CreateLines(`rope_pin_to_photo_${i}`, { // Unique name
            points: ropePathPoints, // Use the array of points
            updatable: true
        }, scene);
        ropeMesh.color = new BABYLON.Color3(0.8, 0.1, 0.1); // Reddish color

        // Apply RopeImpostor physics
        // fixedPoints: 3 means fix the start (index 0) and end (last index) vertices
        ropeMesh.physicsImpostor = new BABYLON.PhysicsImpostor(ropeMesh, BABYLON.PhysicsImpostor.RopeImpostor, {
             mass: 0.1, // Give the rope some mass
             fixedPoints: 3,
             // Optional: Adjust friction/restitution if needed
             // friction: 0.2,
             // restitution: 0.2
            }, scene);
        // Adjust physics properties for stability and appearance
        ropeMesh.physicsImpostor.velocityIterations = 10; // Default is usually okay
        ropeMesh.physicsImpostor.positionIterations = 10; // Default is usually okay
        ropeMesh.physicsImpostor.stiffness = 0.8; // Controls how much the rope resists stretching

        ropes.push(ropeMesh);


    }

    function updateCentralPinPosition() {
        const currentPhotoCenter = photoGroup.getAbsolutePosition();
        photoPin.position.x = currentPhotoCenter.x;
        photoPin.position.y = currentPhotoCenter.y - (photoInfo.height / 2) - photoPinSpacing;
    }

    return { pins, strings: ropes, updateStrings: updateCentralPinPosition }; // Keep API similar, return ropes as 'strings'
}

