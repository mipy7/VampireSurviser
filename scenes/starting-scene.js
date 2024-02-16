import EasyStar from "easystarjs";

import tilemapPng from '../assets/tileset/Dungeon_Tileset.png'
import dungeonRoomJson from '../assets/dungeon_room.json'
import bigDungeonJson from '../assets/map/BigDungeon.json'
import CharacterFactory from "../src/characters/character_factory";

// Heroes and mobs
import MainHero from '../assets/sprites/characters/ginger.png'
import PinkyMob from '../assets/sprites/characters/pinky.png'
import ClydeMob from '../assets/sprites/characters/clyde.png'
import StoneGolem from '../assets/sprites/characters/golem.png'
import Berserk from '../assets/sprites/characters/berserk.png'
import Gary from '../assets/sprites/characters/gary.png'
import Sans from '../assets/sprites/characters/sans.png'

// Attacks and other
import Splash from "../assets/sprites/attack/Splash.png";
import Wave from "../assets/sprites/attack/Wave.png";
import Bullet from "../assets/sprites/projectile/bullet.png";
import Stone from "../assets/sprites/projectile/cobbleStone.png";

let StartingScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function StartingScene() {
            Phaser.Scene.call(this, {key: 'StartingScene'});
        },
    characterFrameConfig: {frameWidth: 305, frameHeight: 305, margin: 50},
    pinkyFrameConfig: {frameWidth: 403, frameHeight: 403},
    clydeFrameConfig: {frameWidth: 341, frameHeight: 341},
    golemFrameConfig: {frameWidth: 996, frameHeight: 709, margin: 40},
    berserkFrameConfig: {frameWidth: 500, frameHeight: 500},
    garyFrameConfig: {frameWidth: 500, frameHeight: 500},
    sansFrameConfig: {frameWidth: 324, frameHeight: 324},
    waveFrameConfig: {frameWidth: 198, frameHeight: 186},

    preload: function () {

        //loading map tiles and json with positions
        this.load.image("tiles", tilemapPng);
        // this.load.tilemapTiledJSON("map", dungeonRoomJson);
        this.load.tilemapTiledJSON("map", bigDungeonJson);

        //loading spitesheets
        this.load.spritesheet('ginger', MainHero, this.characterFrameConfig);
        this.load.spritesheet('pinky', PinkyMob, this.pinkyFrameConfig);
        this.load.spritesheet('clyde', ClydeMob, this.clydeFrameConfig);
        this.load.spritesheet('golem', StoneGolem, this.golemFrameConfig);
        this.load.spritesheet('berserk', Berserk, this.berserkFrameConfig);
        this.load.spritesheet('gary', Gary, this.garyFrameConfig);
        this.load.spritesheet('sans', Sans, this.sansFrameConfig);

        this.load.spritesheet('wave', Wave, this.waveFrameConfig);

        //loading splashes and projectiles
        this.load.image('splash', Splash);
        this.load.image('bullet', Bullet);
        this.load.image('stone', Stone);

    },
    create: function () {

        this.gameObjects = [];
        const map = this.make.tilemap({key: "map"});

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("Dungeon_Tileset", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createStaticLayer("Floor", tileset, 0, 0);
        this.worldLayer = map.createStaticLayer("Walls", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Upper", tileset, 0, 0);
        this.tileSize = 32;

        // Setup for A-star
        this.finder = new EasyStar.js();
        let grid = [];
        for(let y = 0; y < this.worldLayer.tilemap.height; y++){
            let col = [];
            for(let x = 0; x < this.worldLayer.tilemap.width; x++) {
                const tile = this.worldLayer.tilemap.getTileAt(x, y);
                col.push(tile ? tile.index : 0);
            }
            grid.push(col);
        }

        this.finder.setGrid(grid);
        this.finder.setAcceptableTiles([0]);

        // Setup for collisions
        this.worldLayer.setCollisionBetween(1, 500);
        aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.characterFactory = new CharacterFactory(this);

        // Creating characters
        this.player = this.characterFactory.buildCharacter('ginger', 1700, 1250, {player: true});
        this.gameObjects.push(this.player);
        this.physics.add.collider(this.player, this.worldLayer);
        this.playersEnemy = this.physics.add.group();
        this.cameras.main.startFollow(this.player);

        // create golem
        this.SpawnCharacter('golem', 460, 2200);
        // this.golems = this.physics.add.group();
        // for(let i = 0; i < 0; i++) {
        //     const x = Phaser.Math.RND.between(50, this.physics.world.bounds.width - 50 );
        //     const y = Phaser.Math.RND.between(50, this.physics.world.bounds.height -50 );
        //
        //     const golem = this.characterFactory.buildGolem(x, y);
        //     golem.player = this.player;
        //     this.golems.add(golem);
        //     this.playersEnemy.add(golem);
        //     this.physics.add.collider(golem, worldLayer);
        //     this.gameObjects.push(golem);
        // }

        // create pinky
        // this.pinkys = this.physics.add.group();
        // for(let i = 0; i < 0; i++) {
        //     const x = Phaser.Math.RND.between(50, this.physics.world.bounds.width - 50 );
        //     const y = Phaser.Math.RND.between(50, this.physics.world.bounds.height -50 );
        //
        //     const pinky = this.characterFactory.buildPinky(x, y);
        //     pinky.player = this.player;
        //     this.pinkys.add(pinky);
        //     this.playersEnemy.add(pinky);
        //     this.physics.add.collider(pinky, this.worldLayer);
        //     this.gameObjects.push(pinky);
        // }

        // create berserk
        this.SpawnCharacter('berserk', 2900, 2200);
        // this.berserks = this.physics.add.group();
        // for(let i = 0; i < 0; i++) {
        //     const x = Phaser.Math.RND.between(50, this.physics.world.bounds.width - 50 );
        //     const y = Phaser.Math.RND.between(50, this.physics.world.bounds.height -50 );
        //
        //     const berserk = this.characterFactory.buildBerserk(x, y);
        //     berserk.player = this.player;
        //     this.berserks.add(berserk);
        //     this.playersEnemy.add(berserk);
        //     this.physics.add.collider(berserk, worldLayer);
        //     this.gameObjects.push(berserk);
        // }

        // create clyde
        // this.clydes = this.physics.add.group();
        // for(let i = 0; i < 0; i++) {
        //     const x = Phaser.Math.RND.between(50, this.physics.world.bounds.width - 50 );
        //     const y = Phaser.Math.RND.between(50, this.physics.world.bounds.height -50 );
        //
        //     const clyde = this.characterFactory.buildClyde(x, y);
        //     clyde.player = this.player;
        //     this.clydes.add(clyde);
        //     this.playersEnemy.add(clyde);
        //     this.physics.add.collider(clyde, this.worldLayer);
        //     this.gameObjects.push(clyde);
        // }

        // create gary (1700, 300)
        this.gary = this.SpawnCharacter('gary', 1700, 300);
        this.isBossSecondPhase = false;
        // this.garys = this.physics.add.group();
        // for(let i = 0; i < 0; i++) {
        //     const x = Phaser.Math.RND.between(50, this.physics.world.bounds.width - 50 );
        //     const y = Phaser.Math.RND.between(50, this.physics.world.bounds.height -50 );
        //
        //     const gary = this.characterFactory.buildGary(x, y);
        //     gary.player = this.player;
        //     this.garys.add(gary);
        //     this.playersEnemy.add(gary);
        //     this.physics.add.collider(gary, worldLayer);
        //     this.gameObjects.push(gary);
        // }

        // create sans
        // this.sansys = this.physics.add.group();
        // for(let i = 0; i < 0; i++) {
        //     const x = Phaser.Math.RND.between(50, this.physics.world.bounds.width - 50 );
        //     const y = Phaser.Math.RND.between(50, this.physics.world.bounds.height -50 );
        //
        //     const sans = this.characterFactory.buildSans(x, y);
        //     sans.player = this.player;
        //     this.sansys.add(sans);
        //     this.playersEnemy.add(sans);
        //     this.physics.add.collider(sans, worldLayer);
        //     this.gameObjects.push(sans);
        // }

        this.commonMob = ['clyde', 'pinky'];

        this.physics.add.collider(this.playersEnemy, this.playersEnemy);
        this.physics.add.collider(this.player, this.playersEnemy);

        this.player.enemies = this.playersEnemy;

        //this.physics.world.createDebugGraphic();

        this.input.keyboard.on("keydown_D", event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            const graphics = this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
        });
    },
    update: function () {
        this.removeUnusedGameObjects();
        this.gameObjectsUpdate();
        this.SpawnCommonEnemy();
    },
    gameObjectsUpdate(){
        if (this.gameObjects)
        {
            this.gameObjects.forEach( function(element) {
                element.update();
            });
            this.garySansUpdate();
        }
    },
    tilesToPixels(tileX, tileY)
    {
        return [tileX*this.tileSize, tileY*this.tileSize];
    },
    removeUnusedGameObjects(){
      this.gameObjects.forEach(elem =>{
          if(!elem.active){
              this.gameObjects.splice(this.gameObjects.indexOf(elem), 1);
          }
      })
    },
    garySansUpdate(){
        if(this.gary.scene !== undefined) {
            this.garyLastPos = this.gary.body.position;
        }
        if(this.gameObjects.indexOf(this.gary) === -1 && !this.isBossSecondPhase){
            this.isBossSecondPhase = true;
            this.SpawnCharacter('sans', this.garyLastPos.x, this.garyLastPos.y);
        }
    },
    SpawnCommonEnemy(){
        if(this.player.scene && this.gameObjects.length < 15) {
            const CommonEnemyType = this.commonMob[Phaser.Math.RND.between(0, this.commonMob.length-1)];

            let spawnX = 0;
            let spawnY = 0;

            switch (Phaser.Math.RND.between(0, 3))
            {
                case 0:  // spawn enemy along left wall
                    if (this.player.x > 200 + this.cameras.main.width/2) {
                        spawnX = 300;
                        spawnY = Phaser.Math.RND.between(200, this.physics.world.bounds.height -200 );
                    } break;
                case 1: // spawn enemy along right wall
                    if (this.player.x < this.physics.world.bounds.width - this.cameras.main.width/2) {
                        spawnX = this.physics.world.bounds.width - 300;
                        spawnY = Phaser.Math.RND.between(200, this.physics.world.bounds.height -200 );
                    } break;
                case 2:// spawn enemy along top wall
                    if (this.player.y > 200 + this.cameras.main.height/2) {
                        spawnX = Phaser.Math.RND.between(200, this.physics.world.bounds.width -200 );
                        spawnY = 300;
                    } break;
                case 3:// spawn enemy along bottom wall
                    if (this.player.y < this.physics.world.bounds.height + this.cameras.main.height/2) {
                        spawnX = Phaser.Math.RND.between(200, this.physics.world.bounds.width -200 );
                        spawnY = this.physics.world.bounds.height - 300;
                    } break;
            }

            const CommonEnemy = this.SpawnCharacter(CommonEnemyType, spawnX, spawnY);

            const posX = this.player.body.position.x - CommonEnemy.body.position.x;
            const posY = this.player.body.position.y - CommonEnemy.body.position.y;
            let pos = new Phaser.Math.Vector2(posX, posY);
            const dist = this.player.body.position.distance(CommonEnemy.body.position);
            pos = pos.normalize().scale(dist - 500);
            CommonEnemy.setPosition(CommonEnemy.body.position.x + pos.x, CommonEnemy.body.position.y + pos.y);
            //CommonEnemy.isAngry = true;
        }
    },
    SpawnCharacter(characterType, x, y){
        const spawnX = x !== undefined ? x : Phaser.Math.RND.between(50, this.physics.world.bounds.width - 50 );
        const spawnY = y !== undefined ? y : Phaser.Math.RND.between(50, this.physics.world.bounds.height -50 );

        const character = this.characterFactory.buildCharacter(characterType, spawnX, spawnY);
        character.player = this.player;
        this.playersEnemy.add(character);
        this.physics.add.collider(character, this.worldLayer);
        this.gameObjects.push(character);
        return character;
    },
});

export default StartingScene