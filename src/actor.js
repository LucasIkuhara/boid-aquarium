const vec3 = glMatrix.vec3;


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
     * @param {EnvConfig} environment The settings of the environment the boid is in.
     * @param {BoidCfg} config The parameters for boid decision-making.
     */
    constructor(environment, config) {

        // Behavior parameters
        this.env = environment;
        this.cfg = config;

        // Generate Boid ID and add to peers
        BoidActor.boidCount++;
        this._id = BoidActor.boidCount;
        BoidActor.peers.push(this);

        // ! refactor
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
        this.heading = this.computeHeading()
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

        // Make the boids bounce back, in case they are escaping the tank
        pos.forEach((val, index) => {
            if (Math.abs(val) > this.env.tankSize[index]) 
                this.heading[index] = -this.heading[index];
        });

        return pos;
    }

    /**
     * Computes a new heading based on its peers.
     * This is the core of boid grouping behavior.
     * @returns {number[]} The new heading for that boid.
     */
    computeHeading() {

        let newHeading;
        const turnRate = this.cfg.turnSpeed * this.env.timeStepInSecs;

        // Get all visible neighbors. If there aren't any, keep course,
        // but with noise applied to the new heading.
        const visiblePeers = this.getVisiblePeers();
        if (visiblePeers.length < 1) 
            return applyNoiseToVec3(this.heading, this.cfg.randomness);
        
        // Compute the average position and heading of visible peers.
        const avg = BoidActor.averagePeers(visiblePeers);

        const boidToPeers = vec3.subtract([], avg.position, this.position);
        const distance = vec3.len(boidToPeers);
        
        // Move closer
        if (distance < this.cfg.tooClose)
        newHeading = vec3.lerp([], this.heading, vec3.inverse([], boidToPeers), turnRate);    
        
        // Move farther
        if (distance > this.cfg.tooFar)
        newHeading = vec3.lerp([], this.heading, boidToPeers, turnRate);

        // Move alongside
        else
            newHeading = vec3.lerp([], this.heading, avg.heading, turnRate);

        // Add randomness
        return applyNoiseToVec3(newHeading, this.cfg.randomness)
    } 
    
    /**
     * Returns the list of boids that are in visible range of the actor, excluding itself.
     * @returns {BoidActor[]} An array of boids in range.
    */
   getVisiblePeers() {
       return BoidActor.peers.filter(boid => {
           
           // Exclude itself
           if (boid._id === this._id) return false;
           
           return vec3.distance(this.position, boid.position) < this.cfg.viewingRange;
        })
    }

    /**
     * Computes the average pose of a group of BoidActors.
     * @param {BoidActor[]} peers A group of boids.
     * @returns {BoidPose} The average position and heading of all boids in the group.
     */
    static averagePeers(peers) {

        let count = 0;

        // Accumulate all headings and positions
        let avg = peers.reduce(
            (prev, curr) => { 
                count++;
                return {
                position: vec3.add([], prev.position, curr.position),
                heading: vec3.add([], prev.heading, curr.heading)
            }},
        {position: [0,0,0], heading: [0,0,0]});

        // Vector normalization
        avg = {
            position: vec3.scale([], avg.position, 1/count),
            heading: vec3.normalize([], avg.heading)
        };

        return avg;
    }
}

/**
 * Represents the pose of a Boid. Contains their position and heading.
 * @typedef {object} BoidPose
 * @property position: vec3.scale([], avg.position, 1/count),
 * @property heading: vec3.normalize([], avg.heading)
*/

/**
 * Generates a random number, either positive or negative in the scale given [scale, scale]
 * @param {number} scale 
 * @returns A random number.
*/
function random(scale) {
    return ((Math.random()*2)-1)*scale;
    
}

/**
 * Applies random noise to the given vector.
 * 
 * @param {readonly number[]} x The input vector
 * @param {number} scale The scale (norm) of the noise vector.
 * @param {boolean} normalize Wether to normalize the output.
 * Will always return a unit-vector if enabled. Defaults to true.
 * 
 * @returns {number[]} The original vector with noise applied to it.
 */
function applyNoiseToVec3(x, scale, normalize=true) {
    
    // Add noise
    let noisyVec = vec3.add([], 
        x, 
        vec3.random([], scale)
    )

    // Transform to a unit-vector
    if (normalize)
        noisyVec = vec3.normalize([], noisyVec);

    return noisyVec;
}
