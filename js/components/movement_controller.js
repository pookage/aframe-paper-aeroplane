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
		this.updateRoll  = this.updateRoll.bind(this);;

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
	},//addJoystickListeners
	removeJoystickListeners: function(){
		const element = this.el;
		element.removeEventListener("joystick-throttle-updated", this.updateSpeed);
		element.removeEventListener("joystick-roll-updated", this.updateRoll);
	},//removeJoystickListeners

	///////////////////////////////////////////	
	//HANDLING/////////////////////////////////
	///////////////////////////////////////////
	updateSpeed: function(event){
		const speed = event.detail.value;
		//console.log("updating speed to : ", speed)
	},//updateSpeed
	updateRoll: function(event){
		const element           = this.el;
		const inputScalar       = event.detail.value * 90 || 0;
		const { x, y, z }       = element.getAttribute("rotation");
		const currentRollVector = new THREE.Vector3(x, y, z); //use later for iterative slow increases
		const rollAmount        = new THREE.Vector3(0, 0, 1).multiplyScalar(inputScalar)
		const newRollVector     = currentRollVector.add(rollAmount)
		
		element.setAttribute("rotation", rollAmount)

		//console.log(rollVector)

		//const rollDirection   = rollVector
		//console.log(`updating rotation to ${rotation}`)
		//console.log(currentX)
	},//updateRoll
});