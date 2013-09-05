jQuery ->
	width = jQuery window .width!
	height = jQuery window .height!

	engine = new Darkcore.Engine width, height, 'Hi Panda!'
	scene = new Darkcore.Scene 'game', engine
	scene.gamestate = {
		blocks: []
	}

	panda = new Game.Panda scene
		..x = 100
		..y = 200
		..velocity_x = 0.5

	logo = new Game.Logo scene
		..setTitle "Hi! Panda"
		..x = 300
		..y = 300
		..scale_x = 2.0
		..scale_y = 2.0

	fps = new Game.FPS scene
		..x = 400
		..y = 100

	block1 = new Darkcore.Sprite scene, 100, 100, 300, 100
		..id = "block1"
		..setColor 255, 0, 0
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

	engine.run!

	setInterval ->
		b = new Game.Block scene, 32, 32, 100, 150
			..velocity_x = 1.0 + Math.random() * 5
			..velocity_y = Math.random() * 7
	, 50