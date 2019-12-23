let gameScene = new Phaser.Scene('Game');
// let winScene = new Phaser.Scene('Win');
let score = 0;
let timer = 60;
let scoreText;
let timeText;
let tmt;



tmt = setInterval(() => {
    timer--

    console.log(timer);
    if (timer === 0 && score < 3) {
        clearTimeout(tmt);
        let missrac = 3 - score;
        bg = gameScene.add.sprite(0, 0, 'loose');
        bg.setOrigin(0, 0);
        scoreText = gameScene.add.text(250, 160, missrac + "Raccoons are missing!!!\n Time is up:(", { font: "34px Arial", fill: '#FF0000' })
        


   
        // scoreText.destroy();
        gameScene.scene.pause();
        return;
    }
}, 1000)

gameScene.init = function () {

   
    this.playerSpeed = 3;


    this.enemyMinSpeed = 0.5;
    this.enemyMaxSpeed = 3;


    this.enemyMinY = -100;
    this.enemyMaxY = 450;
};


gameScene.preload = function () {

    this.load.image('background', 'assets/font.png');
    this.load.image('player', 'assets/raccoon5.png');
    this.load.image('rac', 'assets/raccoon5.png');
    this.load.image('enemy', 'assets/car.png');
    this.load.image('goal', 'assets/unnamed.png');
    this.load.image('win', 'assets/winback.png');
    this.load.image('loose', 'assets/loose.png');

};

gameScene.create = function () {

    let bg = this.add.sprite(0, 0, 'background');


    bg.setOrigin(0, 0);

    // let rac = this.add.sprite(600, 120, 'rac');
    // rac.depth = 1;
    // rac.setScale(0.1);
  


    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');


    this.player.setScale(0.15);


    this.goal = this.add.sprite(this.sys.game.config.width - 65, this.sys.game.config.height / 2, 'goal');
    this.goal.setScale(0.07);

    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 3,
        setXY: {
            x: 150,
            y: 200,
            stepX: 90,
            stepY: 100
        }
    });


    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.8, -0.8);


    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {

        enemy.flipX = true;


        let dir = Math.random() < 0.5 ? -1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = dir * speed;

    }, this);

      timeText = this.add.text(10, 10, timer + "sec", {font:"40px Arial", fill: '#ff0000'})


    console.log('fdgdfg');

    if (score < 3) {
        scoreText = this.add.text(530, 90, score + " of 3 \n raccoons \n are coding", { font: "15px Arial" });

    }
    else {
        scoreText = this.add.text(350, 160, "Good job!!!\n Everybody came\n in time!", { font: "34px Arial", fill: '#00ff00' });
        scoreText.depth = 1;
    }
};




gameScene.update = function () {
    timeText.setText(timer + "sec")


    if (this.input.activePointer.isDown) {

        this.player.x += this.playerSpeed;
    }


    let playerRect = this.player.getBounds();
    let goalRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {


        score++;
       

        console.log(score);


        this.scene.restart();
        return;
    }
    if (score === 3) {
        clearTimeout(tmt);

        timer = 0;
        console.log("win");
         bg = this.add.sprite(0, 0, 'win');
         bg.setOrigin(0, 0);
       
        this.scene.pause();
        return;

        //   this.scene.stop();
        //   return;
        //   winScene.init();
        //   winScene.preload();
        //   winScene.create();

    }




    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {


        enemies[i].y += enemies[i].speed;


        let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
        let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;


        if (conditionUp) {
            enemies[i].speed *= -1;
            enemies[i].flipY = true;
        }
        if (conditionDown) {
            enemies[i].speed *= -1;
            enemies[i].flipY = false;
        }


        let enemyRect = enemies[i].getBounds();

        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            //   console.log('Game over!');

            // restart the Scene
            this.scene.restart();
            return;
        }
    }



};

// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 640,
    height: 360,
    scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
