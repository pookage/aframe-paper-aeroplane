AFRAME.registerPrimitive("a-chase-camera", {
	defaultComponents: {
		camera: {
			fov: 60
		}, 
		chase_camera: {},
		position: {
			x: 0,
			y: 2.6,
			z: 5
		},
		rotation: {
			x: -10,
			y: 0,
			z: 0
		}
	},
	mappings: {
		"chase" : "chase_camera.chase"
	}
})
AFRAME.registerComponent("chase_camera", {

	//SCHEMA
	//-------------------------------
	schema: {
		chase: {
			type: "selector"
		}
	},

	//LIFECYCLE METHODS
	//--------------------------------
	init: function(){

		const element = this.el;
		const data    = this.data;

		console.log(data.chase)

	},//init
	remove: function(){

	}//remove
})