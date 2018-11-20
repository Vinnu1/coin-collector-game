var playState = {
	create:function(){

		game.stage.backgroundColor='#000000';//why isn;t this in boot working?
		this.player=game.add.sprite(game.width/2,game.height/2,'player');
		this.player.anchor.setTo(0.5,0.5);
		this.player.animations.add('right',[1,2],8,true);
		this.player.animations.add('left',[3,4],8,true);
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y=500;
		this.cursor=game.input.keyboard.createCursorKeys();
		this.jumpSound=game.add.audio('jump');
		this.coinSound=game.add.audio('coin');
		this.deadSound=game.add.audio('dead');
		this.music=game.add.audio('background_music');
		this.music.loop=true;
		this.music.play();
		this.createWorld();
		this.coin = game.add.sprite(60,140,'coin');
		this.coin.anchor.setTo(0.5,0.5);
		game.physics.arcade.enable(this.coin);
		//this.coin.body.gravity.y=500;
		this.scoreLabel=game.add.text(30,30,'score:0',{font:'18px Arial',fill:'#ffffff'});
		game.global.score=0;
		this.enemies=game.add.group();
		this.enemies.enableBody=true;
		this.enemies.createMultiple(10, 'enemy',0,false);
		this.nextEnemy=0;

		//this.enemyLabel=game.add.text(90,30,'DeadEnemies:');
		this.emitter=game.add.emitter(0,0,15);
		this.emitter.makeParticles('pixel');
		this.emitter.setYSpeed(-150,150);
		this.emitter.setXSpeed(-150,150);
		this.emitter.setScale(2,0,2,0,800);
		this.emitter.gravity=0;
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,Phaser.Keyboard.DOWN,Phaser.Keyboard.LEFT,Phaser.Keyboard.RIGHT]);
		this.wasd={
			up:game.input.keyboard.addKey(Phaser.Keyboard.W),
			left:game.input.keyboard.addKey(Phaser.Keyboard.A),
			right:game.input.keyboard.addKey(Phaser.Keyboard.D)
		};
		if(!game.device.desktop){
			this.addMobileInputs();
		}
		if(!game.device.desktop){
			this.rotateLabel=game.add.text(game.width/2,game.height/2,'',{font:'30px Arial',fill:'#fff',backgroundColor:'#000'});
			this.rotateLabel.anchor.setTo(0.5,0.5);
			game.scale.onOrientationChange.add(this.orientationChange,this);
			this.orientationChange();
		}
		//FPS
		game.time.advancedTiming = true;
		this.fpslabel=game.add.text(450,30,'0',{font:'18px Arial',fill:'#fff'});
	},
	update:function(){
		this.fpslabel.text=game.time.fps;
		game.physics.arcade.collide(this.player, this.layer);
		game.physics.arcade.collide(this.enemies,this.layer);
		game.physics.arcade.overlap(this.player,this.coin,this.takeCoin,null,this);
		game.physics.arcade.collide(this.player,this.enemies,this.playerDie,null,this);
		if(!this.player.alive){
			return; //update function is called 60 times per sec, when the player is already dead we don't want to call moveplayer or playerDie func for the sound.
		}
		this.movePlayer();
		if(!this.player.inWorld){
			this.playerDie();
		}
		//this.enemyLabel.text='DeadEnemies:'+this.enemies.countDead();
		if(this.nextEnemy<game.time.now){
			var start=4000,end=1000,score=100;
			var delay=Math.max(start - (start - end)*game.global.score/score,end);
			this.addEnemy();
			this.nextEnemy=game.time.now+delay;
		}
	},
	movePlayer:function(){
		if(game.input.totalActivePointers==0){ // zero finger on screen
			this.moveLeft=false;
			this.moveRight=false;
		}
		if(this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft){
			this.player.body.velocity.x=-200;
			this.player.animations.play('left');
		}
		else if(this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight){
			this.player.body.velocity.x=200;
			this.player.animations.play('right');
		}
		else{
			this.player.body.velocity.x=0;
			this.player.animations.stop();
			this.player.frame=0;
		}
		if((this.cursor.up.isDown || this.wasd.up.isDown || this.jumpCont) && this.player.body.onFloor()){ // //&& this.hitGround //player and ground are touching
			this.player.body.velocity.y=-320;
			this.jumpSound.play();
		}
	},
	createWorld:function(){
		this.map=game.add.tilemap('map');
		this.map.addTilesetImage('tileset');
		this.layer=this.map.createLayer('Tile Layer 1');
		this.layer.resizeWorld(); //world size = size layer
		this.map.setCollision(1); //collision on for 1st element(blue wall)
	},
	playerDie:function(){
		this.music.stop();
		this.player.kill();
		this.deadSound.play();
		game.camera.shake(0.06, 300);
		this.emitter.x=this.player.x;
		this.emitter.y=this.player.y;
		this.emitter.start(true,2000,null,15);
		game.time.events.add(3000,this.startMenu,this);
	},
	takeCoin:function(player,coin){ //parameters are the object getting overlapped
		this.coin.kill();
		this.coinSound.play();
		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100)
.yoyo(true).start();


		game.global.score+=5;
		this.scoreLabel.text='score:'+game.global.score;
		this.updateCoinPosition();
	},
	updateCoinPosition:function(){
		var coinPosition=[
			{x:140,y:60},{x:360,y:60},{x:60,y:140},{x:440,y:140},{x:130,y:300},{x:370,y:300} 
		];
		for (var i= 0;i<coinPosition.length;i++){
			if(coinPosition[i].x==this.coin.x){
				coinPosition.splice(i,1);
			}
		}
		var newPosition = game.rnd.pick(coinPosition);
		this.coin.reset(newPosition.x, newPosition.y);
		this.coin.scale.setTo(0, 0);
// Grow the coin back to its original scale in 300ms
game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();

	},
	addEnemy:function(){
		var enemy = this.enemies.getFirstDead();
		if(!enemy){
			return;
		}
		enemy.anchor.setTo(0.5,1);
		enemy.reset(game.width/2, 0);
		enemy.body.gravity.y=500;
		enemy.body.velocity.x=100*game.rnd.pick([-1,1]);
		enemy.body.bounce.x=1;
		enemy.checkWorldBounds=true;
		enemy.outOfBoundsKill=true;
	},
	startMenu:function(){
		game.state.start('menu');
	},
	addMobileInputs:function(){
		var jumpButton=game.add.sprite(420,260,'jumpButton');
		jumpButton.inputEnabled=true;
		jumpButton.alpha=0.3;
		this.jumpCont=false;
		jumpButton.events.onInputOver.add(this.jumpPlayer,this);
		jumpButton.events.onInputOut.add(this.DontjumpPlayer,this);
		jumpButton.events.onInputDown.add(this.jumpPlayer,this);
		jumpButton.events.onInputUp.add(this.DontjumpPlayer,this);
		this.moveLeft=false;
		this.moveRight=false;
		var leftButton=game.add.sprite(-15,260,'leftButton');
		leftButton.inputEnabled=true;
		leftButton.alpha=0.3;
		leftButton.events.onInputOver.add(this.setLeftTrue,this);
		leftButton.events.onInputOut.add(this.setLeftFalse,this);
		leftButton.events.onInputDown.add(this.setLeftTrue,this);
		leftButton.events.onInputUp.add(this.setLeftFalse,this);
		var rightButton=game.add.sprite(80,260,'rightButton');
		rightButton.inputEnabled=true;
		rightButton.alpha=0.3;
		rightButton.events.onInputOver.add(this.setRightTrue,this);
		rightButton.events.onInputOut.add(this.setRightFalse,this);
		rightButton.events.onInputDown.add(this.setRightTrue,this);
		rightButton.events.onInputUp.add(this.setRightFalse,this);
	},
	jumpPlayer:function(){
		this.jumpCont=true;
	},
	DontjumpPlayer:function(){
		this.jumpCont=false;
	},
	setLeftTrue:function(){
		this.moveLeft=true;
	},
	setLeftFalse:function(){
		this.moveLeft=false;
	},
	setRightTrue:function(){
		this.moveRight=true;
	},
	setRightFalse:function(){
		this.moveRight=false;
	},
	orientationChange:function(){
		if(game.scale.isPortrait){
			game.paused=true;
			this.rotateLabel.text='rotate your device in landscape';
		}
		else{
			game.paused=false;
			this.rotateLabel.text='';
		}
	},
}