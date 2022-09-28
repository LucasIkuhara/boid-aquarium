export class BoidActor {

    static boidCount = 0;

    /**
     * Creates a new BoidActor.
     * @constructor
     * @param {EnvConfig} environment The settings of the environment the boid is in.
     */
    constructor(environment) {
        
        this.env = environment;

        // Generate Boid ID
        BoidActor.boidCount++;
        this._id = BoidActor.boidCount;

        this.position = [
            random(this.env.tankSize[0]), 
            random(this.env.tankSize[1]), 
            this.env.is2dSpace ? 0 : random(this.env.tankSize[2])
        ]

        this.heading = [
            random(0.5), 
            random(0.5), 
            this.env.is2dSpace ? 0 : random(0.5)
        ]

    }

    /**
     * Computes the next step in the boid simulation. Updates the object's position and heading.
     */
    act() {
        this.position = this.computePosition()
    }

    /**
     * Computes the new boid position based on its current position, heading and speed.
     * @returns The new position as a number[] of size 3.
     */
    computePosition() {

        const moveBy = this.env.boidSpeed * this.env.timeStepInSecs;

        let pos = [
            this.position[0] + this.heading[0]*moveBy,
            this.position[1] + this.heading[1]*moveBy,
            this.position[2] + this.heading[2]*moveBy
        ]

        pos.forEach((val, index) => {
            pos[index] = Math.abs(val) > this.env.tankSize[index] ? -val : val;
        });

        return pos;
    }
}

/**
 * Generates a random number, either positive or negative in the scale given [scale, scale]
 * @param {number} scale 
 * @returns A random number.
 */
 function random(scale) {
    return ((Math.random()*2)-1)*scale;
}
