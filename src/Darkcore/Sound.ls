class Sound
	(filename = "") ->
		@filename = filename
		@loaded = false
		@audio = null
		@source = null;
	load: (callback = false) ->
		if @filename.length > 0
			if Modernizr.audio.ogg
				soundfile = @filename.replace /\.(mp3|ogg|m4a)/, '.ogg'
			else if Modernizr.audio.mp3
				soundfile = @filename.replace /\.(mp3|ogg|m4a)/, '.mp3'
			@audio = new webkitAudioContext!;
			parent = @
			request = new XMLHttpRequest!
				..open "GET", soundfile, true
				..responseType = 'arraybuffer'
				..onload = ->
					parent.loaded = true
					parent.source = parent.audio.createBufferSource!
						..connect parent.audio.destination
					parent.audio.decodeAudioData request.response, (buffer) ->
						parent.source.buffer = buffer
						if callback != false
							callback parent
				..send!

	play: ->
		if @loaded is false
			@load (sound) ->
				sound.play!
		if @source is not null
			@source.start 0

export Darkcore.Sound = Sound