jQuery ->
	width = jQuery window .width!
	height = jQuery window .height!

	engine = new Darkcore.Engine width, height, 'Hi Panda!'

	menu = new Darkcore.Scene 'menu', engine

	startgame = new Darkcore.Sprite.Text menu, "Start Game", 100, 25, (engine.width / 2), (engine.height / 2)
		..id = "start"
		..setColor 255, 0, 0
		..setTextColor 255, 255, 255
		..setTextAlign 'center'

	music = new Darkcore.Sound 'resources/Control_Alt_Deus_-_01_-_Control.mp3'
	menu.addSound music
	music.play!

	scene = new Darkcore.Scene 'game', engine
	scene.gamestate = {
		blocks: []
	}

	panda = new Game.Panda scene
		..x = 100
		..y = 200
		..velocity_x = 0.5

	logo = new Game.Logo scene
		..setText "Hi! Panda"
		..x = 300
		..y = 300
		..scale_x = 2.0
		..scale_y = 2.0

	block1 = new Game.Grass scene, 256px, 192px, 500px, 0px
		..id = "block1"
	scene.gamestate.blocks.push block1

	block2 = new Darkcore.Sprite scene, 100, 15, 100, 50
		..id = "block2"
		..setColor 0, 255, 0
	scene.gamestate.blocks.push block2

	block3 = new Darkcore.Sprite scene, engine.width, 20, engine.width / 2, 0
		..id = "block3"
		..setColor 50, 50, 50
	scene.gamestate.blocks.push block3

	block4 = new Darkcore.Sprite scene, 75, 20, 320, 10
		..id = "block4"
		..setColor 50, 50, 50
	scene.gamestate.blocks.push block4

	block6 = new Darkcore.Sprite scene, 75, 20, 200, 85
		..id = "block6"
		..setColor 50, 50, 50
	scene.gamestate.blocks.push block6

	fps = new Game.FPS scene
		..x = 400
		..y = 100

	engine.run!

	# setInterval ->
	# 	b = new Game.Block scene, 32, 32, 100, 150
	# 		..velocity_x = 1.0 + Math.random() * 5
	# 		..velocity_y = Math.random() * 7
	# , 50

	export engine = engine