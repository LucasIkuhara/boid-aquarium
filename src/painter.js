import frag from './shaders/boid_frag.js'
import vert from './shaders/boid_vert.js'


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
          position: [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1]
          ]
        },
        depth: {
          enable: false
        },
        primitive: "triangle fan",
        blend: {
          enable: false,
          func: {
            srcRGB: "src alpha",
            srcAlpha: 1,
            dstRGB: "one minus src alpha",
            dstAlpha: 1
          }
        },
    
        count: 4,
    
        uniforms: {
          resolution: this.resolution,
          intensity: 1,
          start: this.canvas.prop('position'),
          end: [20, 300],
          color: [1.0, 1.0, 1.0, 1.0]
        }
      })
    }

    /**
     * Draws the aquarium background on the controlled canvas.
     */
    paintBackground() {
      this.canvas.clear({
        color: [1.0, 0.5, 0.3, 1.0]
      })
    }
    
    /**
     * Draws a boid on the controlled canvas.
     * @param {PaintableBoid} boid A boid to be painted on to the canvas.
     */
    paintBoid(boid) {
      this.boidShader(boid);
    }
}


/**
 * A PaintableBoid is an object that can be drawn by a Painter.
 * 
 * @typedef {Object} PaintableBoid
 * @property {number[]} position The current boid position.
 * @property {number[]} heading The unitary vector corresponding to the moving direction.
 */
