/**
 * An object capable of performing orbital camera control using mouse inputs.
 * The class @implements {CameraObject}, for use in common 3d stacks.
 */
export class CameraController {

    constructor(radialSensitivity = 0.01, tangentSensitivity = 0.1 ) {

        this.angle = 0;
        this.radius = 20;
        this.clickPos = null;
        this.rSense = radialSensitivity;
        this.tSense = tangentSensitivity;
        this.registerClickCallback()
    }

    /**
     * Registers callbacks to enable handling mouse movement.
     */
    registerClickCallback() {

        // On click
        document.onmousedown = event => {
            if (!this.clickPos)
                this.clickPos = {x: event.x, y: event.y};
            
            // On move
            document.onmousemove = event => {
                this.angle = this.angle + -1*(event.x - this.clickPos.x)*this.tSense;
                this.radius = this.radius + (event.y - this.clickPos.y)*this.rSense;
                this.clickPos = {x: event.x, y: event.y};
            }
        }

        // On release
        document.onmouseup = () => {
            document.onmousemove = null;
            this.clickPos = null;
        }
    }

    /**
     * Generates the perspective matrix of the camera, depending on the window sizing.
     * @returns {number[]} A perspective matrix.
     */
    get perspectiveMatrix() {
        return glMatrix.mat4.perspective([],
            60*Math.PI/180, // Vertical resolution
            window.innerWidth/window.innerHeight, // Aspect-ratio
            10000, // Max dist
            0.01, // Min dist
        );
    }

    /**
     * Generates the view matrix of the camera, depending on the camera position and orientation.
     * @returns {number[]} A view matrix.
     */
    get viewMatrix() {

        const angleInRad = this.angle*Math.PI/180;

        // ViewMatrix = CameraModelMatrix^(-1)
        return glMatrix.mat4.invert([],

            // compute CameraModelMatrix
            glMatrix.mat4.fromRotationTranslationScale([], 
                glMatrix.quat.fromEuler([], ...[0, this.angle, 0]), // Look at the center
                [this.radius*Math.sin(angleInRad), 0, this.radius*Math.cos(angleInRad)], // Orbit the object using polar coordinates
                [1, 1, 1] // No scaling
            )
        );
    }
}