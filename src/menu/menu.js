/**
* Defines all configuration for boids simulation behavior, environment and rendering.
* @typedef {object} AppCfg
* @property {import("../actor").BoidCfg} boids The boid behavior settings.
* @property {import("../tank").EnvConfig} env The boid environment settings.
* @property {import("../actor").BlinkCfg} blink The boid blinking behavior settings.
* @property {number} fpsTarget The target number of frames that should be drawn in a second.
*/


/**
 * Menu component for choosing simulation settings. @emits settings-updated of @type {AppCfg}.
 */
export default {
	data() {
		return {

			fpsTarget: 150,

			// Environment Settings
			env: {
				boidCountTarget: 350,
				is2dSpace: false,
				dimensions: {
					x: window.innerWidth/100, 
					y: window.innerHeight/100, 
					z: window.innerWidth/100
				},
				useBlinking: true
			},

			// Boid Settings
			boids: {
				viewingRange: 1.8,
				tooClose: 1.1,
				tooFar: 1.6,
				randomness: 0.02,
				turnSpeed: 0.25,
				boidSpeed: 5
			},

			blink: {
				maxBrightness: 1.0,
				minBrightness: 0.15,
				accumulationRate: 0.2,
				empathyFactor: 0.5,
				colorSaturation: 30,
				colorAccumulationRate: 5,
				colorEmpathyFactor: 40
			},

			collapsed: true
		}
	},

	methods: {

		/**
		 * Called upon opening or closing the modal.
		 */
		toggle() {
			this.collapsed = !this.collapsed;

			// if (!this.collapsed)
			// {

			// 	this.$refs.menu.focus();
				
			// 	console.log(document.activeElement)
			// }
		},

		/**
		 * Called upon clicking outside the modal.
		 */
		close() {
			this.collapsed = true;
		},

		/**
		 * Propagate new settings to parent component.
		 * @param {AppCfg} newSettings The current application settings.
		 */
		emitSettings(newSettings) {
			this.$emit('settings-updated', newSettings)
		}
	},

	computed: {

		/**
		 * The current application settings.
		 * @returns {AppCfg}
		 */
		appConfig() {
			return {
				boids: this.boids,
				env: {
					...this.env,
					tankSize: [
						this.env.dimensions.x,
						this.env.dimensions.y,
						this.env.dimensions.z,
					],
                    timeStepInSecs: 1/this.fpsTarget,
				},
				blink: this.blink,
				fpsTarget: this.fpsTarget
			}
		}
	},

	watch: {
		env: {
			handler() {
				this.emitSettings(this.appConfig);
			},
			deep: true
		}
	},

	mounted() {
		this.emitSettings(this.appConfig);
	},

	template: await (await fetch('menu/menu.html')).text(),
}
