/**
 * Make less into css file in the dist directory
 */
module.exports = function exportLess(grunt) {
	grunt.config('less', {
		dev: {
			files: [{
				'<%= distPath %>escape.css': [
					'src/less/session.less'
				]
			},{
				'<%= distPath %>admin.css': [
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
					'src/less/session.less'
				]
			},{
				'<%= distPath %>admin.css': [
					'src/less/admin.less'
				]
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
};
