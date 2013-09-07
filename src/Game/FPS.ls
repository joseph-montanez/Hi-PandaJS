class FPS extends Darkcore.Sprite.Text
	(scene) ->
		super scene
		jQuery @div .css "font-family", "'Caesar Dressing', cursive"
	onRender: (delta) ->
		@setTitle "FPS: #{@scene.engine.frames_per_second}"
	setTitle: (title) ->
		jQuery @div .text title

@Game.FPS = FPS