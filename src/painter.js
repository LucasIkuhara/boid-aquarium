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
        frag: `
        precision mediump float;
        uniform vec4 color;
        uniform vec3 start;
        uniform vec2 end;
        uniform vec2 resolution;
        
        void main () {

          // Compute position
          vec2 position = resolution.yx / 2.0 + start.xy;

          // 5%
          float distThresholdInPixels = ((resolution[0] + resolution[1]) / 2.0) * 0.006;

          if (distance(position, gl_FragCoord.xy) > distThresholdInPixels) {
            discard;
          }

          gl_FragColor = vec4(position, 0.0, 1.0);
        
        } // End main
        `,
    
        vert: `
        attribute vec2 position;
        void main () {
          gl_Position = vec4(position, 0., 1.);
        }`,
    
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
