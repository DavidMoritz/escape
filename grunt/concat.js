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
					'lib/lodash/lodash.js',
					'lib/firebase/firebase.js',
					'lib/angularfire/dist/angularfire.js',
					'lib/moment/moment.js'
				],
				'<%= distPath %>escape.js': [
					'src/services/mc.js',
					'src/js/app.js',
					'src/services/*.js',
					'!src/js/public.js',
					'src/**/*.js'
				],
				'<%= distPath %>public.js': [
					'src/js/app.js',
					'src/services/*.js',
					'!src/js/escape.js',
					'src/**/*.js'
				]
			}
		},
		prod: {
			options: {
				stripBanners: true,
				banner: '<%= banner %>'
			},
			files: {
				'<%= distPath %>escape.js': [
					'lib/jquery/dist/jquery.js',
					'lib/bootstrap/dist/js/bootstrap.js',
					'lib/lodash/dist/lodash.js',
					'lib/firebase/firebase.js',
					'lib/angularfire/dist/angularfire.min.js',,
					'lib/moment/moment.js',
					'!src/tests/*',
					'src/**/*.js'
				],
				'<%= distPath %>escape.css': '<%= distPath %>escape.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
};
