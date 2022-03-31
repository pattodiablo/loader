// You can write more code here
/* prettier-ignore */

import LeadLiaisonGame from './baseGame/LeadLiaisonGame.js';
import LeadLiaisonGameEvents from './baseGame/GameEvents';
import BootScene from './phaser/bootPhaser.js';
import WebFont from "webfontloader"
import LeadLiaisonGamePrizes from './baseGame/Prizes.js';
import defaultAssets from './phaser/defaultPhaserAssets.json';
import isMobile from 'ismobilejs';
import { getGameDimensions } from '../src/utils/FitScaleModeHelper';


window.LeadLiaisonGameEvents = LeadLiaisonGameEvents;

window.isMobile = isMobile(window.navigator);

let iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream
let aspect = window.screen.width / window.screen.height
if (iPhone && aspect.toFixed(3) === "0.462") {
  window.hasNotch = true
}

const urlParams = Object.fromEntries(
  new URLSearchParams(window.location.search)
);

const gameId = urlParams.game;

const gamesFolder = "../";
const gamePath =
  window.location.href.replace(/[^/]*$/, "") + `${gamesFolder}${gameId}/`;

window.phaser_load_game = async () => {

  window.LeadLiaisonGame = LeadLiaisonGame;

  let settings = {};
  if (typeof ll_activation_rendering_manager != 'undefined') {
    LeadLiaisonGame.settings = settings;
  } else {
    LeadLiaisonGame.settings = await (await fetch(gamePath + "settings.json")).json();
  }
  settings = LeadLiaisonGame.settings;
  settings.gameData = settings.gameData || {}
  settings.gameData.gameId = settings.gameData.gameId || gameId;
  settings.gameData.gamePath = settings.gameData.gamePath || gamePath;
  settings.gameData.urlParams = settings.gameData.urlParams;

  settings.backgroundColor = settings.backgroundColor || "#242424";
  settings.width = document.documentElement.clientWidth;
  settings.height = document.documentElement ? document.documentElement.clientHeight : window.innerHeight;
  settings.gameData.gameScale =
    settings.gameData.gameScale || window.devicePixelRatio;

  LeadLiaisonGame.settings.gameData = {
    ...settings.gameData,
    ...urlParams
  };

  LeadLiaisonGame.gamePath = gamePath;

  try {
    LeadLiaisonGame.assets = await (await fetch(gamePath + 'assets.json')).json();
  } catch (e) { }

  LeadLiaisonGamePrizes.init();

  const mapUrl = item => {
    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    if (Array.isArray(item.url)) item.url = item.url[0]

    if (typeof item.url == "string" && !r.test(item.url))
      item.url = gamePath + item.url;
    return item
  }
  const combineArray = (arr1, arr2, path) => {

    const map = new Map();
    arr1.forEach(item => map.set(item.key, item));
    arr2.forEach(item => map.set(item.key, { ...map.get(item.key), ...item }))
    return Array.from(map.values());
  }

  let webFontConfig = {
    custom: {
      families: ['Digtal7', "AvenirRoman", "AvenirMedium"]
    }
  }

  if (LeadLiaisonGame.settings.googleFonts) {
    webFontConfig.google = { families: LeadLiaisonGame.settings.googleFonts }
  }

  WebFont.load(webFontConfig);

  if (LeadLiaisonGame.assets) {

    LeadLiaisonGame.assets = combineArray(LeadLiaisonGame.assets.section1.files.map(mapUrl), defaultAssets.section1.files)

    LeadLiaisonGame.assets = combineArray(LeadLiaisonGame.assets, LeadLiaisonGame.settings.files.map(mapUrl))

    if (LeadLiaisonGame.settings.animations) {
      let animations = await (await fetch(gamePath + 'animations.json')).json();
      animations.anims = combineArray(animations.anims, LeadLiaisonGame.settings.animations || [])
      LeadLiaisonGame.assets.find((item) => item.key == "animations").url = animations
    }

    //let phaserFile =  LeadLiaisonGame.settings.gameData.phaserFile || `phaser.min.js`
    // window.Phaser = await import("./phaser/lib/"+phaserFile);

    let width = 1366;
    let height = 1024;

    // if using 'fit' mode, check if custom game size was given
    if (LeadLiaisonGame.settings.gameData.scaleMode === 'fit') {
      ({ width, height } = getGameDimensions(
        LeadLiaisonGame.settings.gameData.gameWidth ?? width,
        LeadLiaisonGame.settings.gameData.gameHeight ?? height,
      ));
    }

    let game = new Phaser.Game({
      transparent: settings.transparent ?? true,
      type: Phaser.WEBGL,
      backgroundColor: settings.backgroundColor,
      scale: {
        width,
        height,
        parent: 'gameDiv',
        mode: LeadLiaisonGame.settings.gameData.scaleMode === 'fit' ? Phaser.Scale.FIT : undefined,
      },
      physics: {
        default: LeadLiaisonGame.settings.gameData.physicsEngine || 'matter',
        arcade: {
          debug: window.location.href.includes("debug"),
          ...(LeadLiaisonGame.settings.gameData.physicsConfig ?? {}),
        },
        matter: {
          debug: window.location.href.includes("debug"),
          ...(LeadLiaisonGame.settings.gameData.physicsConfig ?? {
            gravity: false,
          }),
        },
      }
    });

    game.scene.add("Boot", BootScene, true);
  } else {
    LeadLiaisonGame.assets = LeadLiaisonGame.settings.files
    await import(/* webpackIgnore: true */ `${gamePath}${"Main"}.js`);
    LeadLiaisonGame.init();
  }
}

if (typeof ll_activation_rendering_manager == 'undefined') {
  window.addEventListener("load", async () => {
    phaser_load_game();
  });
}
