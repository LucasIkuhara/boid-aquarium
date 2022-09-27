import { PaintableBoid, Painter } from "./painter.js"


export class BoidTank {

    /**
     * 
     * @param {Painter} painter 
     * @param {EnvConfig} env
     *
     */
    constructor(painter, env) {

        this.env = env;
        this.painter = painter;
        this.frame = 0;

        this.boids = []
        for (let i=0; i<env.boidCountTarget; i++) {
            this.boids.push(new BoidActor(env))
        }
    }

    paintAll() {
        this.painter.paintBackground();
        this.boids.forEach(boid => this.painter.paintBoid(boid));
    }

    /**
     * Trigger all boids to compute a new state.
     */
    triggerAll() {
        this.boids.forEach(boid => boid.act());
    }

    /**
     * Advance time in the tank simulation.
     */
    simStep() {
        this.frame++;
        console.log("[FRAME]:", this.frame)
        this.triggerAll();
        this.paintAll()
    }
}


/**
 * Represents the settings of the environment in which the boids are placed in.
 */
class EnvConfig {
    /** Depicts the dimensions of the environment as number[] of length 3. */
    tankSize = [100, 100, 100];

    /** The size of simulation steps in seconds (ex: 0.2s per step), */
    timeStepInSecs = 1;

    /** The desired amount of boids in the tank. */
    boidCountTarget = 10;

    /** Indicates wether or not the boids should be simulated in 2D. */
    is2dSpace = true;
}


class BoidActor extends PaintableBoid {

    static boidCount = 0;

    /**
     * Creates a new BoidActor.
     * @constructor
     * @param {EnvConfig} environment 
     */
    constructor(environment) {
        super()

        this.env = environment;
        console.log(environment)

        // Generate Boid ID
        BoidActor.boidCount++;
        this._id = BoidActor.boidCount;
        this.speed = 40;
        this.tankSize = this.env.tankSize;

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

        const moveBy = this.speed * this.env.timeStepInSecs;

        let pos = [
            this.position[0] + this.heading[0]*moveBy,
            this.position[1] + this.heading[1]*moveBy,
            this.position[2] + this.heading[2]*moveBy
        ]

        pos.forEach((val, index) => {
            pos[index] = Math.abs(val) > this.tankSize[index] ? -val : val;
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