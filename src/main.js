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
        const fpsTarget = 60;

        // Setup REGL and scene
        const camController = new CameraController();
        const painter = new Painter('webgl-canvas', camController);
        const tank = new BoidTank(painter, {
            boidCountTarget: 1000,
            is2dSpace: false,
            tankSize: [10, 10, 10],
            timeStepInSecs: 1/fpsTarget,
            boidSpeed: 4.0
        });

        // Iterate tank
        setInterval(() => {tank.simStep();}, 1000/fpsTarget)
 
    },

    methods: {

    }

}).mount('#vue-app')
