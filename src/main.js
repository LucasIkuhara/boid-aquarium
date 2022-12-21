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
        const tank = new BoidTank(painter, {
            boidCountTarget: 40,
            is2dSpace: false,
            tankSize: [
                window.innerWidth/200, 
                window.innerHeight/250, 
                window.innerWidth/200
            ],
            timeStepInSecs: 1/fpsTarget,
            boidSpeed: 3
        });

        // Iterate tank
        setInterval(() => {tank.simStep();}, 1000/fpsTarget)
 
    },

    methods: {

    }

}).mount('#vue-app')
