// falling stone attack

import waveAttack from "./waveAttack";

export default class fallingStoneAttack extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, enemy, x, y, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setActive(true);

        this.scale = 0.1;
        this.setSize(100, 100);
        //this.setOffset(200,200);

        this.damage = 0;
        this.speed = 200;
        this.lifetime = 5000;
        this.startTime = Date.now();
        this.enemy = enemy;

        this.dest = new Phaser.Math.Vector2(this.enemy.body.position.x + 20, this.enemy.body.position.y + 20);

        // spawn stone above player
        this.setPosition(this.dest.x, this.dest.y - 200);
        // this.body.position.x = this.dest.x;
        // this.body.position.y = this.dest.y - 200;

        // set velocity
        //this.body.setVelocity((this.dest.x - this.body.position.x), (this.dest.y - this.body.position.y));
        this.body.setVelocity(0, 200);
        this.body.velocity.normalize().scale(this.speed);
        this.pojectileVelocity = this.body.velocity;
    }

    update() {
        this.projectileFlyController();
        this.checkAimHit();
        this.checkAlive();
        this.waveUpdate();
    }

    projectileFlyController(){
        if(this.active){
            this.body.velocity = this.pojectileVelocity;
        }
    }

    checkAimHit(){
        if(this.active && this.body.position.distance(this.dest) < 20.0){
            this.hide();
            this.setVelocity(0);
            this.spawnWaveAttack();
        }
    }

    checkAlive(){
        if(!this.active && !this.wave.active || Date.now() > this.startTime + this.lifetime){
            this.killObject();
        }
    }

    spawnWaveAttack(){
        this.wave = new waveAttack(this.scene, this.dest.x, this.dest.y, 'wave');
        this.wave.setSize(50, 50);
        this.wave.damage = this.damage;
        this.wave.delay = 0;
        this.wave.enemy = this.enemy;
        this.wave.setActive(true);
        this.wave.show();
    }

    waveUpdate(){
        if(this.wave && this.wave.active){
            this.wave.update();
        }
    }

    hide(){
        this.setActive(false);
        this.setVisible(false);
    }

    show(){
        this.setActive(true);
        this.setVisible(true);
    }

    killObject(){
        if(this.wave) {
            this.wave.hide();
            this.wave.destroy();
        }
        this.hide();
        this.destroy();
    }
}