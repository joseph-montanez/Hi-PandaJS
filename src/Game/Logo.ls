class Logo extends Darkcore.Sprite
	(scene) ->
		super scene
		jQuery @div .css "font-family", "'Caesar Dressing', cursive"
	setTitle: (title) ->
		jQuery @div .text title

@Game.Logo = Logo