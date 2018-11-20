var menuState={
	create:function(){
		game.add.image(0,0,'background'); //image doesn't need physics & animations
		this.muteButton=game.add.button(20,20,'mute',this.toggleSound,this);
		this.muteButton.frame=game.sound.mute?1:0;
		var nameLabel=game.add.text(game.width/2, -50,'Super Coin Box',{font:'50px Arvo',fill:'#ffffff'});
		game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
		nameLabel.anchor.setTo(0.5,0.5);
		if(!localStorage.getItem('bestScore')){
			localStorage.setItem('bestScore',0);
		}
		if(game.global.score>localStorage.getItem('bestScore')){
			localStorage.setItem('bestScore',game.global.score);
		}
		var text='score:'+ game.global.score + '\nbest score:' + localStorage.getItem('bestScore');
		var scoreLabel=game.add.text(game.width/2,game.height/2,text,{font:'25px Arial',fill:'#ffffff',align:'center'});
		scoreLabel.anchor.setTo(0.5,0.5);
		var start_text;
		if(game.device.desktop){
			start_text='press the up arrow key to start';
		}
		else{
			start_text='touch the screen to start';
		}
		var startLabel=game.add.text(game.width/2,game.height-80,start_text,{font:'25px Arial',fill:'#ffffff'});
		startLabel.anchor.setTo(0.5,0.5);
		var tween = game.add.tween(startLabel);
// Rotate the label to -2 degrees in 500ms
tween.to({angle: -2}, 500);
// Then rotate the label to +2 degrees in 1000ms
tween.to({angle: 2}, 1000);
// And get back to our initial position in 500ms
tween.to({angle: 0}, 500);
// Loop indefinitely the tween
tween.loop();
// Start the tween
tween.start();
		var upKey=game.input.keyboard.addKey(Phaser.Keyboard.UP);
		upKey.onDown.add(this.start,this);
		if(!game.device.desktop){
			game.input.onDown.add(this.start,this);
		}
		
	},
	start:function(){
		if(!game.device.desktop && game.input.y<50 && game.input.x<60){
			return;
		}
		game.state.start('play');
	},
	toggleSound:function(){
		game.sound.mute=!game.sound.mute;
		this.muteButton.frame=game.sound.mute?1:0;
	},

	};