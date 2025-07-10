function createLabel(text, scene, position, width = 2, height = 1, pinCount = 1, fontSize = 120, camera = null) {
    // Create a plane mesh to serve as the background for the button
    const buttonPlane = BABYLON.MeshBuilder.CreatePlane("buttonPlane", { width: width, height: height }, scene);
    buttonPlane.position = position;
    
    // Add random tilt with triangular distribution (favors smaller angles)
    // Generate two random values and average them for triangular distribution
    if (pinCount === 1) {
        const random1 = (Math.random() * 2) - 1; // Random between -1 and 1
        const random2 = (Math.random() * 2) - 1; // Random between -1 and 1
        const triangularRandom = (random1 + random2) / 2; // Average creates triangular distribution
        const randomTiltDegrees = triangularRandom * 10; // Scale to -10 to 10 degrees
        const randomTiltRadians = randomTiltDegrees * (Math.PI / 180); // Convert to radians
        buttonPlane.rotation.z = randomTiltRadians;
    }
    // Add a material to the plane for the label
    const planeMaterial = new BABYLON.StandardMaterial("planeMaterial", scene);
    planeMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // White color
    planeMaterial.alpha = 1.0; // Fully opaque
    planeMaterial.hasAlpha = false; // Disable alpha blending
    buttonPlane.material = planeMaterial;

    // Create an AdvancedDynamicTexture for the plane
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(buttonPlane, 1024, 512);
    
    // Create a background rectangle to ensure solid white
    const rect = new BABYLON.GUI.Rectangle();
    rect.width = width;
    rect.height = height;
    rect.color = "transparent";
    rect.background = "white";
    rect.thickness = 0;
    advancedTexture.addControl(rect);
    
    // Create a simple TextBlock with default font first
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = "#000000";
    textBlock.fontSize = fontSize; // Adjusted size for handwriting font
    textBlock.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
    textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    
    // Add slight random rotation to the text block for more handwritten feel
    const randomRotation = (Math.random() * 0.05) - 0.025; // Small random rotation between -0.025 and 0.025 radians
    textBlock.rotation = randomRotation;
    
    // Add a slight shadow to the text for depth
    textBlock.shadow = true;
    textBlock.shadowColor = "rgba(0, 0, 0, 1)";
    textBlock.shadowOffsetX = 1;
    textBlock.shadowOffsetY = 1;
    textBlock.shadowBlur = 2;
    
    // Add the text to the texture
    advancedTexture.addControl(textBlock);
    
    // Create pins to secure the label
    const pins = [];
    const pinOffset = -0.15;
    
    if (pinCount === 1) {
        // Single pin at top center
        const pinPosition = new BABYLON.Vector3(
            position.x, 
            position.y + height / 2 + 0.2, // Slightly above the top edge
            position.z + pinOffset
        );
        const pin = createComplexPin(scene, "labelPin_center", pinPosition);
        pins.push(pin);
    } else {
        // Two pins at top corners
        const pinPositions = [
            new BABYLON.Vector3(
                position.x - width / 2.25, // Left corner (not quite at the edge)
                position.y + height / 2 + 0.2,
                position.z + pinOffset
            ),
            new BABYLON.Vector3(
                position.x + width / 2.25, // Right corner (not quite at the edge)
                position.y + height / 2 + 0.2,
                position.z + pinOffset
            )
        ];
        
        pinPositions.forEach((pinPos, index) => {
            const pin = createComplexPin(scene, `labelPin_${index}`, pinPos);
            pins.push(pin);
        });
    }
    

    // Use FontFaceObserver to ensure the font is loaded before applying it
    const fontFamily = 'Playwrite HU';
    const font = new FontFaceObserver(fontFamily);
    
    // Apply the font when it's loaded
    font.load().then(() => {
        console.log(`Font '${fontFamily}' loaded successfully`);
        
        // Apply the font to the text block
        textBlock.fontFamily = `'${fontFamily}', cursive`;
        textBlock.fontWeight = "300"; // Using weight 300 for a natural handwritten look
        
        // Force a refresh of the texture
        advancedTexture.markAsDirty();
    }).catch(err => {
        console.warn(`Font '${fontFamily}' could not be loaded:`, err);
    });
    
    // Create label object for zoom functionality
    const labelObject = { 
        buttonPlane: buttonPlane, 
        textBlock: textBlock, 
        pins: pins
    };

    // Add zoom functionality if camera is provided
    if (camera) {
        const zoomToObject = createZoomToObject(camera, scene);
        
        // Add action manager for click handling
        buttonPlane.actionManager = new BABYLON.ActionManager(scene);
        
        // Add click action for zoom
        buttonPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger, 
            () => zoomToObject(labelObject, 30)
        ));
        
        // Add hover effects
        buttonPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger, 
            function() {
                planeMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
                scene.getEngine().getInputElement().style.cursor = "pointer";
            }
        ));
        
        buttonPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger, 
            function() {
                planeMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
                scene.getEngine().getInputElement().style.cursor = "default";
            }
        ));
    }

    // Return the plane, text block, and pins
    return labelObject;
}