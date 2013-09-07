class Scene
	(name, engine) ->
		@camera_x = 0
		@camera_y = 0
		@last_camera = ""
		@background_color = [255, 255, 255, 1.0]
		@timed_events = []
		@render_events = []
		@remove_queue = []
		@textures = []
		@sounds = []
		@engine = null
		@gamestate = null
		@div = null
		@active = false
		engineId = engine.addScene @
		@id = "dc-scene-#{engineId}"
		@name = name
		@engine = engine
		@div = null
		@sprites = []
	createElement: ->
		@div = jQuery("""
			<div id="#{@id}" style="
				width: #{@engine.width}px;
				height:#{@engine.height}px;
				position: absolute;
				top: 0px;
				left: 0px;
				animation-duration: 16ms;
				animation-timing-function: linear;
			"></div>
		""")
		@div.appendTo @engine.div

		if @isActive!
			@div.css 'display', 'block'
	setInactive: ->
		@active = false
	setActive: ->
		@active = true
	isActive: ->
		@active
	draw: (delta) ->
		for sprite in @sprites
			sprite.onRender delta
			sprite.render delta

		if @remove_queue.length > 0
			for sprite in @remove_queue
				item_index = @sprites.indexOf sprite
				if item_index > -1
					#sprite.destory!
					@div[0].removeChild sprite.div[0]
					@sprites.splice item_index, 1
			@remove_queue = []

		new_camera = "translate3d(#{@camera_x}px, #{@camera_y}px, 0)"

		if new_camera != last_camera
			jQuery @div .css "transform", new_camera
			last_camera = new_camera

	render: (delta) ->
		if @div is null
			@createElement!
		for sprite in @sprites
			sprite.onBeforeRender delta

		for i, mgr in @timed_events
			if delta - mgr.getActiveTime! > mgr.getTimeout!
				mgr.callCallback!
				@timed_events.splice i, 1

		@draw delta
	addSprite: (sprite) ->
		sprite.scene = @;
		@sprites[*] = sprite
	removeSprite: (sprite) ->
		@remove_queue.push sprite
	addEvent: (evtType, evt) ->
		if evtType == Darkcore.EventTypes.Render
			mgr = new Darkcore.EventManager
			mgr.addCallback evt
			@render_events.push mgr
	addTimer: (evt, timeout) ->
		mgr = new Darkcore.EventManager
		mgr.addCallbackTimer evt, timeout
		@timed_events.push mgr
	setBackgroundColor: (r, g, b, a) ->
		@background_color = [r, g, b, a]
		jQuery @div .css "background-color", "rgba(#{@background_color[0]}, #{@background_color[1]}, #{@background_color[2]}, #{@background_color[3]})"


export Darkcore.Scene = Scene