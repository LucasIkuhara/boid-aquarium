import { BoidActor } from './actor.js';
import frag from './shaders/boid_frag.js'
import vert from './shaders/boid_vert.js'
import model from './boid_model.js'



/**
 * Responsible for interacting with the canvas element to draw objects on it.
 */
export class Painter {

    /**
     * Generates a new Painter. 
     * @constructor
     * @param {string} canvasElementId The element id of a canvas element.
     */
    constructor(canvasElementId) {

        // Setup REGL
        const elem = document.getElementById(canvasElementId);
        this.canvas = createREGL(elem);
        this.resolution = [elem.height, elem.width]

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
          position: model.pos,
          normal: model.pos
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
          start: this.canvas.prop('position'),
          end: [20, 300],
          color: [1.0, 1.0, 1.0, 1.0],
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
     * Draws a boid on the controlled canvas.
     * @param {PaintableBoid} boid A boid to be painted on to the canvas.
     */
    paintBoid(boid) {
      this.boidShader(actorToPaintable(boid));
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
 * @param {BoidActor} actor The boid actor to be painted.
 */
function actorToPaintable(actor) {
  
  const scale= 0.5;
  const a = {
    perspectiveMatrix: glMatrix.mat4.perspective([], 480, 16/9, 0.001, 10000),
    modelMatrix: glMatrix.mat4.fromRotationTranslationScale(
      [], 
      glMatrix.quat.fromEuler([], 
        Math.acos(actor.heading[0])*(180/Math.PI),
        Math.acos(actor.heading[1])*(180/Math.PI),
        Math.acos(actor.heading[2])*(180/Math.PI)
      ),
      actor.position, 
      [scale,scale,scale]
    ),
    viewMatrix: glMatrix.mat4.invert([], glMatrix.mat4.fromRotationTranslationScale([], glMatrix.quat.fromEuler([], ...[0,0,0]), [0, -3, 1.5], [1,1,1])),
    position: actor.position
  }


  return a

}

