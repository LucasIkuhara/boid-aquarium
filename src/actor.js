import * as THREE from 'three';
const vec3 = glMatrix.vec3;
import { random, applyNoiseToAxisAngle, lerp } from './utils.js';

/** Type imports 
 * @typedef {import('./utils').AxisAngle} AxisAngle
 * @typedef {import('./utils').Pose} Pose
 * */

/**
 * Defines the behavior of a boid, by providing parameters for its actions.
 * @typedef {object} BoidCfg
 * @property {number} viewingRange How far the boid can see peers from.
 * @property {number} tooClose The minimum distance boids can be from the group before
 * they start going away from it.
 * @property {number} tooFar The maximum distance boids can be from the group before they
 * start going towards it.
 * @property {number} turnSpeed How much a boid can turn per unit of time (1 means the boid can turn to
 * any direction within 1 second, higher values make it faster).
 * @property {number} randomness How random or deterministic the boid moving direction is.
 * Noise is added to their intended movement direction, to make them more natural. randomness is
 * the scale of the noise compared to the movement (eg. randomness=1 means 1/2 of the movement is
 * determined by noise).
 * @property {number} boidSpeed The nominal boid moving speed per second. 
 */

/**
 * Defines the behavior of the blinking in a blinking boid.
 * @typedef {object} BlinkCfg
 * @property {number} maxBrightness The maximum intensity of each blink (from 0 to 1).
 * @property {number} minBrightness The minimum intensity of each blink (from 0 to 1).
 * @property {number} accumulationRate The amount of excitement increase of each boid in isolation per second.
 * @property {number} empathyFactor The amount of excitement gained when observing a peer blink.
 * @property {number} colorSaturation The saturation of the blinking color from (from 0 to 100).
 * @property {number} colorAccumulationRate The amount of change in color per second in isolation.
 * @property {number} colorEmpathyFactor The amount of excitement gained when observing a peer complete a color circle.
 */

/**
 * Represents an agent that follows Boid behavior.
 * Each boid has the capability to turn itself, to move forward and to look for peers
 * in a given range. Following a simple rule set, each boid decides alone on its actions, 
 * but can exhibit very interesting behavior as a group. Their rules are:
 * - Boids avoid getting to close to other boids they can see to avoid colliding;
 * - Boids try to get closer to other boids they see, as they are social creatures;
 * - Boids, when they consider their distance to the group appropriate, 
 * try to go in the same direction as others;
 */
export class BoidActor {

    // Keep state of all boids accessible
    static boidCount = 0;
    static peers = [];

    /**
     * Creates a new BoidActor.
     * @constructor
     * @param {import('./tank.js').EnvConfig} environment The settings of the environment the boid is in.
     * @param {BoidCfg} config The parameters for boid decision-making.
     */
    constructor(environment, config) {

        // Behavior parameters
        this.env = environment;
        this.cfg = config;

        // Generate Boid ID and add to peers
        this.constructor.boidCount++;
        this._id = this.constructor.boidCount;
        this.constructor.peers.push(this);
        this.visiblePeers = [];

        // ! refactor
        this.position = [
            random(this.env.tankSize[0]), 
            random(this.env.tankSize[1]), 
            this.env.is2dSpace ? 0 : random(this.env.tankSize[2])
        ]

        /**
         * @type {AxisAngle}
         * Start with a random orientation
         * Uses Axis-angle representation.
         */
        this.orientation = {
            axis: [
                random(0.5), 
                random(0.5), 
                this.env.is2dSpace ? 0 : random(0.5)
            ],
            angle: random(2*Math.PI)
        }

    }

    static resetBoidSim() {
        this.boidCount = 0;
        this.peers = [];
    }

    /**
     * Computes the next step in the boid simulation. Updates the object's position and heading.
     */
    act() {
        this.visiblePeers = this.getVisiblePeers();
        const orientation = this.computeOrientation();
        this.orientation = applyNoiseToAxisAngle(orientation, this.cfg.randomness);
        this.position = this.computePosition();
    }

    /**
     * Computes the new boid position based on its current position, heading and speed.
     * @returns The new position as a number[] of size 3.
     */
    computePosition() {

        // Factor accounting for time step and speed
        const moveBy = this.cfg.boidSpeed * this.env.timeStepInSecs;

        // Compute movement vector and new position
        const displacementVector = vec3.scale([], this.orientation.axis, moveBy);
        let pos = vec3.add([], this.position, displacementVector);

        // Make the boids bounce back, in case they are escaping the tank
        pos.forEach((val, index) => {

            if (val > this.env.tankSize[index]) 
                this.orientation.axis[index] = -Math.abs(this.orientation.axis[index]);

            else if (val < -this.env.tankSize[index])
                this.orientation.axis[index] = Math.abs(this.orientation.axis[index]);

        });

        return pos;
    }

    /**
     * Computes a new orientation based on its peers.
     * This is the core of boid grouping behavior.
     * @returns {AxisAngle} The new orientation for that boid.
     */
    computeOrientation() {

        // Get all visible neighbors. If there aren't any, keep current course.
        if (this.visiblePeers.length < 1)  return this.orientation

        // If there are visible peers, compute new orientation based on them.
        let newOrientation = { axis: null, angle: this.orientation.angle };
        const turnRate = this.cfg.turnSpeed * this.env.timeStepInSecs;

        // Compute the average position and heading of visible peers.
        const avg = this.constructor.averagePeers(this.visiblePeers);

        const boidToPeers = vec3.subtract([], avg.position, this.position);
        const distance = vec3.len(boidToPeers);

        // Aggregation, Separation and Cohesion behaviors
        // Move closer
        if (distance < this.cfg.tooClose) 
            newOrientation.axis = vec3.lerp([], this.orientation.axis, vec3.negate([], boidToPeers), turnRate);

        // Move farther
        else if (distance > this.cfg.tooFar) 
            newOrientation.axis = boidToPeers

        // Move alongside
        else {
            newOrientation.axis = avg.orientation.axis  
            newOrientation.angle =  avg.orientation.angle   
        }

        return newOrientation;
    } 

    /**
     * Returns the list of boids that are in visible range of the actor, excluding itself.
     * @returns {BoidActor[]} An array of boids in range.
    */
    getVisiblePeers() {

        return this.constructor.peers.filter(boid => {
           
            // Exclude itself
            if (boid._id === this._id) return false;
            
            return vec3.distance(this.position, boid.position) < this.cfg.viewingRange;
        })
    }

    /**
     * Computes the average pose of a group of BoidActors.
     * @param {BoidActor[]} peers A group of boids.
     * @returns {Pose} The average position and orientation of all boids in the group.
     */
    static averagePeers(peers) {

        // Accumulate all headings and positions
        let avg = peers.reduce(
            (prev, curr) => ({
                position: vec3.add([], prev.position, curr.position),
                orientation: {
                    axis: vec3.add([], prev.orientation.axis, curr.orientation.axis),
                    angle: prev.orientation.angle + curr.orientation.angle
                }
            }),
        {position: [0,0,0], orientation: {axis: [0,0,0], angle: 0}});
  
        // Vector normalization
        avg = {
            position: vec3.scale([], avg.position, 1/peers.length),
            orientation: {
                axis: vec3.normalize([], avg.orientation.axis),
                angle: avg.orientation.angle/(peers.length)
            }
        };

        return avg;
    }
}

/**
 * A variant of @type {BoidActor}, which behaves like the original, but has the additional
 * capability to blink in different colors. Boids of this type tend to blink together in the same
 * color as peers if exposed to them long enough.
 */
export class BlinkingActor extends BoidActor {

    /**
     * Creates a new BlinkingActor.
     * @constructor
     * @param {import('./tank.js').EnvConfig} environment The settings of the environment the boid is in.
     * @param {BoidCfg} config The parameters for boid decision-making.
     * @param {BlinkCfg} blinkCfg The parameters for boid blinking behavior.
     */
    constructor(environment, config, blinkCfg) {
        super(environment, config);

        this.blinkCfg = blinkCfg;
        this.phase = Math.random()*360;
        this.excitement = Math.random();
    }

    /**
     * Compute the normal behavior of a @type {BoidActor}, with some additional
     * distributed color matching logic. Boids should sync their color and blink timings
     * by observing others. Seeing a peer blink (or change colors) increases the urge of
     * a @type {BlinkingBoid} to do so, generating the emergent behavior of synchrony.
     */
    act() {
        super.act();
        this.excitement = this.computeExcitement();
        this.phase = this.computeColorPhase();
    }

    /**
     * Computes the color of the boid's light emissions based on time passage and peers.
     * The phase increases with time and also upon seeing other boids reset their phase (ie. seeing a boid
     * with a phase value critically close to 360, with the definition of criticality depending on the 
     * colorEmpathyFactor). If the phase exceeds 360, it will be reset in the next simulation step.
     * @returns {number} The degree component of an HSL color.
     */
    computeColorPhase() {

        // If the boid just blinked, reset gradient
        if (this.phase > 360) return 0;

        // Passive isolated color change
        let phase = this.phase + this.env.timeStepInSecs * this.blinkCfg.colorAccumulationRate;

        // Empathetic color change
        this.visiblePeers.forEach(peer => {
            if (peer.phase > 360 - this.blinkCfg.colorEmpathyFactor) 
                phase = phase + this.blinkCfg.colorEmpathyFactor;
        })

        return phase;
    }

    /**
     * Calculate the excitement gradient of the boid, which controls blinking.
     * The boid's excitement is visible to peers once the gradient is critically close to 1
     * (less than the value of empathyFactor away). If the gradient exceeds 1, it will reset
     * next step.
     * @returns {number} The new excitement gradient value based on time passage and peers.
     */
    computeExcitement() {

        // If the boid just blinked, reset gradient
        if (this.excitement > 1) return 0;

        // Passive isolated excitement growth
        let excitement = this.excitement + this.env.timeStepInSecs * this.blinkCfg.accumulationRate;

        // Empathetic excitement growth
        this.visiblePeers.forEach(peer => {
            if (peer.excitement > 1 - this.blinkCfg.empathyFactor) 
                excitement += this.blinkCfg.empathyFactor;
        })

        return excitement;
    }

    /**
     * The parameters of light emission from the blinking boid.
     */
    get emission() {
        return {
            color: new THREE.Color(`hsl(${this.phase}, ${this.blinkCfg.colorSaturation}%, 50%)`),
            intensity: this.computeIntensity()
        }
    }

    /**
     * Applies a function to convert excitement into blinking brightness.
     */
    computeIntensity() {

        const val = this.excitement < 0.5 ?
        Math.pow(this.excitement + 0.5, 6) :
        Math.pow(this.excitement - 1.5, 6)

        // Ensure intensity is in the [minBrightness, maxBrightness] interval
        const normalized = Math.max(Math.min(val, this.blinkCfg.maxBrightness), this.blinkCfg.minBrightness);
        return normalized;
    }
}

/**
 * Resets static properties in Boid Species, allowing the simulation
 * to be restarted.
 */
export function resetBoids() {
    BoidActor.resetBoidSim();
    BlinkingActor.resetBoidSim();
}
