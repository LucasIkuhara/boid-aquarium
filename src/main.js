import { Painter } from './painter.js'
import { BoidTank } from './tank.js'
import { CameraController } from './camera.js'
import SettingsMenu from './menu/menu.js'
import { BoidActor } from './actor.js'
import { isolated } from './utils.js'


Vue.createApp({
    data() {
        return {
            canvasHeight: window.innerHeight,
            canvasWidth: window.innerWidth,
            animationLoop: null
        }
    },

    components: {
        SettingsMenu
    },

    mounted() {

        // Load Feather SVG icons
        feather.replace()
        sessionStorage.clear()
    },

    methods: {

        /**
         * Triggered when updates are made to the settings modal.
         * Stops the current animation loop and creates a new one with update settings.
         * 
         * @param {{env: import('./tank.js').EnvConfig, boids: import('./actor.js').BoidCfg}} settings
         *  The new simulation settings for configuring the environment and boid behavior.
        */
       async handleUpdateSettings(settings) {
            isolated(async () => {
                this.stopAnimationLoop()
                await this.createAnimationLoop(settings)
            });
        },

        /**
         * Start continuous boid simulation.
         * @param {import('./menu/menu.js').AppCfg} cfg The animation configuration object.
        */
        async createAnimationLoop(cfg) {

            // Setup THREE.js and scene
            const camController = new CameraController('webgl-canvas');
            const painter = new Painter('webgl-canvas', camController);
            await painter.loadModels();
            const tank = new BoidTank(painter, cfg.env, cfg.boids, cfg.blink);

            // Start animation loop
            this.animationLoop = setInterval(() => {
                tank.simStep();
            }, 
            1000/cfg.fpsTarget);
        },

        /**
         * Stop current animation loop and reset the simulation.
         */
        stopAnimationLoop() {

            if (!this.animationLoop) return;

            clearInterval(this.animationLoop);
            this.animationLoop = null;
            BoidActor.resetBoidSim();
        }

    }

}).mount('#vue-app')
