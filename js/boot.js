var bootState={
	preload:function(){
		game.load.image('progressBar','assets/progressBar.png');
	},
	create:function(){
		game.stage.backgroundColor='#000000';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.renderer.renderSession.roundPixels=true;
		if(!game.device.desktop){
			game.scale.scaleMode=Phaser.ScaleManager.EXACT_FIT;
			game.scale.setMinMax(game.width/2,game.height/2,game.width*2,game.height*2);
			game.scale.pageAlignHorizontally=true;
			game.scale.pageAlignVertically=true;
			document.body.style.backgroundColor="#000000";
		}
		game.state.start('load');
	}
	
};