function createPostIt(text, scene, position, width = 1.5, height = 1.5, fontSize = 100) {
    // Create a custom curved mesh for the post-it using CreatePlane and then modify it
    const postItMesh = BABYLON.MeshBuilder.CreatePlane("postItMesh", { 
        width: width, 
        height: height, 
    }, scene);
    
    postItMesh.position = position;
    
    // Add slight random tilt for natural look
    const random1 = (Math.random() * 2) - 1;
    const random2 = (Math.random() * 2) - 1;
    const triangularRandom = (random1 + random2) / 2;
    const randomTiltDegrees = triangularRandom * 5; // Slightly less tilt than labels
    const randomTiltRadians = randomTiltDegrees * (Math.PI / 180);
    postItMesh.rotation.z = randomTiltRadians;

    // Create material for the post-it with opaque yellowish color
    const postItMaterial = new BABYLON.StandardMaterial("postItMaterial", scene);
    
    // Post-it yellow color - opaque and bright
    const yellowVariation = Math.random() * 0.05; // Small variation for natural look
    postItMaterial.diffuseColor = new BABYLON.Color3(
        1.0,                          // Red: full for bright yellow
        1.0 - yellowVariation * 0.1,  // Green: slight variation
        0.2 + yellowVariation         // Blue: low value for yellow
    );
    
    postItMaterial.alpha = 1.0; // Fully opaque
    postItMaterial.hasAlpha = false; // No transparency
    
    // Add subtle roughness for paper texture
    postItMaterial.roughness = 0.7;
    postItMaterial.metallicFactor = 0.0;
    
    postItMesh.material = postItMaterial;

    // Create AdvancedDynamicTexture for text
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(postItMesh, 1024, 1024);
    
    // Create background rectangle with yellow tint
    const rect = new BABYLON.GUI.Rectangle();
    rect.color = "transparent";
    rect.background = `rgba(255, 255, 180, 1)`; // Very light yellow tint
    rect.thickness = 0;
    advancedTexture.addControl(rect);
    
    // Create text block
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = "#2c2c2c"; // Dark gray for good contrast on yellow
    textBlock.fontSize = fontSize;
    textBlock.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_JUSTIFY;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.paddingTop = "0%";

    
    // Add shadow for depth
    textBlock.shadow = true;
    textBlock.shadowColor = "rgba(0, 0, 0, 0.4)";
    textBlock.shadowOffsetX = 1;
    textBlock.shadowOffsetY = 1;
    textBlock.shadowBlur = 3;
    
    advancedTexture.addControl(textBlock);
    
    // Apply handwriting font when loaded
    const fontFamily = 'Playwrite HU';
    const font = new FontFaceObserver(fontFamily);
    
    font.load().then(() => {
        console.log(`Font '${fontFamily}' loaded successfully for post-it`);
        textBlock.fontFamily = `'${fontFamily}', cursive`;
        textBlock.fontWeight = "400"; // Slightly bolder for post-it visibility
        advancedTexture.markAsDirty();
    }).catch(err => {
        console.warn(`Font '${fontFamily}' could not be loaded for post-it:`, err);
    });

    // Return the mesh and text block (no pins needed)
    return { 
        postItMesh: postItMesh, 
        textBlock: textBlock
    };
} 