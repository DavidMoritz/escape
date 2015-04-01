/**
 * concatenate scripts together for dev
 */
module.exports = function exportConcat(grunt) {
	grunt.config.set('concat', {
		dev: {
			options: {
				stripBanners: true,
				banner: '<%= banner %>',
			},
			files: {
				'<%= distPath %>lib.js': [
					'lib/jquery/dist/jquery.js',
					'lib/bootstrap/dist/js/bootstrap.js',
					'lib/lodash/lodash.js'
				],
				'<%= distPath %>trapped.js': [
					'src/app.js',
					'src/services/*.js',
					'src/*.js'
				]
			}
		},
		prod: {
			options: {
				stripBanners: true,
				banner: '<%= banner %>'
			},
			files: {
				'<%= distPath %>trapped.js': [
					'lib/jquery/dist/jquery.js',
					'lib/bootstrap/dist/js/bootstrap.js',
					'lib/lodash/dist/lodash.js',
					'!src/tests/*',
					'src/**/*.js'
				],
				'<%= distPath %>trapped.css': '<%= distPath %>trapped.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
};
