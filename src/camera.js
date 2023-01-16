import * as THREE from 'three';


/**
 * An object capable of performing orbital camera control using mouse inputs.
 * The class @implements {CameraObject}, for use in common 3d stacks.
 */
export class CameraController {

    constructor(radialSensitivity = 0.01, tangentSensitivity = 0.1 ) {

        // Camera configuration
        this.angle = 0;
        this.radius = 30;
        this.clickPos = null;
        this.rSense = radialSensitivity;
        this.tSense = tangentSensitivity;

        // Create THREE.js Camera
        this._camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.001, 100);
        this.updateCameraObject()

        // Start tracking mouse clicks and drags
        this.registerClickCallback()
    }

    /**
     * Registers callbacks to enable handling mouse movement and touch
     * screen events.
     */
    registerClickCallback() {

        // On click
        document.onmousedown = event => {
            if (!this.clickPos)
                this.clickPos = {x: event.x, y: event.y};
 
            // On mouse move
            document.onmousemove = event => {
                this.angle = this.angle + -1*(event.x - this.clickPos.x)*this.tSense;
                this.radius = this.radius + (event.y - this.clickPos.y)*this.rSense;
                this.clickPos = {x: event.x, y: event.y};
                this.updateCameraObject();
            }
        }

        // On mouse release
        document.onmouseup = () => {
            document.onmousemove = null;
            this.clickPos = null;
        }

        // Touchscreen click
        document.ontouchstart = event => {
            if (!this.clickPos)
            this.clickPos = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
            
            // Touchscreen move
            document.ontouchmove = event => {
                this.angle = this.angle + -1*(event.targetTouches[0].clientX - this.clickPos.x)*this.tSense;
                this.radius = this.radius + (event.targetTouches[0].clientY - this.clickPos.y)*this.rSense;
                this.clickPos = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
                this.updateCameraObject();
            }
        }

        document.ontouchend = document.onmouseup;

    }

    /**
     * Update the Three.js camera object with the current orientation and position.
     */
    updateCameraObject() {

        const angleInRad = this.angle*Math.PI/180;

        // Orbit the object using polar coordinates
        this._camera.position.x = this.radius*Math.sin(angleInRad)
        this._camera.position.y = 0
        this._camera.position.z = this.radius*Math.cos(angleInRad)

        this._camera.lookAt(new THREE.Vector3(0, 0, 0))
    }

    /**
     * Get the camera as a THREE.js Camera object.
     * @returns {THREE.Camera} Camera object.
     */
    get threeCamera() { return this._camera }

    /**
     * Generates the perspective matrix of the camera, depending on the window sizing.
     * @returns {THREE.Matrix4} A perspective matrix.
     */
    get perspectiveMatrix() {
        return this._camera.projectionMatrix;
    }

    /**
     * Generates the view matrix of the camera, depending on the camera position and orientation.
     * @returns {THREE.Matrix4} A view matrix.
     */
    get viewMatrix() {

       return this._camera.modelViewMatrix;
    }
}
