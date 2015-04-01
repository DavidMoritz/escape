/**
 * concat and minify scripts
 */
module.exports = function exportUglify(grunt) {
	grunt.config.set('uglify', {
		prod: {
			options: {
				banner: '<%= banner %>',
			},
			files: {
				'<%= distPath %>trapped.js': '<%= distPath %>trapped.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};