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
				'<%= distPath %>escape.js': '<%= distPath %>escape.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};
