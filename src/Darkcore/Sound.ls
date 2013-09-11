class Sound
	(filename = "") ->
		@filename = filename
		@loaded = false
		@audio = null
		@source = null
		@response = null
		@buffer = null
	_createSource: (inBuffer, callback = false, decode = false) ->
		@source = @audio.createBufferSource!
			..connect @audio.destination
		if decode
			parent = @
			@audio.decodeAudioData inBuffer, (outBuffer) ->
				parent.buffer = outBuffer
				parent.source.buffer = parent.buffer
				parent.loaded = true
				if callback != false
					callback parent

	load: (callback = false) ->
		if @buffer is not null
			@_createSource @response, callback, true
		else if @filename.length > 0
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
					parent.response = request.response
					parent._createSource request.response, callback, true
				..send!

	play: (replay = false) ->
		if @loaded is false
			@load (sound) ->
				sound.play!
		if @source is not null
			@source.loop = if replay then true else false
			@source.start 0
	stop: ->
		@loaded = false
		@source.stop(0.0)

export Darkcore.Sound = Sound