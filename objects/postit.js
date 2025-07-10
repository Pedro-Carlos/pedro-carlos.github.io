function createPostIt(text, scene, position, width = 1.5, height = 1.5, fontSize = 100, justify = false, camera = null) {
    const postItMesh = BABYLON.MeshBuilder.CreatePlane("postItMesh", { 
        width: width, 
        height: height, 
    }, scene);
    
    postItMesh.position = position;
    
    const random1 = (Math.random() * 2) - 1;
    const random2 = (Math.random() * 2) - 1;
    const triangularRandom = (random1 + random2) / 2;
    const randomTiltDegrees = triangularRandom * 5; 
    const randomTiltRadians = randomTiltDegrees * (Math.PI / 180);
    postItMesh.rotation.z = randomTiltRadians;

    const postItMaterial = new BABYLON.StandardMaterial("postItMaterial", scene);
    
    const yellowVariation = Math.random() * 0.05; 
    postItMaterial.diffuseColor = new BABYLON.Color3(
        1.0,                          
        1.0 - yellowVariation * 0.1,  
        0.2 + yellowVariation         
    );
    
    postItMaterial.alpha = 1.0; 
    postItMaterial.hasAlpha = false; 
    
    postItMaterial.roughness = 0.7;
    postItMaterial.metallicFactor = 0.0;
    
    postItMesh.material = postItMaterial;

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(postItMesh, 1024, 1024);
    
    const rect = new BABYLON.GUI.Rectangle();
    rect.color = "transparent";
    rect.background = `rgba(255, 255, 180, 1)`; 
    rect.thickness = 0;
    advancedTexture.addControl(rect);
    
    // Create text block
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = "#2c2c2c"; 
    textBlock.fontSize = fontSize;
    textBlock.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
    if (justify) {
        textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_JUSTIFY;
    }
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.paddingTop = "0%";
    if (justify) {
        textBlock.paddingLeft = "8%";
    } else {
        textBlock.paddingLeft = "0%";
        textBlock.paddingRight = "0%";
    }
    textBlock.paddingBottom = "0%";

    
    textBlock.shadow = true;
    textBlock.shadowColor = "rgba(0, 0, 0, 0.4)";
    textBlock.shadowOffsetX = 1;
    textBlock.shadowOffsetY = 1;
    textBlock.shadowBlur = 3;
    
    advancedTexture.addControl(textBlock);


    const fontFamily = 'Playwrite HU';
    const font = new FontFaceObserver(fontFamily);
    
    font.load().then(() => {
        console.log(`Font '${fontFamily}' loaded successfully for post-it`);
        textBlock.fontFamily = `'${fontFamily}', cursive`;
        textBlock.fontWeight = "400"; 
        advancedTexture.markAsDirty();
    }).catch(err => {
        console.warn(`Font '${fontFamily}' could not be loaded for post-it:`, err);
    });

    // Create post-it object for zoom functionality
    const postItObject = { 
        postItMesh: postItMesh, 
        textBlock: textBlock
    };

    // Add zoom functionality if camera is provided
    if (camera) {
        const zoomToObject = createZoomToObject(camera, scene);
        
        // Add action manager for click handling
        postItMesh.actionManager = new BABYLON.ActionManager(scene);
        
        // Add click action for zoom
        postItMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger, 
            () => zoomToObject(postItObject, 12)
        ));
        
        // Add hover effects
        postItMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger, 
            function() {
                postItMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.05);
                scene.getEngine().getInputElement().style.cursor = "pointer";
            }
        ));
        
        postItMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger, 
            function() {
                postItMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
                scene.getEngine().getInputElement().style.cursor = "default";
            }
        ));
    }

    return postItObject;
} 