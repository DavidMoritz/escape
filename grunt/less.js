/**
 * Make less into css file in the dist directory
 */
module.exports = function exportLess(grunt) {
	grunt.config('less', {
		dev: {
			files: {
				'<%= distPath %>trapped.css': [
					'src/less/monokai-theme.less',
					'lib/fontawesome/less/font-awesome.less',
					'src/**/*.less'
				]
			}
		},
		prod: {
			options: {
				cleancss: true,
				compress: true
			},
			files: {
				'<%= distPath %>trapped.css': [
					'src/less/monokai-theme.less',
					'lib/fontawesome/less/font-awesome.less',
					'src/**/*.less'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
};
