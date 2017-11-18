AFRAME.registerComponent("movement_controller", {

	schema: {
		input: {
			default: "keyboard"
		}
	},

	//LIFECYCLE METHODS
	//-----------------------------------------
	init: function(){

		this.updateSpeed = this.updateSpeed.bind(this);
		this.updateRoll  = this.updateRoll.bind(this);
		this.updatePitch = this.updatePitch.bind(this);
		this.updateYaw   = this.updateYaw.bind(this);

		this.addListeners();

	},//init
	remove: function(){
		this.removeListeners();
	},//remove

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

		element.emit("speed-updated", { value: clampedSpeed });

		console.log(clampedSpeed)
		//console.log("updating speed to : ", speed)
	},//updateSpeed
	updateRoll: function(event){
		const element      = this.el;
		const inputScalar  = event.detail.value * 90 || 0;
		const { x, y, z }  = element.getAttribute("rotation");
		const rollRotation = 1 * inputScalar
		const newRotation  = new THREE.Vector3(x, y, rollRotation); //use later for iterative slow increases

		element.setAttribute("rotation", newRotation)
	},//updateRoll
	updatePitch: function(event){
		const element = this.el;

		const inputScalar   = event.detail.value * 90 || 0;
		const { x, y, z }   = element.getAttribute("rotation");
		const pitchRotation = 1 * inputScalar
		const newRotation   = new THREE.Vector3(pitchRotation, y, z); //use later for iterative slow increases

		element.setAttribute("rotation", newRotation)
	},//updatePitch
	updateYaw: function(event){
		const element = this.el;

		const inputScalar   = event.detail.value * 90 || 0;
		const { x, y, z }   = element.getAttribute("rotation");
		const yawRotation = 1 * inputScalar
		const newRotation   = new THREE.Vector3(x, yawRotation, z); //use later for iterative slow increases

		element.setAttribute("rotation", newRotation)
	},//updateYaw

});