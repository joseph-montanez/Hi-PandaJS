class Sprite
	@fromTexture = (scene, filename) ->
		texture = Darkcore.Texture scene, filename
		sprite = new Darkcore.Sprite scene
		sprite.textureIndex = texture.textureId
		sprite
	(scene, width = 0, height = 0, x = 0, y = 0) ->
		@rotation = 0.00
		@tile_width = 0.00
		@tile_height = 0.00
		@coords_top_left_x = 0.00
		@coords_top_left_y = 0.00
		@coords_bottom_left_x = 1.00
		@coords_bottom_left_y = 0.00
		@coords_bottom_right_x = 1.00
		@coords_bottom_right_y = 1.00
		@coords_top_right_x = 0.00
		@coords_top_right_y = 1.00
		@color = [-1, -1, -1]
		@scale_x = 1.00
		@scale_y = 1.00
		@animation = false
		@animation_from = 0
		@animation_to = 0
		@animation_current = 0
		@animation_duration = 60
		@animation_last_tick = 0
		@textureIndex = -1
		@animation_event = null
		@div = null
		@last_style = ""
		@backgroundPosition = [0, 0]

		scene.addSprite @
		@scene = scene
		@width = width
		@height = height
		@x = x
		@y = y
		@id = "ds_" + Math.floor Math.random! * 10000
	getTexture: ->
		@scene.textures[@textureIndex]
	createElement: ->
		@div = jQuery("""
			<div id="#{@id}" style="#{@getStyles!.join \;}"></div>
		""")
		@div.appendTo @scene.div
	destory: ->
		false
	getId: ->
		@id
	setColor: (r, g, b) ->
		@color = [r, g, b]
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

		if Modernizr.csstransforms3d
			[matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1]
		else
			matrix
	getStyles: (styles = []) ->
		styles.push "position: absolute"
		styles.push "left: 0"
		styles.push "top: 0"

		styles.push "animation-duration: 16ms"
		styles.push "animation-timing-function: linear"

		if @color !== [-1, -1, -1]
			styles.push "background-color: rgb(#{@color[0]}, #{@color[1]}, #{@color[2]})"

		if @textureIndex > -1
			texture = @getTexture!
			styles.push "background-image: url(#{texture.surface.src})"
			styles.push "background-position: #{@backgroundPosition[0]}px #{@backgroundPosition[1]}px"

		styles.push "width: #{@width}px"
		styles.push "height: #{@height}px"

		# TODO: Detect 2D vs 3D Matrix?
		matrix = @getTransformationMatrix!

		if Modernizr.csstransforms3d
			matrix_css = "matrix3d(#{matrix.join \,})"
		else
			matrix_css = "matrix(#{matrix.join \,})"

		styles.push "-webkit-transform: #{matrix_css}"
		styles.push "-moz-transform: #{matrix_css}"

		styles
	onBeforeRender: ->
	onRender: (delta) ->
		if @div is null
			@createElement!
		[]
	onLeftClick: (evt) ->
		console.log \click
	render: (delta, styles = []) ->
		styles = (@getStyles styles).join \;
		if @last_style != styles
			@div[0].style.cssText = styles
			@last_style = styles

export Darkcore.Sprite = Sprite