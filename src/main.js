import { Painter } from './painter.js'
import { BoidTank } from './tank.js'
import { CameraController } from './camera.js'


Vue.createApp({
    data() {
        return {
           canvasHeight: window.innerHeight,
           canvasWidth: window.innerWidth
        }
    },

    computed: {
    },

    mounted() {
        console.log('Vue app mounted successfully!')
        const fpsTarget = 150;

        // Setup REGL and scene
        const camController = new CameraController();
        const painter = new Painter('webgl-canvas', camController);
        const tank = new BoidTank(painter, 

            // Environment settings
            {
                boidCountTarget: 40,
                is2dSpace: false,
                tankSize: [
                    window.innerWidth/200, 
                    window.innerHeight/250, 
                    window.innerWidth/200
                ],
                timeStepInSecs: 1/fpsTarget,
            },
            
            // Boid settings
            {
                viewingRange: 0.5,
                tooClose: 0.3,
                tooFar: 0.4,
                randomness: 0.02,
                turnSpeed: 10,
                boidSpeed: 3
            }
        );

        // Iterate tank
        setInterval(() => {tank.simStep();}, 1000/fpsTarget)
 
    },

    methods: {

    }

}).mount('#vue-app')
