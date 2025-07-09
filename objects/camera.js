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
    const fastMultiplier = 3; // Make movement 3x faster when Ctrl is pressed or touch is detected
    
    camera.wheelDeltaPercentage = normalWheelSpeed;
    camera.angularSensibilityX = normalRotationSpeed;
    camera.angularSensibilityY = normalRotationSpeed;
    
    // Track control states
    let isCtrlPressed = false;
    let isTouchActive = false;
    let isFastMode = false;
    
    // Mobile device orientation variables
    let isDeviceOrientationSupported = false;
    let deviceOrientationPermissionGranted = false;
    let lastAlpha = null;
    let lastBeta = null;
    let orientationSensitivity = 0.02; // Adjust this to change gyroscope sensitivity
    
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
    
    // Device orientation support for mobile gyroscope
    function requestDeviceOrientationPermission() {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ requires permission
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        deviceOrientationPermissionGranted = true;
                        enableDeviceOrientation();
                    } else {
                        console.log('Device orientation permission denied');
                    }
                })
                .catch(error => {
                    console.error('Error requesting device orientation permission:', error);
                });
        } else if (typeof DeviceOrientationEvent !== 'undefined') {
            // Android and older iOS versions
            deviceOrientationPermissionGranted = true;
            enableDeviceOrientation();
        } else {
            console.log('Device orientation not supported');
        }
    }
    
    function enableDeviceOrientation() {
        isDeviceOrientationSupported = true;
        
        window.addEventListener('deviceorientation', (event) => {
            if (!deviceOrientationPermissionGranted) return;
            
            // Get orientation values
            const alpha = event.alpha; // Z axis rotation (compass heading)
            const beta = event.beta;   // X axis rotation (front-back tilt)
            const gamma = event.gamma; // Y axis rotation (left-right tilt)
            
            if (alpha !== null && beta !== null && lastAlpha !== null && lastBeta !== null) {
                // Calculate change in orientation
                let deltaAlpha = alpha - lastAlpha;
                let deltaBeta = beta - lastBeta;
                
                // Handle wraparound for alpha (0-360 degrees)
                if (deltaAlpha > 180) deltaAlpha -= 360;
                if (deltaAlpha < -180) deltaAlpha += 360;
                
                // Apply orientation changes to camera
                // Alpha controls horizontal rotation (left-right movement)
                camera.alpha -= deltaAlpha * orientationSensitivity;
                
                // Beta controls vertical rotation (up-down movement)
                camera.beta += deltaBeta * orientationSensitivity;
                
                // Ensure beta stays within limits
                camera.beta = Math.max(camera.lowerBetaLimit, Math.min(camera.upperBetaLimit, camera.beta));
            }
            
            // Store current values for next frame
            lastAlpha = alpha;
            lastBeta = beta;
        });
    }
    
    // Check if we're on a mobile device and try to enable orientation
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
        // Show touch controls hint
        const touchHint = createMobileHint('Touch the screen for faster camera movement');
        setTimeout(() => showMobileHint(touchHint, 4000), 1000);
        
        // Add a touch prompt for iOS permission (since it requires user interaction)
        const enableOrientationIfNeeded = () => {
            if (!isDeviceOrientationSupported) {
                // Show gyroscope permission prompt for iOS
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    const gyroPrompt = createMobileHint('Tap here to enable tilt controls', true);
                    gyroPrompt.addEventListener('click', () => {
                        requestDeviceOrientationPermission();
                        gyroPrompt.classList.remove('show');
                        setTimeout(() => {
                            if (gyroPrompt.parentNode) {
                                gyroPrompt.parentNode.removeChild(gyroPrompt);
                            }
                        }, 300);
                    });
                    setTimeout(() => showMobileHint(gyroPrompt, 0), 5000); // Show indefinitely until clicked
                } else {
                    requestDeviceOrientationPermission();
                }
            }
        };
        
        // Try to enable orientation on first touch (for iOS)
        canvas.addEventListener('touchstart', enableOrientationIfNeeded, { once: true });
        
        // Also try to enable it immediately for Android
        setTimeout(() => {
            if (!isDeviceOrientationSupported) {
                requestDeviceOrientationPermission();
            }
        }, 1000);
        
        // Show orientation success message
        const originalEnableFunction = enableDeviceOrientation;
        enableDeviceOrientation = function() {
            originalEnableFunction();
            const successHint = createMobileHint('✓ Tilt controls enabled! Move your device to look around');
            setTimeout(() => showMobileHint(successHint, 3000), 500);
        };
    }

    return camera;
} 