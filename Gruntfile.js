grunt.loadNpmTasks('grunt-env');


module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      build:{ 

      }
    }
  })

  grunt.registerTask('start', ['env:build']

  )
  // Do grunt-related things in here
};