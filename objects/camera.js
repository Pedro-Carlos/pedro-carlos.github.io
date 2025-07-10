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
    camera.lowerAlphaLimit = -Math.PI + 0.5;
    camera.upperAlphaLimit = -0.5;    

    // zoom in and out limit
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 100;
    
    // Default speeds
    const normalWheelSpeed = 0.01;
    const normalRotationSpeed = 5000;
    const fastMultiplier = 100;
    
    camera.wheelDeltaPercentage = normalWheelSpeed;
    camera.angularSensibilityX = normalRotationSpeed;
    camera.angularSensibilityY = normalRotationSpeed;
    
    // Track control states
    let isCtrlPressed = false;
    let isTouchActive = false;
    let isFastMode = false;
    let twoFingersPressed = false;
    

    
    // Function to update camera speed based on current state
    function updateCameraSpeed() {
        const shouldBeFast = isCtrlPressed || (isTouchActive && twoFingersPressed);
        if (shouldBeFast && !isFastMode) {
            isFastMode = true;
            camera.wheelDeltaPercentage = normalWheelSpeed * fastMultiplier;
            camera.angularSensibilityX = normalRotationSpeed / fastMultiplier;
            camera.angularSensibilityY = normalRotationSpeed / fastMultiplier;
        } else if (!shouldBeFast && isFastMode) {
            isFastMode = false;
            camera.wheelDeltaPercentage = normalWheelSpeed;
            camera.angularSensibilityX = normalRotationSpeed;
            camera.angularSensibilityY = normalRotationSpeed;
        }
    }
    
    // Desktop keyboard controls
    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && !isCtrlPressed) {
            isCtrlPressed = true;
            updateCameraSpeed();
        }
    });
    
    window.addEventListener('keyup', (event) => {
        if (!event.ctrlKey && isCtrlPressed) {
            isCtrlPressed = false;
            updateCameraSpeed();
        }
    });
    
    // Handle window blur to reset speed if user switches windows while holding Ctrl
    window.addEventListener('blur', () => {
        if (isCtrlPressed) {
            isCtrlPressed = false;
            updateCameraSpeed();
        }
    });
    
    // Mobile touch controls
    canvas.addEventListener('touchstart', (event) => {
        if (!isTouchActive) {
            isTouchActive = true;
        }
        
        // Check if 2 or more fingers are pressed
        const wasTwoFingersPressed = twoFingersPressed;
        twoFingersPressed = event.touches.length >= 2;
        
        // Update speed if the state changed
        if (wasTwoFingersPressed !== twoFingersPressed) {
            updateCameraSpeed();
        }
    });
    
    canvas.addEventListener('touchend', (event) => {
        // Check if 2 or more fingers are still pressed
        const wasTwoFingersPressed = twoFingersPressed;
        twoFingersPressed = event.touches.length >= 2;
        
        // If no touches remain, deactivate touch
        if (event.touches.length === 0) {
            isTouchActive = false;
        }
        
        // Update speed if the state changed
        if (wasTwoFingersPressed !== twoFingersPressed) {
            updateCameraSpeed();
        }
    });
    
    canvas.addEventListener('touchcancel', (event) => {
        if (isTouchActive) {
            isTouchActive = false;
            twoFingersPressed = false;
            updateCameraSpeed();
        }
    });
    

    
    // Check if we're on a mobile device
    function isMobileDevice() {
        return window.innerWidth < 1024;
    }
    
    // Mobile UI helpers
    function createMobileHint(message, isPrompt = false) {
        const hint = document.createElement('div');
        hint.className = 'mobile-hint' + (isPrompt ? ' gyro-prompt' : '');
        hint.textContent = message;
        document.body.appendChild(hint);
        return hint;
    }
    
    function showMobileHint(hint, duration = 3000) {
        hint.classList.add('show');
        if (duration > 0) {
            setTimeout(() => {
                hint.classList.remove('show');
                setTimeout(() => {
                    if (hint.parentNode) {
                        hint.parentNode.removeChild(hint);
                    }
                }, 300);
            }, duration);
        }
    }
    
    // Initialize mobile features
    if (isMobileDevice()) {

        const hints = [
            "🖱️ Touch and drag to change camera angle",
            "⚡ Touch with two fingers and drag to change camera position"
        ];
        
        const hintDuration = 4000; // 4 seconds display time
        const fadeOutDuration = 300; // fade-out animation duration
        
        hints.forEach((hint, index) => {
            const hintElement = createMobileHint(hint);
            // Calculate delay: first hint starts at 1s, each subsequent hint starts after previous one completely finishes
            const delay = 1000 + (index * (hintDuration + fadeOutDuration));
            setTimeout(() => showMobileHint(hintElement, hintDuration), delay);
        });
    } else {
        // Desktop UI
        const hints = [
            "💡 Scroll to zoom in/out",
            "🖱️ Left click + drag to rotate camera",
            "⚡ Hold Ctrl + left click + drag to change camera position",
            "🎯 Use mouse wheel for precise zoom control"
        ];
        
        const hintDuration = 4000; // 4 seconds display time
        const fadeOutDuration = 300; // fade-out animation duration
        
        // Show hints sequentially - each starts after the previous one completely disappears
        hints.forEach((hint, index) => {
            const hintElement = createMobileHint(hint);
            // Calculate delay: first hint starts at 1s, each subsequent hint starts after previous one completely finishes
            const delay = 1000 + (index * (hintDuration + fadeOutDuration));
            setTimeout(() => showMobileHint(hintElement, hintDuration), delay);
        });
    }

    return camera;
} 