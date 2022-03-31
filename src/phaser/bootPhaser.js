import LeadLiaisonPhaserGame from "./LeadLiaisonPhaserGame";
import Phaser from 'phaser'

import UserComponent from "./components/UserComponent"
import autoResizeText from "./components/autoResizeText"
import autoResize from "./components/autoResize"
import PhysicsObject from "./components/physicsObject"

window.UserComponent = UserComponent;
window.autoResizeText = autoResizeText;
window.autoResize = autoResize;
window.PhysicsObject = PhysicsObject;


export default class Boot extends Phaser.Scene {
  
     preload() {

      if (LeadLiaisonGame.settings.gameData.scaleMode !== 'fit') {
        this.game.canvas.style.width = `${window.innerWidth}px`;
        this.game.canvas.style.height = `${window.innerHeight}px`;
        this.scale.setGameSize(window.innerWidth*window.devicePixelRatio, window.innerHeight*window.devicePixelRatio);
        this.scale.parent = null;
      }
    
      this.load.setCORS("anonymous");
      this.loadFiles();
      this.drawProgressBar(400, 50);
     
    }
  
     loadFiles() {

      this.load.pack("pack", {section1:{files:LeadLiaisonGame.assets}});
      this.load.script("Main", LeadLiaisonGame.settings.gameData.gamePath+"Main.js");
     
    }
  
    drawProgressBar(barWidth, barHeight) {
      let container = this.add.container(
        this.cameras.main.centerX - barWidth / 2,
        this.cameras.main.centerY - barHeight / 2
      );
  
      this.barWidth = barWidth;
      this.barHeight = barHeight;
  
      this.graphics = this.add.graphics();
      this.newGraphics = this.add.graphics();
  
      var progressBar = new Phaser.Geom.Rectangle(0, 0, barWidth, barHeight);
  
      this.graphics.fillStyle(0xffffff, 1);
      this.graphics.fillRectShape(progressBar);
  
      container.add(this.graphics);
      container.add(this.newGraphics);
  
      this.load.on("progress", this.updateBar, this);
  
      this.updateBar(0);
    }
  
    updateBar(percentage) {
      this.newGraphics.clear();
      this.newGraphics.fillStyle(0x3587e2, 1);
      this.newGraphics.fillRectShape(
        new Phaser.Geom.Rectangle(
          5,
          5,
          percentage * (this.barWidth - 10),
          this.barHeight - 10
        )
      );
    }
  
    async create() {
      
      this.scene.add("LeadLiaisonPhaserGame", LeadLiaisonPhaserGame);
      this.scene.start("LeadLiaisonPhaserGame", { settings:LeadLiaisonGame.settings });
    
      LeadLiaisonGame.init();
    }
  }