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
			<div id="#{@id}" style="#{@getStyles!.join \;}"></div>
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

	getStyles: (styles = []) ->
		styles.push "position: absolute"
		styles.push "left: 0"
		styles.push "top: 0"

		styles.push "animation-duration: 16ms"
		styles.push "animation-timing-function: linear"

		if @active
			styles.push "display: block"
		else
			styles.push "display: hidden"

		styles.push "width: #{@engine.width}px"
		styles.push "height: #{@engine.height}px"

		if Modernizr.csstransforms3d
			styles.push "-webkit-transform: translate3d(#{@camera_x}px, #{@camera_y}px, 0)"
			styles.push "-moz-transform: translate3d(#{@camera_x}px, #{@camera_y}px, 0)"
		else
			styles.push "-webkit-transform: translate(#{@camera_x}px, #{@camera_y}px)"
			styles.push "-moz-transform: translate(#{@camera_x}px, #{@camera_y}px)"

		styles
	draw: (delta) ->
		for sprite in @sprites
			styles = sprite.onRender delta
			sprite.render delta, styles

		if @remove_queue.length > 0
			for sprite in @remove_queue
				item_index = @sprites.indexOf sprite
				if item_index > -1
					#sprite.destory!
					@div[0].removeChild sprite.div[0]
					@sprites.splice item_index, 1
			@remove_queue = []

		styles = (@getStyles []).join \;
		if @last_style != styles
			@div[0].style.cssText = styles
			@last_style = styles

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
	addSound: (sound) ->
		sound.scene = @
		@sounds[*] = sound
	addSprite: (sprite) ->
		sprite.scene = @
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