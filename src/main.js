import { Painter } from './painter.js'


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
        painter.paint()

    },

    methods: {

    }

}).mount('#vue-app')
