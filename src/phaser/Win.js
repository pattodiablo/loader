// You can write more code here
/* prettier-ignore */
/* START OF COMPILED CODE */
import Phaser from 'phaser'
export default class Win extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this._create();
  }

  /* START-USER-CODE */
  bigWin(windata) {
    this.bigwin.play();
    this.fireworks.play();
    var spark0 = this.scene.add.particles("red");
    var spark1 = this.scene.add.particles("blue");

    for (let i = 0; i < 14; i++) {
      this.scene.time.delayedCall(Math.random() * 2500, () => {
        let expleo = (Math.random() > 0.5 ? spark0 : spark1).createEmitter({
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          angle: {min: -100, max: 500},
          speed: {min: -100, max: 500},
          gravityY: 200,
          scale: {start: 0.4, end: 0},
          lifespan: 3500,
          quantity: 0,
          blendMode: "SCREEN",
          active: true
        });
        expleo.explode(120);
      });
    }

    this.scene.time.delayedCall(3000, () => this.scene.events.emit("winDone",windata));
  }

  _create() {
    this.bigwin = this.scene.game.sound.add("bigwin");
    this.fireworks = this.scene.game.sound.add("fireworks");
    this.smallwin = this.scene.game.sound.add("smallwin");
    this.scene.events.on("win", windata => {
      if (windata && windata.bigWin) {
        this.bigWin(windata);
      } else {
        this.smallwin.play();
        this.scene.time.delayedCall(1600, () => this.scene.events.emit("winDone",windata));
      }
    });
  }

  // Write your code here.

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
