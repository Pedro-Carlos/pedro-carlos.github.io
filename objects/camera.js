// Camera setup and configuration
function createCamera(scene, canvas) {
    // Add a camera to the scene and attach it to the canvas
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 40, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    
    // Prevent camera from going below the board
    // up bottom limit
    camera.lowerBetaLimit = 0.5;
    camera.upperBetaLimit = Math.PI - 0.5;

    // left right limit
/*     camera.lowerAlphaLimit = -Math.PI + 0.5;
    camera.upperAlphaLimit = -0.5;    */ 

    // zoom in and out limit
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 40;
    camera.wheelDeltaPercentage = 0.01;

    return camera;
} 