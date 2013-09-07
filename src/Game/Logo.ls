class Logo extends Darkcore.Sprite.Text
	(scene, width, height, x, y) ->
		super scene, width, height, x, y
		jQuery @div .css "font-family", "'Caesar Dressing', cursive"

@Game.Logo = Logo