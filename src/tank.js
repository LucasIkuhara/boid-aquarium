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

        if (!tankSize) tankSize = [100, 100 , 100];

        // Generate Boid ID
        BoidActor.boidCount++;
        this._id = BoidActor.boidCount;
        this.speed = 4;
        this.tankSize = tankSize;

        this.position = [
            random(tankSize[0]), 
            random(tankSize[1]), 
            isIn2dSpace ? 0 : random(tankSize[2])
        ]

        this.heading = [
            random(0.5), 
            random(0.5), 
            isIn2dSpace ? 0 : random(0.5)
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
        let pos = [
            this.position[0] + this.heading[0]*this.speed,
            this.position[1] + this.heading[1]*this.speed,
            this.position[2] + this.heading[2]*this.speed
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