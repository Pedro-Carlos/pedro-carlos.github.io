function createPhotoAndFrame(scene, photo, width, height, position, pinCount = 1, onClick = null) {
    const photoDepth = 0.001; // Slight depth to lift off the board
    const photoFrameThickness = 0.1;

    // Create Photo Plane
    const photoPlane = BABYLON.MeshBuilder.CreatePlane("photoPlane", { width: width, height: height }, scene);
    // Adjust Z position slightly to be definitely in front of the corkboard
    /*     photoPlane.position = new BABYLON.Vector3(position.x, position.y, position.z); // Position in front of corkboard's default Z=0
     */
    // photoPlane.position = position; // MODIFIED: This line is removed. photoPlane will be at local (0,0,0) of photoGroup.
    // Create Photo Material (using a placeholder texture for now)
    const photoMaterial = new BABYLON.StandardMaterial("photoMaterial", scene);
    photoMaterial.diffuseTexture = new BABYLON.Texture(photo, scene); // Placeholder
    photoMaterial.backFaceCulling = false;
    photoMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    photoMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    photoMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    photoPlane.material = photoMaterial;

    const photoFrameMaterial = new BABYLON.StandardMaterial("photoFrameMaterial", scene);
    photoFrameMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    photoFrameMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    photoFrameMaterial.specularColor = new BABYLON.Color3(1, 1, 1);

    // Create Photo Frame Material
    // Top frame piece
    const topFrame = BABYLON.MeshBuilder.CreateBox("topFrame", { width: width + photoFrameThickness * 2, height: photoFrameThickness, depth: photoDepth }, scene);
    topFrame.position = new BABYLON.Vector3(0, (height / 2) + (photoFrameThickness / 2), -photoDepth / 2);
    topFrame.material = photoFrameMaterial;

    // Bottom frame piece
    const bottomFrame = BABYLON.MeshBuilder.CreateBox("bottomFrame", { width: width + photoFrameThickness * 2, height: photoFrameThickness, depth: photoDepth }, scene);
    bottomFrame.position = new BABYLON.Vector3(0, -(height / 2) - (photoFrameThickness / 2), -photoDepth / 2);
    bottomFrame.material = photoFrameMaterial;

    // Left frame piece
    const leftFrame = BABYLON.MeshBuilder.CreateBox("leftFrame", { width: photoFrameThickness, height: height, depth: photoDepth }, scene);
    leftFrame.position = new BABYLON.Vector3(-(width / 2) - (photoFrameThickness / 2), 0, -photoDepth / 2);
    leftFrame.material = photoFrameMaterial;

    // Right frame piece
    const rightFrame = BABYLON.MeshBuilder.CreateBox("rightFrame", { width: photoFrameThickness, height: height, depth: photoDepth }, scene);
    rightFrame.position = new BABYLON.Vector3((width / 2) + (photoFrameThickness / 2), 0, -photoDepth / 2);
    rightFrame.material = photoFrameMaterial;

    // Group the corkboard and its frame
    const photoGroup = new BABYLON.TransformNode("photoGroup", scene);
    photoGroup.position = position; // ADDED: Set the main group's position
    
    // Add random tilt with triangular distribution (favors smaller angles) if pinCount is 1
    if (pinCount === 1) {
        // Single pin at top center makes the photo tilt
        const random1 = (Math.random() * 2) - 1; // Random between -1 and 1
        const random2 = (Math.random() * 2) - 1; // Random between -1 and 1
        const triangularRandom = (random1 + random2) / 2; // Average creates triangular distribution
        const randomTiltDegrees = triangularRandom * 7; // Scale to -10 to 10 degrees
        const randomTiltRadians = randomTiltDegrees * (Math.PI / 180); // Convert to radians
        photoGroup.rotation.z = randomTiltRadians;
    }

    photoPlane.parent = photoGroup;  
    topFrame.parent = photoGroup;
    bottomFrame.parent = photoGroup;
    leftFrame.parent = photoGroup;
    rightFrame.parent = photoGroup;

    // Add click functionality if onClick callback is provided
    if (onClick) {
        // Make the photo clickable by adding action manager
        photoPlane.actionManager = new BABYLON.ActionManager(scene);
        
        // Add click action with visual feedback
        photoPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function() {
            onClick();
        }));
        
        // Add hover effect for better UX
        photoPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function() {
            photoPlane.material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            scene.getEngine().getInputElement().style.cursor = "pointer";
        }));
        
        photoPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function() {
            photoPlane.material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            scene.getEngine().getInputElement().style.cursor = "default";
        }));
    }

    // Create pins to secure the photo
    const pins = [];
    const pinOffset = -0.15; // Small offset to position pins slightly in front of the photo
    
    if (pinCount === 1) {
        // Single pin at top center
        const pinPosition = new BABYLON.Vector3(
            position.x, 
            position.y + height / 2 + photoFrameThickness + 0.1, // Above the top frame
            position.z + pinOffset
        );
        const pin = createComplexPin(scene, "photoPin_center", pinPosition);
        pins.push(pin);
    } else {
        // Two pins at top corners
        const pinPositions = [
            new BABYLON.Vector3(
                position.x - width / 2.25, // Left corner (not quite at the edge thats why the adding .25)
                position.y + height / 2 + photoFrameThickness + 0.1, // Above the top frame
                position.z + pinOffset
            ),
            new BABYLON.Vector3(
                position.x + width / 2.25, // Right corner (not quite at the edge thats why the adding .25)
                position.y + height / 2 + photoFrameThickness + 0.1, // Above the top frame
                position.z + pinOffset
            )
        ];
        
        pinPositions.forEach((pinPos, index) => {
            const pin = createComplexPin(scene, `photoPin_${index}`, pinPos);
            pins.push(pin);
        });
    }

    return {
        group: photoGroup,
        width: width,
        height: height,
        frameThickness: photoFrameThickness,
        pins: pins
    };
} 