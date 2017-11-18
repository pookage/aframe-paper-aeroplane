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
		chase: "chase_camera.chase",
		near: "chase_camera.near",
		far: "chase_camera.far"
	}
});
AFRAME.registerComponent("chase_camera", {

	//SCHEMA
	//-------------------------------
	schema: {
		chase: {
			type: "selector"
		},
		near: {
			default: 5
		},
		far: {
			default: 7.5
		}
	},

	//LIFECYCLE METHODS
	//--------------------------------
	init: function(){

		//scope binding
		this.updateCameraDistance = this.updateCameraDistance.bind(this);

		this.addListeners();
	},//init
	remove: function(){
		this.removeListeners();
	},//remove


	//EVENT HANDLING
	//-------------------------------
	addListeners: function(){
		const chase = this.data.chase;
		chase.addEventListener("speed-updated", this.updateCameraDistance);
	},//addListeners
	removeListeners: function(){
		const chase = this.data.chase;
		chase.removeEventListener("speed-updated", this.updateCameraDistance);
	},//removeListeners
	updateCameraDistance: function(event){
		const element          = this.el;
		const data             = this.data;
		const { x, y, z }      = element.getAttribute("position");
		const { near, far  }   = data;
		const speedMultiplier  = event.detail.value;
		const distanceDiff     = (far - near) * speedMultiplier;
		const newDistance      = near + distanceDiff;
		const newPosition      = { x, y, z: newDistance};

		element.setAttribute("position", newPosition)
	}//updateCameraDistance
})