AFRAME.registerPrimitive("a-paper-plane", {
	defaultComponents: {
		"obj-model": {
			obj: "#paper-plane-model"
		},
		material: {
			roughness: 0.9
		},
		scale: {
			x: 0.3,
			y: 0.3,
			z: 0.3,
		},
		rotation: {
			x: 0,
			y: 180,
			z: 0
		}
	},
	mappings: {
		color: "material.color"
	}
})