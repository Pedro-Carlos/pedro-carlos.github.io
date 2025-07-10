// Camera zoom functionality for interactive objects
function createZoomToObject(camera, scene) {
    return function(targetObject, zoomDistance = 15) {
        // Get the target position and calculate perpendicular front view
        let targetPosition;
        let targetMesh;
        
        if (targetObject.group) {
            // For objects with groups (photos, download buttons)
            targetPosition = targetObject.group.getAbsolutePosition();
            targetMesh = targetObject.group;
        } else if (targetObject.buttonPlane) {
            // For labels
            targetPosition = targetObject.buttonPlane.getAbsolutePosition();
            targetMesh = targetObject.buttonPlane;
        } else if (targetObject.postItMesh) {
            // For post-it notes
            targetPosition = targetObject.postItMesh.getAbsolutePosition();
            targetMesh = targetObject.postItMesh;
        } else if (targetObject.getAbsolutePosition) {
            // For meshes directly
            targetPosition = targetObject.getAbsolutePosition();
            targetMesh = targetObject;
        } else {
            console.warn("Cannot determine position for zoom target:", targetObject);
            return;
        }

        // Set camera to default angles for straight-on perpendicular view
        const targetAlpha = -Math.PI / 2; // Default horizontal angle (facing forward)
        const targetBeta = Math.PI / 2; // Default vertical angle (horizontal view, no tilt)

        // Store current values
        const currentTarget = camera.getTarget();
        const currentRadius = camera.radius;
        const currentAlpha = camera.alpha;
        const currentBeta = camera.beta;
        
        // Calculate zoom out distance (further than current radius)
        const zoomOutDistance = Math.max(currentRadius * 1.5, 25);
        const finalZoomDistance = Math.max(zoomDistance, camera.lowerRadiusLimit);

        // Phase 1: Zoom out while moving to target
        const targetAnimation1 = BABYLON.Animation.CreateAndStartAnimation(
            "cameraTargetAnimation1", 
            camera, 
            "target", 
            60, // 60 FPS
            20, // 20 frames
            currentTarget,
            targetPosition,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const radiusAnimation1 = BABYLON.Animation.CreateAndStartAnimation(
            "cameraRadiusAnimation1",
            camera,
            "radius",
            60, // 60 FPS  
            20, // 20 frames
            currentRadius,
            zoomOutDistance,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const alphaAnimation1 = BABYLON.Animation.CreateAndStartAnimation(
            "cameraAlphaAnimation1",
            camera,
            "alpha",
            60, // 60 FPS  
            20, // 20 frames
            currentAlpha,
            targetAlpha,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const betaAnimation1 = BABYLON.Animation.CreateAndStartAnimation(
            "cameraBetaAnimation1",
            camera,
            "beta",
            60, // 60 FPS  
            20, // 20 frames
            currentBeta,
            targetBeta,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            null,
            () => {
                // Phase 2: Zoom in to final position
                const radiusAnimation2 = BABYLON.Animation.CreateAndStartAnimation(
                    "cameraRadiusAnimation2",
                    camera,
                    "radius",
                    60, // 60 FPS  
                    25, // 25 frames
                    zoomOutDistance,
                    finalZoomDistance,
                    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
                    null,
                    () => {
                        console.log(`Zoomed to object at position: ${targetPosition.toString()}`);
                    }
                );
            }
        );
    };
}

// Double click detection utility
function createDoubleClickHandler(singleClickCallback, doubleClickCallback, delay = 300) {
    let clickCount = 0;
    let clickTimer = null;
    
    return function() {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                // Single click
                if (singleClickCallback) {
                    singleClickCallback();
                }
                clickCount = 0;
            }, delay);
        } else if (clickCount === 2) {
            // Double click
            clearTimeout(clickTimer);
            if (doubleClickCallback) {
                doubleClickCallback();
            }
            clickCount = 0;
        }
    };
} 