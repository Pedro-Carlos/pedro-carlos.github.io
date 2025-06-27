window.addEventListener('DOMContentLoaded', function(){
        // Get the canvas element
        const canvas = document.getElementById("renderCanvas");

        // Create the Babylon.js engine
        const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

        // This function will set up the scene and physics once Ammo is loaded
        const initializeSceneWithPhysics = function (AmmoInstance) {
            const scene = new BABYLON.Scene(engine);

            // Enable physics using Ammo.js, passing the loaded instance
            const ammoPlugin = new BABYLON.AmmoJSPlugin(true, AmmoInstance);
            scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), ammoPlugin);
            console.log("Physics engine enabled with Ammo.js.");

            // Add a camera to the scene and attach it to the canvas
            const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 40, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas, true);
            // Prevent camera from going below the board
            //up bottom limit
            camera.lowerBetaLimit = 0.5;
            camera.upperBetaLimit = Math.PI - 0.5;

            //left right limit
            camera.lowerAlphaLimit = -Math.PI + 0.5;
            camera.upperAlphaLimit = -0.5;    

            //zoom in and out limit
            camera.lowerRadiusLimit = 5;
            camera.upperRadiusLimit = 40;
            camera.wheelDeltaPercentage = 0.01;

            // Add a light to the scene
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
            light.intensity = 1.5;

            // Create the corkboard using the external function
            const corkboardInfo = createCorkboard(scene);
            const corkboardGroup = corkboardInfo.group;
            const corkboardPlane = corkboardGroup.getChildMeshes(true, (node) => node.name === "corkboard")[0];
            if (corkboardPlane) {
                corkboardPlane.physicsImpostor = new BABYLON.PhysicsImpostor(corkboardPlane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, scene);
            }

            // Create the photo and frame using the external function
            const label = createLabel("Pedro Carlos", scene, new BABYLON.Vector3(1, 5, -0.01));
            const photoInfo = createPhotoAndFrame(scene, "base.jpg", 2, 2, new BABYLON.Vector3(0, 1, -0.1));
            const photoGroup = photoInfo.group;
            const photoPlane = photoGroup.getChildMeshes(true, (node) => node.name === "photoPlane")[0];
             if (photoPlane) {
                photoPlane.physicsImpostor = new BABYLON.PhysicsImpostor(photoPlane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, scene);
            }

            // Create pins and connecting strings
            const pinData = createPinsAndStrings(scene, 5, corkboardInfo, photoInfo); // Create 5 pins

            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(function () {
                // Update string visuals if needed (e.g., if objects could move)
                // pinData?.updateStrings(); // Uncomment if dynamic updates are required
                scene.render();
            });

            // Watch for browser/canvas resize events
            window.addEventListener("resize", function () {
                engine.resize();
            });
        };

        // Wait for Ammo.js to be loaded using the Ammo() promise
        // This requires index.html to use <script src="https://cdn.babylonjs.com/ammo.js"></script>
        if (typeof Ammo === 'function') {
            Ammo().then((loadedAmmoInstance) => { // The promise resolves with the Ammo instance
                initializeSceneWithPhysics(loadedAmmoInstance); // Pass the instance

                // Basic error handling for context loss (can be here as it's engine-related)
                engine.onContextLostObservable.add(() => {
                    console.error("WebGL context lost. Please refresh the page.");
                });

                engine.onContextRestoredObservable.add(() => {
                    console.log("WebGL context restored.");
                    // You might need to recreate resources here if necessary
                });

            }).catch(e => {
                console.error("Error initializing Ammo.js:", e);
            });
        } else {
            console.error("Ammo() function not found. Ensure 'https://cdn.babylonjs.com/ammo.js' is loaded in HTML, or the loading mechanism needs adjustment.");
            // As a fallback, if Ammo object is already somehow loaded (e.g. by a different non-promise script)
            // you could try to initialize directly, but this is less standard for wasm.
            if (typeof Ammo === 'object' && Ammo !== null) {
                 console.warn("Ammo object was found globally, but Ammo() function was not. Attempting direct initialization (may be less stable).");
                 // initializeSceneWithPhysics(Ammo); // This is a less robust fallback.
            }
        }
}); 