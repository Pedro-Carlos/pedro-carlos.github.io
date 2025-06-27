function createCorkboard(scene) {
    // Create the corkboard plane
    const boardWidth = 30; 
    const boardHeight = 20;
    const frameThickness = 0.5;
    const frameDepth = 0.1;


    const corkboard = BABYLON.MeshBuilder.CreatePlane("corkboard", {width: boardWidth, height: boardHeight}, scene);

    // Create cork material
    const corkMaterial = new BABYLON.StandardMaterial("corkMaterial", scene);
    corkMaterial.diffuseTexture = new BABYLON.Texture("textures/cork.jpg", scene);
    corkMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Reduce shininess
    corkMaterial.backFaceCulling = false; // Show texture on both sides if needed
    corkboard.material = corkMaterial;


    const frameMaterial = new BABYLON.StandardMaterial("frameMaterial", scene);
    frameMaterial.diffuseTexture = new BABYLON.Texture("textures/wood.png", scene);
    frameMaterial.specularColor = new BABYLON.Color3(0.2, 0.1, 0.05);

    // Top frame piece
    const topFrame = BABYLON.MeshBuilder.CreateBox("topFrame", {width: boardWidth + frameThickness * 2, height: frameThickness, depth: frameDepth}, scene);
    topFrame.position = new BABYLON.Vector3(0, (boardHeight / 2) + (frameThickness / 2), -frameDepth / 2);
    topFrame.material = frameMaterial;

    // Bottom frame piece
    const bottomFrame = BABYLON.MeshBuilder.CreateBox("bottomFrame", {width: boardWidth + frameThickness * 2, height: frameThickness, depth: frameDepth}, scene);
    bottomFrame.position = new BABYLON.Vector3(0, -(boardHeight / 2) - (frameThickness / 2), -frameDepth / 2);
    bottomFrame.material = frameMaterial;

    // Left frame piece
    const leftFrame = BABYLON.MeshBuilder.CreateBox("leftFrame", {width: frameThickness, height: boardHeight, depth: frameDepth}, scene);
    leftFrame.position = new BABYLON.Vector3(-(boardWidth / 2) - (frameThickness / 2), 0, -frameDepth / 2);
    leftFrame.material = frameMaterial;

    // Right frame piece
    const rightFrame = BABYLON.MeshBuilder.CreateBox("rightFrame", {width: frameThickness, height: boardHeight, depth: frameDepth}, scene);
    rightFrame.position = new BABYLON.Vector3((boardWidth / 2) + (frameThickness / 2), 0, -frameDepth / 2);
    rightFrame.material = frameMaterial;

    // Group the corkboard and its frame
    const corkboardGroup = new BABYLON.TransformNode("corkboardGroup", scene);
    corkboard.parent = corkboardGroup;
    topFrame.parent = corkboardGroup;
    bottomFrame.parent = corkboardGroup;
    leftFrame.parent = corkboardGroup;
    rightFrame.parent = corkboardGroup;


    return { 
        group: corkboardGroup, 
        width: boardWidth, 
        height: boardHeight, 
        depth: frameDepth 
    };
} 