export default class aim extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setActive(true);
        this.setVisible(false);

        this.scale = 5;
        // this.setSize(300, 200);
        // this.setOffset(-15,-15);
    }

    update() {

    }

    hide(){
        this.setActive(false);
        this.setVisible(false);
        // this.destroy();
    }

    show(){
        this.setActive(true);
        this.setVisible(true);
    }
}