import { Painter } from './painter.js'
import { BoidTank } from './tank.js'


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

        // Setup REGL
        const painter = new Painter('webgl-canvas')
        const tank = new BoidTank(painter, {
            boidCountTarget: 15,
            is2dSpace: false,
            tankSize: [500, 300, 0],
            timeStepInSecs: 1/fpsTarget
        });

        // Iterate tank
        setInterval(() => {tank.simStep();}, 1000/fpsTarget)
 
    },

    methods: {

    }

}).mount('#vue-app')
