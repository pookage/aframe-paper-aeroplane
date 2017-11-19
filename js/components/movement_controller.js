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
		this.markers            = this.setupOrientationMarkers();
		this.accelerationVector = new THREE.Vector3(0, 0, 0);
		this.rotationSpeed      = new THREE.Vector3(5, 3, 3); //pitch, yaw, roll

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
		const nextPositionStep = directionVector.multiply(this.accelerationVector);
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
		const element      = this.el;
		const speed        = event.detail.value;
		

		this.accelerationVector = new THREE.Vector3(speed, speed, speed)
		element.emit("speed-updated", { value: speed });
	},//updateSpeed
	updateRoll: function(event){
		const element      = this.el;
		const inputScalar  = event.detail.value;
		const { x, y, z }  = element.getAttribute("rotation");
		const rollRotation = this.rotationSpeed.z * inputScalar;
		const newRoll      = z + rollRotation;
		const newRotation  = new THREE.Vector3(x, y, newRoll);
		const rotationAxis = new THREE.Vector3(0, 0, 1);
		const quaternion   = new THREE.Quaternion();

		quaternion.setFromAxisAngle(rotationAxis, this.convertToRadians(newRoll));
		//newRotation.applyQuaternion(quaternion);
		element.setAttribute("rotation", newRotation)
	},//updateRoll
	updatePitch: function(event){
		const element       = this.el;
		const inputScalar   = event.detail.value;
		const { x, y, z }   = element.getAttribute("rotation");
		const pitchRotation = this.rotationSpeed.x * inputScalar;
		const newPitch      = x + pitchRotation;
		const newRotation   = new THREE.Vector3(newPitch, y, z); //use later for iterative slow increases
		const rotationAxis  = new THREE.Vector3(1, 0, 0);
		const quaternion    = new THREE.Quaternion();
		
		quaternion.setFromAxisAngle(rotationAxis, this.convertToRadians(newPitch));
		//newRotation.applyQuaternion(quaternion);
		element.setAttribute("rotation", newRotation)
	},//updatePitch
	updateYaw: function(event){
		const element      = this.el;
		const inputScalar  = event.detail.value;
		const { x, y, z }  = element.getAttribute("rotation");
		const yawRotation  = this.rotationSpeed.y * inputScalar;
		const newYaw       = y + yawRotation;
		const newRotation  = new THREE.Vector3(x, newYaw, z); //use later for iterative slow increases
		const rotationAxis = new THREE.Vector3(0, 1, 0);
		const quaternion   = new THREE.Quaternion();

		quaternion.setFromAxisAngle(rotationAxis, this.convertToRadians(newYaw));
		//newRotation.applyQuaternion(quaternion);
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
		marker.setAttribute("visible", false);
		return marker;
	},//createPositionMarker
	calculateDirectionVector: function(){

		const frontPosition = this.markers.front.object3D.getWorldPosition();
		const rearPosition  = this.markers.rear.object3D.getWorldPosition();
		const direction     = frontPosition.sub(rearPosition).normalize();
		return direction;
	},//calculateDirectionVector
	convertToRadians: function(angle){
		return angle * (Math.PI / 180)
	}//convertToRadians

});