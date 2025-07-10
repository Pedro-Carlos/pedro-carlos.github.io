function createDownloadButton(scene, flagImage, pdfPath, position, size = 2, camera = null) {
    const buttonDepth = 0.1;
    // Create the flag image disc (circular)
    const flagPlane = BABYLON.MeshBuilder.CreateDisc("flagPlane", scene);

    
    // Create flag material
    const flagMaterial = new BABYLON.StandardMaterial("flagMaterial", scene);
    flagMaterial.diffuseTexture = new BABYLON.Texture(flagImage, scene);
    flagMaterial.backFaceCulling = false;
    flagMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    flagMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    flagMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    flagPlane.material = flagMaterial;
    
    // Group the button and flag
    const buttonGroup = new BABYLON.TransformNode("downloadButtonGroup", scene);
    buttonGroup.position = position;
    
    // Reset positions to be relative to group
    flagPlane.position = new BABYLON.Vector3(0, 0, 0);
    flagPlane.rotation.x = Math.PI;
    flagPlane.parent = buttonGroup;
    
    // Create button object for zoom functionality
    const buttonObject = {
        group: buttonGroup,
        flagPlane: flagPlane,
        size: size
    };
    
    // Add click functionality for PDF download and zoom
    flagPlane.actionManager = new BABYLON.ActionManager(scene);
    
    const downloadPDF = function() {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = pdfPath.split('/').pop(); // Get filename from path
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    if (camera) {
        const zoomToObject = createZoomToObject(camera, scene);
        
        // Create a combined handler for zoom + download
        const combinedHandler = function() {
            zoomToObject(buttonObject, 20);
            // Small delay before download to let zoom animation start
            setTimeout(downloadPDF, 100);
        };
        
        flagPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger, 
            combinedHandler
        ));
    } else {
        // Fallback: original download behavior
        flagPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger, 
            downloadPDF
        ));
    }
    
    const addHoverEffects = function(mesh) {
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger, 
            function() {
                // Smooth scaling animation
                const scaleAnimation = BABYLON.Animation.CreateAndStartAnimation(
                    "scaleUp", buttonGroup, "scaling", 60, 10,
                    new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(1.1, 1.1, 1.1),
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );
                
                // Smooth emissive color animation
                const colorAnimation = BABYLON.Animation.CreateAndStartAnimation(
                    "brighten", flagMaterial, "emissiveColor", 60, 10,
                    new BABYLON.Color3(0.2, 0.2, 0.2), new BABYLON.Color3(0.4, 0.4, 0.4),
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );
                
                scene.getEngine().getInputElement().style.cursor = "pointer";
            }
        ));
        
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger, 
            function() {
                // Smooth scaling animation back to normal
                const scaleAnimation = BABYLON.Animation.CreateAndStartAnimation(
                    "scaleDown", buttonGroup, "scaling", 60, 10,
                    new BABYLON.Vector3(1.1, 1.1, 1.1), new BABYLON.Vector3(1, 1, 1),
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );
                
                // Smooth emissive color animation back to normal
                const colorAnimation = BABYLON.Animation.CreateAndStartAnimation(
                    "dim", flagMaterial, "emissiveColor", 60, 10,
                    new BABYLON.Color3(0.4, 0.4, 0.4), new BABYLON.Color3(0.2, 0.2, 0.2),
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );
                
                scene.getEngine().getInputElement().style.cursor = "default";
            }
        ));
    };
    
    addHoverEffects(flagPlane);
    
    return buttonObject;
} 