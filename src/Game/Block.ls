class Block extends Darkcore.Sprite
	velocity_x: 0.00
	velocity_y: 0.00
	(scene, width, height, x, y) ->
		super scene, width, height, x, y
		@div.css {
			"background-image": "url(resources/Weapons_ThyLordRoot.png)"
			"background-position": "64px 96px"
		}

	onBeforeRender: (delta) ->
		gravity = 7.0 * delta

		@velocity_y -= gravity


		state = @scene.gamestate;
		remove = false
		for block in state.blocks
			bounding_box1 = block.getBoundingBox!
			bounding_box2 = @getBoundingBox @velocity_x, @velocity_y
			bounding_box3 = @getBoundingBox!

			hit =
				(bounding_box1.get 0) < (bounding_box2.get 2) and
				(bounding_box1.get 2) > (bounding_box2.get 0) and
				(bounding_box1.get 1) < (bounding_box2.get 3) and
				(bounding_box1.get 3) > (bounding_box2.get 1)
			if hit
				remove = true

		@y += @velocity_y
		@x += @velocity_x

		if @x > @scene.engine.width or @x < 0px
			remove = true
		else if @y > @scene.engine.height or @y < 0px
			remove = true

		if remove
			@scene.removeSprite @

@Game.Block = Block