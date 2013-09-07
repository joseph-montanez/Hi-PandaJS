class Texture
	@fromFile = (scene, filename) ->

		has_texture = scene.textures.indexOf filename
		if has_texture > -1
			scene.textures[has_texture]
		else
			texture = new Darkcore.Texture filename, scene
			texture
	(filename, scene) ->
		@scene = scene
		@surface = 0
		@texture = 0
		@texture_format = 0
		@nOfColors = 0
		@loaded = false
		@width = 0
		@height = 0

		@textureId = (@scene.textures.push @) - 1

		that = @
		@surface = new Image
		@surface.onload = (evt) ->
			that.loaded = true

		@surface.src = filename;

export Darkcore.Texture = Texture