export default class meleeAttack extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.hide();

        this.scale = 0.18;
        this.setSize(300, 200);
        this.setOffset(-15,-15);

        this.startTime = Date.now();
        this.livetime = 200;

        this.damage = 0;
    }

    update() {
        if(Date.now() > this.startTime + this.livetime){
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
        this.setActive(true);
        this.setVisible(true);
    }
}