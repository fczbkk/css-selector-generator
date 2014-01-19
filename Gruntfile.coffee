module.exports = (grunt) ->

  grunt.initConfig
  
    pkg: grunt.file.readJSON 'package.json'
    
    coffeelint:
      app: ['src/css-selector-generator.coffee', 'test/src/css-selector-generator.spec.coffee']
    
    jasmine:
      default:
        src: ['build/css-selector-generator.js']
        options:
          keepRunner: true
          outfile: 'test/_SpecRunner.html'
          specs: 'test/spec/css-selector-generator.spec.js'

    coffee:
      default:
        files:
          'build/css-selector-generator.js' : ['src/css-selector-generator.coffee']
          'test/spec/css-selector-generator.spec.js' : ['test/src/css-selector-generator.spec.coffee']

    uglify:
      default:
        options:
          banner:
            """
              // <%= pkg.title %> <%= pkg.version %>
              // by <%= pkg.author %>
              // <%= pkg.homepage %>
              
            """
        files:
          'build/css-selector-generator.min.js' : ['build/css-selector-generator.js']
    
    watch:
      default:
        options:
          atBegin: true
        files: ['src/css-selector-generator.coffee', 'test/src/css-selector-generator.spec.coffee']
        tasks: ['dev']
    
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  
  grunt.registerTask 'build', ['dev', 'uglify:default']
  grunt.registerTask 'dev', ['coffeelint', 'coffee:default', 'jasmine:default']
  grunt.registerTask 'default', ['watch:default']
