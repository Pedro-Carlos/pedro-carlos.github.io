function createPhotoAndFrame(scene, photo, width, height, position) {
    const photoDepth = 0.02; // Slight depth to lift off the board
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
    photoPlane.material = photoMaterial;

    const photoFrameMaterial = new BABYLON.StandardMaterial("photoFrameMaterial", scene);
    photoFrameMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // White
    photoFrameMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);

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
    photoPlane.parent = photoGroup;  
    topFrame.parent = photoGroup;
    bottomFrame.parent = photoGroup;
    leftFrame.parent = photoGroup;
    rightFrame.parent = photoGroup;




    // Calculate an attachment point (e.g., center top of the frame)
    // MODIFIED: Calculate attachmentPoint in local space of the group
    const attachmentPoint = new BABYLON.Vector3(
        0, // Centered horizontally
        (height / 2) + photoFrameThickness, // Top edge of the top frame piece
        0 // Coplanar with the photo plane and front surface of the frame
    );

    return {
        group: photoGroup,
        attachmentPoint: attachmentPoint, // Point in local space of the group
        width: width,
        height: height,
        frameThickness: photoFrameThickness
    };
} 