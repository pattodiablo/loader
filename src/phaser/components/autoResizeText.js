
// You can write more code here
import UserComponent from "./UserComponent"

/* START OF COMPILED CODE */

export default class autoResizeText extends UserComponent {
	
	constructor(gameObject) {
		super(gameObject);
		
		gameObject["__autoResizeText"] = this;
		
		this.gameObject = gameObject;
		this.maxWidth = 100;
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	static getComponent(gameObject) {
		return gameObject["__autoResizeText"];
	}
	
	/* START-USER-CODE */
	start(){
		let maxWidth = this.maxWidth;
	
		this.gameObject.setText = function(value){
			console.log("setting text!");
			if (!value && value !== 0)
			{
				value = '';
			}
	
			if (Array.isArray(value))
			{
				value = value.join('\n');
			}
	
			if (value !== this._text)
			{
				this._text = value.toString();
	
				this.updateText();
			}

			let messageFontSize = parseInt(this.style.fontSize.split("px"));
			while (this.width > maxWidth) {
				messageFontSize -= 5;
				this.setFontSize(messageFontSize + "px");
			}
			return this;
		}
	}
	// Write your code here.
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
