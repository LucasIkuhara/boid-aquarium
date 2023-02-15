import * as THREE from "three";


/**
 * An object capable of performing orbital camera control using mouse inputs.
 * The class @implements {CameraObject}, for use in common 3d stacks.
 */
export class CameraController {

	constructor(canvasElementId, radialSensitivity = 0.01, tangentSensitivity = 0.1 ) {

		// Camera configuration
		this.angle = 0;
		const verticalFov = 45;
		this.clickPos = null;
		this.rSense = radialSensitivity;
		this.tSense = tangentSensitivity;

		// Compute distance so the aquarium always fit the screen vertically, with an arc of theta of leeway
		// above and below. This is basic trigonometry using the size of the aquarium derived from the window size.
		const theta = 3;
		this.radius = (window.innerHeight / 100) / Math.tan((verticalFov/2 - theta)*Math.PI/180) + (window.innerWidth / 100);

		// Create THREE.js Camera
		this._camera = new THREE.PerspectiveCamera(verticalFov, window.innerWidth/window.innerHeight, 0.001, 100);
		this.updateCameraObject();

		// Start tracking mouse clicks and drags
		const canvas = document.getElementById(canvasElementId);
		this.registerClickCallback(canvas);
	}

	/**
     * Registers callbacks to enable handling mouse movement and touch
     * screen events.
     * @param {HTMLElement} canvas The element in which to track movements.
     */
	registerClickCallback(canvas) {

		// On click
		canvas.onmousedown = event => {
			if (!this.clickPos)
				this.clickPos = {x: event.x, y: event.y};
 
			// On mouse move
			canvas.onmousemove = event => {
				this.angle = this.angle + -1*(event.x - this.clickPos.x)*this.tSense;
				this.radius = this.radius + (event.y - this.clickPos.y)*this.rSense;
				this.clickPos = {x: event.x, y: event.y};
				this.updateCameraObject();
			};
		};

		// On mouse release
		canvas.onmouseup = () => {
			canvas.onmousemove = null;
			this.clickPos = null;
		};

		// Touchscreen click
		canvas.ontouchstart = event => {
			if (!this.clickPos)
				this.clickPos = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
            
			// Touchscreen move
			canvas.ontouchmove = event => {
				this.angle = this.angle + -1*(event.targetTouches[0].clientX - this.clickPos.x)*this.tSense;
				this.radius = this.radius + (event.targetTouches[0].clientY - this.clickPos.y)*this.rSense;
				this.clickPos = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
				this.updateCameraObject();
			};
		};

		canvas.ontouchend = canvas.onmouseup;

	}

	/**
     * Update the Three.js camera object with the current orientation and position.
     */
	updateCameraObject() {

		const angleInRad = this.angle*Math.PI/180;

		// Orbit the object using polar coordinates
		this._camera.position.x = this.radius*Math.sin(angleInRad);
		this._camera.position.y = 0;
		this._camera.position.z = this.radius*Math.cos(angleInRad);

		this._camera.lookAt(new THREE.Vector3(0, 0, 0));
	}

	/**
     * Get the camera as a THREE.js Camera object.
     * @returns {THREE.Camera} Camera object.
     */
	get threeCamera() { return this._camera; }

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
