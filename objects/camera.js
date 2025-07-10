// Camera setup and configuration
function createCamera(scene, canvas) {
    // Check if we're on a mobile device
    function isMobileDevice() {
        return window.innerWidth < 1024;
    }
    
        
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
    
    camera.wheelPrecision = 50;
    camera.pinchPrecision = 700;
    camera.panningSensibility = isMobileDevice() ? 25 : 100; // Mobile: 25, PC: 100
    camera.allowUpsideDown = false;
    camera.useNaturalPinchZoom = true;
    camera.panningInertia = 0.5
    
    camera.wheelDeltaPercentage = 0.01;
    camera.angularSensibilityX = 2000;
    camera.angularSensibilityY = 2000;

    
    

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