# Firefly Boid Aquarium

## Try it live!

There is a working demo you can check out right now at https://lucasikuhara.github.io/boid-aquarium/

## Summary

This project is a 3d web-based aquarium meant to demonstrate to two different emergent behaviors: flocking and synchronized blinking.
Both of these are behaviors observed in the nature, and look like very complex social endeavors, which for the untrained eye might be assumed to
require some sort of central planning or a complex language to convey ideas and enable coordination. In reality, both behaviors can be recreated by each individual
following a very specific yet simple set of rules. This is what we aim to demonstrate in this demo.

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

## Firefly Synchronization

Fireflies also exhibit interesting emergent behaviors which have been explored in the aquarium. Over time, a flock of fireflies is able to sync
their blink cycles, so they all eventually blink in unison. The mentioned phenomena is much better described in [this paper](https://www.rlocman.ru/i/File/2007/10/24/2006_WSL_Firefly_Synchronization_Ad_Hoc_Networks.pdf), which motivated the demo.

## The synchronization mechanism

For the sake of completeness, I though it would be best to provide an overview of the emergent blinking synchronization mechanism shown in the aquarium. Keep in mind the model
implemented in the aquarium is a simplification, so refer to the paper for a full explanation.

### The Gradient

Let's begin by defining the conditions needed for a firefly boid to blink. What we are trying to simulate here is a biological process, and therefore our modeling should attempt to follow this theme accordingly.
Let's imagine a simple cell for example that does something every time it reaches an X amount of a given substance or energy for instance. 
We can capture this idea with a simple percentage variable denoted from 0 to 1. If we apply this concept to our blinking process, we could define our boid's blinking state as follows: when this variable is smaller 1, the boid does nothing; when it equals or exceeds 1, it blinks. This will be our chosen approach to blinking, and from this point on, we are going to refer to this value as the boid's urge to blink or its gradient.

### Periodicity

To try to give this behavior a periodic nature, we can imagine each boid gains a fixed rate of energy per unit of time, increasing its gradient. Additionally, let's imagine
that once a boid blinks, it really gives its all, and loses all its energy or whatever it needs to blink (ie. resetting the gradient to 0). Just like this, we have created
a periodical blinking behavior that goes on indefinitely.

### Social synchronization

Okay, that's simple enough but we haven't explained the syncing yet though.. Fortunately for us, this is the beauty of this mechanism. To make the boids sync-up, we only need
to add one more simple rule: every time an individual sees another blink, it gets excited and fills up its gradient a little bit (ie. a fixed rate is added to the observers gradient).
That's it! Just like that, this seemingly complex social blinking behavior emerges on its own. Pretty cool, right?

As a final note, we can replicate the same behavior for matching the blinking color. The trick to get this to work, is to define the color by using gradients that follow the same
rules as blinking. We can either do this by having three gradients for RGB, or better yet, by using a single one as the H value of an HSL-defined color, which is what is done in the demo. The only difference is that the values have to be scaled to match the full range of color available (ie. transforming the gradient from the [0, 1] interval to [0, 255] for RGB of [0, 360] in HSL).
