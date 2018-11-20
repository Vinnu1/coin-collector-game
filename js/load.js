var loadState={
	preload:function(){
		var loadingLabel = game.add.text(game.width/2,150,'loading...',{font:'20px Arial',fill:'#ffffff'});
		loadingLabel.anchor.setTo(0.5,0.5);
		var progressBar = game.add.sprite(game.width/2,200,'progressBar');
		progressBar.anchor.setTo(0.5,0.5);
		game.load.setPreloadSprite(progressBar);
		game.load.spritesheet('player','assets/player2.png',20,20);
		game.load.image('enemy','assets/enemy.png');
		game.load.image('coin','assets/coin.png');
		game.load.image('tileset','assets/tileset.png');
		game.load.tilemap('map','assets/map.json',null,Phaser.Tilemap.TILED_JSON);
		game.load.image('background','assets/background.png');
		game.load.audio('jump',['assets/jump.ogg','assets/jump.mp3']); 
		game.load.audio('coin',['assets/coin.ogg','assets/dead.mp3']);
		game.load.audio('dead',['assets/mariodie.wav']);
		game.load.audio('background_music',['assets/background_music.mp3']);
		game.load.image('pixel','assets/pixel.png');
		game.load.spritesheet('mute','assets/muteButton.png',28,22);
		game.load.image('jumpButton','assets/jumpButton.png');
		game.load.image('rightButton','assets/rightButton.png');
		game.load.image('leftButton','assets/leftButton.png');	
	},
	create:function(){
		game.state.start('menu');
	}
};