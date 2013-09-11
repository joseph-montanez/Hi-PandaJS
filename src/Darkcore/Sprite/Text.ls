class Text extends Darkcore.Sprite
	(scene, text = "", width, height, x, y) ->
		@text = text
		@lastText = ""
		@textColor = [0, 0, 0]
		@textAlign = 'left'
		@padding = 0px
		super scene, width, height, x, y
	setText: (text) ->
		@text = text
	setTextColor: (r, g, b) ->
		@textColor = [r, g, b]
	getTextColor: ->
		@textColor
	setTextAlign: (alignment) ->
		@textAlign = alignment
	getTextAlign: ->
		@textAlign
	setPadding: (padding) ->
		@padding = padding
	getPadding: ->
		@padding
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
		styles.push "padding: #{@padding}px"
		return styles
	/**
	 * Events
	 */
	onRender: (delta) ->
		styles = super delta
		if @text is not @lastText
			jQuery @div .text @text
			@lastText = @text
		styles

export Darkcore.Sprite.Text = Text