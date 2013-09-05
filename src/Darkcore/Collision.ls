class Darkcore.Collision
	closestPointOnSegment: (segment_1, segment_2, circle_position) ->
		segment = new Darkcore.Vector.copy segment_1
		segment.sub segment_2

		point = new Darkcore.Vector.copy circle_position
		point.sub segment_2

		# Length
		segment_length = segment.length!

		if segment_length <= 0
			# Invalid segment length
			return null

		# Divide against scalar
		segment_unit = new Darkcore.Vector.copy segment
		segment_unit.div_scalar segment_length

		# Dot Product
		projection_unit = new Darkcore.Vector.copy point
		double projection = projection_unit.dot segment_unit

		result = new Darkcore.Vector 2
		if projection <= 0
			result.set 0, segment_1[0]
			result.set 1, segment_1[1]
			return result

		if projection >= segment_length
			result.set 0, segment_2[0]
			result.set 1, segment_2[1]
			return result

		# Divide against scalar
		projection_vector = new Darkcore.Vector.copy (segment_unit);
		projection_vector.scale (projection);

		# Closest
		result.memcpy projection_vector
		result.add segment_1

		result

	@circleInRectangle  = (v1, v2, position, radius) ->
		test = new Darkcore.Vector.copy position
		if position.get 0 < v1.get 0
			test.set 0, v1.get 0
		if position.get 0 > v2.get 0
			test.set 0, v2.get 0
		if position.get 1 < v1.get 1
			test.set 1, v1.get 1
		if position.get 1 > v2.get 1
			test.set 1, v2.get 1

		result = new Darkcore.Vector.copy position
		result.sub test

		result.length! < radius


@Darkcore.Collision = Darkcore.Collision