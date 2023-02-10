# Boid Aquarium

## Try it live!

There is a working demo you can check out right now at https://lucasikuhara.github.io/boid-aquarium/

## What are Boids?

The general idea of Boids is simulating flocking behavior (aka organized group movement) in individuals with no central planning.

This phenomena is often observed in nature, and hints to the capability of a group to organize precisely with little-to-no communication between its individuals other than being able to see one another. The idea is that each member of flock is able to follow a very simple set of rules and the flocking behavior should arise naturally.

Think, for example, of a school of fish. Even without any one fish taking the role of fish traffic maestro, the school as a whole moves in a coordinated manner. The resulting formation should look a little bit like this:

![Example of flock of fish](https://upload.wikimedia.org/wikipedia/commons/e/ea/Large_fish_school.png)

Notice how most fish are swimming in the same direction as the ones close to it. This hints to the set of rules alluded to before, which we will try to simulate using software (boid simulation). So, without further ado, let's take a look at the guiding principles of boids.

## The boid rule set

To emulate the flocking behavior, each boid (this is how we will be loosely referring to an individual in the boid simulation) should follow three main principles: separation, alignment and cohesion.

### Separation

Each boid should aim to keep itself at a reasonable distance from the center of its visible neighbors. When it feels it's too close for comfort, it should move away from the group.

### Alignment

Each boid should aim to move in the same direction of its neighbors.

### Cohesion

Each boid should aim to be part of a group. If it sees other boids nearby, it should try to move closer.
