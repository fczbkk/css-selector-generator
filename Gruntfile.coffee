module.exports = (grunt) ->

  require('load-grunt-tasks')(grunt)

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    banner:
      """
        /*
        <%= pkg.title %>, v<%= pkg.version %>
        by <%= pkg.author %>
        <%= pkg.homepage %>
        */
      """

    coffeelint:
      app: [
        'src/css-selector-generator.coffee'
        'test/src/css-selector-generator.spec.coffee'
      ]

    jasmine:
      default:
        src: ['build/css-selector-generator.js']
        options:
          keepRunner: true
          outfile: 'test/_SpecRunner.html'
          specs: 'test/spec/css-selector-generator.spec.js'

    coffee:
      default:
        options:
          join: true
        files:
          'build/css-selector-generator.js' : [
            'src/css-selector-generator.coffee'
          ]
          'test/spec/css-selector-generator.spec.js' : [
            'test/src/complex-example.coffee'
            'test/src/css-selector-generator.spec.coffee'
          ]

    uglify:
      default:
        options:
          banner: "<%= banner %>"
        files:
          'build/css-selector-generator.min.js' : [
            'build/css-selector-generator.js'
          ]

    watch:
      default:
        options:
          atBegin: true
        files: [
          'src/css-selector-generator.coffee'
          'test/src/css-selector-generator.spec.coffee'
        ]
        tasks: ['dev']

    bump:
      options:
        files: [
          'package.json'
          # 'bower.json'
        ]
        updateConfigs: ['pkg']
        commitFiles: ['-a']
        pushTo: 'origin'

    conventionalChangelog:
      options:
        changelogOpts:
          preset: 'angular'
      release:
        src: 'CHANGELOG.md'

  # Constructs the code, runs tests and if everyting is OK, creates a minified
  # version ready for production. This task is intended to be run manually.
  grunt.registerTask 'build', 'Bumps version and builds JS.', (version_type) ->
    version_type = 'patch' unless version_type in ['patch', 'minor', 'major']
    grunt.task.run [
      "bump-only:#{version_type}"
      'dev'
      'uglify'
      'conventionalChangelog'
      'bump-commit'
    ]


  grunt.registerTask 'dev', ['coffeelint', 'coffee', 'jasmine']
  grunt.registerTask 'default', ['watch']
