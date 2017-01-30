// grunt.loadNpmTasks('grunt-env');

var path = require('path');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    webpack: {
      webApp: {
        // webpack options
        entry: {
            web: "./web/webApp.js"
        },
        output: {
            path: path.resolve(__dirname, 'public/bundle'),
            filename: "[name].bundle.js"
        },
        module: {
            loaders: [
                { 
                    test: /\.js$/, 
                    exclude: /node_modules/, 
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015', 'react']
                    } 
                }
            ]
        },
        stats: {
            colors: true
        },
        watch: false,
        externals: {
          'cheerio': 'window',
          'react/addons': 'react',
          'react/lib/ExecutionEnvironment': 'react',
          'react/lib/ReactContext': 'react',
        }
      }
    },
    
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['Test/Server/serverTest.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! client <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          'public/bundle/web.bundle.min.js': ['public/bundle/web.bundle.js']
        }
      }
    },

    eslint: {
      target: [
        'web/**/*.js'
      ]
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/bundle/style.min.css': ['public/*.css']
        }
      }
    },

    watch: {
      scripts: {
        files: ['web/**/*.js'],
        tasks: [
          'webpack',
          'uglify'
        ]
      },
      css: {
        files: ['public/*.css'],
        tasks: ['cssmin']
      }
    },

    shell: {
      add: {
        command: 'git add .'
      },
      commit: {
        command: 'git commit'
      },
      prodServer: {
        command: 'git push upstream master'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
   'eslint', 'mochaTest', 'webpack', 'uglify', 'cssmin'
  ]);

  // grunt.registerTask('upload', function(n) {
  //   if (grunt.option('prod')) {
  //     // add your production server task here
  //     grunt.task.run([ 'shell' ]);
  //   } else {
  //     grunt.task.run([ 'server-dev' ]);
  //   }
  // });

  // grunt.registerTask('deploy', [
    
  // ]);


};


// module.exports = function(grunt) {
//   grunt.initConfig({
//     pkg: grunt.file.readJSON('package.json'),
//     env: {
//       build:{ 

//       }
//     }
//   })

//   grunt.registerTask('start', ['env:build']

//   )
//   // Do grunt-related things in here
// };