/**
 * Make less into css file in the dist directory
 */
module.exports = function exportLess(grunt) {
	grunt.config('less', {
		dev: {
			files: [{
				'<%= distPath %>escape.css': [
					'src/less/monokai-theme.less',
					'lib/fontawesome/less/font-awesome.less',
					'src/**/*.less',
					'!src/less/admin.less'
				]
			},{
				'<%= distPath %>admin.css': [
					'lib/fontawesome/less/font-awesome.less',
					'!src/less/escape.less',
					'src/less/admin.less'
				]
			}]
		},
		prod: {
			options: {
				cleancss: true,
				compress: true
			},
			files: [{
				'<%= distPath %>escape.css': [
					'src/less/monokai-theme.less',
					'lib/fontawesome/less/font-awesome.less',
					'src/**/*.less',
					'!src/less/admin.less'
				]
			},{
				'<%= distPath %>admin.css': [
					'lib/fontawesome/less/font-awesome.less',
					'!src/less/escape.less',
					'src/less/admin.less'
				]
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
};
