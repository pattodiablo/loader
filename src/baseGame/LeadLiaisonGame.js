import Swal from 'sweetalert2'
import LeadLiaisonGamePrizes from "./Prizes"

export default class LeadLiaisonGame {
    
    static init() {

            document.getElementById("background").style.backgroundColor=this.settings.backgroundColor;
            let bgImage = this.getUrlFromKey("bg");
           
            if(bgImage){
                document.getElementById("background").style.backgroundImage=`url("${bgImage}")`;
                document.getElementById("background").style.backgroundSize="cover";
                document.getElementById("background").style.backgroundPosition="center";
            }
            if(this.settings.backgroundFit == "stretch"){
                document.getElementById("background").style.backgroundSize="100% 100%";
            }
            if(this.settings.backgroundFit == "tile"){
                document.getElementById("background").style.backgroundPosition="0% 0%";
                document.getElementById("background").style.backgroundSize="auto";
                document.getElementById("background").style.backgroundRepeat="repeat";
            }
            if(this.settings.backgroundFit == "contain"){
                document.getElementById("background").style.backgroundSize="contain";
                document.getElementById("background").style.backgroundRepeat="no-repeat";
            }

            if(this.settings.backButtonColor)document.querySelector("#path0").setAttribute("fill", this.settings.backButtonColor )
            if(this.settings.backButtonArrowColor)document.querySelector("#path1").setAttribute("fill", this.settings.backButtonArrowColor)
            if(this.settings.disableBackButton)document.querySelector("#backButton").style.display = "none";
            document.querySelector("#backButton").addEventListener("click", ()=>{
                this.gameEvent({eventName:"back"});
		});

            if(!this.settings.logo)this.settings.logo = {}
            var div = document.createElement("div");
            div.style.display = "none";
            var img = document.createElement("img");
            img.src = this.getUrlFromKey("logo");
            img.onload = function(){
                document.getElementById('logo').style.display = "block";
            };
            div.id = "logo"
            let nw= Object.assign({}, this.settings.logo)

            this.settings.logo.margin = this.settings.logo.margin || 0
            this.settings.logo.borderRadius = this.settings.logo.borderRadius || 5
            this.settings.logo.padding = (this.settings.logo.padding/2) || 5
            this.settings.logo.borderThickness = (this.settings.logo.borderThickness) || 5
            if(this.settings.logo.backgroundColor) div.style.backgroundColor = this.settings.logo.backgroundColor

            div.style.padding = this.settings.logo.padding  +"px"


            if(this.settings.logo.outlineColor) {
                div.style.border = this.settings.logo.borderThickness + "px solid " + this.settings.logo.outlineColor
            }
            div.style.borderRadius = this.settings.logo.borderRadius+"px"
            div.style.zIndex=9999;
            this.settings.logo.margin -=  this.settings.logo.padding+this.settings.logo.borderThickness;
            if(!this.settings.outlineColor){
                img.style.borderRadius = this.settings.logo.borderRadius+"px"
		    }

           // div.style.margin = this.settings.logo.margin/2 +"px"
            if(this.settings.logo.x == "left"){
                div.style.left = this.settings.logo.margin+"px";
	}
            if(this.settings.logo.y == "top"){
                div.style.top = this.settings.logo.margin+"px";
	}
            if(this.settings.logo.x == "right"){
                div.style.right = this.settings.logo.margin+"px"
	}

			if (this.settings.logo.x == "middle") {
                div.style.left = "50%"
                div.style.transform = `translate(-50%,0px)`
			}
			if (this.settings.logo.y == "middle") {
                div.style.top = "50%"
                div.style.transform = `translate(0px,-50%)`
			}

            if(this.settings.logo.y == "middle" && this.settings.logo.x == "middle"){
                div.style.transform = `translate(-50%,-50%)`
			}

			if (this.settings.logo.y == "bottom") {
                div.style.bottom = this.settings.logo.margin+"px"
			}
            this.settings.logo = nw;
            div.appendChild(img)
            document.body.prepend(div)


            if(this.settings.borderSlices && this.getUrlFromKey("border"))
            {
                var img = document.createElement("div");
                img.style.borderImage = `url(${this.getUrlFromKey("border")}) `
                img.style.width="100%"
                img.style.height="100%"
                img.style.borderStyle="solid"
                img.style.position = 'fixed'
                img.style.zIndex = 9999;
                img.style.pointerEvents = "none"
                img.style.boxSizing = "border-box"
                img.style.borderWidth= this.settings.borderSlices.map((a)=>a+"px").join(" ")
                img.style.borderImageSlice =  this.settings.borderSlices.join(" ")
                div.id = "logo"
                let nw2= Object.assign({}, this.settings.logo)
                document.body.prepend(img)
		}

	}
 
    static done(doneData = {}) {
         
    	doneData.prize ||= (doneData.prizesWon||[])[0]
      
        if(doneData.prize === true) {
            doneData.prize = LeadLiaisonGamePrizes.pick()    
        }

        doneData.winPrizeName = doneData.prize ? doneData.prize.name : null
        doneData.winPrizeKey =doneData.prize ? doneData.prize.key : null

        doneData.secondaryMessage = LeadLiaisonGame.settings.doneSecondMessage

        if (
            doneData.prize && doneData.prize.name &&
            LeadLiaisonGame.settings.prize_threshold_message &&
            LeadLiaisonGame.settings.prize_threshold &&
            doneData.prize.quantity+1 <= LeadLiaisonGame.settings.prize_threshold
		) {
            if (doneData.secondaryMessage) doneData.secondaryMessage += "\n" + LeadLiaisonGame.settings.prize_threshold_message
            else doneData.secondaryMessage = LeadLiaisonGame.settings.prize_threshold_message;
		}

        if(!doneData.confirmButtonText)doneData.confirmButtonText = LeadLiaisonGame.settings.doneButtonText || "Done";

        this.gameEvent({eventName: "done", eventData: doneData});

        doneData.callback =  ()=>{     
            this.gameEvent({eventName:"replay", eventData:doneData});
		}
        
        if(LeadLiaisonGame.game&&LeadLiaisonGame.game.gameDone){
            LeadLiaisonGame.game.gameDone(doneData);
        }
        
        LeadLiaisonGame.message(doneData);
    }

    static gameEvent({ eventName, eventData }) {
		LeadLiaisonGameEvents.event({
			eventName,
			gameData: this.settings.gameData,
			eventData
		});
	}

    static getUrlFromKey(imageKey){
        let file = (LeadLiaisonGame.assets||{}).find(file => (file.key == imageKey)) || {};   
        return file.url || "";
    }

    static showMessage(){
        document.getElementsByClassName("swal2-container")[0].className =
        document.getElementsByClassName("swal2-container")[0].className.replace(/\bhide-container\b/,'');
    }
 

    static message(doneData) {

        var doneButtonText = (typeof doneData.confirmButtonText != 'undefined' && doneData.confirmButtonText) ? doneData.confirmButtonText : (LeadLiaisonGame.settings.doneButtonText || "Done");
        var endButtonTextColor = (typeof doneData.endButtonTextColor != 'undefined' && doneData.endButtonTextColor) ? doneData.endButtonTextColor : (LeadLiaisonGame.settings.endButtonTextColor || "#fff");
        var endButtonColor = (typeof doneData.endButtonColor != 'undefined' && doneData.endButtonColor) ? doneData.endButtonColor : (LeadLiaisonGame.settings.endButtonColor || "#3085d6");

        var title = doneData.winTitleText || doneData.message || LeadLiaisonGame.settings.doneMessage || "Thanks for playing!";
        var msg = doneData.secondaryMessage;

        if (typeof title != 'undefined' && ! /<\/?[a-z][\s\S]*>/i.test(title)) title = title.replace(/\n/g, "<br />");
        if (typeof msg != 'undefined' && ! /<\/?[a-z][\s\S]*>/i.test(msg)) msg = msg.replace(/\n/g, "<br />");

        return Swal.fire({
            title: title,
          //  text: doneData.secondaryMessage,
            html: ` 
            <div id="swal2-content" class="swal2-html-container" style="display:${doneData.secondaryMessage?"block":"none"};">${msg}</div>
            <div style="align-items: center; justify-content: center;display:${doneData.winPrizeKey?"flex":"none"} ">
                <div style="width:30%;min-height:50px;padding:10px" > 
                    <img class="swal2-image" src="${LeadLiaisonGame.getUrlFromKey(doneData.winPrizeKey) }" onload="LeadLiaisonGame.showMessage();" onerror="LeadLiaisonGame.showMessage();"> </img>
                </div>
                <div style="padding:10px" > 
                    <b>${doneData.winPrizeName}</b>
                </div>
            </div>
           `,
            allowOutsideClick: false,
            confirmButtonText:`<span style="color:${endButtonTextColor}">${doneButtonText}<span>`,
            backdrop: `rgba(10,10,10,0.8)`,
            confirmButtonColor: endButtonColor,
            customClass: {
                container: (doneData.winPrizeKey) ? "hide-container" : ""
            }
        }).then((result) => {  
            let callback = doneData.callback || LeadLiaisonGame.game.messageDone;
            callback.bind(this)();
        });
    }

}