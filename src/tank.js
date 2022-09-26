import { PaintableBoid, Painter } from "./painter.js"


export class BoidTank {

    /**
     * 
     * @param {Painter} painter 
     * @param {number} n 
     * @
     */
    constructor(painter, n=10, tankSize=[10, 10, 10]) {

        this.painter = painter;
        this.frame = 0;
        this.tankSize = tankSize;

        this.boids = []
        for (let i=0; i<n; i++) {
            this.boids.push(new BoidActor(tankSize))
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

class BoidActor extends PaintableBoid {

    static boidCount = 0;

    constructor(tankSize, isIn2dSpace=false) {
        super()

        // Generate Boid ID
        BoidActor.boidCount++;
        this._id = BoidActor.boidCount;
        this.speed = 1;

        this.position = [
            tankSize[0]*Math.random(), 
            tankSize[1]*Math.random(), 
            isIn2dSpace ? 0 : tankSize[2]*Math.random()
        ]

        this.heading = [
            Math.random(), 
            Math.random(), 
            isIn2dSpace ? 0 : Math.random()
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
     * 
     * @returns The new position as a number[] of size 3.
     */
    computePosition() {
        return [
            this.position[0] + this.heading[0]*this.speed,
            this.position[1] + this.heading[1]*this.speed,
            this.position[2] + this.heading[2]*this.speed
        ]
    }
}