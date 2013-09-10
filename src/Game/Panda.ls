class Panda extends Darkcore.Sprite
	velocity_x: 0.00
	velocity_y: 0.00
	jumping: true
	has_gun: false
	jumping_from: null
	(scene) ->
		super scene
		texture = Darkcore.Texture.fromFile scene, "resources/Panda_ClausKruuskopf.png"
		@textureIndex = texture.textureId
		@backgroundPosition = [-1, 0]
		@width = 17
		@height = 22
	onBeforeRender: (delta) ->
		max_vx = 150.00 * delta
		min_vx = -150.00 * delta
		gravity = 7.0 * delta
		half_width = @width / 2
		half_height = @height / 2

		#-- Step 1: Check for controls to enhance object
		if @jumping and @jumping_from != null and (@y - @jumping_from.get 1) >= 20
			@jumping_from = null
		if @scene.engine.keys.w and @jumping_from != null and (@y - @jumping_from.get 1) < 20
			@velocity_y += 30 * delta
			@jumping = true
		if @scene.engine.keys.s
			@velocity_y -= 20 * delta
		if @scene.engine.keys.d and @velocity_x < max_vx
			@velocity_x += 30 * delta
		if @scene.engine.keys.a and @velocity_x > min_vx
			@velocity_x -= 30 * delta

		if @jumping
			@velocity_y -= gravity

		# The down arrow produces -4, greater then gravities -1
		# If this happens they will be sitting, if not jumping.
		if !@jumping and @scene.engine.keys.s and @velocity_y < 0
			@backgroundPosition = [-17 * 3, -22 * 2]
		else if @scene.engine.keys.d and @velocity_x >= 0
			@scale_x = 1.0
			@backgroundPosition = [-17 * 1, -22 * 4]
		else if @scene.engine.keys.a and @velocity_x < 0
			@scale_x = -1.0
			@backgroundPosition = [-17 * 1, -22 * 4]
		else if !@jumping and not @scene.engine.keys.s and @velocity_x == 0
			@backgroundPosition = [-1, 0]
		# Prevent the player from twitching back and forth
		if @velocity_x < 0.50 && @velocity_x > -0.50
			@velocity_x = 0.00;
		# If they are not jumping then only apply surface friction?
		else if @velocity_x > 0.00 and !@jumping
			@velocity_x -= 24.00 * delta
		else if @velocity_x < 0.00 and !@jumping
			@velocity_x += 24.00 * delta
		# If they are jumping then only apply wind friction?
		else if @velocity_x < 0.00 and @jumping
			@velocity_x -= 0.35 * delta
		if @velocity_x > 0.00 and @jumping
			@velocity_x += 0.35 * delta

		# Check the x-axis
		if @x + @velocity_x + half_width >= @scene.engine.width
			@velocity_x = 0
		else if @x + @velocity_x - half_width <= 0
			@velocity_x = 0

		# Ensure Constant Velocity
		if @velocity_x > max_vx
			@velocity_x = max_vx
		else if @velocity_x < min_vx
			@velocity_x = min_vx

		#-- Step 2: Check to see if the enhance object needs to be altered
		# Check Blocks for collision
		state = @scene.gamestate;
		hit = false;
		on_ground = false
		for block in state.blocks
			bounding_box1 = block.getBoundingBox!
			bounding_box2 = @getBoundingBox @velocity_x, @velocity_y
			bounding_box3 = @getBoundingBox!

			block_half_width = block.width / 2
			block_half_height = block.height / 2
			hit =
				(bounding_box1.get 0) < (bounding_box2.get 2) and
				(bounding_box1.get 2) > (bounding_box2.get 0) and
				(bounding_box1.get 1) < (bounding_box2.get 3) and
				(bounding_box1.get 3) > (bounding_box2.get 1)
			if hit
				distance_x = @x - block.x
				distance_y = @y - block.y

				distance = Math.sqrt(Math.abs(distance_x)) + Math.sqrt(Math.abs(distance_y))

				# 0:left 1:bottom 2:right 3:top

				# Top Left Quadrant
				if distance_y > 0 and distance_x < 0
					top_distance = Math.abs((bounding_box1.get 3) - (bounding_box2.get 1))
					left_distance = Math.abs((bounding_box1.get 0) - (bounding_box2.get 2))
					# Make the character kiss the top the block
					if top_distance < left_distance
						@velocity_y = 0
						@y = (bounding_box1.get 3) + half_height
						@jumping_from = new Darkcore.Vector 2
						@jumping_from.set 0, @x
						@jumping_from.set 1, @y
						on_ground = true
					# Make the character kiss the left side the block
					else
						@velocity_x = 0
						@x = (bounding_box1.get 0) - half_width
				# Top Right Quadrant
				else if distance_y > 0 and distance_x > 0
					top_distance = Math.abs((bounding_box1.get 3) - (bounding_box2.get 1))
					right_distance = Math.abs((bounding_box1.get 2) - (bounding_box2.get 0))
					# Make the character kiss the top the block
					if top_distance < right_distance
						@velocity_y = 0
						@y = (bounding_box1.get 3) + half_height
						@jumping_from = new Darkcore.Vector 2
						@jumping_from.set 0, @x
						@jumping_from.set 1, @y
						on_ground = true
					# Make the character kiss the right side the block
					else
						@velocity_x = 0
						@x = (bounding_box1.get 2) + half_width
				# Bottom Left Quadrant
				else if distance_y < 0 and distance_x < 0
					bottom_distance = Math.abs((bounding_box1.get 1) - (bounding_box2.get 3))
					left_distance = Math.abs((bounding_box1.get 0) - (bounding_box2.get 2))
					# Make the character kiss the top the block
					if bottom_distance < left_distance
						@velocity_y = 0
						@y = (bounding_box1.get 1) - half_height
					# Make the character kiss the left side the block
					else
						@velocity_x = 0
						@x = (bounding_box1.get 0) - half_width
				# Bottom Right Quadrant
				else if distance_y < 0 and distance_x > 0
					bottom_distance = Math.abs((bounding_box1.get 1) - (bounding_box2.get 3))
					right_distance = Math.abs((bounding_box1.get 2) - (bounding_box2.get 0))
					# Make the character kiss the top the block
					if bottom_distance < right_distance
						@velocity_y = 0
						@y = (bounding_box1.get 1) - half_height
					# Make the character kiss the right side the block
					else
						@velocity_x = 0
						@x = (bounding_box1.get 2) + half_width



		# Check the y-axis
		if @y + @velocity_y + half_height >= @scene.engine.height
			@velocity_y = 0;
		else if @y + @velocity_y - half_height <= 0
			on_ground = true;
			@velocity_y = 0;
			@y = half_height;
			@jumping_from = new Darkcore.Vector 2
			@jumping_from.set 0, @x
			@jumping_from.set 1, @y
			on_ground = true

		if on_ground
			@jumping = false
		else
			@jumping = true

		@y += @velocity_y;
		@x += @velocity_x;

		@scene.camera_x = @scene.engine.width - @x - (@scene.engine.width / 2)
		@scene.camera_y = @y - (@scene.engine.height / 2)

@Game.Panda = Panda