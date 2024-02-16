// second phase of boss
import Attack from '../attack/meleeAttack.js'
import StoneAttack from '../attack/fallingStoneAttack.js'

export default class Sans extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.scale = 0.2;
        this.setSize(200,200);
        this.setOffset(100,180);

        this.speed = 60;
        this.healPoint = 40;

        // common attack
        this.attackSpeed = 800; // delay between attack in milliseconds
        this.damage = 10;
        this.prevAttack = Date.now();
        this.isCanAttack = false;

        // falling stone attack
        this.fallingStoneAttackSpeed = 1000; // delay between falling stones attack in milliseconds
        this.fallingStoneDamage = 10;
        this.prevFallingStoneAttack = Date.now();
        this.thrownStoneArray = [];

        this.attackHitBox = new Attack(this.scene, x, y).setTexture('splash');
        this.attackHitBox.damage = this.damage;

        // area in which mobs are get angry
        this.areaVision = new Phaser.GameObjects.Rectangle(scene, x, y, 300, 300, 0xff0000, 0);
        scene.physics.world.enable(this.areaVision);
        scene.add.existing(this.areaVision);
        this.isAngry = false;

        this.getHittedArray = [];
        this.isGetHitted = false;
        this.startHit = Date.now();
        this.startDeath = Date.now();
    }

    update() {
        this.AreaOfVisionUpdate();
        this.moveToPlayer();
        this.AttackUpdate();
        this.updateAnimation();
        this.checkHit();
        this.checkHP();
    }

    updateAnimation() {
        const idleAnim = this.animationSets.get('Idle');
        const walkAnim = this.animationSets.get('Walk');
        const attackAnim = this.animationSets.get('Attack');
        const getHitAnim = this.animationSets.get('Hit');
        const deathAnim = this.animationSets.get('Death');
        const animsController = this.anims;
        const x = this.isDeath ? 0 : this.body.velocity.x;
        const y = this.isDeath ? 0 : this.body.velocity.y;
        if(this.isCanAttack && Date.now() - this.prevAttack > this.attackSpeed)
            this.isAttack = true;

        if(this.isDeath){
            if(!this.isDeathAnimPlaying) {

                // death anim
                animsController.play({key: deathAnim[0], timeScale: 5, repeat: 0}, true);
                this.isDeathAnimPlaying = true;
            }

            if(Date.now() > this.startDeath + 1500){
                this.killObject();
            }
        } else if(this.isGetHitted){
            if(!this.isHitAnimPlaying) {

                // get hit anim
                animsController.play({key: getHitAnim[0], timeScale: 3, repeat: 0}, true);
                this.isHitAnimPlaying = true;
            }

            if(Date.now() > this.startHit + 150){
                this.isGetHitted = false;
                this.isHitAnimPlaying = false;
            }
        } else if (this.isAttack) {
            if(!this.isAttackAnimPlaying) {

                // attack anim
                animsController.play({key: attackAnim[0], timeScale: 10, repeat: 0}, true);
                this.attackHitBox.show();
                this.prevAttack = Date.now();
                this.isAttackAnimPlaying = true;
            }

            if(!animsController.isPlaying){
                this.isAttack = false;
                this.isAttackAnimPlaying = false;
            }
        } else if(this.isMoving){

            // walk anim
            animsController.play({key: walkAnim[0], timeScale: 3}, true);
        } else if(!this.isMoving) {

            // idle anim
            animsController.play({key: idleAnim[0], timeScale: 3}, true);
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
    }

    checkHit(){
        this.getHittedArray.forEach( element => {
            if(!element.active){
                this.getHittedArray.splice(this.getHittedArray.indexOf(element), 1);
            }
        })
    }

    checkHP(){
        if(this.healPoint <= 0 && !this.isDeath){
            this.startDeath = Date.now();
            this.isDeath = true;
            this.body.setVelocity(0);
        }
    }

    killObject(){
        this.areaVision.destroy();
        this.attackHitBox.hide();
        this.attackHitBox.destroy();
        this.thrownStoneArray.forEach(elem => {
            elem.killObject();
        })
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
        }
    }

    moveToPlayer(){
        if(!this.isDeath && !this.isGetHitted && this.player.active && this.isAngry){
            const delta = this.body.position.distance(this.player.body.position);
            const x = this.player.body.x - this.body.x;
            const y = this.player.body.y - this.body.y;
            this.body.setVelocity(x, y);
            this.body.velocity.normalize().scale(Math.min(delta, this.speed));
        }
        else{
            this.body.setVelocity(0);
        }
    }

    AreaOfVisionUpdate(){
        if(!this.isDeath){
            if(this.scene.physics.world.overlap(this.areaVision, this.player)){
                this.isAngry = true;
            }

            if(this.areaVision){
                const posX = this.body.x + 15;
                const posY = this.body.y + 15;
                this.areaVision.setPosition(posX, posY);
            }
        }
    }

    AttackUpdate(){
        if(!this.isDeath && this.isAngry) {
            // common splash attack
            this.isCanAttack = false;
            this.isCanAttack = this.scene.physics.world.overlap(this.attackHitBox, this.player, this.tryAttack);

            if (this.attackHitBox && this.attackHitBox.scene !== undefined) {
                const attackX = this.flipX ? this.body.x + 30 : this.body.x + 10;
                const attackY = this.body.y + 15;
                this.attackHitBox.setPosition(attackX, attackY);
                this.attackHitBox.setFlipX(this.flipX);
                this.attackHitBox.update();
            }

            // falling stones attack
            if (this.player.scene && Date.now() > this.prevFallingStoneAttack + this.fallingStoneAttackSpeed){
                let fallingStone = new StoneAttack(this.scene, this.player).setTexture('stone');
                fallingStone.damage = this.fallingStoneDamage;
                this.thrownStoneArray.push(fallingStone);
                this.prevFallingStoneAttack = Date.now();
            }
        }
        this.thrownStoneArray.forEach(elem => {
            elem.update();
        })
    }

    tryAttack(attackHitBox, enemy){
        enemy.tryGetHit(attackHitBox);
        return true;
    }
}
