/* prettier-ignore */

/* START OF COMPILED CODE */
import Win from "./Win";
import Prizes from "../baseGame/Prizes"
import { getGameDimensions } from '../utils/FitScaleModeHelper';

export default class LeadLiaisonPhaserGame extends Phaser.Scene {

	constructor() {
		super("LeadLiaisonPhaserGame");

		/* START-USER-CTR-CODE */
		this.fitScaleModeResizeTimeout;
		/* END-USER-CTR-CODE */
	}

	_create() {

		// win
		const win = new Win(this, 0, 0);
		this.add.existing(win);
	}

	/* START-USER-CODE */

	init(data) {

		this.settings = data.settings;
		LeadLiaisonGame.game = this;

	}

	create() {

		this.mainScene = this.scene.add("Main", Main, false, {
			settings: this.settings
		});

		this.mainScene.settings = this.settings;

		this.mainScene.gameWidth = 1366
		this.mainScene.gameHeight = 1024

		if (this.settings.gameData.scaleMode == "none") {
			this.mainScene.gameWidth = this.cameras.main.width
			this.mainScene.gameHeight = this.cameras.main.height
		}

		if (this.mainScene.fit) {
			this.mainScene.fit({
				width: this.cameras.main.width,
				height: this.cameras.main.height,
			});
		}
		
		this.mainScene.events.on(
			"create",
			function () {
				if (this.settings.gameData.scaleMode === 'fit') {
					return;
				}
				this.fitScale = this.add.container(0, 0);

				if (!this.ignoreScale) this.ignoreScale = [];

				if (this.settings.gameData.scaleMode != "none") {
					this.ignoreScale.push(this.fitScale);
					this.fitScale.add(
						this.children.getChildren().filter(i => !this.ignoreScale.includes(i))
					);
				}

				this._resize();

			},
			this.mainScene
		);

		this.mainScene._resize = function () {
			if (this.fit) this.fit({
				width: this.cameras.main.width,
				height: this.cameras.main.height
			});

			if (this.settings.gameData.scaleMode != "none") {
				this.box = new Phaser.Structs.Size(this.gameWidth, this.gameHeight);
				this.fitScale.setSize(this.gameWidth, this.gameHeight);
				this.box.fitTo(this.cameras.main.width, this.cameras.main.height);
				this.fitScale.setDisplaySize(this.box.width, this.box.height);
				this.fitScale.x = this.cameras.main.centerX - this.box.width / 2;
				this.fitScale.y = this.cameras.main.centerY - this.box.height / 2;
			}

			if (this.resize)
				this.resize({
					width: this.cameras.main.width,
					height: this.cameras.main.height
				});

			if (this.ready) this.ready();

			this.ignoreScale.forEach(
				i =>
					i.resize &&
					i.resize({
						width: this.cameras.main.width,
						height: this.cameras.main.height
					})
			);
			this.children.bringToTop(this.prizesPanel);

		}

		this._create();

		window.addEventListener('resize', () => {
			if (LeadLiaisonGame.settings.gameData.scaleMode === 'fit') {
				if (this.fitScaleModeResizeTimeout !== undefined) {
					window.clearTimeout(this.fitScaleModeResizeTimeout);
				}
				this.fitScaleModeResizeTimeout = window.setTimeout(() => {
					let width;
					let height;
					({ width, height } = getGameDimensions(
					LeadLiaisonGame.settings.gameData.gameWidth ?? width,
					LeadLiaisonGame.settings.gameData.gameHeight ?? height,
					));
					this.scale.setGameSize(width, height);
					this.fitScaleModeResizeTimeout = undefined;
					this.sys.game.events.emit('fit-scale-mode-resize', { width, height });
				}, 250);
				return;
			}

			if (this.settings.gameData.responsive) {
				this.resize();
				this.mainScene._resize();
			}
		});

		this.mainScene.Win = new Win(this.mainScene, 0, 0);
		this.mainScene.add.existing(this.mainScene.Win);

		this.mainScene.win = winnerSettings =>
			this.mainScene.events.emit("win", winnerSettings);

		this.startGame();
		this.resize();

		var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
		var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

		if (isSafari && iOS) {
			setInterval(()=> {
				document.body.scrollTop = document.documentElement.scrollTop = 0;
			}, 500);
		}
	}

	resize() {
		if (this.settings.gameData.scaleMode === 'fit') {
			return;
		}

		let screenWidth = window.innerWidth;
		let screenHeight = window.innerHeight;
		this.game.canvas.style.width = `${screenWidth}px`;
		this.game.canvas.style.height = `${screenHeight}px`;

		this.scale.setGameSize(screenWidth * window.devicePixelRatio, screenHeight * window.devicePixelRatio);
		this.scale.displaySize.resize(screenWidth * window.devicePixelRatio, screenHeight * window.devicePixelRatio);
		if (this.physics) this.physics.world.setBounds(0, 0, screenWidth * window.devicePixelRatio, screenHeight * window.devicePixelRatio);

	}

	messageDone() {
		this.mainScene.messageDone()
	}

	gameDone(doneData) {
		// use LeadLiaisonGameEvents done event unless need to talk to phaser
		this.mainScene.scene.pause();
		if (this.settings.trigger_win_event_with_done_event &&
			doneData.prize && typeof doneData.prize.name != 'undefined' && doneData.prize.name
		) {
			this.events.emit("win", doneData.prize);
		}
	}

	startGame() {

		this.mainScene.done = LeadLiaisonGame.done.bind(this);
		this.mainScene.message = LeadLiaisonGame.message.bind(this);
		this.mainScene.gameEvent = this.gameEvent.bind(this);
		this.mainScene.prizes = Prizes;

		this.scene.launch("Main");
		this.gameEvent({ eventName: "start" });

		this.scene.bringToTop();
	}



	gameEvent({ eventName, eventData }) {
		LeadLiaisonGame.gameEvent({ eventName, eventData });
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */
