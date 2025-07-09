 function createComplexPin(scene, name, position) {
    // Define dimensions relative to a base size for easier scaling
    const baseSize = 0.2; // Base diameter for the neck
    const headDiameter = baseSize * 2;
    const headHeight = baseSize * 0.5;
    const neckHeight = baseSize * 1.5;
    const metal = 0.1;

    // Create the head (flattened cylinder)
    const head = BABYLON.MeshBuilder.CreateCylinder("pinHead", { diameter: headDiameter, height: headHeight }, scene);
    // Position the head at the top
    head.position.y = neckHeight / 2 + headHeight / 2;

    // Create the neck (cylinder)
    const neck = BABYLON.MeshBuilder.CreateCylinder("pinNeck", { diameter: baseSize, height: neckHeight }, scene);
    // Position the neck below the head
    neck.position.y = 0; // Neck is centered at y=0 initially

    // Create the tip (cone)
    const tip = BABYLON.MeshBuilder.CreateCylinder("pinTip", { diameter: headDiameter, height: headHeight }, scene);
    // Position the tip below the neck
    tip.position.y = -neckHeight / 2 - headHeight / 2;

    const metalTip = BABYLON.MeshBuilder.CreateCylinder("metalTip", { diameter: metal, height: neckHeight * 1.5 }, scene);

    metalTip.position.y = -neckHeight - headHeight;

    // Merge the meshes into a single mesh
    const pin = BABYLON.Mesh.MergeMeshes([head, neck, tip, metalTip], true, false, undefined, false, true);
    pin.name = name; // Set the name of the merged mesh

    // Set the overall position of the merged pin
    pin.position = position;

    // Define possible colors
    const colors = [
        new BABYLON.Color3(171/255,67/255,66/255), // Red
        new BABYLON.Color3(76/255,181/255,127/255), // Green
        new BABYLON.Color3(15/255,141/255,208/255)  // Blue
    ];

    // Randomly select a color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Create a new material with the random color
    const pinMaterial = new BABYLON.StandardMaterial(name + "Material", scene);
    pinMaterial.diffuseColor = randomColor;
    pinMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    pinMaterial.specularPower = 100;

    // Apply the material to the merged mesh
    pin.material = pinMaterial;

    // Add physics impostor to the actual pin mesh (not the pivot node)
    pin.physicsImpostor = new BABYLON.PhysicsImpostor(pin, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);

    // Apply rotation around the base of the pin (assuming the pivot is at the base of the neck/top of the tip)
    // To rotate around the base, we might need to adjust the pivot or use a parent node.
    // For simplicity, let's apply rotation directly and assume the mesh is created such that
    // its local origin is at the base. If not, pivot adjustment is needed.
    // Let's assume the merged mesh's pivot is at its center. We need to rotate it around the base.
    // A common way is to create a parent TransformNode at the desired pivot point.

    const pivotNode = new BABYLON.TransformNode("pinPivot", scene);
    pivotNode.position = new BABYLON.Vector3(position.x, position.y - (neckHeight/2 + headHeight), position.z); // Position pivot at the base

    pin.setParent(pivotNode); // Make the pivot node the parent of the pin

    // Now rotate the pivot node
    pivotNode.rotation.z = (-Math.PI / 2) + (Math.random() * 0.5);
    pivotNode.rotation.y = Math.PI / 2 - (Math.random() * 0.3);

    // Store reference to the pin mesh for physics operations
    pivotNode.pinMesh = pin;

    return pivotNode; // Return the pivot node so you can manipulate the pin's position and rotation easily
}