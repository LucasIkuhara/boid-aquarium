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

        // Setup REGL
        const painter = new Painter('webgl-canvas')
        const tank = new BoidTank(painter);

        // Iterate tank
        setInterval(() => {tank.simStep();}, 100)
 
    },

    methods: {

    }

}).mount('#vue-app')
