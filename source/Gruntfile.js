/* jslint es3: false */
/* global module:false, console:false, process:false */

module.exports = function(grunt) {
	
	'use strict';
	
	grunt.initConfig({
		
		/*----------------------------------( PACKAGE )----------------------------------*/
		
		/**
		 * The `package.json` file belongs in the root directory of your project,
		 * next to the `Gruntfile`, and should be committed with your project
		 * source. Running `npm install` in the same folder as a `package.json`
		 * file will install the correct version of each dependency listed therein.
		 *
		 * Install project dependencies with `npm install` (or `npm update`).
		 *
		 * @see http://gruntjs.com/getting-started#package.json
		 * @see https://npmjs.org/doc/json.html
		 * @see http://package.json.nodejitsu.com/
		 * @see http://stackoverflow.com/a/10065754/922323
		 */
		
		pkg : grunt.file.readJSON('package.json'),
		
		/*----------------------------------( BANNERS )----------------------------------*/
		
		/**
		 * Short and long banners.
		 *
		 * @see http://gruntjs.com/getting-started#an-example-gruntfile
		 */
		
		banner : {
			
			'short' : '/*! ' +
			          '<%= pkg.title || pkg.name %>' +
			          '<%= pkg.version ? " v" + pkg.version : "" %>' +
			          '<%= pkg.licenses ? " | " + _.pluck(pkg.licenses, "type").join(", ") : "" %>' +
			          '<%= pkg.homepage ? " | " + pkg.homepage : "" %>' +
			          ' */',
			
			'long' : '/**\n' +
			         ' * <%= pkg.title || pkg.name %>\n' +
			         '<%= pkg.description ? " * " + pkg.description + "\\n" : "" %>' +
			         ' *\n' +
			         '<%= pkg.author.name ? " * @author " + pkg.author.name + "\\n" : "" %>' +
			         '<%= pkg.author.url ? " * @link " + pkg.author.url + "\\n" : "" %>' +
			         '<%= pkg.homepage ? " * @docs " + pkg.homepage + "\\n" : "" %>' +
			         ' * @copyright Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>.\n' +
			         '<%= pkg.licenses ? " * @license Released under the " + _.pluck(pkg.licenses, "type").join(", ") + ".\\n" : "" %>' +
			         '<%= pkg.version ? " * @version " + pkg.version + "\\n" : "" %>' +
			         ' * @date <%= grunt.template.today("yyyy/mm/dd") %>\n' +
			         ' */\n\n',
			
		},
		
		/*----------------------------------( VERSIONING )----------------------------------*/
		
		/**
		 * Build date and version.
		 *
		 * @see http://tanepiper.com/blog/2012/11/25/building-and-testing-javascript-with-gruntjs/
		 * @see http://blog.stevenlevithan.com/archives/date-time-format
		 */
		
		now : grunt.template.today('yyyymmdd'), // Alternative: yyyymmddhhMMss
		
		ver : 1, // Increment if more than one build is needed in a single day.
		
		/*----------------------------------( BOWER )----------------------------------*/
		
		/**
		 * Install Bower packages. Smartly.
		 *
		 * Use this task to update dependencies defined in `bower.json`.
		 *
		 * @see https://github.com/yatskevich/grunt-bower-task
		 * @see http://bower.io/
		 */
		
		bower : {
			
			install : {
				
				options : {
					
					targetDir : './files/plugins', // A directory where you want to keep your Bower packages.
					cleanup : true,                // Will clean target and bower directories.
					layout : 'byComponent',        // Folder structure type.
					verbose : true,                // Debug output.
					
				},
				
			},
			
		},
		
		/*----------------------------------( SHELL )----------------------------------*/
		
		/**
		 * Run shell commands.
		 *
		 * @see https://github.com/sindresorhus/grunt-shell
		 */
		
		shell: {
			
			clean_bower : {
				
				options : {
					
					stderr : false,
					
				},
				
				command : [
					
					// Remove unwanted Bower plugin dependencies:
					'rm -rf files/plugins/{doc-ready,eventEmitter,eventie,get-size,get-style-property,jquery-bridget,masonry,matches-selector,outlayer}',
					
				].join(';'),
				
			},
			
		},
		
		/*----------------------------------( WATCH )----------------------------------*/
		
		/**
		 * Run predefined tasks whenever watched file patterns are added, changed
		 * or deleted.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-watch
		 */
		
		watch : {
			
			files : [
				
				'<%= jshint.init %>',
				'./files/scripts/**/*',
				'./files/styles/**/*',
				'./files/templates/**/*',
				
			],
			
			tasks : ['default'],
			
		},
		
		/*----------------------------------( JSHINT )----------------------------------*/
		
		/**
		 * Validate files with JSHint.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-jshint
		 * @see http://www.jshint.com/docs/
		 */
		
		jshint : {
			
			options : {
				
				jshintrc : '.jshintrc', // Defined options and globals.
				
			},
			
			init : [
				
				'./Gruntfile.js',
				'./files/scripts/<%= pkg.name %>.*.js',
				
			],
			
		},
		
		/*----------------------------------( ENV )----------------------------------*/
		
		/**
		 * Grunt task to automate environment configuration for future tasks.
		 *
		 * @see https://github.com/onehealth/grunt-env
		 */
		
		env : {
			
			dev : {
				
				NODE_ENV : 'DEVELOPMENT',
				
			},
			
			prod : {
				
				NODE_ENV : 'PRODUCTION',
				
			},
			
		},
		
		/*----------------------------------( CLEAN )----------------------------------*/
		
		/**
		 * Clean files and folders.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-clean
		 */
		
		clean : {
			
			options : {
				
				force : true, // Allows for deletion of folders outside current working dir (CWD). Use with caution.
				
			},
			
			dev : [
				
				'../dev/**/*',
				
			],
			
			prod : [
				
				'../prod/<%= pkg.version %>/<%= now %>/<%= ver %>/**/*',
				
			],
			
		},
		
		/*----------------------------------( UGLIFY )----------------------------------*/
		
		/**
		 * Minify files with UglifyJS.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-uglify
		 * @see http://lisperator.net/uglifyjs/
		 */
		
		uglify : {
			
			prod : {
				
				options : {
					
					banner : '<%= banner.short %>',
					
				},
				
				files : {
					
					'../prod/<%= pkg.version %>/<%= now %>/<%= ver %>/scripts/<%= pkg.name %>.min.js' : [
						'./files/scripts/fastclick.js',
						'./files/scripts/jquery.js',
						'./files/scripts/jquery.*.js',
						'./files/scripts/imagesloaded.pkgd.js',
						'./files/scripts/isotope.pkgd.js',
						'./files/scripts/<%= pkg.name %>.js',
						'./files/scripts/<%= pkg.name %>.mod.*.js',
						'./files/scripts/<%= pkg.name %>.init.js',
					],
					
				},
				
			},
			
		},
		
		/*----------------------------------( PURE )----------------------------------*/
		
		/**
		 * Generate custom grid units for Pure Grids.
		 *
		 * @see https://github.com/yahoo/grunt-pure-grids
		 * @see http://purecss.io/grids/
		 */
		
		pure_grids: {
			
			responsive: {
				
				dest : './files/styles/partials/_grids-responsive.scss',
				
				options : {
					
					decimals : 14,
					includeOldIEWidths : false,
					
					mediaQueries : {
						
						sm : 'all and (min-width: 640px)',
						md : 'all and (min-width: 960px)',
						lg : 'all and (min-width: 1280px)',
						xl : 'all and (min-width: 1600px)',
						
					},
					
				},
				
			},
			
		},
		
		/*----------------------------------( SASS )----------------------------------*/
		
		/**
		 * Compile Sass to CSS.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-sass
		 * @see http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#output_style
		 */
		
		sass : {
			
			options : {
				
				noCache : true, // Don't cache to sassc files.
				precision : 14, // How many digits of precision to use when outputting decimal numbers.
				sourcemap : 'none', // Generate CSS source maps?
				
			},
			
			dev : {
				
				options : {
					
					banner : '<%= banner.long %>',
					style : 'expanded', // Output style. Can be nested, compact, compressed, expanded.
					
				},
				
				files : {
					
					'../dev/styles/<%= pkg.name %>.css' : './files/styles/<%= pkg.name %>.scss',
					'../dev/styles/development.css' : './files/styles/development.scss',
					
				},
				
			},
			
			prod : {
				
				options : {
					
					banner : '<%= banner.short %>',
					style : 'compressed',
					
				},
				
				files : {
					
					'../prod/<%= pkg.version %>/<%= now %>/<%= ver %>/styles/<%= pkg.name %>.min.css' : './files/styles/<%= pkg.name %>.scss',
					
				},
				
			},
			
		},
		
		/*----------------------------------( PREPROCESS )----------------------------------*/
		
		/**
		 * Grunt task around preprocess npm module.
		 *
		 * @see https://github.com/onehealth/grunt-preprocess
		 * @see https://github.com/onehealth/preprocess
		 * @see http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
		 */
		
		preprocess : {
			
			options : {
				
				context : {
					
					title : '<%= pkg.title %>',
					description : '<%= pkg.description %>',
					name : '<%= pkg.name %>',
					version : '<%= pkg.version %>',
					homepage : '<%= pkg.homepage %>',
					production : '<%= pkg.production %>',
					now : '<%= now %>',
					ver : '<%= ver %>',
					
				},
				
			},
			
			dev : {
				
				expand : true,
				cwd : './files/templates/',
				src : [
					'**/*.*', // Greedy!
					'!latest.html',
				],
				dest : '../dev/',
				
			},
			
			prod : {
				
				expand : true,
				cwd : './files/templates/',
				src : [
					'**/*.*', // IBID.
					'!latest.html',
				],
				dest : '../prod/<%= pkg.version %>/<%= now %>/<%= ver %>/',
				
			},
			
			misc : {
				
				src : './files/templates/latest.html',
				dest : '../prod/index.html',
				
			},
			
		},
		
		/*----------------------------------( COPY )----------------------------------*/
		
		/**
		 * Copy files and folders.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-copy
		 * @see http://gruntjs.com/configuring-tasks#globbing-patterns
		 */
		
		copy : {
			
			dev : {
				
				expand : true,
				cwd : './files/',
				src : [
					'images/**/*',
					'pages/**/*',
					'scripts/**/*',
				],
				dest : '../dev/',
				
			},
			
			prod : {
				
				expand : true,
				cwd : './files/',
				src : [
					'images/**/*',
					'pages/**/*',
					'scripts/**/*',
				],
				dest : '../prod/<%= pkg.version %>/<%= now %>/<%= ver %>/',
				
			},
			
		},
		
	});
	
	/*----------------------------------( TASKS )----------------------------------*/
	
	grunt.loadNpmTasks('grunt-bower-task');
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.loadNpmTasks('grunt-contrib-sass');
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.loadNpmTasks('grunt-env');
	
	grunt.loadNpmTasks('grunt-pure-grids');
	
	grunt.loadNpmTasks('grunt-preprocess');
	
	grunt.loadNpmTasks('grunt-shell');
	
	//----------------------------------
	
	/**
	 * @see https://github.com/onehealth/grunt-preprocess/issues/7
	 * @see https://github.com/onehealth/grunt-env/issues/4
	 */
	
	grunt.registerTask('printenv', function () { console.log(process.env); });
	
	//----------------------------------
	
	grunt.registerTask('init', ['jshint',]);
	
	grunt.registerTask('plugins', ['bower', 'shell',]);
	
	grunt.registerTask('dev', ['init', 'env:dev', 'clean:dev', 'pure_grids', 'sass:dev', 'preprocess:dev', 'copy:dev',]);
	
	grunt.registerTask('prod', ['init', 'dev', 'env:prod', 'clean:prod', 'pure_grids', 'sass:prod', 'uglify:prod', 'preprocess:prod', 'preprocess:misc', 'copy:prod',]);
	
	grunt.registerTask('default', ['dev',]);
	
};
