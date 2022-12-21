const vec3 = glMatrix.vec3;


export class BoidActor {

    // Keep state of all boids accessible
    static boidCount = 0;
    static peers = [];

    /**
     * Creates a new BoidActor.
     * @constructor
     * @param {EnvConfig} environment The settings of the environment the boid is in.
     */
    constructor(environment) {
        
        this.env = environment;

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

        this.viewingRange = 0.5;

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

        const visiblePeers = this.getVisiblePeers();
        if (visiblePeers.length < 1) return this.heading;
        
        const avg = visiblePeers.reduce(
            (prev, curr) => { 
                return {
                position: vec3.add([], prev.position, curr.position),
                heading: vec3.add([], prev.heading, curr.heading)
            }},
        {position: [0,0,0], heading: [0,0,0]})
        
        const newHeading = vec3.lerp([], this.heading, avg.heading, 0.5);
        return vec3.normalize([], newHeading)
    } 

    /**
     * Returns the list of boids that are in visible range of the actor, excluding itself.
     * @returns {BoidActor[]} An array of boids in range.
     */
    getVisiblePeers() {
        return BoidActor.peers.filter(boid => {
            
            // Exclude itself
            if (boid._id === this._id) return false;
            
            return vec3.distance(this.position, boid.position) < this.viewingRange;
        })
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
