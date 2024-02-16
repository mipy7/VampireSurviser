import {StateTableRow, StateTable} from '../ai/behaviour/state';

// Heroes and mobs classes
import Slime from "./slime";
import Player from "./player";
import Golem from "./golem";
import Pinky from "./pinky";
import Berserk from "./berserk";
import Clyde from "./clyde";
import Gary from "./gary";
import Sans from "./sans";

// Heroes, mobs and attacks jsons
import cyberpunkConfigJson from "../../assets/animations/cyberpunk.json";
import gingerConfigJson from "../../assets/animations/ginger.json";
import pinkyConfigJson from "../../assets/animations/pinky.json";
import clydeConfigJson from "../../assets/animations/clyde.json";
import golemConfigJson from "../../assets/animations/golem.json";
import berserkConfigJson from "../../assets/animations/berserk.json";
import garyConfigJson from "../../assets/animations/gary.json";
import sansConfigJson from "../../assets/animations/sans.json";
import slimeConfigJson from "../../assets/animations/slime.json";
import waveConfigJson from "../../assets/animations/waveAttack.json"

// animation loader
import AnimationLoader from "../utils/animation-loader";


export default class CharacterFactory {

    constructor(scene) {
        this.scene = scene;

        this.cyberSpritesheets =  ['ginger'];
        this.slimeSpriteSheet = 'slime';
        this.pinkySpriteSheet = 'pinky';
        this.clydeSpriteSheet = 'clyde';
        this.golemSpriteSheet = 'golem';
        this.berserkSpriteSheet = 'berserk';
        this.garySpriteSheet = 'gary';
        this.sansSpriteSheet = 'sans';
        this.waveSpriteSheet = 'wave';

        const slimeStateTable = new StateTable(this);
        slimeStateTable.addState(new StateTableRow('searching', this.foundTarget, 'jumping'));
        slimeStateTable.addState(new StateTableRow('jumping', this.lostTarget, 'searching'));

        let animationLibrary =  new Map();
        this.cyberSpritesheets.forEach(
            function (element) {
                animationLibrary.set(element, new AnimationLoader(scene,
                    element,
                    gingerConfigJson,
                    element).createAnimations());
            }
        );

        animationLibrary.set(this.pinkySpriteSheet,
            new AnimationLoader(scene, this.pinkySpriteSheet, pinkyConfigJson, this.pinkySpriteSheet).createAnimations());
        animationLibrary.set(this.clydeSpriteSheet,
            new AnimationLoader(scene, this.clydeSpriteSheet, clydeConfigJson, this.clydeSpriteSheet).createAnimations());
        animationLibrary.set(this.golemSpriteSheet,
                new AnimationLoader(scene, this.golemSpriteSheet, golemConfigJson, this.golemSpriteSheet).createAnimations());
        animationLibrary.set(this.berserkSpriteSheet,
            new AnimationLoader(scene, this.berserkSpriteSheet, berserkConfigJson, this.berserkSpriteSheet).createAnimations());
        animationLibrary.set(this.garySpriteSheet,
            new AnimationLoader(scene, this.garySpriteSheet, garyConfigJson, this.garySpriteSheet).createAnimations());
        animationLibrary.set(this.sansSpriteSheet,
            new AnimationLoader(scene, this.sansSpriteSheet, sansConfigJson, this.sansSpriteSheet).createAnimations());
        animationLibrary.set(this.waveSpriteSheet,
            new AnimationLoader(scene, this.waveSpriteSheet, waveConfigJson, this.waveSpriteSheet).createAnimations());
        this.animationLibrary = animationLibrary;
    }

    buildCharacter(spriteSheetName, x, y, params = {}) {
        switch (spriteSheetName) {
            case 'aurora':
            case 'blue':
            case 'punk':
            case 'yellow':
            case 'green':
            case 'ginger':
                if (params.player)
                    return this.buildPlayerCharacter(spriteSheetName, x, y);
                else{
                    // todo: Add NPC
                }
                break
            case "slime":
            case "pinky":
                return this.buildPinky(x, y, params);
            case "clyde":
                return this.buildClyde(x, y, params);
            case "golem":
                return this.buildGolem(x, y, params);
            case "berserk":
                return this.buildBerserk(x, y, params);
            case "gary":
                return this.buildGary(x, y, params);
            case "sans":
                return this.buildSans(x, y, params);
        }
    }

    buildPlayerCharacter(spriteSheetName, x, y) {
        let character = new Player(this.scene, x, y, spriteSheetName, 0);
        character.setCollideWorldBounds(true);
        character.cursors = this.scene.input.keyboard.createCursorKeys();
        character.animationSets = this.animationLibrary.get('ginger');
        character.scale = 0.2;
        character.setSize(200,200);
        return character;
    }

    buildPinky(x, y, params) {
        let pinky = new Pinky(this.scene, x, y, this.pinkySpriteSheet, 0);
        pinky.animationSets = this.animationLibrary.get('pinky');
        pinky.setCollideWorldBounds(true);
        return pinky;
    }

    buildClyde(x, y, params) {
        let clyde = new Clyde(this.scene, x, y, this.clydeSpriteSheet, 0);
        clyde.animationSets = this.animationLibrary.get('clyde');
        clyde.setCollideWorldBounds(true);
        return clyde;
    }

    buildGolem(x, y, params) {
        let golem = new Golem(this.scene, x, y, this.golemSpriteSheet, 0);
        golem.animationSets = this.animationLibrary.get('golem');
        golem.setCollideWorldBounds(true);
        return golem;
    }

    buildBerserk(x, y, params) {
        let berserk = new Berserk(this.scene, x, y, this.berserkSpriteSheet, 0);
        berserk.animationSets = this.animationLibrary.get('berserk');
        berserk.setCollideWorldBounds(true);
        return berserk;
    }

    buildGary(x, y, params) {
        let gary = new Gary(this.scene, x, y, this.garySpriteSheet, 0);
        gary.animationSets = this.animationLibrary.get('gary');
        gary.setCollideWorldBounds(true);
        return gary;
    }

    buildSans(x, y, params) {
        let sans = new Sans(this.scene, x, y, this.garySpriteSheet, 0);
        sans.animationSets = this.animationLibrary.get('sans');
        sans.setCollideWorldBounds(true);
        return sans;
    }
}