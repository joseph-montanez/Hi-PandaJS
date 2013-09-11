module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		livescript: {
			src: {
				files: {
					'build/Darkcore.js': [
						'src/Darkcore.ls',
						'src/Darkcore/Engine.ls',
						'src/Darkcore/Collion.ls',
						'src/Darkcore/Keystate.ls',
						'src/Darkcore/Scene.ls',
						'src/Darkcore/Sprite.ls',
						'src/Darkcore/Sprite/Text.ls',
						'src/Darkcore/Sound.ls',
						'src/Darkcore/Texture.ls',
						'src/Darkcore/Vector.ls'
					],
					'build/Game.js': [
						'src/Game.ls',
						'src/Game/Panda.ls',
						'src/Game/Block.ls',
						'src/Game/Logo.ls',
						'src/Game/FPS.ls',
						'src/Game/Grass.ls'
					],
					'build/App.js': 'src/App.ls'
				}
			}
		},
		watch: {
			files: [
				'src/Darkcore.ls',
				'src/Darkcore/Engine.ls',
				'src/Darkcore/Collion.ls',
				'src/Darkcore/Keystate.ls',
				'src/Darkcore/Scene.ls',
				'src/Darkcore/Vector.ls',
				'src/Darkcore/Sprite.ls',
				'src/Darkcore/Sprite/Text.ls',
				'src/Darkcore/Texture.ls',
				'src/Darkcore/Sound.ls',
				'src/Game.ls',
				'src/Game/Grass.ls',
				'src/Game/Panda.ls',
				'src/Game/Block.ls',
				'src/Game/Logo.ls',
				'src/Game/FPS.ls',
				'src/App.ls'
			],
			tasks: ['livescript']
		}
	});

	grunt.loadNpmTasks('grunt-livescript');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.registerTask('test', ['livescript']);

	grunt.registerTask('default', ['livescript']);


};