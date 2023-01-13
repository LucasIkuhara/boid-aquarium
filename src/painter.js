import { BoidActor } from './actor.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Responsible for interacting with the canvas element to draw objects on it.
 */
export class Painter {

	/**
	 * Generates a new Painter. 
	 * @constructor
	 * @param {string} canvasElementId The element id of a canvas element.
	 * @param {CameraObject} camera The camera through which the scene is viewed.
	 */
	constructor(canvasElementId, camera) {
	this.isLoading = true;

	// Setup THREE.js
	const canvas = document.querySelector(`#${canvasElementId}`);
	this.renderer = new THREE.WebGLRenderer({canvas});

	this.scene = new THREE.Scene()
	this.isSceneReady = false;

	// Register camera
	this.camera = camera;

	}

	/**
	 * Loads the boid model from the .glb file and saves its geometry to @property boidModel.
	 */
	async loadModels() {

		try{
			const loader = new GLTFLoader();
			const model = await loader.loadAsync('./models/boid_fish.glb');
			this.boidModel = model.scene.children[0].geometry;
		} 

		catch(error) {
			throw Error(`Failed to load Boid model: ${error}`)
		}
	}

	/**
	 * Adds a Mesh object for each boid actor and creates a cube representing the walls of
	 * the aquarium.
	 * 
	 * @param {BoidActor[]} boids An array of boids which must be created in the scene.
	 * @param {import('./tank.js').EnvConfig} env An object representing the current environment.
	 */
	setupScene(boids, env) {

		const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
		this.scene.add(new THREE.DirectionalLight());

		/**
		 * A Map from Boid Actor Ids to THREE scene objects
		 * @type {Map<Number, THREE.Mesh>}
		 */
		this.boidObjs = new Map();

		// Create an Object3D and add it to the scene for each boidActor
		boids.forEach(boid => {

			const boidObj =  new THREE.Mesh(this.boidModel, material);

			// Required for allowing manual pose updates
			boidObj.matrixAutoUpdate = false;

			// Add to map for tracking and add to the scene
			this.boidObjs.set(boid._id, boidObj);
			this.scene.add(boidObj);
		});

		// Create aquarium walls
		this.scene.add(new THREE.Mesh(
			new THREE.BoxGeometry(...env.tankSize.map(n => n*2)),
			new THREE.MeshBasicMaterial({color: 0x44aa88, wireframe: true})
		))

		this.isSceneReady = true;
	}

	/**
	 * Draws all boids inputted on the controlled canvas.
	 * @param {PaintableBoid[]} boids An array of boids to be painted on to the canvas.
	 */
	paintScene(boids, env) {

		// Setup scene before running for the first time
		if (!this.isSceneReady) this.setupScene(boids, env);

		// Update pose for all boids
		boids.forEach(actor => {
			const obj = this.boidObjs.get(actor._id);
			obj.matrix = actorToModel(actor);
		})

		// Render a new frame
		this.renderer.render(this.scene, this.camera.threeCamera);
	}
}


/**
 * A PaintableBoid is an object that can be drawn by a Painter.
 * 
 * @typedef {Object} PaintableBoid
 * @property {number} _id The identifier for a given boid.
 * @property {number[]} position The current boid position.
 * @property {import('./utils.js').AxisAngle} orientation The unitary vector corresponding to the moving direction.
 */

/**
 * A CameraObject is an object representing a camera in the scene.
 * 
 * @typedef {Object} CameraObject
 * @property {number[]} viewMatrix The view matrix, regarding the position and heading of a camera.
 * @property {number[]} perspectiveMatrix The perspective matrix of the camera.
 * @property {THREE.Camera} threeCamera A THREE.js camera object representing the controlled camera.
 */

/**
 * Creates a model matrix from the position, orientation and scale of a boid.
 * @param {PaintableBoid} actor The boid actor to be painted.
 * @returns {THREE.Matrix4} A model matrix.
 */
function actorToModel(actor) {

	const matrix = new THREE.Matrix4();

	// Set rotation
	matrix.makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(
		new THREE.Vector3(1, 0, 0),
		new THREE.Vector3(...actor.orientation.axis)
	));

	// Set position
	matrix.setPosition(new THREE.Vector3(...actor.position));

	// Set scale
	const scale = 1.0;
	matrix.scale(new THREE.Vector3(scale, scale, scale))

	return matrix;
}
