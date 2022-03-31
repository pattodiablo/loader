import LeadLiaisonGame from "./LeadLiaisonGame"

export default class LeadLiaisonGamePrizes {
	static init(){
		this.settings = LeadLiaisonGame.settings;
		this.prizes = this.settings.prizes || [];
		this.PrizesIdxs = [];
		this.PrizesProbs = [];
	}
	static pick(){

		this.calculatePrizesProbability();

		let pickedPrizeFromTotal = 0;
		let pickedPrize = null;

		if (this.PrizesProbs.length == 0) {
			return pickedPrize;
		}
		let prob_sum = this.PrizesProbs.reduce((a, e) => a + e); 

		let rand_item = Math.random() * prob_sum;
		pickedPrizeFromTotal = this.PrizesIdxs.find((e, i) => (rand_item -= this.PrizesProbs[i]) < 0);
		if(pickedPrizeFromTotal != undefined) {
			pickedPrize = this.prizes[pickedPrizeFromTotal];
			if (
				pickedPrize &&
				this.settings.prize_threshold_message &&
				this.settings.prize_threshold &&
				pickedPrize.quantity <= this.settings.prize_threshold
			) {
				pickedPrize.message = this.settings.prize_threshold_message
			}
			this.prizes[pickedPrizeFromTotal].quantity = this.prizes[pickedPrizeFromTotal].quantity ? (this.prizes[pickedPrizeFromTotal].quantity - 1) : 0;
			if(!parseInt(this.settings.probabilityCalculationMode)){
				this.prizes[pickedPrizeFromTotal].custom_probability = this.prizes[pickedPrizeFromTotal].custom_probability ? (this.prizes[pickedPrizeFromTotal].custom_probability - 1) : 0;
			}
		}
		return pickedPrize
	}



	static calculatePrizesProbability() {
		this.PrizesIdxs = [];
		this.PrizesProbs = [];
		for (var i in this.settings.prizes){
			if(typeof this.settings.prizes[i].custom_probability == 'undefined'){
				this.settings.prizes[i].custom_probability = this.settings.prizes[i].quantity;
			}
		}
		let totalPrizesProbQuantity = this.prizes.reduce( function(a, b){
			return a + b['custom_probability'];
		}, 0);
		this.prizes.forEach( (prize,prizeId)=>{

			prize.prizeId = prizeId;
			this.PrizesIdxs.push(prize.prizeId);
			var custom_probability = prize.custom_probability ? (prize.custom_probability / totalPrizesProbQuantity) : 0
			this.PrizesProbs.push(custom_probability);

		});

	}


}



