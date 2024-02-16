import Attack from '../attack/meleeAttack.js'

export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.prevAttack = Date.now();

        this.speed = 100;
        this.healPoint = 100;
        this.damage = 20;
        this.attackSpeed = 1000; // delay between attack in milliseconds

        this.attackHitBox = new Attack(this.scene).setTexture('splash');
        this.attackHitBox.damage = this.damage;

        this.getHittedArray = [];
        this.isKnockingBack = false;
        this.startKnockingBack = Date.now();
        this.isGetHitted = false;
        this.startHit = Date.now();
        this.startDeath = Date.now();
    }

    update() {
        this.MovingController();
        this.AttackUpdate();
        this.updateAnimation();
        this.checkHit();
        this.checkHP();
    };

    updateAnimation() {
        const idleAnim = this.animationSets.get('Idle');
        const walkAnim = this.animationSets.get('Walk');
        const attackAnim = this.animationSets.get('Attack');
        const getHitAnim = this.animationSets.get('Hit');
        const deathAnim = this.animationSets.get('Death');
        const animsController = this.anims;
        const x = this.isDeath ? 0 : this.body.velocity.x;
        const y = this.isDeath ? 0 : this.body.velocity.y;
        if(Date.now() > this.prevAttack + this.attackSpeed){
            this.isAttack = true;
        }

        if(this.isDeath){
            if(!this.isDeathAnimPlaying) {

                // death anim
                animsController.play({key: deathAnim[0], timeScale: 10, repeat: 0}, true);
                this.isDeathAnimPlaying = true;
            }

            if(Date.now() > this.startDeath + 1500){
                this.killObject();
            }
        } else if(this.isGetHitted){
            if(!this.isHitAnimPlaying) {

                // get hit anim
                animsController.play({key: getHitAnim[0], timeScale: 5, repeat: 0}, true);
                this.isHitAnimPlaying = true;
            }

            if(!animsController.isPlaying){
                this.isGetHitted = false;
                this.isHitAnimPlaying = false;
            }
        } else if(this.isAttack) {

            if(!this.isAttackAnimPlaying){
                // attack anim
                animsController.play({key: attackAnim[0], timeScale: 5, repeat: 0}, true);

                this.isAttackAnimPlaying = true;
                this.attackHitBox.show();
                this.prevAttack = Date.now();
            }

            if(!animsController.isPlaying){
                this.isAttack = false;
                this.isAttackAnimPlaying = false;
            }
        } else if(this.isMoving){

            // walk anim
            animsController.play({key: walkAnim[0], timeScale: 1}, true);
        } else if(!this.isMoving) {

            // idle anim
            animsController.play({key: idleAnim[0], timeScale: 1}, true);
        }

        if (x < 0) {
            this.setFlipX(false);
            this.isMoving = true;
        } else if (x > 0) {
            this.setFlipX(true);
            this.isMoving = true;
        } else if (y < 0) {
            this.isMoving = true;
        } else if (y > 0) {
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
        // else {
        //     const currentAnimation = animsController.currentAnim;
        //     if (currentAnimation) {
        //         const frame = currentAnimation.getLastFrame();
        //         this.setTexture(frame.textureKey, frame.textureFrame);
        //     }
        // }
    }

    MovingController(){
        if(!this.isDeath){
            if(this.isKnockingBack){
                if(Date.now() > this.startKnockingBack + 100){
                    this.isKnockingBack = false;
                }
                return;
            }
            const body = this.body;
            this.body.setVelocity(0);
            //this.body.setOffset(100,100);
            const speed = this.speed;
            const cursors = this.cursors;

            if (cursors.left.isDown) {
                body.velocity.x -= speed;
            } else if (cursors.right.isDown) {
                body.velocity.x += speed;
            }

            // Vertical movement
            if (cursors.up.isDown) {
                body.setVelocityY(-speed);
            } else if (cursors.down.isDown) {
                body.setVelocityY(speed);
            }
            // Normalize and scale the velocity so that player can't move faster along a diagonal
            body.velocity.normalize().scale(speed);
        }
        if(this.isDeath){
            this.body.setVelocity(0);
        }
    }

    checkHit(){
        this.getHittedArray.forEach( element => {
            if(element && !element.active){
                this.getHittedArray.splice(this.getHittedArray.indexOf(element), 1);
            }
        })
    }

    checkHP(){
        if(this.healPoint <= 0 && !this.isDeath){
            this.startDeath = Date.now();
            this.isDeath = true;
        }
    }

    killObject(){
        this.attackHitBox.hide();
        this.attackHitBox.destroy();
        this.destroy();
    }

    getHit(damage){
        this.healPoint -= damage;
        this.isGetHitted = true;
        this.startHit = Date.now();
    }

    tryGetHit(attack){
        if(attack.active && this.getHittedArray.indexOf(attack) === -1){
            this.getHit(attack.damage);
            this.getHittedArray.push(attack);
            if(attack.texture.key === 'wave'){
                this.isKnockingBack = true;
                this.startKnockingBack = Date.now();
                const forceX = this.body.x - attack.body.x;
                const forceY = this.body.y - attack.body.y;
                this.body.setVelocity(forceX, forceY);
                this.body.velocity.normalize().scale(attack.throwForce);
            }
        }
    }

    // attack anim update
    AttackUpdate(){
        this.scene.physics.world.overlap(this.attackHitBox, this.enemies, this.tryAttack);

        if(this.attackHitBox && this.attackHitBox.scene !== undefined) {
            const attackX = this.flipX ? this.body.x + 30: this.body.x + 10;
            const attackY = this.body.y + 15;
            this.attackHitBox.setPosition(attackX, attackY);
            this.attackHitBox.setFlipX(this.flipX);
            this.attackHitBox.update();
        }
    }

    tryAttack(attackHitBox, enemy){
        enemy.tryGetHit(attackHitBox);
    }
}
