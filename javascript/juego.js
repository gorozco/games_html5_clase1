Q = new Quintus({
	development:true,
	maximize:"touch"
});

Q.include("Sprites, Scenes, Input, 2D, Anim, Touch");
Q.setup("juego");
Q.controls();

Q.load("mapa_escena1.tmx, mosaicos_escenario.png, mosaicos_mario_enano.png, mosaicos_enemigos_32x32.png, mosaicos_enemigos_32x46.png",function(){
	Q.sheet("escenario","mosaicos_escenario.png",{
		tileW:32,
		tileH:32
	});
	
	Q.sheet("mario_enano","mosaicos_mario_enano.png",{
		tileW:30,
		tileH:30
	});

	Q.sheet("enemigos_bajos","mosaicos_enemigos_32x32.png",{
		tileW:32,
		tileH:32
	});

	Q.sheet("enemigos_altos","mosaicos_enemigos_32x46.png",{
		tileW:32,
		tileH:46
	});


	Q.stageScene("escena1");
});

Q.animations("mario_enano_anim",{
	caminar:{
		frames:[4,5,8],
		rate:1/6,
		loop:false
	},
	quieto:{
		frames:[1],
		rate:1/2,
		loop:false
	}
	
});

Q.Sprite.extend("Mario",{
	init:function(p){
		this._super(p,{
			sheet:"mario_enano",
			sprite:"mario_enano_anim",
			frame:1,
			x:100,
			y:40,
			jumpSpeed: -450
		});
		this.add("2d, platformerControls, animation");
		
	},
	step:function(){
		if(this.p.vx > 0){
			this.p.flip = false;
			this.play("caminar");
		} else if(this.p.vx < 0){
			this.p.flip = "x";
			this.play("caminar");
		} else if(this.p.vx = 0){
			this.play("quieto");
		}
			
	}
});

Q.Sprite.extend("TortugaVerde",{
	init:function(p){
		this._super(p,{
			sheet:"enemigos_altos",
			frame:0,
			x:200,
			y:40,
			jumpSpeed:-500,
			vx:120
		});
		this.add("2d, aiBounce");
	}
});

Q.Sprite.extend("Gomba",{
	init:function(p){
		this._super(p,{
			sheet:"enemigos_bajos",
			frame:1,
			x:300,
			y:40,
			vx:-120
		});
		this.add("2d, aiBounce");
	}
});


Q.scene("escena1",function(stage){
	var cielo = new Q.TileLayer({
			sheet:"escenario",
			dataAsset:"mapa_escena1.tmx",
			layerIndex:0,
			type:Q.SPRITE_NONE
	});
	
	stage.insert(cielo);
	
	var paisaje = new Q.TileLayer({
			sheet:"escenario",
			dataAsset:"mapa_escena1.tmx",
			layerIndex:1,
			type:Q.SPRITE_NONE
	});
	
	stage.insert(paisaje);
	
	var colisiones = new Q.TileLayer({
			sheet:"escenario",
			dataAsset:"mapa_escena1.tmx",
			layerIndex:2
	});
	
	stage.collisionLayer(colisiones);
	
	var alturaPiso = colisiones.p.h -(32*4);
	
	var mario = new Q.Mario({
		y:alturaPiso
	});
	stage.insert(mario);
	stage.add("viewport").follow(mario,{
		x:true,
		y:true
	},{
		minX:0,
		minY:0,
		maxX:colisiones.p.w,
		maxY:colisiones.p.h
	});
	
	//stage.collisionLayer(colisiones);
	
	
	
	var tortugaVerde = new Q.TortugaVerde({
		y:alturaPiso
	});
	stage.insert(tortugaVerde);
	
	var gomba = new Q.Gomba({
		y:alturaPiso
	});
	stage.insert(gomba);


});
