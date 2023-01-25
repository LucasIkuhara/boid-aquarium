/**
* Defines all configuration for boids simulation behavior, environment and rendering.
* @typedef {object} AppCfg
* @property {import("../actor").BoidCfg} boids The boid behavior settings.
* @property {import("../tank").EnvConfig} env The boid environment settings.
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
				boidCountTarget: 50,
				is2dSpace: false,
				dimensions: {
					x: window.innerWidth/100, 
					y: window.innerHeight/100, 
					z: window.innerWidth/100
				},
			},

			// Boid Settings
			boids: {
				viewingRange: 1.5,
				tooClose: 0.9,
				tooFar: 1.3,
				randomness: 0.02,
				turnSpeed: 5,
				boidSpeed: 5
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
						Number(this.env.dimensions.x),
						Number(this.env.dimensions.y),
						Number(this.env.dimensions.z),
					],
                    timeStepInSecs: 1/this.fpsTarget,
				},
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
