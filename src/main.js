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

    async mounted() {
        console.log('Vue app mounted successfully!')
        
        const fpsTarget = 150;

        // Setup THREE.js and scene
        const camController = new CameraController();
        const painter = new Painter('webgl-canvas', camController);
        await painter.loadModels();
        const tank = new BoidTank(painter, 

            // Environment settings
            {
                boidCountTarget: 40,
                is2dSpace: false,
                tankSize: [
                    window.innerWidth/100, 
                    window.innerHeight/100, 
                    window.innerWidth/100
                ],
                timeStepInSecs: 1/fpsTarget,
            },
            
            // Boid settings
            {
                viewingRange: 1.5,
                tooClose: 0.9,
                tooFar: 1.3,
                randomness: 0.02,
                turnSpeed: 5,
                boidSpeed: 5
            }
        );

        // Iterate tank
        setInterval(() => {tank.simStep();}, 1000/fpsTarget)
 
    },

    methods: {

    }

}).mount('#vue-app')
