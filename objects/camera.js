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
    
    // Default speeds
    const normalWheelSpeed = 0.01;
    const normalRotationSpeed = 5000;
    const fastMultiplier = 20; // Make movement 3x faster when Ctrl is pressed or touch is detected
    
    camera.wheelDeltaPercentage = normalWheelSpeed;
    camera.angularSensibilityX = normalRotationSpeed;
    camera.angularSensibilityY = normalRotationSpeed;
    
    // Track control states
    let isCtrlPressed = false;
    let isTouchActive = false;
    let isFastMode = false;
    

    
    // Function to update camera speed based on current state
    function updateCameraSpeed() {
        const shouldBeFast = isCtrlPressed || isTouchActive;
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
            updateCameraSpeed();
        }
    });
    
    canvas.addEventListener('touchend', (event) => {
        if (isTouchActive) {
            isTouchActive = false;
            updateCameraSpeed();
        }
    });
    
    canvas.addEventListener('touchcancel', (event) => {
        if (isTouchActive) {
            isTouchActive = false;
            updateCameraSpeed();
        }
    });
    

    
    // Check if we're on a mobile device
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
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
        // Show touch controls hints (both messages with 1 second delay)
        const hints = [
            "Touch and drag to change camera angle",
            "Touch with two fingers and drag to change camera position"
        ];
        
        // Show first message after 1 second
        const firstHint = createMobileHint(hints[0]);
        setTimeout(() => showMobileHint(firstHint, 4000), 1000);
        
        // Show second message after 2 seconds (1 second after the first)
        const secondHint = createMobileHint(hints[1]);
        setTimeout(() => showMobileHint(secondHint, 4000), 2000);
    }

    return camera;
} 