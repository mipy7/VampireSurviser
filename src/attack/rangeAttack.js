// range attack
export default class rangeAttack extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, enemy, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setActive(true);

        this.scale = 0.1;
        this.setSize(100, 100);
        this.setOffset(-15,-15);

        this.damage = 0;
        this.speed = 200;
        this.lifetime = 1500;
        this.startTime = Date.now();
        this.enemy = enemy;

        this.dest = new Phaser.Math.Vector2(this.enemy.body.position);

        // set velocity
        this.body.setVelocity((this.dest.x - this.body.position.x), (this.dest.y - this.body.position.y));
        this.body.velocity.normalize().scale(this.speed);
        this.pojectileVelocity = this.body.velocity;

        // set rotation
        if(this.pojectileVelocity.y >= 0){
            this.setRotation(Math.acos(this.pojectileVelocity.x / this.pojectileVelocity.length()) + Math.PI);
        }else{
            this.setRotation(Math.acos(-this.pojectileVelocity.x / this.pojectileVelocity.length()));
        }
    }

    update() {
        this.projectileFlyController();
        this.checkAimHit();
        this.checkAlive();
    }

    projectileFlyController(){
        if(this.active){
            this.body.velocity = this.pojectileVelocity;
        }
    }

    checkAlive(){
        if(this.active && ((Date.now() > this.startTime + this.lifetime) || this.isAimHit)){
            this.killObject();
        }
    }

    checkAimHit(){
        if(this.active) {
            this.isAimHit = false;
            this.isAimHit = this.scene.physics.world.overlap(this, this.enemy, this.tryAttack);
        }
    }

    tryAttack(attackHitBox, enemy){
        enemy.tryGetHit(attackHitBox);
        return true;
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
        this.hide();
        this.destroy();
    }
}