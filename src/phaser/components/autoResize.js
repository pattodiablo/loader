
// You can write more code here
import UserComponent from "./UserComponent"
/* START OF COMPILED CODE */

export default class autoResize extends UserComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__autoResize"] = this;
		
		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;
		/** @type {number} */
		this.widthTarget = 100;
		/** @type {number} */
		this.heightTarget = 100;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/** @returns {autoResize} */
	static getComponent(gameObject) {
		return gameObject["__autoResize"];
	}
	
	/* START-USER-CODE */
	start() {
		
		this.newScale = this.widthTarget / this.gameObject.width
		if (this.gameObject.height > this.gameObject.width) this.newScale = this.heightTarget / this.gameObject.height
		this.gameObject.setScale(this.newScale);
    }
	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here