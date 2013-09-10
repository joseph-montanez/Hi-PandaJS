class Darkcore.Engine
	@getTime = ->
		if typeof window.performance != 'undefined'
			performance.now!
		else
			Date.now!
	@loop = (fn, delay)->
		if typeof window.requestAnimationFrame != 'undefined'
			window.requestAnimationFrame fn
		else
			setTimeout fn, delay
	(width, height, title = "") ->
		@frames_per_second = 60
		@keys = null
		@mouse_x = 0
		@mouse_y = 0
		@gamestate = null
		@scenes = []
		@activeScene = false
		@done = false
		@interval = false
		@div = null

		@width = width
		@height = height
		@title = title
		@keys = new Darkcore.KeyState
		@id = Math.random! * 100

		jQuery window .on 'keydown keyup', @, (evt) ->
			evt.data.onKeyboardEvent evt, if evt.type is "keydown" then true else false

		jQuery window .on 'mousemove mousedown mouseup', @, (evt) ->
			evt.data.onMouseEvent evt, if evt.type is "mousedown" then true else false

		jQuery window .on 'devicemotion', @, (evt) ->
			evt.data.onDeviceEvent evt.originalEvent

		do @initVideo
	initVideo: ->
		# TODO:
		document.title = @title
		@div = jQuery("""
			<div id="Darkcore_frame" style="width: #{@width}px; height:#{@height}px;"></div>
		""")
		@div.appendTo document.body
	onDeviceEvent: (evt) ->
		if evt.acceleration.x > 0
			@keys.d = true
		else
			@keys.d = false

		if evt.acceleration.x < 0
			@keys.a = true
		else
			@keys.a = false

		if evt.acceleration.y > 0
			@keys.w = true
		else
			@keys.w = false

		if evt.acceleration.y < 0
			@keys.s = true
		else
			@keys.s = false

	onMouseEvent: (evt, is_down) ->
		if evt.type is "mousedown"
			console.log evt.target
			scene = @getActiveScene!
			console.log 'scene', scene
			if scene != null
				for sprite in scene.sprites
					console.log sprite

		if evt.type is "mousemove"
			@mouse_x = evt.clientX
			@mouse_y = evt.clientY
		else if evt.which is 1
			@keys.mouse_left = is_down
		else if evt.which is 3
			@keys.mouse_right = is_down
		else if evt.which is 2
			@keys.mouse_middle = is_down
	onKeyboardEvent: (evt, is_down) ->
		letter = String.fromCharCode evt.which .toLocaleLowerCase!

		if letter is "w"
			@keys.w = is_down
		else if letter is "s"
			@keys.s = is_down
		else if letter is "a"
			@keys.a = is_down
		else if letter is "d"
			@keys.d = is_down
		else if letter is "b"
			@keys.b = is_down
		else if evt.which is 38
			@keys.up = is_down
		else if evt.which is 40
			@keys.down = is_down
		else if evt.which is 37
			@keys.left = is_down
		else if evt.which is 39
			@keys.right = is_down
		else if evt.which is 32
			@keys.space = is_down
	addScene: (scene) ->
		scene.engine = @
		@scenes.push scene
	getActiveScene: ->
		if @activeScene
			console.log @scenes
			@scenes[@activeScene]
		else
			null
	processEvents: ->
	render: ->
		old_time = Darkcore.Engine.getTime!
		last_time = old_time
		fps = 0
		minticks = 1000 / 60
		parent = @

		render_loop = (time) ->
			if parent.done
				cancelAnimationFrame parent.interval;
				#jQuery (jQuery.find "\#Darkcore_frame") .text "Done"
				return

			new_time = Darkcore.Engine.getTime!
			fpsdelta = new_time - old_time
			delta = (new_time - last_time) / 1000

			parent.processEvents!

			if parent.activeScene is false
				parent.scenes[0].setActive!
				parent.activeScene = 0

			parent.scenes[parent.activeScene].render delta

			fps++
			last_time := new_time

			if fpsdelta > 1000
				old_time := new_time
				parent.frames_per_second = fps
				fps := 0

			Darkcore.Engine.loop render_loop, minticks

		@interval = Darkcore.Engine.loop render_loop, minticks
	run: ->
		@render!

@Darkcore.Engine = Darkcore.Engine