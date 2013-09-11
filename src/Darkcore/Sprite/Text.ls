class Text extends Darkcore.Sprite
	(scene, text = "", width, height, x, y) ->
		@text = text
		@textColor = [0, 0, 0]
		@textAlign = 'left'
		super scene, width, height, x, y
	setText: (text) ->
		@text = text
	setTextColor: (r, g, b) ->
		@textColor = [r, g, b]
	setTextAlign: (alignment) ->
		@textAlign = alignment
	createElement: ->
		matrix3d = @getTransformationMatrix!

		@div = jQuery("""
			<div id="#{@id}" style="#{@getStyles!.join \;}">#{@text}</div>
		""")
		@div.appendTo @scene.div
	getStyles: ->
		styles = super!
		styles.push "text-align: #{@textAlign}"
		styles.push "color: rgb(#{@textColor.join \,})"
		return styles

export Darkcore.Sprite.Text = Text