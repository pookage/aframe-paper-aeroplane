AFRAME.registerComponent("joystick_controls", {

	//LIFECYCLE METHODS
	//--------------------------------------------
	init: function(){

		this.gamepadCheckInterval       = false;
		this.disconnectionCheckInterval = false;
		this.listenForInput             = false;
		this.inputIndexes               = false;
		this.gamepadState               = false;

		//default indexes for each input (keys are the events that will be emitted)
		this.defaultInputIndexes = {
			axes: {
				pitch:    1,
				yaw:      0,
				roll :    5,
				throttle: 6,
				hat:      9
			},
			buttons: {
				trigger: 0,
			}
		};

		//state to be changed with input
		this.defaultGamepadState = {
			axes: {
				pitch:    0,
				yaw:      0,
				roll :    0,
				throttle: 0,
				hat:      0
			},
			buttons: {
				trigger: false
			}
		};

		//function binding
		this.startListeningForInputs = this.startListeningForInputs.bind(this);
		this.disconnectController    = this.disconnectController.bind(this);
		this.removeAllListeners      = this.removeAllListeners.bind(this);
		this.updateControllerState   = this.updateControllerState.bind(this);
		this.listenForConnection     = this.listenForConnection.bind(this);

		this.listenForConnection();
	},//getGamepads
	tick: function(){
		if(this.listenForInput){
			this.updateControllerState();
		}
	},//tick
	remove: function(){

		this.removeAllListeners();
	},//remove


	//UTILITY METHODS
	//--------------------------------------------
	listenForConnection: function(){
		//if a controller is plugged in, return it, and clear any checks that are in place
		const controller = window.navigator.getGamepads()[0];
		if(controller) this.startListeningForInputs();
		else {
			//if controller connection events exist in the window then add a listener
			if('ongamepadconnected' in window){
				window.addEventListener("webkitgamepadconnected", this.startListeningForInputs);
			} 
			//otherwise make your own damn listener
			else if(this.gamepadCheckInterval === false){
				this.gamepadCheckInterval = setInterval(this.listenForConnection, 500);
			}
		}		
	},//listenForConnection
	listenForDisconnection: function(){
		const controller = window.navigator.getGamepads()[0];
		if(!controller) this.disconnectController();
		else{
			//listen for disconnection event if it exists
			if('ongamepaddisconnected' in window){
				window.addEventListener("webkitgamepaddisconnected", this.disconnectController);
			} 
			//otherwise make your own damn listener
			else if(this.disconnectionCheckInterval === false){
				this.disconnectionCheckInterval = setInterval(this.listenForDisconnection, 5000);
			}
		}
	},//listenForDisconnection
	getInputIndexes: function(controller){
		let indexes = this.defaultInputIndexes;
		switch(controller){
			case "T.16000M (Vendor: 044f Product: b10a)":
				indexes = this.defaultInputIndexes;
				break;
		}
		return indexes;
	},//getInputIndexes
	updateControllerState: function(){
		const controller = navigator.getGamepads()[0];
		if(controller){

			//store all the axies to variables for easier rounding
			const axes     = controller.axes;
			const buttons  = controller.buttons;
			const pitch    = axes[this.defaultInputIndexes.axes.pitch];
			const yaw      = axes[this.defaultInputIndexes.axes.yaw];
			const roll     = axes[this.defaultInputIndexes.axes.roll];
			const throttle = axes[this.defaultInputIndexes.axes.throttle];
			const hat      = axes[this.defaultInputIndexes.axes.hat];
			const trigger  = buttons[this.defaultInputIndexes.buttons.trigger];

			//rounding to 2dp on all axes
			const newGamepadState = {
				axes: {
					pitch:    Math.round(pitch*100)/100,
					yaw:      Math.round(yaw*100)/100,
					roll :    Math.round(roll*100)/100,
					throttle: Math.round(throttle*100)/100,
					hat:      Math.round(hat*100)/100
				},
				buttons: {
					trigger: trigger.pressed
				}
			};

			//calculate which parts of the joystick have been moved...
			const topLevelChanges   = AFRAME.utils.diff(this.gamepadState, newGamepadState);
			const controllerUpdated = Object.keys(topLevelChanges).length > 0;
			if(controllerUpdated){

				let topKey, topChange, deepKey, deepChange, deepLevelChanges, deepLevelUpdated;
				for(topKey in topLevelChanges){
					topChange        = topLevelChanges[topKey];
					deepLevelChanges = AFRAME.utils.diff(this.gamepadState[topKey], newGamepadState[topKey]);

						//...and then emit an event specific to that change on the element...
						for(deepKey in deepLevelChanges){
							deepChange = deepLevelChanges[deepKey];
							this.el.emit(`joystick-${deepKey}-updated`, { value: deepChange })
						}
				}

				//...as well as emitting a general update event just in case
				this.el.emit(`joystick-updated`, {...newGamepadState});
			}
			this.gamepadState = newGamepadState;
		}
	},//updateControllerState


	//EVENT LISTENERS
	//-------------------------------------------
	startListeningForInputs: function(){
		const controller    = navigator.getGamepads()[0];
		const controllerID  = controller.id;
		this.inputIndexes   = this.getInputIndexes(controllerID);
		this.gamepadState   = this.defaultInputIndexes;
		this.listenForInput = true;
		this.removeConnectionListeners();
		this.listenForDisconnection();
	},//startListeningForInputs
	disconnectController: function(){
		this.removeInputListeners();
		this.removeDisconnectionListeners();
		this.listenForConnection();	
	},//disconnectController
	removeAllListeners: function(){
		this.removeConnectionListeners();
		this.removeDisconnectionListeners();
		this.removeInputListeners();
	},//removeAllListeners
	removeConnectionListeners: function(){
		window.removeEventListener("webkitgamepadconnected", this.startListeningForInputs);
		clearInterval(this.gamepadCheckInterval);
	},//removeConnectionListeners
	removeDisconnectionListeners: function(){
		window.removeEventListener("webkitgamepaddisconnected", this.disconnectController);
		clearInterval(this.disconnectionCheckInterval);
	},//removeDisconnectionListeners
	removeInputListeners: function(){
		this.inputIndexes   = false;
		this.gamepadState   = false;
		this.listenForInput = false;
	}//removeInputListeners

});