import AnimationLoader from "../utils/animation-loader";
import waveConfigJson from "../../assets/animations/waveAttack.json"

export default class waveAttack extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.animationSets = new AnimationLoader(scene, 'wave', waveConfigJson, 'wave').createAnimations();

        this.setActive(false);

        //this.scale = 0.6;
        //this.setSize(50, 50);
        //this.setOffset(-100,-100);

        this.startTime = Date.now();
        this.livetime = 600;
        this.delay = 200;

        this.damage = 0;
        this.throwForce = 200;

        this.aim = false;
        this.spreadingframe = 0;
    }

    update() {
        if(!this.aim){
            this.playAnimation();
            this.attackZoneSpreading();
            this.checkAimHit();
            this.checkAlive();
        }
    }

    playAnimation(){
        if(this.isPlaying && Date.now() > this.startTime + this.delay){
            this.setActive(true);
            this.setVisible(true);

            const attackAnim = this.animationSets.get('Wave');
            const animsController = this.anims;

            // attack anim
            animsController.play({key: attackAnim[0], frameRate: 10, repeat: 0}, true);
            this.isSpreading = true;
            this.isPlaying = false;
        }
    }

    attackZoneSpreading(){
        if(this.isSpreading){
            this.setSize(50,50);
            if(this.spreadingframe < 70){
                this.setSize(50+this.spreadingframe*(150 / 70),50+this.spreadingframe*(150 / 70));
                this.spreadingframe++;
            } else {
                this.isSpreading = false;
            }
        }else{
            this.spreadingframe = 0;
        }
    }

    checkAimHit(){
        if(this.active && this.enemy) {
            this.scene.physics.world.overlap(this, this.enemy, this.tryAttack);
        }
    }

    tryAttack(attackHitBox, enemy){
        enemy.tryGetHit(attackHitBox);
        return true;
    }

    checkAlive(){
        if(Date.now() > this.startTime + this.livetime + this.delay){
            this.hide();
        }
    }

    hide(){
        this.setActive(false);
        this.setVisible(false);
        // this.destroy();
    }

    show(){
        this.startTime = Date.now();
        this.isPlaying = true;
    }
}