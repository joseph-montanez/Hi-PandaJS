class Darkcore.Vector
	(length) ->
		@data = []
	@from_array = (arr) ->
		new_vector = new Darkcore.Vector arr.length
		for i from 0 to arr.length
			new_vector.set i, arr[i]
		new_vector
	@copy = (vector) ->
		new_vector = new Darkcore.Vector vector.length
		for i from 0 to vector.length
			new_vector.set i, vector.get i
		new_vector
	scale: (val) ->
		len = @data.length - 1
		for i from 0 to len
			@data[i] *= val
	add: (val) ->
		len = @data.length - 1
		for i from 0 to len
			@data[i] += val
	sub: (val) ->
		@add
		len = @data.length - 1
		for i from 0 to len
			@data[i] += val
	mulScalar: (val) ->
		@scale val
	divScalar: (val) ->
		@scale 1 / val
	addScalar: (val) ->
		@add val
	subScalar: (val) ->
		@add -val
	get: (index) ->
		@data[index]
	set: (index, val) ->
		@data[index] = val
	distance: (vector) ->
		a_x = (@get 0)
		a_y = (@get 1)
		b_x = (vector.get 0)
		b_y = (vector.get 1)

		Darkcore.Vector.from_array [
			Math.abs(a_x - b_x)
			Math.abs(a_y - b_y)
		]
	dot: (vector) ->
		len = @data.length - 1
		result = 0.00
		for i from 0 to len
			result += (@.get i) * (vector.get i)
		result
	normalize: ->
		vx = (@get 0)
		vy = (@get 1)
		len_v = Math.sqrt(vx * vx + vy * vy);
		vx /= len_v;
		vy /= len_v;

		v = Darkcore.Vector.from_array [vx, vy]
		v
	length: ->
		len = @data.length - 1
		result = 0.00
		for i from 0 to len
			result += (@.get i) * (@.get i)
		result
	toString: ->
		len = @data.length - 1
		result = "("
		for i from 0 to len
			if i is not 0
				result += ", "
			result += "" + @.get i
		result += ")"

		result

@Darkcore.Vector = Darkcore.Vector