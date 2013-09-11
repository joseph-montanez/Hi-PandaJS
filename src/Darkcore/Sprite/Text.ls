class Text extends Darkcore.Sprite
	(scene, text = "", width, height, x, y) ->
		@text = text
		@lastText = ""
		@textColor = [0, 0, 0]
		@textAlign = 'left'
		@textSize = 14px
		@textFamily = "monospace"
		@textWeight = "normal"
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
	setTextSize: (textSize) ->
		@textSize = textSize
	getTextSize: ->
		@textSize
	setTextFamily: (textFamily) ->
		@textFamily = textFamily
	getTextFamily: ->
		@textFamily
	setTextWeight: (textWeight) ->
		@textWeight = textWeight
	getTextWeight: ->
		@textWeight
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
		styles.push "font-size: #{@textSize}px"
		styles.push "font-family: #{@textFamily}"
		styles.push "font-weight: #{@textWeight}"
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