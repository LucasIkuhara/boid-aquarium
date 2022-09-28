import { Painter } from "./painter.js"
import { BoidActor } from "./actor.js"


export class BoidTank {

    /**
     * Creates a new BoidTank.
     * @constructor
     * @param {Painter} painter A Painter object.
     * @param {EnvConfig} env The tank environment settings.
     * @param {boolean} debug Enable debugging logs.
     */
    constructor(painter, env, debug=false) {

        this.env = env;
        this.painter = painter;
        this.frame = 0;
        this.debug = debug;

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

        if (this.debug) {
            this.frame++;
            console.log("[FRAME]:", this.frame)
        }
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

    /** The nominal boid moving speed per second. */
    boidSpeed = 40;
}
