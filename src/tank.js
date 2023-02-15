import { BlinkingActor, BoidActor } from "./actor.js";


/**
 * Represents the settings of the environment in which the boids are placed in.
 * @typedef {object} EnvConfig
 * @property {number[]} tankSize Depicts the dimensions of the environment as number[] of length 3.
 * @property {number} timeStepInSecs The size of simulation steps in seconds (ex: 0.2s per step).
 * @property {number} boidCountTarget The desired amount of boids in the tank.
 * @property {boolean} is2dSpace Indicates wether or not the boids should be simulated in 2D.
 * @property {boolean} useBlinking Indicates wether or not the boids be blinking boids.
 */


export class BoidTank {

	/**
     * Creates a new BoidTank.
     * @constructor
     * @param {Painter} painter A Painter object.
     * @param {EnvConfig} env The tank environment settings.
     * @param {import('./actor').BoidCfg} cfg The parameters for boid creation.
     * @param {import('./actor').BlinkCfg} blinkCfg The parameters for blinking boid creation.
     * @param {boolean} debug Enable debugging logs.
     */
	constructor(painter, env, cfg, blinkCfg, debug=false) {

		this.env = env;
		this.painter = painter;
		this.frame = 0;
		this.debug = debug;

		this.boids = [];
		for (let i=0; i<env.boidCountTarget; i++) {
			this.boids.push(
				env.useBlinking ?
					new BlinkingActor(env, cfg, blinkCfg) :
					new BoidActor(env, cfg)
			);
		}
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
			console.log("[FRAME]:", this.frame);
		}
		this.triggerAll();
		this.painter.paintScene(this.boids, this.env);
	}
}
