import { BoidActor } from './actor.js';
import { quaternionFromAxisAngle } from './utils.js';
import frag from './shaders/boid_frag.js'
import vert from './shaders/boid_vert.js'
import model from './models/boid_fish.js'


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

        // Setup REGL
        const elem = document.getElementById(canvasElementId);
        this.canvas = createREGL(elem);
        this.resolution = [elem.height, elem.width]

        // Register camera
        this.camera = camera;

        // Compile shaders
        this.boidShader = this.compileBoidShader();
    }

    /**
     * Compiles the Shaders needed to draw boids.
     * @returns A callable WebGL program. 
     */
    compileBoidShader() {
      return this.canvas({
        frag: frag,
        vert: vert,
        attributes: {
          position: model.vertex,
          normal: model.normal
        },
        depth: {
          enable: true,
          mask: true,
          func: '>',
          range: [0, 1]
        },
        elements: model.faces,
        uniforms: {
          resolution: this.resolution,
          intensity: 1,
          objColor: [0.5, 0.7, 1.0],
          emission: 0.0,
          viewMatrix: this.canvas.prop('viewMatrix'),
          modelMatrix: this.canvas.prop('modelMatrix'),
          perspectiveMatrix: this.canvas.prop('perspectiveMatrix'),
        }
      })
    }

    /**
     * Draws the aquarium background on the controlled canvas.
     */
    paintBackground() {
      this.canvas.clear({
        color: [1.0, 0.5, 0.3, 1.0],
        depth: 0
      })
    }
    
    /**
     * Draws all boids inputted on the controlled canvas.
     * @param {PaintableBoid[]} boids An array of boids to be painted on to the canvas.
     */
    paintBoids(boids) {

      const paintableBoids = boids.map(boid => { return {
        perspectiveMatrix: this.camera.perspectiveMatrix,
        viewMatrix: this.camera.viewMatrix,
        modelMatrix: actorToModel(boid)
      }});

      this.boidShader(paintableBoids);
    }
}


/**
 * A PaintableBoid is an object that can be drawn by a Painter.
 * 
 * @typedef {Object} PaintableBoid
 * @property {number[]} viewMatrix The view matrix of the boid, regarding the position and heading of a camera.
 * @property {number[]} modelMatrix The view matrix of the boid, regarding the position and heading of a camera.
 * @property {number[]} perspectiveMatrix A perspective matrix from a camera.
 * @property {number[]} position The current boid position.
 * @property {number[]} heading The unitary vector corresponding to the moving direction.
 */

/**
 * A CameraObject is an object representing a camera in the scene.
 * 
 * @typedef {Object} CameraObject
 * @property {number[]} viewMatrix The view matrix, regarding the position and heading of a camera.
 * @property {number[]} perspectiveMatrix The perspective matrix of the camera.
 */


/**
 * Creates a model matrix from the position, orientation and scale of a boid.
 * @param {BoidActor} actor The boid actor to be painted.
 * @returns {number[]} A model matrix.
 */
function actorToModel(actor) {

  // Converts radians to degrees
  const k = 180/Math.PI
  const scale = 0.2; // draw scale

  // Direction vector to euler angles.
  const orientation = glMatrix.quat.fromEuler([], 
    -glMatrix.vec3.dot(actor.orientation.axis, [0,1,0])*90, // up and down
    Math.acos(actor.orientation.axis[2])*k*(actor.orientation.axis[0]/Math.abs(actor. orientation.axis[0])),
    90,
  )
  // const orientation = quaternionFromAxisAngle(actor.orientation)
  // Model matrix
  return glMatrix.mat4.fromRotationTranslationScale([], 
    orientation,
    actor.position, 
    [scale,scale,scale]
  );
}
