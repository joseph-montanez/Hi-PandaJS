module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    livescript: {
      src: {
        files: {
          'Darkcore.js': [
            'src/Darkcore.ls',
            'src/Darkcore/Engine.ls',
            'src/Darkcore/Collion.ls',
            'src/Darkcore/Keystate.ls',
            'src/Darkcore/Scene.ls',
            'src/Darkcore/Vector.ls',
            'src/Darkcore/Sprite.ls'
          ],
          'Game.js': [
            'src/Game.ls',
            'src/Game/Panda.ls',
            'src/Game/Block.ls',
            'src/Game/Logo.ls',
            'src/Game/FPS.ls',
          ],
          'App.js': 'App.ls'
        }
      }
    },
    watch: {
      files: ['<%= livescript.src.files["Darkcore.js"] %>'],
      tasks: ['livescript']
    }
  });

  grunt.loadNpmTasks('grunt-livescript');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['livescript']);

  grunt.registerTask('default', ['livescript']);


};