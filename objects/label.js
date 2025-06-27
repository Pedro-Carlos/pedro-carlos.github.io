function createLabel(text, scene, position, width = 2, height = 0.8) {
    // Create a plane mesh to serve as the background for the button
    const buttonPlane = BABYLON.MeshBuilder.CreatePlane("buttonPlane", { width: width, height: height }, scene);
    buttonPlane.position = position;

    // Create the tape effect for top left corner with torn edges
    const createTornTape = (name, posX, posY, isLeft) => {
        // Base dimensions for tape
        const tapeWidth = Math.sqrt(width * width + height * height) * 0.3; // 20% of diagonal length
        const tapeHeight = height * 0.3;
        
        // Create a custom shape for torn tape with irregular edges on all sides
        const tape = new BABYLON.MeshBuilder.CreateRibbon(name, {
            pathArray: createTornTapePath(tapeWidth, tapeHeight, 12, isLeft), // More points for more irregularity
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, scene);
        
        // Position the tape
        tape.position = new BABYLON.Vector3(
            posX, 
            posY, 
            position.z + 0.005
        );
        
        // Rotate the tape to be diagonal
        tape.rotation.z = Math.PI / 4;
        
        return tape;
    };
    
    // Function to create points for a torn tape path with irregular left/right edges
    function createTornTapePath(width, height, segments, isLeft) {
        const paths = [];
        const path = [];
        
        // Create points with varied randomness for an authentic torn look
        // Left edge (with greater irregularity for torn look)
        const leftVariationFactor = isLeft ? 0.15 : 0.1; // More pronounced for left tape
        const leftEdgeYStart = height/2;
        const leftEdgeYEnd = -height/2;
        const leftEdgeYStep = (leftEdgeYEnd - leftEdgeYStart) / Math.floor(segments / 3);
        
        for (let i = 0; i < Math.floor(segments / 3); i++) {
            const y = leftEdgeYStart + i * leftEdgeYStep;
            // More pronounced randomness for left edge
            const xVariation = Math.random() * leftVariationFactor - (leftVariationFactor / 2);
            path.push(new BABYLON.Vector3(-width/2 + xVariation, y, 0));
        }
        
        // Top edge with random variations
        for (let i = 0; i <= Math.floor(segments / 3); i++) {
            const xPos = -width/2 + (width * i / Math.floor(segments / 3));
            // Add randomness to y position for top edge
            const yVariation = (i > 0 && i < Math.floor(segments / 3)) ? (Math.random() * 0.07 - 0.035) : 0;
            path.push(new BABYLON.Vector3(xPos, height/2 + yVariation, 0));
        }
        
        // Right edge with irregularity
        const rightVariationFactor = isLeft ? 0.1 : 0.15; // More pronounced for right tape
        const rightEdgeYStart = height/2;
        const rightEdgeYEnd = -height/2;
        const rightEdgeYStep = (rightEdgeYEnd - rightEdgeYStart) / Math.floor(segments / 3);
        
        for (let i = 0; i < Math.floor(segments / 3); i++) {
            const y = rightEdgeYStart + i * rightEdgeYStep;
            // Random variation for right edge
            const xVariation = Math.random() * rightVariationFactor - (rightVariationFactor / 2);
            path.push(new BABYLON.Vector3(width/2 + xVariation, y, 0));
        }
        
        // Bottom edge with more pronounced random variations for torn look
        for (let i = Math.floor(segments / 3); i >= 0; i--) {
            const xPos = -width/2 + (width * i / Math.floor(segments / 3));
            // More pronounced randomness for bottom edge
            const yVariation = (i > 0 && i < Math.floor(segments / 3)) ? (Math.random() * 0.12 - 0.06) : 0;
            path.push(new BABYLON.Vector3(xPos, -height/2 + yVariation, 0));
        }
        
        // Close the path
        path.push(path[0].clone());
        paths.push(path);
        
        return paths;
    }
    
    // Create torn tape pieces
    const leftTapePlane = createTornTape("leftTapePlane", position.x - width/2, position.y + height/3, true);
    const rightTapePlane = createTornTape("rightTapePlane", position.x + width/2, position.y - height/3, false);
    
    // Create tape material with special rendering properties
    const tapeMaterial = new BABYLON.StandardMaterial("tapeMaterial", scene);
    
    // Make sure the tape is a very light yellow/beige
    tapeMaterial.diffuseColor = new BABYLON.Color3(0.98, 0.96, 0.86); // Very light yellow/beige
    tapeMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Very low specular for less shine
    tapeMaterial.specularPower = 32; // Lower power for larger, softer highlights
    tapeMaterial.alpha = 0.9; // Slightly transparent
    
    // Optional: Use a simple texture for the tape instead of noise
    const tapeTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", scene);
    tapeTexture.hasAlpha = false;
    tapeMaterial.diffuseTexture = tapeTexture;
    
    // Apply a very subtle bump effect
    tapeMaterial.bumpTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", scene);
    tapeMaterial.bumpTexture.level = 0.1; // Very subtle bump
    
    // Enable alpha blending with proper render settings
    tapeMaterial.hasAlpha = true;
    tapeMaterial.useAlphaFromDiffuseTexture = false;
    tapeMaterial.separateCullingPass = true; // Ensure proper transparent rendering
    tapeMaterial.backFaceCulling = true; // Only render front faces
    
    // Create a second material instance for the right tape (slightly different)
    const rightTapeMaterial = tapeMaterial.clone("rightTapeMaterial");
    // Make right tape slightly different to add variation
    rightTapeMaterial.diffuseColor = new BABYLON.Color3(0.96, 0.93, 0.82); // Slightly different color
    
    // Force depth sorting for transparency
    leftTapePlane.alphaIndex = 0;
    rightTapePlane.alphaIndex = 0;
    
    // Set rendering order to ensure tape renders correctly
    leftTapePlane.renderingGroupId = 1;
    rightTapePlane.renderingGroupId = 1;
    buttonPlane.renderingGroupId = 0;
    
    // Use Z-offset to slightly move the tape forward to avoid Z-fighting
    leftTapePlane.position.z += 0.01;
    rightTapePlane.position.z += 0.01;
    
    // Apply materials to tapes
    leftTapePlane.material = tapeMaterial;
    rightTapePlane.material = rightTapeMaterial;
    
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
    textBlock.color = "#000000"; // Slightly off-black for more natural look
    textBlock.fontSize = 120; // Adjusted size for handwriting font
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

    // Return both the plane, the text block, and the tapes
    return { 
        buttonPlane: buttonPlane, 
        textBlock: textBlock, 
        leftTapePlane: leftTapePlane,
        rightTapePlane: rightTapePlane
    };
}