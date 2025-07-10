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
        
        // Create CV download buttons in the top right corner
        const ptButton = createDownloadButton(scene, "assets/flags/pt.webp", "assets/CV/CV_Pedro-pt.pdf", new BABYLON.Vector3(16.5, 14, -0.1), 1.5);
        const enButton = createDownloadButton(scene, "assets/flags/uk.webp", "assets/CV/CV_Pedro-en.pdf", new BABYLON.Vector3(14.7, 14, -0.1), 1.5);
        
        
        // CREATE PROFILE PHOTO
        const photoInfo = createPhotoAndFrame(scene, "assets/pedro.webp", 5, 5, new BABYLON.Vector3(0, 4, -0.1), 2);

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
    • Continuous Learning`;
        createPostIt(softSkills, scene, new BABYLON.Vector3(-16.5, 7.1, -0.1), 5, 8, 50, true);

        //HARD SKILLS
        //HARD SKILLS LABEL
        const hardSkillsLabel = createLabel("HARD SKILLS", scene, new BABYLON.Vector3(-13, -0.7, -0.01), 2, 1, 1, 100);
        connectPinsWithRope(hardSkillsLabel.pins[0], skillsLabel.pins[0], scene);
        //PROGRAMMING LANGUAGES PHOTOS
        const languages = [
            // Row 1
            { name: "Java", file: "assets/logos/Java_white_bg.png", pos: new BABYLON.Vector3(-16, -2.8, -0.1) },
            { name: "JavaScript", file: "assets/logos/JS_white_bg.png", pos: new BABYLON.Vector3(-13.3, -2.9, -0.1) },
            { name: "HTML", file: "assets/logos/HTML_white_bg.png", pos: new BABYLON.Vector3(-10.6, -3, -0.1) },
            // Row 2
            { name: "C", file: "assets/logos/C_white_bg.png", pos: new BABYLON.Vector3(-16.2, -5.5, -0.1) },
            { name: "Go", file: "assets/logos/Go_white_bg.png", pos: new BABYLON.Vector3(-13.7, -5.8, -0.1) },
            { name: "SQL", file: "assets/logos/SQL_white_bg.webp", pos: new BABYLON.Vector3(-11, -5.5, -0.1) },
            // Row 3
            { name: "Python", file: "assets/logos/Python_white_bg.png", pos: new BABYLON.Vector3(-16, -8.1, -0.1) },
            { name: "Erlang", file: "assets/logos/Erlang.svg", pos: new BABYLON.Vector3(-13.5, -8.3, -0.1) },
            { name: "Rust", file: "assets/logos/Rust_white_bg.png", pos: new BABYLON.Vector3(-10.5, -8.1, -0.1) },
            // Row 4
            { name: "OCaml", file: "assets/logos/OCaml_white_bg.png", pos: new BABYLON.Vector3(-15, -10.7, -0.1) },

        ];
        languages.forEach((lang, index) => {
            createPhotoAndFrame(scene, lang.file, 2, 2, lang.pos, 1);
        });
        // SPOKEN LANGUAGES
        const spokenLanguagesLabel = createLabel("SPOKEN LANGUAGES", scene, new BABYLON.Vector3(-6.5, 4, -0.01), 2, 1, 1, 100);
        connectPinsWithRope(spokenLanguagesLabel.pins[0], skillsLabel.pins[0], scene);
        // SPOKEN LANGUAGES
        const portuguese = createPhotoAndFrame(scene, "assets/flags/pt.webp", 2, 2, new BABYLON.Vector3(-5.2, 1.9, -0.1), 1);
        createLabel("Native", scene, new BABYLON.Vector3(-5.2, 0.1, -0.01), 2, 1, 1, 140);
        const english = createPhotoAndFrame(scene, "assets/flags/uk.webp", 2, 2, new BABYLON.Vector3(-7.7, 1.9, -0.1), 1);
        createLabel("Upper Intermediate", scene, new BABYLON.Vector3(-7.7, 0.1, -0.01), 2, 1.2, 1, 130);
        connectPinsWithRope(spokenLanguagesLabel.pins[0], portuguese.pins[0], scene);
        connectPinsWithRope(spokenLanguagesLabel.pins[0], english.pins[0], scene);

        // EDUCATION
        const educationLabel = createLabel("EDUCATION", scene, new BABYLON.Vector3(-5, 13, -0.01), 4.5, 1.5, 2, 120);
        connectPinsWithRope(educationLabel.pins[0], skillsLabel.pins[0], scene);
        connectPinsWithRope(educationLabel.pins[0], photoInfo.pins[0], scene);
        createPhotoAndFrame(scene, "assets/logos/novaLogo_white_bg.webp", 1.2, 1, new BABYLON.Vector3(-2.5, 12, -0.1), 1);
        const educationInfo = `
    • Master of Computer Science and Engineering (2022 - 2025)
    • Bachelor of Computer Science and Engineering (2019 - 2022)`;
        createPostIt(educationInfo, scene, new BABYLON.Vector3(2, 11, -0.1), 5, 3.5, 65, true);
        const educationInfoPin = createComplexPin(scene, `educationInfoPin`, new BABYLON.Vector3(2, 12.7, -0.17));
        connectPinsWithRope(educationLabel.pins[1], educationInfoPin, scene);

        // ABOUT ME
        const aboutMeLabel = createLabel("ABOUT ME", scene, new BABYLON.Vector3(10, 10, -0.01), 4.5, 1.5, 1, 120);
        connectPinsWithRope(aboutMeLabel.pins[0], photoInfo.pins[1], scene);
        const aboutMeInfo = `
• Experience:
Full-stack developer with experience in feature development and data dashboards

• Career Goal:
Seeking a development role to apply and grow technical and problem-solving skills

• Personal Projects:
IoT: Smart mini car, mobile-controlled cat feeder
Motorcycle restoration: Hands-on 50cc bike project

• Hobbies
Bouldering
DIY mechanics and electronics
            `;
        createPostIt(aboutMeInfo, scene, new BABYLON.Vector3(8, 3.5, -0.1), 6, 9, 34, true);
        const contactsLabel = createLabel("CONTACTS", scene, new BABYLON.Vector3(15.5, 7, -0.01), 2, 1, 1, 100);
        connectPinsWithRope(contactsLabel.pins[0], aboutMeLabel.pins[0], scene);
        createPhotoAndFrame(scene, "assets/logos/linkedin.png", 1.7, 1.7, new BABYLON.Vector3(15.5, 5, -0.1), 1, () => {
            window.open("https://www.linkedin.com/in/pedro-carlos-028417268/", "_blank");
        });
        createPhotoAndFrame(scene, "assets/logos/github.png", 1.7, 1.7, new BABYLON.Vector3(13, 5.1, -0.1), 1, () => {
            window.open("https://github.com/PedroCarlos-FCT", "_blank");
        });
        createPhotoAndFrame(scene, "assets/logos/github2.png", 1.7, 1.7, new BABYLON.Vector3(18, 5.3, -0.1), 1, () => {
            window.open("https://github.com/Pedro-Carlos", "_blank");
        });
        createLabel("pedrocarlos650@gmail.com", scene, new BABYLON.Vector3(15.5, 3, -0.01), 6, 1.5, 1, 65);

        // EXPERIENCE
        const experienceLabel = createLabel("EXPERIENCE", scene, new BABYLON.Vector3(-0.5, -2, -0.01), 4.5, 1.5, 1, 120);
        connectPinsWithRope(experienceLabel.pins[0], photoInfo.pins[0], scene);
        const ai4chef = createPhotoAndFrame(scene, "assets/logos/ai4chef.png", 4.5, 2, new BABYLON.Vector3(-3, -5, -0.01), 1, () => {
            window.open("https://ai4chef.com/", "_blank");
        });
        connectPinsWithRope(experienceLabel.pins[0], ai4chef.pins[0], scene);
        createLabel("Part-Time Full-Stack Developer (2023 - Present)", scene, new BABYLON.Vector3(-3, -7.5, -0.01), 6, 2, 2, 70);
        const ai4chefExperience = `
• Using React and TypeScript for the frontend.

• Building the API with Django (Python).

• Emphasis on data analytics dashboards.

• Actively maintaining and enhancing key features.`;
        createPostIt(ai4chefExperience, scene, new BABYLON.Vector3(-3, -11.5, -0.01), 7, 5, 45, true);

        const visionD = createPhotoAndFrame(scene, "assets/logos/visionD.webp", 4, 2, new BABYLON.Vector3(5, -5, -0.01), 1, () => {
            window.open("https://www.visiond.pt/", "_blank");
        });
        connectPinsWithRope(experienceLabel.pins[0], visionD.pins[0], scene);
        createLabel("Part-Time Full-Stack Developer (2023 - 2024)", scene, new BABYLON.Vector3(5, -7.5, -0.01), 6, 2, 2, 70);
        const visionDExperience = `
• Designed and built responsive, dynamic UIs using React, TypeScript, and Next.js.

• Created custom-styled components with Tailwind CSS.

• Participated in the full software development lifecycle, including deployment and maintenance.`;
        createPostIt(visionDExperience, scene, new BABYLON.Vector3(5, -11.5, -0.01), 7, 5, 45, true);

        const betacode = createPhotoAndFrame(scene, "assets/logos/betacode.webp", 4.5, 2, new BABYLON.Vector3(13, -5, -0.01), 1, () => {
            window.open("https://www.betacode.tech/", "_blank");
        });
        connectPinsWithRope(experienceLabel.pins[0], betacode.pins[0], scene);
        createLabel("Betacode | Full-Stack Developer Intern (2022)", scene, new BABYLON.Vector3(13, -7.5, -0.01), 6, 2, 2, 70);
        const betacodeExperience = `
• Worked with a development team on a full-stack application.

• Built UI components using Gatsby (React-based).

• Implemented a CMS backend with Strapi.

• Improved proficiency in JavaScript, HTML, and CSS.`;
        createPostIt(betacodeExperience, scene, new BABYLON.Vector3(13, -11.5, -0.01), 7, 5, 45, true);
        
        



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