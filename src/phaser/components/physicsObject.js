
// You can write more code here
import UserComponent from "./UserComponent"

/* START OF COMPILED CODE */

export default class PhysicsObject extends UserComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		this.gameObject = gameObject;
		gameObject["__PhysicsObject"] = this;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {PhysicsObject} */
	static getComponent(gameObject) {
		return gameObject["__PhysicsObject"];
	}
	
	/** @type {Phaser.GameObjects.Sprite} */
	gameObject;
	
	/* START-USER-CODE */
	start(){
		this.scene.physics.add.existing(this.gameObject)
	}
	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
