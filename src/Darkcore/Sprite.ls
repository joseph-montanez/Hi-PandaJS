class Darkcore.Sprite
	id: ""
	x: 0.00
	y: 0.00
	rotation: 0.00
	width: 32.00
	height: 32.00
	tile_width: 0.00
	tile_height: 0.00
	coords_top_left_x: 0.00
	coords_top_left_y: 0.00
	coords_bottom_left_x: 1.00
	coords_bottom_left_y: 0.00
	coords_bottom_right_x: 1.00
	coords_bottom_right_y: 1.00
	coords_top_right_x: 0.00
	coords_top_right_y: 1.00
	color_r: 255
	color_g: 255
	color_b: 255
	scale_x: 1.00
	scale_y: 1.00
	animation: false
	animation_from: 0
	animation_to: 0
	animation_current: 0
	animation_duration: 60
	animation_last_tick: 0
	texture_index: -1
	animation_event: null
	div: null
	scene: null
	last_matrix: ""
	last_size: [0, 0]
	(scene, width = 0, height = 0, x = 0, y = 0) ->
		scene.addSprite @
		@scene = scene
		@width = width
		@height = height
		@x = x
		@y = y
		@id = "ds_" + Math.floor Math.random! * 10000

		matrix3d = @getTransformationMatrix!

		@div = jQuery("""
			<div id="#{@id}" style="
				matrix3d(#{matrix3d.join \,});
				width: #{@width}px;
				height: #{@height}px;
				position: absolute;
				left: 0;
				top: 0;
				animation-duration: 16ms;
				animation-timing-function: linear;
				"></div>
		""")
		@div.appendTo @scene.div
	destory: ->
		@div.remove!
	getId: ->
		@id
	setColor: (r, g, b) ->
		@color_r = r
		@color_g = g
		@color_b = b
		jQuery @div .css "background-color", "rgb(#{@color_r}, #{@color_g}, #{@color_b})"
	getBoundingBox: (mod_x = 0.00, mod_y = 0.00) ->
		half_width = @width / 2.00
		half_height = @height / 2.00
		bounding_box = new Darkcore.Vector 4
		# 0 => x1, 1 => y1, x2, y2
		bounding_box.set 0, @x + mod_x - half_width
		bounding_box.set 1, @y + mod_y - half_height
		bounding_box.set 2, @x + mod_x + half_width
		bounding_box.set 3, @y + mod_y + half_height

		bounding_box
	animaTile: (x, y) ->
		@coords_top_left_x     = 0.00 + (@tile_width * x)
		@coords_top_left_y     = 0.00 + (@tile_height * y)
		@coords_bottom_left_x  = @tile_width + (@tile_width * x)
		@coords_bottom_left_y  = 0.00 + (@tile_height * y)
		@coords_bottom_right_x = @tile_width + (@tile_width * x)
		@coords_bottom_right_y = @tile_height + (@tile_height * y)
		@coords_top_right_x    = 0.00 + (@tile_width * x)
		@coords_top_right_y    = @tile_height + (@tile_height * y)
	animaFlip: ->
		tmp_top_left_x     = @coords_top_left_x
		tmp_top_left_y     = @coords_top_left_y
		tmp_bottom_left_x  = @coords_bottom_left_x
		tmp_bottom_left_y  = @coords_bottom_left_y
		tmp_bottom_right_x = @coords_bottom_right_x
		tmp_bottom_right_y = @coords_bottom_right_y
		tmp_top_right_x    = @coords_top_right_x
		tmp_top_right_y    = @coords_top_right_y

		@coords_top_left_x     = tmp_bottom_left_x
		@coords_top_left_y     = tmp_bottom_left_y
		@coords_bottom_left_x  = tmp_top_left_x
		@coords_bottom_left_y  = tmp_top_left_y
		@coords_bottom_right_x = tmp_top_right_x
		@coords_bottom_right_y = tmp_top_right_y
		@coords_top_right_x    = tmp_bottom_right_x
		@coords_top_right_y    = tmp_bottom_right_y
	animationStart: (from, to, delay) ->
		if !@animation
			this.animation = true
			this.animation_duration = delay
			this.animation_from = from
			this.animation_current = from
			this.animation_to = to
			this.animation_last_tick = Darkcore.Engine.getTime!
	animationStop: ->
		this.animation = false
	getTransformationMatrix: ->
		half_width = @width / 2
		half_height = @height / 2

		tx = @x - half_width
		ty = @scene.engine.height - @y - half_height
		sx = @scale_x
		sy = @scale_y

		matrix = [1.00, 0.00, 0.00, 1.00, tx, ty]

		/*
		| cos0  sin0 |
		| -sin0 cos0
		*/
		if @rotation != 0.00
			theta = @rotation * 0.0174532925
			rx = Math.cos(theta)
			ry = Math.sin(theta)
			matrix[0] = matrix[0] * rx
			matrix[1] = if matrix[1] is not 0.00 then matrix[1] * ry else ry
			matrix[2] = if matrix[2] is not 0.00 then matrix[1] * ry * -1 else ry
			matrix[3] = matrix[3] * rx

		/*
		| sx  0 |
		| 0   sy|
		*/
		if sx is not 1.00
			matrix[0] = matrix[0] * sx
			matrix[1] = matrix[1] * sx
		if sy is not 1.00
			matrix[2] = matrix[2] * sy
			matrix[3] = matrix[3] * sy

		[matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1]
	onBeforeRender: ->
	onRender: (delta) ->
	render: (delta) ->
		#TODO: textures

		if @last_size[0] is not @width or @last_size[1] is not @height
			jQuery @div .css {width: @width, height: @height}
			@last_size = [@width, @height]

		matrix3d = @getTransformationMatrix!
		matrix_css = "matrix3d(#{matrix3d.join \,})"

		if matrix_css is not @last_matrix
			@div[0].style.WebkitTransform = matrix_css
			@div[0].style.MozTransform = matrix_css
			#jQuery @div .css "transform", matrix_css

		@last_matrix = matrix_css


@Darkcore.Sprite = Darkcore.Sprite