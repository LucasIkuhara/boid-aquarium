/**
 * An object capable of performing orbital camera control using mouse inputs.
 * The class @implements {CameraObject}, for use in common 3d stacks.
 */
export class CameraController {

    constructor(radialSensitivity = 0.01, tangentSensitivity = 0.01 ) {

        this.angle = 0;
        this.radius = 50;
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
                this.angle = this.angle + (event.x - this.clickPos.x)*this.tSense;
                // this.radius = this.radius + (event.y - this.clickPos.y)*this.rSense;
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
        return glMatrix.mat4.perspective(
            [],
            window.innerHeight,
            window.innerWidth/window.innerHeight,
            0.001,
            null
        );
    }

    /**
     * Generates the view matrix of the camera, depending on the camera postion and orientation.
     * @returns {number[]} A view matrix.
     */
    get viewMatrix() {

        // console.log(this.angle)
        return glMatrix.mat4.invert(
            [],
            glMatrix.mat4.fromRotationTranslationScale(
                [], 
                glMatrix.quat.fromEuler([], ...[0, -this.angle, 0]),
                // [1, 1, 100],
                [this.radius*Math.sin(this.angle), 1, this.radius*Math.cos(this.angle)], 

                [1, 1, 1]
            )
        );
    }
}