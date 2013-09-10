class Grass extends Darkcore.Sprite
	(scene, width, height, x, y) ->
		@velocity_x = 0.00
		@velocity_y = 0.00
		@texture = Darkcore.Texture.fromFile scene, "resources/grass.png"
		super scene, width, height, x, y
		@init = false
	onRender: (delta) ->
		styles = super delta
		if not @init
			@div.html """
			<div style="
				background-image: url(resources/grass.png);
				margin-top: -53px;
				width: 256px;
				height: 256px;
				background-position: 0px -28px;
				background-size: 125%;
			">
			</div>
			"""
		styles

@Game.Grass = Grass