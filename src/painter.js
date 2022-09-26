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
        this.resX = elem.height;
        this.resY = elem.width;
    }

    paintBackground() {
      this.canvas.clear({
        color: [1.0, 0.5, 0.3, 1.0]
      })
    }
    
    /**
     * Draws a boid on the controlled canvas.
     * 
     * @param {PaintableBoid} boid A boid to be painted on to the canvas.
     */
    paintBoid(boid) {

        this.canvas({
            frag: `
            precision mediump float;
            uniform vec4 color;
            uniform vec2 start;
            uniform vec2 end;
            uniform vec2 resolution;
            
            void main () {

              // 5%
              float distThresholdInPixels = ((resolution[0] + resolution[1]) / 2.0) * 0.01;

              if (distance(start, gl_FragCoord.xy) > distThresholdInPixels) {
                discard;
              }

              gl_FragColor = vec4(start, 0.0, 1.0);
            
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
              resolution: [this.resX, this.resY],
              intensity: 1,
              start: [(this.resY/2) + boid.position[0], (this.resX/2) + boid.position[1]],
              end: [20, 300],
              color: [1.0, 1.0, 1.0, 1.0]
            }
        })();

    }
}

/**
 * A PaintableBoid is an object that can be drawn by a Painter
 * 
 * @property {number[]} position
 */
export class PaintableBoid {

  position = [0, 0]
  heading = [0, 0]

}