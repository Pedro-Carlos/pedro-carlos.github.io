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

        // Create and configure the camera
        const camera = createCamera(scene, canvas);

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

        /*
        CREATE THE MAIN OBJECTS AND SCENE
        */
        // Create decorative pins in the top right corner
        createComplexPin(scene, `decorativePin_1`, new BABYLON.Vector3(19, 13, -0.15));
        createComplexPin(scene, `decorativePin_2`, new BABYLON.Vector3(18, 14.5, -0.15));
        createComplexPin(scene, `decorativePin_3`, new BABYLON.Vector3(18.7, 14.5, -0.15));
        createComplexPin(scene, `decorativePin_4`, new BABYLON.Vector3(18, 13.7, -0.15));
        createComplexPin(scene, `decorativePin_5`, new BABYLON.Vector3(19, 13.6, -0.15));
        // CREATE PROFILE PHOTO
        const photoInfo = createPhotoAndFrame(scene, "assets/pedro.webp", 5, 5, new BABYLON.Vector3(0, 3, -0.1), 2);

        //CREATE SKILLS
        //SKILLS LABEL
        const skillsLabel = createLabel("SKILLS", scene, new BABYLON.Vector3(-9, 7, -0.01), 4, 1.5, 1, 120);
        connectPinsWithRope(photoInfo.pins[0], skillsLabel.pins[0], scene);
        //SOFT SKILLS LABEL
        const softSkillsLabel = createLabel("SOFT SKILLS", scene, new BABYLON.Vector3(-17, 12, -0.01), 2, 1, 1, 100);
        connectPinsWithRope(skillsLabel.pins[0], softSkillsLabel.pins[0], scene);
        //SOFT SKILLS
        const softSkills = `
            • Adaptability
            • Pragmatic  
            • Communicative
            • Resourcefulness
            • Practicality
            • Teamwork
            • Problem-solving
            • Critical Thinking
            • Attention to Detail
            • Continuous Learning`;
        const postIt = createPostIt(softSkills, scene, new BABYLON.Vector3(-17, 7.1, -0.1), 4, 8, 50);

        //HARD SKILLS
        //HARD SKILLS LABEL
        const hardSkillsLabel = createLabel("HARD SKILLS", scene, new BABYLON.Vector3(-13, 0, -0.01), 2, 1, 1, 100);
        connectPinsWithRope(hardSkillsLabel.pins[0], skillsLabel.pins[0], scene);

        //PROGRAMMING LANGUAGES PHOTOS
        const languagePhotos = [];
        const languages = [
            // Row 1
            { name: "Java", file: "assets/logos/Java_white_bg.png", pos: new BABYLON.Vector3(-16, -1.9, -0.1) },
            { name: "JavaScript", file: "assets/logos/JS_white_bg.png", pos: new BABYLON.Vector3(-13, -2, -0.1) },
            { name: "HTML", file: "assets/logos/HTML_white_bg.png", pos: new BABYLON.Vector3(-10, -1.7, -0.1) },
            // Row 2
            { name: "C", file: "assets/logos/C_white_bg.png", pos: new BABYLON.Vector3(-16.2, -4.5, -0.1) },
            { name: "Go", file: "assets/logos/Go_white_bg.png", pos: new BABYLON.Vector3(-13.7, -4.8, -0.1) },
            { name: "Assembly", file: "assets/logos/Assembly_white_bg.png", pos: new BABYLON.Vector3(-11, -4.5, -0.1) },
            // Row 3
            { name: "SQL", file: "assets/logos/SQL_white_bg.webp", pos: new BABYLON.Vector3(-16, -7, -0.1) },
            { name: "Erlang", file: "assets/logos/Erlang.svg", pos: new BABYLON.Vector3(-13.5, -7.3, -0.1) },
            { name: "Rust", file: "assets/logos/Rust_white_bg.png", pos: new BABYLON.Vector3(-10.5, -7.1, -0.1) },
            // Row 4
            { name: "OCaml", file: "assets/logos/OCaml_white_bg.png", pos: new BABYLON.Vector3(-15, -9.7, -0.1) },
            { name: "Python", file: "assets/logos/Python_white_bg.png", pos: new BABYLON.Vector3(-12, -9.8, -0.1) }
        ];

        languages.forEach((lang, index) => {
            const photoInfo = createPhotoAndFrame(scene, lang.file, 2, 2, lang.pos, 1);
            languagePhotos.push(photoInfo);
        });


        engine.runRenderLoop(function () {
            scene.render();
        });

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