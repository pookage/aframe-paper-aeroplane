AFRAME.registerComponent("movement_controller", {

	schema: {
		input: {
			default: "keyboard"
		}
	},

	//LIFECYCLE METHODS
	//-----------------------------------------
	init: function(){

		//scope binding
		this.updateSpeed = this.updateSpeed.bind(this);
		this.updateRoll  = this.updateRoll.bind(this);
		this.updatePitch = this.updatePitch.bind(this);
		this.updateYaw   = this.updateYaw.bind(this);

		//setup
		this.markers     = this.setupOrientationMarkers();
		this.speedVector = new THREE.Vector3(0, 0, 0);

		this.addListeners();

	},//init
	remove: function(){
		this.removeListeners();
	},//remove
	tick: function(){

		const element          = this.el;
		const directionVector  = this.calculateDirectionVector();
		const {x, y, z}        = element.getAttribute("position");
		const currentPosition  = new THREE.Vector3(x, y, z);
		const nextPositionStep = directionVector.multiply(this.speedVector);
		const newPosition      = currentPosition.add(nextPositionStep);

		element.setAttribute("position", newPosition)


	},//tick
	

	//EVENT MANAGEMENT
	//-----------------------------------------
	///////////////////////////////////////////
	//LISTENERS////////////////////////////////
	///////////////////////////////////////////
	addListeners: function(){
		const data    = this.data;
		switch(data.input){
			case "keyboard":
				this.addKeyboardListeners();
				break;
			case "joystick":
				this.addJoystickListeners();
				break;
		}
	},//addListeners
	removeListeners: function(){

		this.removeJoystickListeners();
	},//removeListeners
	addKeyboardListeners: function(){

		//add stuff here later
	},//addKeyboardListeners
	addJoystickListeners: function(){
		const element = this.el;
		element.addEventListener("joystick-throttle-updated", this.updateSpeed);
		element.addEventListener("joystick-roll-updated", this.updateRoll);
		element.addEventListener("joystick-pitch-updated", this.updatePitch);
		element.addEventListener("joystick-yaw-updated", this.updateYaw);
	},//addJoystickListeners
	removeJoystickListeners: function(){
		const element = this.el;
		element.removeEventListener("joystick-throttle-updated", this.updateSpeed);
		element.removeEventListener("joystick-roll-updated", this.updateRoll);
		element.removeEventListener("joystick-pitch-updated", this.updatePitch);
		element.removeEventListener("joystick-yaw-updated", this.updateYaw)
	},//removeJoystickListeners


	///////////////////////////////////////////	
	//HANDLING/////////////////////////////////
	///////////////////////////////////////////
	updateSpeed: function(event){
		const element = this.el;
		const speed   = event.detail.value;
		const clampedSpeed = (speed + 1) / 2;

		this.speedVector = new THREE.Vector3(clampedSpeed, clampedSpeed, clampedSpeed)

		element.emit("speed-updated", { value: clampedSpeed });
		//console.log("updating speed to : ", speed)
	},//updateSpeed
	updateRoll: function(event){
		const element      = this.el;
		const inputScalar  = event.detail.value * 180 || 0;
		const { x, y, z }  = element.getAttribute("rotation");
		const rollRotation = 1 * inputScalar
		const newRotation  = new THREE.Vector3(x, y, rollRotation); //use later for iterative slow increases

		element.setAttribute("rotation", newRotation)
	},//updateRoll
	updatePitch: function(event){
		const element = this.el;

		const inputScalar   = event.detail.value * 180 || 0;
		const { x, y, z }   = element.getAttribute("rotation");
		const pitchRotation = 1 * inputScalar
		const newRotation   = new THREE.Vector3(pitchRotation, y, z); //use later for iterative slow increases

		element.setAttribute("rotation", newRotation)
	},//updatePitch
	updateYaw: function(event){
		const element = this.el;

		const inputScalar   = event.detail.value * 180 || 0;
		const { x, y, z }   = element.getAttribute("rotation");
		const yawRotation = (1 * inputScalar);
		const newRotation   = new THREE.Vector3(x, yawRotation, z); //use later for iterative slow increases

		element.setAttribute("rotation", newRotation)
	},//updateYaw


	//UTILITY FUNCTIONS
	//----------------------------------------------
	setupOrientationMarkers: function(){
		const element     = this.el;
		const frontMarker = this.createPositionMarker("front");
		const rearMarker  = this.createPositionMarker("rear");
		const markers = [
			frontMarker,
			rearMarker
		];
		for(let marker of markers) element.appendChild(marker);
		return {
			front: frontMarker,
			rear: rearMarker
		};
	},//setupOrientationMarkers
	createPositionMarker: function(type){
		const marker = document.createElement("a-sphere");
		let color, position, scale;
		switch(type){
			case "front":
				color    = "red";
				position = "0 0 -1"
				break;
			case "rear":
				color    = "blue";
				position = "0 0 1"
				break;
		}
		marker.setAttribute("material", `color: ${color}`);
		marker.setAttribute("position", position);
		marker.setAttribute("scale", "0.25 0.25 0.25");
		return marker;
	},//createPositionMarker
	calculateDirectionVector: function(){

		const frontPosition = this.markers.front.object3D.getWorldPosition();
		const rearPosition  = this.markers.rear.object3D.getWorldPosition();
		const direction     = frontPosition.sub(rearPosition).normalize();
		return direction;
	},//calculateDirectionVector

});